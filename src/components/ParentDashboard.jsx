import React, { useState } from 'react';
import { getDashboard, resetData } from '../utils/storage';

const categoryLabels = {
  calcul: '🔢 Calcul',
  terme: '🔍 Terme manquant',
  multi_step: '🧩 Problemes a etapes',
  relational: '🔗 De plus / de moins',
  compare: '⚖️ Compare',
  pair_impair: '🎯 Pair / Impair',
  mental: '🧠 Calcul mental',
};

export default function ParentDashboard({ onHome }) {
  const [pin, setPin] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);

  async function handleSubmitPin() {
    try {
      const res = await getDashboard(pin);
      if (res.error) {
        setError('PIN incorrect');
        return;
      }
      setData(res);
      setError('');
    } catch {
      setError('Erreur de connexion');
    }
  }

  async function handleReset() {
    await resetData(pin);
    setData(null);
    setShowReset(false);
    setPin('');
  }

  // PIN entry screen
  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10">
        <button onClick={onHome} className="text-purple-400 font-bold text-sm mb-6">← Menu</button>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/10">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-white mb-4">Tableau de bord parent</h2>
          <p className="text-sm text-purple-300 mb-4">Entrez le code PIN</p>

          {/* PIN dots */}
          <div className="flex justify-center gap-2 mb-4">
            {pin.split('').map((d, i) => (
              <div key={i} className="w-10 h-10 rounded-lg bg-cosmic/40 flex items-center justify-center text-xl font-bold text-star">
                •
              </div>
            ))}
            {Array.from({ length: 4 - pin.length }, (_, i) => (
              <div key={`e${i}`} className="w-10 h-10 rounded-lg bg-white/5 border-2 border-dashed border-white/20" />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((num, i) => {
              if (num === null) return <div key={i} />;
              if (num === 'del') {
                return (
                  <button
                    key={i}
                    onClick={() => setPin((p) => p.slice(0, -1))}
                    className="py-3 rounded-xl font-bold text-purple-300 bg-white/10"
                  >
                    ←
                  </button>
                );
              }
              return (
                <button
                  key={i}
                  onClick={() => pin.length < 4 && setPin((p) => p + num)}
                  className="py-3 rounded-xl font-bold text-lg text-white bg-white/10 border border-white/10"
                >
                  {num}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmitPin}
            disabled={pin.length !== 4}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg, #6c5ce7, #e84393)' }}
          >
            Entrer
          </button>

          {error && <p className="text-red-400 font-semibold mt-3 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  // Dashboard view
  const { stats, sessions, totals, sessionCount } = data;
  const overallPct = totals.total > 0 ? Math.round((totals.correct / totals.total) * 100) : 0;

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="text-purple-400 font-bold text-sm">← Menu</button>
        <h2 className="font-bold text-purple-200">📊 Tableau de bord</h2>
        <div />
      </div>

      {/* Overall stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-4 text-center border border-white/10">
        <div className="text-4xl font-extrabold text-star">{overallPct}%</div>
        <p className="text-sm text-purple-300 mt-1">Score global</p>
        <div className="flex justify-around mt-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{totals.total}</div>
            <div className="text-xs text-purple-400">Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{totals.correct}</div>
            <div className="text-xs text-purple-400">Correctes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{sessionCount}</div>
            <div className="text-xs text-purple-400">Sessions</div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm p-4 mb-4 border border-white/10">
        <h3 className="font-bold text-purple-200 mb-3">Par categorie</h3>
        <div className="space-y-3">
          {stats.map((cat) => {
            const pct = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
            return (
              <div key={cat.category}>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-white">{categoryLabels[cat.category] || cat.category}</span>
                  <span className="text-purple-300">{pct}% ({cat.correct}/{cat.total})</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 mt-1">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 70 ? '#00b894' : pct >= 50 ? '#6c5ce7' : '#e84393',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm p-4 mb-4 border border-white/10">
        <h3 className="font-bold text-purple-200 mb-3">Dernieres sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-purple-400">Aucune session encore</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => {
              const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
              return (
                <div key={s.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-purple-400">{s.date}</span>
                  <span className="font-semibold text-purple-200">{s.mode}</span>
                  <span className={`font-bold ${pct >= 70 ? 'text-green-400' : pct >= 50 ? 'text-star' : 'text-red-400'}`}>
                    {s.correct}/{s.total} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset button */}
      <div className="text-center mb-8">
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="text-sm text-red-400 font-semibold"
          >
            🗑️ Reinitialiser les donnees
          </button>
        ) : (
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <p className="text-sm font-bold text-red-300 mb-3">
              Effacer toutes les donnees de Ryan?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl font-bold text-white bg-red-500"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 py-2 rounded-xl font-bold text-purple-300 bg-white/10"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
