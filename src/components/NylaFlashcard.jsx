import React, { useState, useEffect, useRef } from 'react';
import { speak, speakSlow } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { nylaLetters, nylaWordWeeks } from '../data/nylaFlashcards';

// Nyla's flashcards — same round-cycling idea as Ryan's dictée flashcards
// (missed cards repeat round after round), adapted for a 5yo:
//   • LETTERS / NUMBERS: study mode — she sees it, the voice NAMES it clearly,
//     she marks "Je le sais / Pas encore". One case at a time for letters
//     (majuscules first); numbers level up automatically (1-10 → … → 50).
//   • WORDS: look at the word, tap "Montre-moi" to reveal the picture.
// The voice always tells her what to do so a parent doesn't have to.

const ALPHABET_VIDEO = 'https://www.youtube.com/watch?v=Nzlx9rEmLB8'; // Titounis — L'alphabet en chanson (majuscules)

// Number levels — she advances automatically once she knows a whole level.
const NUMBER_LEVELS = [
  { label: '1 à 10', from: 1, to: 10 },
  { label: '11 à 20', from: 11, to: 20 },
  { label: '21 à 30', from: 21, to: 30 },
  { label: '31 à 40', from: 31, to: 40 },
  { label: '41 à 50', from: 41, to: 50 },
];

function loadNumLevel() {
  const v = parseInt(localStorage.getItem('sb_nyla_numlevel') || '0', 10);
  if (isNaN(v)) return 0;
  return Math.max(0, Math.min(NUMBER_LEVELS.length - 1, v));
}
function saveNumLevel(l) { try { localStorage.setItem('sb_nyla_numlevel', String(l)); } catch {} }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function numberCards(level) {
  const lv = NUMBER_LEVELS[level];
  const cards = [];
  for (let n = lv.from; n <= lv.to; n++) cards.push({ id: `n${n}`, big: String(n), name: String(n) });
  return cards;
}

function buildDeck(deck, numLevel) {
  if (deck === 'letters_upper' || deck === 'letters_lower') {
    const lower = deck === 'letters_lower';
    return {
      kind: 'letter',
      title: lower ? '🔡 Mes lettres (minuscules)' : '🔤 Mes lettres (MAJUSCULES)',
      intro: 'Regarde la lettre, dis son nom, puis touche Montre-moi pour entendre.',
      cards: nylaLetters.map((l) => ({ id: l.letter, big: lower ? l.letter.toLowerCase() : l.letter, name: l.letter })),
    };
  }
  if (deck === 'numbers') {
    return {
      kind: 'number',
      title: `🔢 Mes chiffres — ${NUMBER_LEVELS[numLevel].label}`,
      intro: 'Regarde le nombre, dis-le, puis touche Montre-moi pour entendre.',
      cards: numberCards(numLevel),
    };
  }
  const week = nylaWordWeeks[deck];
  if (!week) return null;
  return {
    kind: 'word',
    title: `⭐ ${week.label}`,
    intro: 'Regarde le mot, puis touche « Montre-moi » pour voir le dessin.',
    cards: week.words.map((w) => ({ id: w.word, big: w.word, word: w.word, icon: w.icon })),
  };
}

