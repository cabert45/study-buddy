import React, { useEffect, useState } from 'react';
import { getProgress } from '../utils/storage';

const mathModes = [
  { id: 'mixed', label: '🚀 Pratique ciblée', desc: 'Mix de tous tes exercices' },
  { id: 'calcul', label: '🔢 Calcul', desc: 'Addition et soustraction' },
  { id: 'terme', label: '🔍 Terme manquant', desc: 'Trouve le nombre mystère' },
  { id: 'multi_step', label: '🧩 Problèmes', desc: 'Problèmes à étapes' },
  { id: 'relational', label: '🔗 De plus/moins', desc: 'Comparaisons' },
  { id: 'compare', label: '⚖️ Compare', desc: '>, < ou =' },
  { id: 'pair_impair', label: '🎯 Pair/Impair', desc: 'Nombres pairs et impairs' },
  { id: 'mental', label: '🧠 Mental', desc: '+9, −9, +10, −10' },
  { id: 'statistique', label: '📊 Statistique', desc: 'Diagrammes et tableaux' },
];

const frenchModes = [
  { id: 'francais_mix', label: '📝 Mix Français', desc: 'Grammaire, verbes, adjectifs' },
  { id: 'determinant', label: '📌 Déterminants', desc: 'le, la, un, une, mon...' },
  { id: 'verbes', label: '✏️ Verbes', desc: 'être, avoir, aller, faire...' },
  { id: 'adjectif', label: '🎨 Adjectifs', desc: 'Accord et familles de mots' },
];

export default function Menu({ onStartPractice, onStartTutor, onStartAquarium, onStartSpeed, onStartMemory, onOpenDashboard }) {
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('math');

  useEffect(() => {
    getProgress().then(setStats).catch(() => {});
  }, []);

  const totalCorrect = stats?.totals?.correct || 0;
  const totalQuestions = stats?.totals?.total || 0;
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const sessionCount = stats?.sessions?.length || 0;

  const modes = tab === 'math' ? mathModes : frenchModes;

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <h1 className="text-xl font-extrabold text-white">Study Buddy</h1>
        </div>
        <button
          onClick={onOpenDashboard}
          className="text-xs font-bold text-purple-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
        >
          📊 Dashboard
        </button>
      </div>

      {/* Welcome banner */}
      <div className="rounded-2xl p-5 mb-4 border border-white/10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.3) 0%, rgba(232,67,147,0.2) 100%)' }}>
        <h2 className="text-2xl font-extrabold text-white mb-1">Bonjour Ryan!</h2>
        <p className="text-sm text-purple-200">
          {pct >= 70 ? "Tu es en feu! Continue ton excellent travail! 🔥" :
           pct >= 50 ? "Tu progresses bien! Continue! 💪" :
           totalQuestions > 0 ? "Chaque exercice te rend plus fort! 🚀" :
           "Prêt pour t'entraîner? C'est parti! 🌟"}
        </p>
        {/* Decorative elements */}
        <div className="absolute top-2 right-4 text-4xl opacity-20">🏰</div>
        <div className="absolute bottom-1 right-16 text-3xl opacity-15">⭐</div>
      </div>

      {/* Stats cards */}
      {totalQuestions > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-extrabold text-white">{totalQuestions}</div>
            <div className="text-[10px] font-bold text-purple-400 uppercase">Questions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-extrabold text-green-400">{pct}%</div>
            <div className="text-[10px] font-bold text-purple-400 uppercase">Score</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-extrabold text-star">{sessionCount}</div>
            <div className="text-[10px] font-bold text-purple-400 uppercase">Sessions</div>
          </div>
        </div>
      )}

      {/* Subject tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('math')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
            tab === 'math'
              ? 'bg-cosmic text-white shadow-lg'
              : 'bg-white/5 text-purple-400 border border-white/10'
          }`}
        >
          🔢 Mathématiques
        </button>
        <button
          onClick={() => setTab('french')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
            tab === 'french'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white/5 text-purple-400 border border-white/10'
          }`}
        >
          📚 Français
        </button>
      </div>

      {/* Mode grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {modes.map((mode, i) => {
          const isFirst = i === 0;
          return (
            <button
              key={mode.id}
              onClick={() => onStartPractice(mode.id)}
              className={`text-left rounded-xl p-3.5 transition-all active:scale-[0.97] ${
                isFirst
                  ? tab === 'math'
                    ? 'col-span-2 bg-gradient-to-r from-cosmic/40 to-rocket/30 border-2 border-star/40'
                    : 'col-span-2 bg-gradient-to-r from-green-800/40 to-emerald-700/30 border-2 border-green-400/40'
                  : 'bg-white/8 border border-white/10 hover:bg-white/12'
              }`}
            >
              <div className="text-base font-bold text-white">{mode.label}</div>
              <div className="text-xs text-purple-300 mt-0.5">{mode.desc}</div>
            </button>
          );
        })}
      </div>

      {/* AI Tutor */}
      <button
        onClick={onStartTutor}
        className="w-full text-left rounded-xl p-3.5 mb-4 bg-white/8 border border-purple-400/30 hover:bg-white/12 transition-all active:scale-[0.97]"
      >
        <div className="text-base font-bold text-white">👨‍🚀 Tuteur IA</div>
        <div className="text-xs text-purple-300 mt-0.5">Apprends avec ton tuteur intelligent</div>
      </button>

      {/* Games section */}
      <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">🎮 Jeux</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={onStartAquarium}
          className="rounded-xl p-3 text-center bg-cyan-500/15 border border-cyan-400/25 hover:bg-cyan-500/25 transition-all active:scale-95"
        >
          <div className="text-2xl mb-1">🐟</div>
          <div className="text-xs font-bold text-cyan-200">Aquarium</div>
        </button>
        <button
          onClick={onStartSpeed}
          className="rounded-xl p-3 text-center bg-orange-500/15 border border-orange-400/25 hover:bg-orange-500/25 transition-all active:scale-95"
        >
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xs font-bold text-orange-200">Course</div>
        </button>
        <button
          onClick={onStartMemory}
          className="rounded-xl p-3 text-center bg-pink-500/15 border border-pink-400/25 hover:bg-pink-500/25 transition-all active:scale-95"
        >
          <div className="text-2xl mb-1">🎴</div>
          <div className="text-xs font-bold text-pink-200">Mémoire</div>
        </button>
      </div>
    </div>
  );
}
