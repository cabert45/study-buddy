import React, { useState, useEffect, useRef } from 'react';
import { speak } from '../utils/speech';

// La cigale et la fourmi — Jean de La Fontaine
// Ryan should be able to read this aloud in 1 minute (Mon May 11 2026 — cahier homework)
const FABLE_LINES = [
  'La cigale, ayant chanté',
  "Tout l'été,",
  'Se trouva fort dépourvue',
  'Quand la bise fut venue:',
  'Pas un seul petit morceau',
  'De mouche ou de vermisseau.',
  'Elle alla crier famine',
  'Chez la fourmi sa voisine,',
  'La priant de lui prêter',
  'Quelque grain pour subsister',
  'Jusqu\'à la saison nouvelle.',
  '« Je vous paierai, lui dit-elle,',
  "Avant l'oût, foi d'animal,",
  'Intérêt et principal. »',
  "La fourmi n'est pas prêteuse:",
  'C\'est là son moindre défaut.',
  '« Que faisiez-vous au temps chaud? »',
  'Dit-elle à cette emprunteuse.',
  '— Nuit et jour à tout venant',
  'Je chantais, ne vous déplaise.',
  '— Vous chantiez? j\'en suis fort aise:',
  'Eh bien! dansez maintenant. »',
];

const FABLE_FULL = FABLE_LINES.join('\n');

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function FableReader({ onHome }) {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const intervalRef = useRef(null);

  // Timer tick
  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            // Ding sound
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              [523.25, 659.25, 783.99].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
                gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.15 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.5);
                osc.start(ctx.currentTime + i * 0.15);
                osc.stop(ctx.currentTime + i * 0.15 + 0.5);
              });
            } catch {}
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function startTimer() {
    setSeconds(60);
    setDone(false);
    setRunning(true);
  }

  function pauseTimer() {
    setRunning(false);
  }

  function resetTimer() {
    setRunning(false);
    setSeconds(60);
    setDone(false);
  }

  function playModel() {
    // Read the fable aloud at a comfortable pace as a model
    speak(FABLE_FULL);
  }

  function stopAudio() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  const timerColor = done ? '#2d7a3a' : seconds <= 10 ? '#c74a15' : seconds <= 30 ? '#e8a050' : '#3a5bc7';

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { stopAudio(); onHome(); }} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone text-base">🐜 Lecture de la fable</h2>
        <div />
      </div>

      {/* Title banner */}
      <div className="bg-orange-50 rounded-2xl p-4 mb-3 border-2 border-orange-200 text-center">
        <p className="text-[10px] font-bold text-fox-d uppercase tracking-wide">Devoir lundi 11 mai</p>
        <h1 className="font-heading text-2xl font-extrabold text-stone leading-tight mt-1">La cigale et la fourmi</h1>
        <p className="text-xs font-semibold text-s4 mt-1">Jean de La Fontaine — Fables, livre 1, fable 1</p>
        <p className="text-xs font-bold text-fox-d mt-2">Objectif: lire toute la fable à voix haute en 1 minute!</p>
      </div>

      {/* Timer + controls */}
      <div className="bg-white rounded-2xl p-4 mb-3 border-2 border-s1 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] font-bold text-s4 uppercase tracking-wide">Chrono</p>
            <div className="font-heading font-extrabold leading-none transition-colors" style={{ fontSize: '3rem', color: timerColor }}>
              {fmt(seconds)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {!running && !done && (
              <button onClick={startTimer}
                className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                ▶ Démarrer 1 min
              </button>
            )}
            {running && (
              <button onClick={pauseTimer}
                className="px-4 py-2 rounded-xl font-bold text-white text-sm bg-yellow-600">
                ⏸ Pause
              </button>
            )}
            {done && (
              <button onClick={startTimer}
                className="px-4 py-2 rounded-xl font-bold text-white text-sm bg-ok">
                ↻ Recommencer
              </button>
            )}
            {(seconds !== 60 || done) && !running && (
              <button onClick={resetTimer}
                className="px-4 py-2 rounded-xl font-bold text-s6 text-xs bg-white border-2 border-s2">
                Réinitialiser
              </button>
            )}
          </div>
        </div>
        {done && (
          <div className="mt-3 bg-green-50 rounded-xl p-3 border-2 border-green-200 text-center">
            <p className="font-heading text-lg font-extrabold text-ok">🎉 Temps écoulé!</p>
            <p className="text-xs font-semibold text-s6">As-tu fini la fable? Si non, essaie encore!</p>
          </div>
        )}
      </div>

      {/* Audio model */}
      <div className="flex gap-2 mb-3">
        <button onClick={playModel}
          className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(90deg, #3a5bc7, #5b4ad4)' }}>
          🔊 Écouter le modèle (à suivre)
        </button>
        <button onClick={stopAudio}
          className="px-4 py-3 rounded-xl font-bold text-s6 text-sm bg-white border-2 border-s2">
          ⏹ Stop
        </button>
      </div>

      {/* Fable text */}
      <div className="bg-cream rounded-2xl p-5 border-2 border-s1 shadow-sm mb-3">
        <div className="font-heading text-lg leading-relaxed text-stone whitespace-pre-line" style={{ fontSize: '1.15rem' }}>
          {FABLE_LINES.map((line, i) => (
            <p key={i} className={`${i > 0 && (FABLE_LINES[i - 1].endsWith('.') || FABLE_LINES[i - 1].endsWith('»') || FABLE_LINES[i - 1].endsWith(':')) ? 'mt-3' : ''}`}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Pronunciation hints */}
      <button onClick={() => setShowHints((v) => !v)}
        className="w-full py-2 rounded-xl text-sm font-bold text-fox-d bg-orange-50 border-2 border-orange-200 mb-3">
        💡 {showHints ? 'Cacher' : 'Voir'} les mots difficiles
      </button>

      {showHints && (
        <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200 mb-3">
          <p className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2">Mots à bien prononcer</p>
          <ul className="text-sm font-semibold text-stone space-y-1">
            <li><b>dépourvue</b> = elle n'a plus rien</li>
            <li><b>la bise</b> = le vent froid d'hiver</li>
            <li><b>vermisseau</b> = un petit ver</li>
            <li><b>famine</b> = pas de nourriture, on a faim</li>
            <li><b>prêter</b> = donner pour un temps</li>
            <li><b>subsister</b> = survivre, vivre</li>
            <li><b>l'oût</b> (= août) = ancien français pour "août"</li>
            <li><b>foi d'animal</b> = je te le promets</li>
            <li><b>intérêt et principal</b> = ce que je dois + un peu plus</li>
            <li><b>prêteuse</b> = quelqu'un qui aime prêter</li>
            <li><b>moindre défaut</b> = son plus petit défaut</li>
            <li><b>emprunteuse</b> = quelqu'un qui emprunte</li>
            <li><b>à tout venant</b> = à n'importe qui</li>
            <li><b>ne vous déplaise</b> = ne te fâche pas</li>
            <li><b>fort aise</b> = très contente</li>
          </ul>
        </div>
      )}

      {/* Done button */}
      <button onClick={() => { stopAudio(); onHome(); }}
        className="w-full py-3 rounded-xl font-bold text-white text-sm"
        style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>
        ✓ J'ai fini — retour au menu
      </button>
    </div>
  );
}