export default function NylaFlashcard({ deck, onHome, onFinish }) {
  const [numLevel, setNumLevel] = useState(() => (deck === 'numbers' ? loadNumLevel() : 0));
  const built = buildDeck(deck, numLevel);
  const isStudy = built?.kind === 'letter' || built?.kind === 'number';

  const [round, setRound] = useState(1);
  const [queue, setQueue] = useState(() => (built ? shuffle(built.cards) : []));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [missed, setMissed] = useState([]);
  const [knownCount, setKnownCount] = useState(0);
  const [seen, setSeen] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [pendingLevel, setPendingLevel] = useState(null);
  const introDone = useRef(false);

  const card = queue[idx];
  const totalCards = built ? built.cards.length : 0;

  // One-time spoken instruction when the deck opens
  useEffect(() => {
    if (built && !introDone.current) {
      introDone.current = true;
      const t = setTimeout(() => speak(built.intro, 'fr', 0.85), 300);
      return () => clearTimeout(t);
    }
  }, [built]);

  // "Try first, then reveal": the card stays SILENT so she attempts it herself.
  // She taps "Montre-moi" to hear the answer (letter/number name or word).
  function reveal() {
    setRevealed(true);
    if (built.kind === 'word') speakSlow(card.word);
    else speak(card.name, 'fr', 0.8);
  }
  function replay() {
    if (built.kind === 'word') speakSlow(card.word);
    else speak(card.name, 'fr', 0.8);
  }

  if (!built) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-12 text-center">
        <p className="text-stone font-semibold mb-4">Oups! Cartes introuvables.</p>
        <button onClick={onHome} className="px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>← Menu</button>
      </div>
    );
  }

  // Between number levels — celebrate + auto-continue
  if (pendingLevel != null) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-12 text-center">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h2 className="font-heading text-3xl font-extrabold text-purple-600 mb-2">Niveau réussi!</h2>
        <p className="text-stone font-semibold mb-6 text-lg">On continue avec les nombres {NUMBER_LEVELS[pendingLevel].label}!</p>
        <button onClick={() => {
          const nl = pendingLevel;
          setNumLevel(nl);
          setQueue(shuffle(numberCards(nl)));
          setIdx(0); setRevealed(false); setMissed([]); setKnownCount(0); setSeen(0); setRound(1);
          setPendingLevel(null);
        }}
          className="w-full py-4 rounded-xl font-bold text-white text-lg"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
          Continue → niveau {NUMBER_LEVELS[pendingLevel].label}
        </button>
        <button onClick={onFinish || onHome} className="w-full mt-3 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
          ← Menu (on garde ta place)
        </button>
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
      saveSession(`nyla_flash_${deck}`, seen + 1, nextKnown,
        [{ category: built.kind === 'word' ? 'nyla_sight_words' : built.kind === 'number' ? 'nyla_count' : 'nyla_letters', correct: true }]);
      // Numbers: auto-advance to the next level
      if (built.kind === 'number' && numLevel < NUMBER_LEVELS.length - 1) {
        const nl = numLevel + 1;
        saveNumLevel(nl);
        setPendingLevel(nl);
        return;
      }
      setAllDone(true);
      return;
    }
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
        <div className="font-heading font-extrabold text-stone leading-none"
          style={{ fontSize: isStudy ? '7rem' : '3.5rem' }}>
          {card.big}
        </div>

        {!revealed ? (
          <button onClick={reveal}
            className="mt-5 px-7 py-3 rounded-xl font-bold text-white text-base"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
            👀 Montre-moi
          </button>
        ) : built.kind === 'word' ? (
          <div className="mt-4">
            <div className="text-7xl mb-1">{card.icon}</div>
            <div className="font-heading text-xl font-bold text-purple-700">{card.word}</div>
          </div>
        ) : (
          <div className="mt-3 font-heading text-lg font-extrabold text-purple-700">🔊 C'est « {card.name} »</div>
        )}
      </div>

      {/* After reveal: listen again. Letters always show the alphabet-song help. */}
      {(revealed || built.kind === 'letter') && (
        <div className="flex gap-2 mb-4">
          {revealed && (
            <button onClick={replay}
              className="flex-1 py-2.5 rounded-xl font-bold text-purple-700 bg-purple-50 border-2 border-purple-200 hover:border-purple-400">
              🔊 Écoute encore
            </button>
          )}
          {built.kind === 'letter' && (
            <a href={ALPHABET_VIDEO} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl font-bold text-center text-white"
              style={{ background: 'linear-gradient(90deg, #e84393, #fd79a8)' }}>
              🎬 La chanson
            </a>
          )}
        </div>
      )}

      {/* I know it / not yet — only after she's seen the answer */}
      {revealed ? (
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
      ) : (
        <p className="text-center text-sm font-semibold text-s4">
          {isStudy ? 'Dis-le tout fort, puis touche « Montre-moi ».' : 'Lis le mot tout fort, puis touche « Montre-moi ».'}
        </p>
      )}
    </div>
  );
}
