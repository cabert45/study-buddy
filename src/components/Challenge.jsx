import React, { useState, useEffect, useRef } from 'react';
import { generateCalcul } from '../generators/calcul';
import { generateMental } from '../generators/mental';
import { generateAccordEtre } from '../generators/accordEtre';
import { generateDictee } from '../generators/dictee';
import { generateApostrophe } from '../generators/apostrophe';
import { generateMDevantBmp } from '../generators/mDevantBmp';
import { generatePasseCompose } from '../generators/passeCompose';
import { speak, speakSlow } from '../utils/speech';

const QUESTIONS_PER_PLAYER = 10;

const challengeTypes = [
  { id: 'mental', label: 'Calcul mental', emoji: '⚡', gen: generateMental, color: '#fef0e4' },
  { id: 'calcul', label: 'Calcul (+ −)', emoji: '🔢', gen: generateCalcul, color: '#fef5e4' },
  { id: 'accord_etre', label: 'Accord après être', emoji: '📝', gen: generateAccordEtre, color: '#fce8ec' },
  { id: 'dictee', label: 'Dictée', emoji: '🎧', gen: generateDictee, color: '#f0ecfb' },
  { id: 'apostrophe', label: 'Apostrophe', emoji: '✏️', gen: generateApostrophe, color: '#fce8ec' },
  { id: 'm_devant_bmp', label: 'M devant b,m,p', emoji: '🔤', gen: generateMDevantBmp, color: '#e6f5f0' },
  { id: 'passe_compose', label: 'Passé composé', emoji: '📚', gen: generatePasseCompose, color: '#e8eef8' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Challenge({ onHome }) {
  // 'setup' → 'p1_ready' → 'p1_playing' → 'p2_ready' → 'p2_playing' → 'results'
  const [phase, setPhase] = useState('setup');
  const [name1, setName1] = useState('Ryan');
  const [name2, setName2] = useState('Castiel');
  const [type, setType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [activePlayer, setActivePlayer] = useState(1);

  function startChallenge(t) {
    const gen = t.gen;
    const qs = Array.from({ length: QUESTIONS_PER_PLAYER }, () => gen());
    setQuestions(qs);
    setType(t);
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setActivePlayer(1);
    setScores({ p1: 0, p2: 0 });
    setPhase('p1_ready');
    speak(`${name1}, à toi de jouer!`);
  }

  function startPlayerTurn() {
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setPhase(activePlayer === 1 ? 'p1_playing' : 'p2_playing');
    const q = questions[0];
    if (q?.spokenWord) speakSlow(q.spokenWord);
    else if (q?.text) speak(q.text);
  }

  function handleAnswer(value) {
    setSelected(value);
    setShowResult(true);
    const q = questions[currentIdx];
    if (value === q.correct) {
      setScores(s => activePlayer === 1
        ? { ...s, p1: s.p1 + 1 }
        : { ...s, p2: s.p2 + 1 });
    }
  }

  function nextQuestion() {
    if (currentIdx + 1 >= QUESTIONS_PER_PLAYER) {
      // End of player turn
      if (activePlayer === 1) {
        setActivePlayer(2);
        setPhase('p2_ready');
        speak(`Bravo ${name1}! ${scores.p1 + (selected === questions[currentIdx].correct ? 1 : 0)} sur ${QUESTIONS_PER_PLAYER}. À toi ${name2}!`);
      } else {
        setPhase('results');
        const finalP2 = scores.p2 + (selected === questions[currentIdx].correct ? 1 : 0);
        const winner = scores.p1 > finalP2 ? name1 : finalP2 > scores.p1 ? name2 : null;
        if (winner) speak(`Le gagnant est ${winner}! Bravo!`);
        else speak('Égalité! Bravo à vous deux!');
      }
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setShowResult(false);
    const q = questions[currentIdx + 1];
    if (q?.spokenWord) speakSlow(q.spokenWord);
    else if (q?.text) speak(q.text);
  }

  // SETUP phase — pick names + type
  if (phase === 'setup') {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
          <h2 className="font-heading font-bold text-stone">Défi entre amis</h2>
          <div className="w-12" />
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4 border-2 border-s1 text-center">
          <div className="font-heading text-2xl font-extrabold text-stone mb-2">Qui s'affronte?</div>
          <p className="text-sm text-s4 font-semibold mb-4">Chacun fait 10 questions. Le meilleur gagne!</p>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-xs font-bold text-fox-d uppercase tracking-wide mb-1 block">Joueur 1</label>
              <input value={name1} onChange={(e) => setName1(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-bold text-center focus:outline-none focus:border-lava" />
            </div>
            <div>
              <label className="text-xs font-bold text-fox-d uppercase tracking-wide mb-1 block">Joueur 2</label>
              <input value={name2} onChange={(e) => setName2(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-bold text-center focus:outline-none focus:border-lava" />
            </div>
          </div>
        </div>

        <div className="font-heading text-base font-bold text-s4 uppercase tracking-wide mb-3">Choisis le défi</div>
        <div className="grid grid-cols-2 gap-3">
          {challengeTypes.map(t => (
            <button key={t.id} onClick={() => startChallenge(t)}
              className="bg-white border-2 border-s1 rounded-2xl p-4 text-left transition-all
                hover:border-lava hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 text-xl"
                style={{ background: t.color }}>{t.emoji}</div>
              <div className="font-heading text-base font-bold text-stone">{t.label}</div>
              <div className="text-xs text-s4 font-semibold mt-0.5">10 questions chacun</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // P1 / P2 READY phase
  if (phase === 'p1_ready' || phase === 'p2_ready') {
    const isP1 = phase === 'p1_ready';
    const playerName = isP1 ? name1 : name2;
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12 text-center">
        <div className="text-6xl mb-4">{isP1 ? '🎯' : '🔥'}</div>
        <h2 className="font-heading text-3xl font-extrabold text-stone mb-2">À toi, {playerName}!</h2>
        <p className="text-s4 font-semibold mb-6">Tu vas faire 10 questions. Bonne chance!</p>

        {!isP1 && (
          <div className="bg-orange-50 rounded-2xl p-4 mb-6 border-2 border-orange-200">
            <p className="text-sm font-bold text-fox-d">Score à battre: <span className="text-2xl ml-2">{scores.p1}/{QUESTIONS_PER_PLAYER}</span></p>
            <p className="text-xs text-s4 font-semibold mt-1">{name1} a fait {scores.p1} bonnes réponses</p>
          </div>
        )}

        <button onClick={startPlayerTurn}
          className="w-full py-4 rounded-xl font-bold text-white text-lg"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          ▶ Je suis prêt!
        </button>
      </div>
    );
  }

  // PLAYING phase
  if (phase === 'p1_playing' || phase === 'p2_playing') {
    const q = questions[currentIdx];
    const playerName = activePlayer === 1 ? name1 : name2;
    const playerScore = activePlayer === 1 ? scores.p1 : scores.p2;

    return (
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-s4">{playerName}</div>
          <div className="text-sm font-bold text-fox">{currentIdx + 1} / {QUESTIONS_PER_PLAYER}</div>
          <div className="text-sm font-bold text-ok">Score: {playerScore}</div>
        </div>

        <div className="w-full bg-s1 rounded-full h-2 mb-4 overflow-hidden">
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / QUESTIONS_PER_PLAYER) * 100}%`, background: 'linear-gradient(90deg, #c74a15, #e8622a)' }} />
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-s1 border-l-4 border-l-lava mb-4">
          <p className="text-xl font-heading font-bold text-stone leading-relaxed mb-4">{q.text}</p>
          {q.spokenWord && (
            <button onClick={() => speakSlow(q.spokenWord)}
              className="text-sm text-fox-d font-bold mb-3">🔊 Réécouter</button>
          )}

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              let cls = 'bg-white border-2 border-s2 text-stone hover:border-fox';
              if (showResult) {
                if (opt === q.correct) cls = 'bg-green-50 border-2 border-green-500 text-green-700';
                else if (opt === selected) cls = 'bg-red-50 border-2 border-red-400 text-red-600';
                else cls = 'bg-gray-50 border-2 border-gray-200 text-gray-400';
              }
              return (
                <button key={i} onClick={() => !showResult && handleAnswer(opt)}
                  disabled={showResult}
                  className={`py-4 rounded-xl font-extrabold text-xl transition-all ${cls}`}>
                  {opt}
                </button>
              );
            })}
          </div>

          {showResult && (
            <button onClick={nextQuestion}
              className="w-full mt-4 py-3 rounded-xl font-bold text-white text-base"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              {currentIdx + 1 >= QUESTIONS_PER_PLAYER
                ? (activePlayer === 1 ? `→ Au tour de ${name2}` : 'Voir les résultats')
                : 'Suivant →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // RESULTS phase
  if (phase === 'results') {
    const winner = scores.p1 > scores.p2 ? { name: name1, score: scores.p1 } :
                   scores.p2 > scores.p1 ? { name: name2, score: scores.p2 } : null;
    return (
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{winner ? '🏆' : '🤝'}</div>
          <h2 className="font-heading text-3xl font-extrabold text-stone mb-1">
            {winner ? `${winner.name} gagne!` : 'Égalité!'}
          </h2>
          <p className="text-s4 font-semibold">{type?.label}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`bg-white rounded-2xl p-5 border-2 text-center ${
            scores.p1 > scores.p2 ? 'border-fox shadow-lg' : 'border-s1'
          }`}>
            <div className="text-3xl mb-2">{scores.p1 > scores.p2 ? '🥇' : scores.p1 < scores.p2 ? '🥈' : '🤝'}</div>
            <div className="font-heading text-xl font-extrabold text-stone">{name1}</div>
            <div className="font-heading text-4xl font-extrabold text-lava mt-2">{scores.p1}</div>
            <div className="text-xs text-s4 font-bold uppercase">/ {QUESTIONS_PER_PLAYER}</div>
          </div>
          <div className={`bg-white rounded-2xl p-5 border-2 text-center ${
            scores.p2 > scores.p1 ? 'border-fox shadow-lg' : 'border-s1'
          }`}>
            <div className="text-3xl mb-2">{scores.p2 > scores.p1 ? '🥇' : scores.p2 < scores.p1 ? '🥈' : '🤝'}</div>
            <div className="font-heading text-xl font-extrabold text-stone">{name2}</div>
            <div className="font-heading text-4xl font-extrabold text-lava mt-2">{scores.p2}</div>
            <div className="text-xs text-s4 font-bold uppercase">/ {QUESTIONS_PER_PLAYER}</div>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => setPhase('setup')}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            ▶ Encore un défi!
          </button>
          <button onClick={onHome}
            className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  return null;
}
