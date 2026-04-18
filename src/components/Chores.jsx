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
  const s = secs % 60;
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

function speak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

export default function Chores({ onHome }) {
  const [chores, setChores] = useState(defaultChores.map(c => ({ ...c, done: false })));
  const [activeId, setActiveId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const doneCount = chores.filter(c => c.done).length;
  const totalMins = chores.reduce((sum, c) => sum + c.mins, 0);
  const remainingMins = chores.filter(c => !c.done).reduce((sum, c) => sum + c.mins, 0);
  const allDone = doneCount === chores.length;

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            const chore = chores.find(c => c.id === activeId);
            if (chore) {
              playDing();
              speak(`${chore.label}, terminé!`);
            }
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, activeId, chores]);

  function startChore(chore) {
    if (chore.done) return;
    setActiveId(chore.id);
    setRemaining(chore.mins * 60);
    setRunning(true);
  }

  function toggleDone(id) {
    setChores(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
    if (id === activeId) {
      setRunning(false);
      setActiveId(null);
    }
  }

  function resetAll() {
    setChores(defaultChores.map(c => ({ ...c, done: false })));
    setActiveId(null);
    setRunning(false);
    setRemaining(0);
  }

  const activeChore = chores.find(c => c.id === activeId);

  if (allDone) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12 text-center">
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="font-heading text-4xl font-extrabold text-ok mb-2">Tout est fait!</h2>
        <p className="text-stone font-semibold mb-6 text-lg">Bravo Ryan! Tu peux jouer dehors maintenant! 🌳⚽</p>
        <div className="bg-white rounded-2xl p-6 mb-4 border-2 border-s1">
          <div className="text-sm font-bold text-s4 uppercase mb-1">Tu as fait</div>
          <div className="font-heading text-5xl font-extrabold text-lava">{chores.length} tâches</div>
          <div className="text-sm font-bold text-s4 mt-2">en {totalMins} minutes au total</div>
        </div>
        <div className="space-y-3">
          <button onClick={resetAll} className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            🔄 Recommencer demain
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
        <button onClick={resetAll} className="text-xs text-s4 font-bold hover:text-lava">🔄</button>
      </div>

      {/* Progress card */}
      <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-s1 text-center">
        <div className="font-heading text-3xl font-extrabold text-stone">
          {doneCount} / {chores.length}
        </div>
        <p className="text-sm text-s4 font-semibold mb-3">tâches faites</p>
        <div className="w-full bg-s1 rounded-full h-3 overflow-hidden">
          <div className="h-3 rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / chores.length) * 100}%`, background: 'linear-gradient(90deg, #c74a15, #e8622a)' }} />
        </div>
        <p className="text-xs font-bold text-s4 mt-2">⏱ {remainingMins} min restantes</p>
      </div>

      {/* Active timer (sticky) */}
      {activeChore && (
        <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-lava sticky top-2 z-10 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeChore.icon}</span>
              <div>
                <div className="text-xs font-bold text-fox-d uppercase">En cours</div>
                <div className="font-heading font-bold text-stone text-sm">{activeChore.label}</div>
              </div>
            </div>
            <div className="font-heading text-3xl font-extrabold" style={{ color: remaining < 30 ? '#c74a15' : '#2d7a3a' }}>
              {format(remaining)}
            </div>
          </div>
          <div className="flex gap-2">
            {running ? (
              <button onClick={() => setRunning(false)}
                className="flex-1 py-2 rounded-lg font-bold text-white text-sm bg-yellow-600">
                ⏸ Pause
              </button>
            ) : (
              <button onClick={() => setRunning(true)}
                className="flex-1 py-2 rounded-lg font-bold text-white text-sm"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                ▶ Reprendre
              </button>
            )}
            <button onClick={() => toggleDone(activeChore.id)}
              className="flex-1 py-2 rounded-lg font-bold text-white text-sm bg-ok">
              ✓ Fait!
            </button>
          </div>
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
              <div className="flex-1">
                <div className={`font-heading font-bold text-sm ${chore.done ? 'line-through text-s4' : 'text-stone'}`}>
                  {chore.label}
                </div>
                <div className="text-xs text-s4 font-semibold">⏱ {chore.mins} min</div>
              </div>
              {!chore.done && (
                <button onClick={() => startChore(chore)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                    isActive ? 'bg-orange-50 text-lava border-2 border-lava' : 'bg-orange-50 text-fox-d border-2 border-orange-200 hover:border-fox'
                  }`}>
                  {isActive ? '...' : '▶ Go'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
