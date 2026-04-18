import React, { useState, useEffect, useRef } from 'react';

const presets = [
  { mins: 5, label: '5 min', desc: 'Pause rapide' },
  { mins: 10, label: '10 min', desc: 'Mini exercice' },
  { mins: 15, label: '15 min', desc: 'App time' },
  { mins: 20, label: '20 min', desc: 'Devoirs' },
  { mins: 30, label: '30 min', desc: 'Chambre / lecture' },
  { mins: 45, label: '45 min', desc: 'Étude longue' },
];

function format(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function playDoneSound() {
  // 3-tone "ding" using Web Audio API
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.2 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.5);
    osc.start(ctx.currentTime + i * 0.2);
    osc.stop(ctx.currentTime + i * 0.2 + 0.5);
  });
}

function speak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

export default function Timer({ onHome }) {
  const [duration, setDuration] = useState(15 * 60); // total seconds
  const [remaining, setRemaining] = useState(15 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [task, setTask] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            playDoneSound();
            speak(task ? `${task} terminé! Bravo!` : 'Temps écoulé! Bravo!');
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, task]);

  function start() {
    if (remaining === 0) setRemaining(duration);
    setDone(false);
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setRemaining(duration);
    setDone(false);
  }

  function selectPreset(mins) {
    const secs = mins * 60;
    setDuration(secs);
    setRemaining(secs);
    setRunning(false);
    setDone(false);
  }

  const pct = duration > 0 ? (remaining / duration) * 100 : 0;
  const color = remaining > duration * 0.5 ? '#2d7a3a' : remaining > duration * 0.2 ? '#e8a050' : '#c74a15';

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone">⏱️ Minuteur</h2>
        <div className="w-12" />
      </div>

      {/* Task input */}
      <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-s1">
        <label className="text-xs font-bold text-s4 uppercase tracking-wide mb-2 block">Que fais-tu?</label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Ex: Ranger ma chambre, Dictée mardi..."
          className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-semibold focus:outline-none focus:border-lava"
        />
      </div>

      {/* Big timer display */}
      <div className={`bg-white rounded-3xl p-8 mb-4 border-2 text-center ${done ? 'border-green-500 animate-pulse' : 'border-s1'}`}>
        {done ? (
          <>
            <div className="text-6xl mb-3">🎉</div>
            <h3 className="font-heading text-3xl font-extrabold text-ok mb-1">Bravo!</h3>
            <p className="text-s4 font-semibold mb-4">{task || 'Temps écoulé!'}</p>
          </>
        ) : (
          <>
            <div
              className="font-heading font-extrabold leading-none mb-4 transition-colors"
              style={{ fontSize: '7rem', color }}
            >
              {format(remaining)}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-s1 rounded-full h-4 overflow-hidden mb-4">
              <div
                className="h-4 rounded-full transition-all duration-1000"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            {task && <p className="text-stone font-semibold mb-2">{task}</p>}
          </>
        )}

        {/* Controls */}
        <div className="flex gap-3 justify-center mt-2">
          {!done && !running && (
            <button
              onClick={start}
              className="px-8 py-3 rounded-xl font-bold text-white text-lg"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}
            >
              ▶ Démarrer
            </button>
          )}
          {running && (
            <button
              onClick={pause}
              className="px-8 py-3 rounded-xl font-bold text-white text-lg bg-yellow-600"
            >
              ⏸ Pause
            </button>
          )}
          {(remaining < duration || done) && (
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2"
            >
              🔄 Recommencer
            </button>
          )}
        </div>
      </div>

      {/* Preset buttons */}
      <div className="font-heading text-base font-bold text-s4 mb-2">Choisis le temps</div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {presets.map((p) => {
          const isActive = duration === p.mins * 60;
          return (
            <button
              key={p.mins}
              onClick={() => selectPreset(p.mins)}
              className={`rounded-2xl p-4 text-center transition-all active:scale-95 ${
                isActive
                  ? 'border-2 border-lava bg-orange-50 text-lava'
                  : 'border-2 border-s1 bg-white text-stone hover:border-fox'
              }`}
            >
              <div className="font-heading text-2xl font-extrabold">{p.label}</div>
              <div className="text-xs font-semibold text-s4 mt-1">{p.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Custom */}
      <div className="bg-white rounded-2xl p-4 border-2 border-s1">
        <label className="text-xs font-bold text-s4 uppercase tracking-wide mb-2 block">Personnalisé (minutes)</label>
        <input
          type="number"
          min="1"
          max="120"
          onChange={(e) => {
            const m = parseInt(e.target.value);
            if (m > 0 && m <= 120) selectPreset(m);
          }}
          placeholder="Ex: 25"
          className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-bold focus:outline-none focus:border-lava"
        />
      </div>
    </div>
  );
}
