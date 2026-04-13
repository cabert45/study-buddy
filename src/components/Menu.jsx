import React, { useEffect, useState } from 'react';
import { getProgress } from '../utils/storage';

const modes = [
  { id: 'mixed', label: '🚀 Pratique ciblée', desc: 'Mix de tes exercices', priority: true, recommended: true },
  { id: 'calcul', label: '🔢 Calcul', desc: 'Addition et soustraction', priority: true },
  { id: 'terme', label: '🔍 Terme manquant', desc: 'Trouve le nombre mystère', priority: true },
  { id: 'multi_step', label: '🧩 Problèmes à étapes', desc: 'Zoo, château, poissons', priority: false },
  { id: 'relational', label: '🔗 De plus / de moins', desc: 'Comparaisons en chaîne', priority: false },
  { id: 'compare', label: '⚖️ Compare', desc: 'Plus grand, plus petit ou égal?', priority: false },
  { id: 'pair_impair', label: '🎯 Pair / Impair', desc: 'Nombres pairs et impairs', priority: false },
  { id: 'mental', label: '🧠 Calcul mental', desc: 'Vite, vite!', priority: false },
];

export default function Menu({ onStartPractice, onStartTutor, onOpenDashboard }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getProgress().then(setStats).catch(() => {});
  }, []);

  const totalCorrect = stats?.totals?.correct || 0;
  const totalQuestions = stats?.totals?.total || 0;
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      {/* Stars background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🚀</div>
          <h1 className="text-3xl font-extrabold text-star">Study Buddy</h1>
          <p className="text-lg font-semibold text-purple-300 mt-1">Tu es capable Ryan! 💪</p>
          {totalQuestions > 0 && (
            <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/10">
              <div className="flex justify-between text-sm font-semibold text-purple-200">
                <span>⭐ {totalCorrect}/{totalQuestions}</span>
                <span>{pct}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 mt-1">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #6c5ce7, #e84393)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Practice modes */}
        <div className="space-y-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onStartPractice(mode.id)}
              className={`w-full text-left rounded-2xl p-4 shadow-lg transition-all active:scale-[0.98] ${
                mode.recommended
                  ? 'bg-gradient-to-r from-cosmic/30 to-rocket/20 border-2 border-star/40 backdrop-blur-sm'
                  : mode.priority
                  ? 'bg-white/10 backdrop-blur-sm border border-cosmic/30'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-white">{mode.label}</div>
                  <div className="text-sm text-purple-300">{mode.desc}</div>
                </div>
                {mode.recommended && (
                  <span className="text-xs font-bold bg-star text-space px-2 py-1 rounded-full">
                    RECOMMANDE
                  </span>
                )}
                {mode.priority && !mode.recommended && (
                  <span className="text-xs font-bold bg-rocket text-white px-2 py-1 rounded-full">
                    PRIORITE
                  </span>
                )}
              </div>
            </button>
          ))}

          {/* Tutor mode */}
          <button
            onClick={onStartTutor}
            className="w-full text-left rounded-2xl p-4 shadow-lg bg-white/10 backdrop-blur-sm border border-purple-400/30"
          >
            <div className="text-lg font-bold text-white">👨‍🚀 Mode Tuteur</div>
            <div className="text-sm text-purple-300">Apprends avec ton tuteur IA</div>
          </button>
        </div>

        {/* Dashboard link */}
        <button
          onClick={onOpenDashboard}
          className="w-full mt-6 text-center text-sm text-purple-400 font-semibold py-3"
        >
          📊 Tableau de bord parent
        </button>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
