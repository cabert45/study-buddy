import React, { useState, useEffect, useRef } from 'react';

const defaultChores = [
  { id: 1, label: 'Ramasser tes vêtements par terre', mins: 5, icon: '👕' },
  { id: 2, label: 'Trouver les vêtements sales (panier)', mins: 5, icon: '🧺' },
  { id: 3, label: 'Ranger ta chambre (jouets, livres)', mins: 15, icon: '🧸' },
  { id: 4, label: 'Balayer ta chambre', mins: 5, icon: '🧹' },
  { id: 5, label: 'Plier tes vêtements (sécheuse)', mins: 15, icon: '👔' },
  { id: 6, label: 'Ranger tes vêtements pliés', mins: 10, icon: '🗄️' },
  { id: 7, label: 'Ranger les souliers — entrée', mins: 5, icon: '👟' },
  { id: 8, label: 'Ranger le salon', mins: 10, icon: '🛋️' },
  { id: 9, label: 'Balayer le salon', mins: 5, icon: '🧹' },
];

function format(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.max(0, secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function playDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  } catch {}
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

const breakOptions = [5, 10, 15];

export default function Chores({ onHome }) {
  const [chores, setChores] = useState(defaultChores.map(c => ({ ...c, done: false, timeWorked: 0 })));
  const [activeId, setActiveId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [breakRemaining, setBreakRemaining] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const [warned2min, setWarned2min] = useState(false);
  const [warned30s, setWarned30s] = useState(false);
  const [totalWorkSecs, setTotalWorkSecs] = useState(0);
  const [totalBreakSecs, setTotalBreakSecs] = useState(0);
  const intervalRef = useRef(null);

  const doneCount = chores.filter(c => c.done).length;
  const remainingMins = chores.filter(c => !c.done).reduce((sum, c) => sum + c.mins, 0);
  const allDone = doneCount === chores.length;

  // Work timer
  useEffect(() => {
    if (running && remaining > 0 && !onBreak) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          const next = r - 1;
          // Voice warnings
          if (next === 120 && !warned2min) {
            setWarned2min(true);
            const chore = chores.find(c => c.id === activeId);
            playBeep();
            speak(`Il te reste 2 minutes pour ${chore?.label || 'cette tâche'}`);
          }
          if (next === 30 && !warned30s) {
            setWarned30s(true);
            playBeep();
            speak('30 secondes!');
          }
          if (next <= 0) {
            clearInterval(intervalRef.current);
            setRunning(false);
            const chore = chores.find(c => c.id === activeId);
            playDing();
            speak(`${chore?.label || 'Tâche'} — Temps écoulé! As-tu fini?`);
            return 0;
          }
          return next;
        });
        setTotalWorkSecs(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, onBreak, activeId, chores, warned2min, warned30s]);

  // Break timer
  useEffect(() => {
    if (onBreak && breakRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setBreakRemaining(b => {
          if (b <= 1) {
            clearInterval(intervalRef.current);
            setOnBreak(false);
            playDing();
            speak('Pause terminée! Retour au travail!');
            return 0;
          }
          return b - 1;
        });
        setTotalBreakSecs(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [onBreak, breakRemaining]);

  function startChore(chore) {
    if (chore.done) return;
    if (onBreak) return;
    setActiveId(chore.id);
    setRemaining(chore.mins * 60);
    setWarned2min(false);
    setWarned30s(false);
    setRunning(true);
    speak(`Commence: ${chore.label}. Tu as ${chore.mins} minutes.`);
  }

  function continueWorking() {
    // Resume on the same chore (if time ran out, restart with 2 more min)
    if (remaining === 0) {
      setRemaining(120);
      setWarned2min(false);
      setWarned30s(false);
    }
    setRunning(true);
  }

  function takeBreak(mins) {
    setRunning(false);
    setOnBreak(true);
    setBreakRemaining(mins * 60);
    speak(`Pause de ${mins} minutes. Repose-toi!`);
  }

  function endBreakEarly() {
    setOnBreak(false);
    setBreakRemaining(0);
    speak('Retour au travail!');
  }

  function toggleDone(id) {
    setChores(prev => prev.map(c => c.id === id ? { ...c, done: !c.done, timeWorked: c.id === activeId ? totalWorkSecs : c.timeWorked } : c));
    if (id === activeId) {
      setRunning(false);
      setActiveId(null);
      setRemaining(0);
    }
  }

  function resetAll() {
    if (!confirm('Tout recommencer? (les tâches faites seront décochées)')) return;
    setChores(defaultChores.map(c => ({ ...c, done: false, timeWorked: 0 })));
    setActiveId(null);
    setRunning(false);
    setRemaining(0);
    setOnBreak(false);
    setBreakRemaining(0);
    setTotalWorkSecs(0);
    setTotalBreakSecs(0);
  }

  const activeChore = chores.find(c => c.id === activeId);

  if (allDone) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12 text-center">
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="font-heading text-4xl font-extrabold text-ok mb-2">Tout est fait!</h2>
        <p className="text-stone font-semibold mb-6 text-lg">Bravo Ryan! Tu peux jouer dehors maintenant! 🌳⚽</p>
        <div className="bg-white rounded-2xl p-6 mb-4 border-2 border-s1">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs font-bold text-s4 uppercase mb-1">Tâches</div>
              <div className="font-heading text-3xl font-extrabold text-lava">{chores.length}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-s4 uppercase mb-1">Travail</div>
              <div className="font-heading text-3xl font-extrabold text-ok">{Math.round(totalWorkSecs / 60)}m</div>
            </div>
            <div>
              <div className="text-xs font-bold text-s4 uppercase mb-1">Pauses</div>
              <div className="font-heading text-3xl font-extrabold text-fox">{Math.round(totalBreakSecs / 60)}m</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={resetAll} className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            🔄 Recommencer
          </button>
          <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone">📋 Mes tâches</h2>
        <button onClick={resetAll} className="text-xs text-s4 font-bold hover:text-lava">🔄 Reset</button>
      </div>

      {/* Day stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white rounded-xl p-2 text-center border-2 border-s1">
          <div className="font-heading text-lg font-extrabold text-stone">{doneCount}/{chores.length}</div>
          <div className="text-[10px] font-bold text-s4 uppercase">Faites</div>
        </div>
        <div className="bg-white rounded-xl p-2 text-center border-2 border-s1">
          <div className="font-heading text-lg font-extrabold text-ok">{Math.round(totalWorkSecs / 60)}m</div>
          <div className="text-[10px] font-bold text-s4 uppercase">Travail</div>
        </div>
        <div className="bg-white rounded-xl p-2 text-center border-2 border-s1">
          <div className="font-heading text-lg font-extrabold text-fox">{Math.round(totalBreakSecs / 60)}m</div>
          <div className="text-[10px] font-bold text-s4 uppercase">Pauses</div>
        </div>
      </div>

      {/* On break — full screen ish */}
      {onBreak && (
        <div className="bg-white rounded-2xl p-6 mb-4 border-2 border-fox sticky top-2 z-10 shadow-lg text-center">
          <div className="text-5xl mb-2">☕</div>
          <div className="text-xs font-bold text-fox-d uppercase tracking-wide">Pause</div>
          <div className="font-heading text-5xl font-extrabold text-fox my-2">{format(breakRemaining)}</div>
          <p className="text-sm text-s4 font-semibold mb-3">Repose-toi! Retour au travail bientôt.</p>
          <button onClick={endBreakEarly}
            className="px-6 py-2 rounded-lg font-bold text-white text-sm"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            ⏭ Reprendre maintenant
          </button>
        </div>
      )}

      {/* Active timer (sticky) */}
      {activeChore && !onBreak && (
        <div className={`bg-white rounded-2xl p-4 mb-4 border-2 sticky top-2 z-10 shadow-lg ${remaining === 0 ? 'border-red-400' : 'border-lava'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-2xl">{activeChore.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-fox-d uppercase">En cours</div>
                <div className="font-heading font-bold text-stone text-sm truncate">{activeChore.label}</div>
              </div>
            </div>
            <div className="font-heading text-3xl font-extrabold flex-shrink-0"
              style={{ color: remaining === 0 ? '#c74a15' : remaining < 60 ? '#c74a15' : remaining < 180 ? '#e8a050' : '#2d7a3a' }}>
              {format(remaining)}
            </div>
          </div>

          {remaining === 0 && (
            <p className="text-xs text-red-600 font-bold mb-2 text-center">⏰ Temps écoulé! Continue ou marque "Fait"</p>
          )}

          <div className="flex gap-2">
            {running ? (
              <button onClick={() => setRunning(false)}
                className="flex-1 py-2 rounded-lg font-bold text-white text-sm bg-yellow-600">
                ⏸ Pause
              </button>
            ) : (
              <button onClick={continueWorking}
                className="flex-1 py-2 rounded-lg font-bold text-white text-sm"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                {remaining === 0 ? '+ 2 min' : '▶ Reprendre'}
              </button>
            )}
            <button onClick={() => toggleDone(activeChore.id)}
              className="flex-1 py-2 rounded-lg font-bold text-white text-sm bg-ok">
              ✓ Fait!
            </button>
          </div>

          {/* Break options */}
          <div className="mt-2 pt-2 border-t border-s1">
            <div className="text-[10px] font-bold text-s4 uppercase mb-1.5 text-center">Besoin d'une pause?</div>
            <div className="grid grid-cols-3 gap-2">
              {breakOptions.map((m) => (
                <button key={m} onClick={() => takeBreak(m)}
                  className="py-1.5 rounded-lg font-bold text-xs text-fox-d bg-orange-50 border-2 border-orange-200 hover:border-fox">
                  ☕ {m} min
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No active chore — show start prompt */}
      {!activeChore && !onBreak && doneCount < chores.length && (
        <div className="bg-orange-50 rounded-2xl p-3 mb-4 border-2 border-orange-200 text-center">
          <p className="text-sm font-bold text-fox-d">👇 Choisis une tâche et clique ▶ Go</p>
        </div>
      )}

      {/* Chore list */}
      <div className="space-y-2">
        {chores.map((chore) => {
          const isActive = chore.id === activeId;
          return (
            <div key={chore.id}
              className={`bg-white rounded-2xl p-3 border-2 flex items-center gap-3 transition-all ${
                chore.done ? 'border-s1 opacity-50' : isActive ? 'border-lava shadow-md' : 'border-s1'
              }`}>
              <button
                onClick={() => toggleDone(chore.id)}
                className={`w-8 h-8 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  chore.done ? 'bg-ok border-ok text-white' : 'bg-white border-s2 hover:border-lava'
                }`}>
                {chore.done ? '✓' : ''}
              </button>
              <span className="text-2xl flex-shrink-0">{chore.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-heading font-bold text-sm ${chore.done ? 'line-through text-s4' : 'text-stone'}`}>
                  {chore.label}
                </div>
                <div className="text-xs text-s4 font-semibold">⏱ {chore.mins} min</div>
              </div>
              {!chore.done && (
                <button onClick={() => startChore(chore)}
                  disabled={onBreak || (activeId && !isActive)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex-shrink-0 ${
                    isActive
                      ? 'bg-orange-50 text-lava border-2 border-lava'
                      : 'bg-orange-50 text-fox-d border-2 border-orange-200 hover:border-fox disabled:opacity-30'
                  }`}>
                  {isActive ? '...' : '▶ Go'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!onBreak && remainingMins > 0 && (
        <p className="text-center text-xs text-s4 font-semibold mt-4">
          ⏱ Encore {remainingMins} min de tâches à faire
        </p>
      )}
    </div>
  );
}
