import React, { useState, useEffect } from 'react';
import { speak, speakSlow } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { nylaLetters, nylaWordWeeks } from '../data/nylaFlashcards';

// Nyla's flashcards — same engine as Ryan's dictée flashcards (audio + missed
// cards cycle round after round until all known), but tap-to-reveal instead of
// typing, since a 5yo recognizes whole letters/words visually rather than spelling.

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(deck) {
  if (deck === 'letters') {
    return {
      title: '🔤 Mes lettres',
      cards: nylaLetters.map((l) => ({
        id: l.letter,
        big: `${l.letter} ${l.letter.toLowerCase()}`,
        word: l.word,
        icon: l.icon,
        say: `${l.letter}. ${l.letter} comme ${l.word}.`,
        isLetter: true,
      })),
    };
  }
  const week = nylaWordWeeks[deck];
  if (!week) return null;
  return {
    title: `⭐ ${week.label}`,
    cards: week.words.map((w) => ({
      id: w.word,
      big: w.word,
      word: w.word,
      icon: w.icon,
      say: w.word,
      isLetter: false,
    })),
  };
}

export default function NylaFlashcard({ deck, onHome, onFinish }) {
  const built = buildDeck(deck);

  const [round, setRound] = useState(1);
  const [queue, setQueue] = useState(() => (built ? shuffle(built.cards) : []));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [missed, setMissed] = useState([]);
  const [knownCount, setKnownCount] = useState(0);
  const [seen, setSeen] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const card = queue[idx];
  const totalCards = built ? built.cards.length : 0;

  // Say the card out loud when it appears
  useEffect(() => {
    if (card && !allDone) {
      const t = setTimeout(() => (card.isLetter ? speak(card.say, 'fr', 0.7) : speakSlow(card.say)), 350);
      return () => clearTimeout(t);
    }
  }, [card, allDone]);

  if (!built) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-12 text-center">
        <p className="text-stone font-semibold mb-4">Oups! Cartes introuvables.</p>
        <button onClick={onHome} className="px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>← Menu</button>
      </div>
    );
  }

  if (allDone) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-10 text-center">
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="font-heading text-3xl font-extrabold text-ok mb-2">Bravo Nyla!</h2>
        <p className="text-stone font-semibold mb-6 text-lg">Tu connais toutes les cartes! 🌟</p>
        <div className="space-y-3">
          <button onClick={() => {
            setQueue(shuffle(built.cards)); setIdx(0); setRevealed(false);
            setMissed([]); setKnownCount(0); setSeen(0); setRound(1); setAllDone(false);
          }}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
            🔁 Encore!
          </button>
          <button onClick={onFinish || onHome}
            className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  function answer(known) {
    const nextMissed = known ? missed : [...missed, card];
    const nextKnown = knownCount + (known ? 1 : 0);
    setSeen((s) => s + 1);

    if (idx + 1 < queue.length) {
      setMissed(nextMissed);
      setKnownCount(nextKnown);
      setIdx(idx + 1);
      setRevealed(false);
      return;
    }

    // End of round
    if (nextMissed.length === 0) {
      setAllDone(true);
      saveSession(`nyla_flash_${deck}`, seen + 1, nextKnown,
        [{ category: deck === 'letters' ? 'nyla_letters' : 'nyla_sight_words', correct: true }]);
      return;
    }
    // New round with only the missed cards
    setRound((r) => r + 1);
    setQueue(shuffle(nextMissed));
    setMissed([]);
    setKnownCount(nextKnown);
    setIdx(0);
    setRevealed(false);
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone text-sm">{built.title}</h2>
        <div className="text-xs font-bold text-s4">Tour {round} · {idx + 1}/{queue.length}</div>
      </div>

      {/* Progress */}
      <div className="w-full bg-s1 rounded-full h-3 mb-5 overflow-hidden">
        <div className="h-3 rounded-full transition-all"
          style={{ width: `${totalCards ? (knownCount / totalCards) * 100 : 0}%`, background: '#7c3aed' }} />
      </div>

      {/* Big card */}
      <div className="bg-white rounded-3xl border-2 border-s1 border-b-8 border-b-purple-300 p-8 mb-4 text-center min-h-[260px] flex flex-col items-center justify-center">
        <div className="font-heading font-extrabold text-stone leading-none mb-2"
          style={{ fontSize: card.isLetter ? '5.5rem' : '3.5rem' }}>
          {card.big}
        </div>

        {revealed ? (
          <div className="mt-3">
            <div className="text-7xl mb-1">{card.icon}</div>
            <div className="font-heading text-xl font-bold text-purple-700">
              {card.isLetter ? `${card.big.split(' ')[0]} comme ${card.word}` : card.word}
            </div>
          </div>
        ) : (
          <button onClick={() => { setRevealed(true); }}
            className="mt-4 px-6 py-3 rounded-xl font-bold text-white text-base"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
            👀 Montre-moi
          </button>
        )}
      </div>

      {/* Listen again */}
      <button onClick={() => (card.isLetter ? speak(card.say, 'fr', 0.7) : speakSlow(card.say))}
        className="w-full mb-4 py-2.5 rounded-xl font-bold text-purple-700 bg-purple-50 border-2 border-purple-200 hover:border-purple-400">
        🔊 Écoute encore
      </button>

      {/* I know it / not yet — only after reveal */}
      {revealed && (
        <div className="flex gap-3">
          <button onClick={() => answer(false)}
            className="flex-1 py-4 rounded-2xl font-extrabold text-white text-lg bg-fox active:scale-95 transition-transform">
            ↻ Pas encore
          </button>
          <button onClick={() => answer(true)}
            className="flex-1 py-4 rounded-2xl font-extrabold text-white text-lg bg-ok active:scale-95 transition-transform">
            ✓ Je le sais!
          </button>
        </div>
      )}
      {!revealed && (
        <p className="text-center text-sm font-semibold text-s4">
          {card.isLetter ? 'Dis la lettre tout fort, puis tape « Montre-moi ».' : 'Lis le mot tout fort, puis tape « Montre-moi ».'}
        </p>
      )}
    </div>
  );
}
