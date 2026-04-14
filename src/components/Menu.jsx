import React, { useEffect, useState } from 'react';
import { getProgress } from '../utils/storage';

const ryanMathModes = [
  { id: 'mixed', label: 'Pratique ciblée', desc: 'Mix de tous tes exercices', featured: true },
  { id: 'calcul', label: 'Calcul', desc: 'Addition et soustraction', icon: '🔢', badge: 'Priorité' },
  { id: 'terme', label: 'Terme manquant', desc: 'Trouve le nombre mystère', icon: '🔍', badge: 'Priorité' },
  { id: 'multi_step', label: 'Problèmes', desc: 'Problèmes à étapes', icon: '🧩', badge: 'À travailler' },
  { id: 'relational', label: 'De plus / moins', desc: 'Comparaisons', icon: '🔗' },
  { id: 'compare', label: 'Compare', desc: '>, < ou =', icon: '⚖️' },
  { id: 'pair_impair', label: 'Pair / Impair', desc: 'Nombres pairs et impairs', icon: '🎯' },
  { id: 'mental', label: 'Mental', desc: 'Calcul rapide', icon: '🧠' },
  { id: 'statistique', label: 'Statistique', desc: 'Diagrammes et tableaux', icon: '📊' },
];

const ryanFrenchModes = [
  { id: 'francais_mix', label: 'Mix Français', desc: 'Grammaire, verbes, adjectifs', featured: true },
  { id: 'determinant', label: 'Déterminants', desc: 'le, la, un, une, mon...', icon: '📌' },
  { id: 'verbes', label: 'Verbes', desc: 'être, avoir, aller, faire...', icon: '✏️' },
  { id: 'adjectif', label: 'Adjectifs', desc: 'Accord et familles de mots', icon: '🎨' },
];

const caylaMathModes = [
  { id: 'pemdas', label: 'PEMDAS', desc: 'Ordre des opérations', featured: true },
];

const caylaFrenchModes = [
  { id: 'conjugaison', label: 'Conjugaison', desc: 'Verbes et temps', featured: true },
];

function FoxMascot() {
  return (
    <svg className="fox-svg" viewBox="0 0 130 160" width="120" height="150" fill="none" style={{ animation: 'bounce 3s ease-in-out infinite' }}>
      <g style={{ transformOrigin: '25px 45px', animation: 'tailwag 1.5s ease-in-out infinite' }}>
        <path d="M25 110Q5 95 10 75Q15 60 30 70Q20 80 28 95Z" fill="#e2762b"/>
        <path d="M10 75Q13 65 22 68Q15 73 18 82Z" fill="white" opacity=".7"/>
      </g>
      <ellipse cx="65" cy="115" rx="32" ry="28" fill="#e2762b"/>
      <ellipse cx="65" cy="120" rx="22" ry="20" fill="#fde8cc"/>
      <rect x="48" y="128" width="10" height="22" rx="5" fill="#e2762b"/>
      <rect x="72" y="128" width="10" height="22" rx="5" fill="#e2762b"/>
      <ellipse cx="53" cy="150" rx="7" ry="3.5" fill="#2c2017"/>
      <ellipse cx="77" cy="150" rx="7" ry="3.5" fill="#2c2017"/>
      <ellipse cx="65" cy="72" rx="28" ry="24" fill="#e2762b"/>
      <ellipse cx="65" cy="76" rx="20" ry="16" fill="#fde8cc"/>
      <path d="M40 60L35 35L52 52Z" fill="#e2762b"/><path d="M42 57L38 40L50 52Z" fill="#ffc68a"/>
      <path d="M90 60L95 35L78 52Z" fill="#e2762b"/><path d="M88 57L92 40L80 52Z" fill="#ffc68a"/>
      <ellipse cx="55" cy="68" rx="4.5" ry="5" fill="#2c2017"/><ellipse cx="56.5" cy="66.5" rx="1.5" ry="1.8" fill="white"/>
      <ellipse cx="75" cy="68" rx="4.5" ry="5" fill="#2c2017"/><ellipse cx="76.5" cy="66.5" rx="1.5" ry="1.8" fill="white"/>
      <ellipse cx="65" cy="78" rx="3.5" ry="2.5" fill="#2c2017"/>
      <path d="M62 81Q65 85 68 81" stroke="#2c2017" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="48" cy="76" rx="5" ry="3" fill="#f4a84a" opacity=".35"/>
      <ellipse cx="82" cy="76" rx="5" ry="3" fill="#f4a84a" opacity=".35"/>
    </svg>
  );
}

export default function Menu({ profile, onStartPractice, onStartTutor, onStartAquarium, onStartSpeed, onStartMemory, onOpenDashboard, onSwitchProfile }) {
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('math');

  useEffect(() => {
    getProgress().then(setStats).catch(() => {});
  }, []);

  const totalCorrect = stats?.totals?.correct || 0;
  const totalQuestions = stats?.totals?.total || 0;
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const sessionCount = stats?.sessions?.length || 0;

  const isRyan = profile === 'ryan';
  const name = isRyan ? 'Ryan' : 'Cayla';
  const grade = isRyan ? '2e année' : '6e année';
  const mathModes = isRyan ? ryanMathModes : caylaMathModes;
  const frenchModes = isRyan ? ryanFrenchModes : caylaFrenchModes;
  const modes = tab === 'math' ? mathModes : frenchModes;
  const featured = modes.find(m => m.featured);
  const grid = modes.filter(m => !m.featured);

  return (
    <div className="relative z-[1] max-w-3xl mx-auto px-4 pt-4 pb-12">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a)' }}>
            <span className="text-white text-lg">🌋</span>
          </div>
          <span className="font-heading text-2xl font-extrabold text-stone tracking-tight">Study Buddy</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenDashboard}
            className="bg-white border-2 border-s2 rounded-xl px-3 py-2 text-sm font-bold text-s6 hover:border-lava hover:text-lava transition-all flex items-center gap-1.5">
            📊
          </button>
          <button onClick={onSwitchProfile}
            className="bg-white border-2 border-s2 rounded-xl px-3 py-2 text-sm font-bold text-s6 hover:border-lava hover:text-lava transition-all">
            👤 {name}
          </button>
        </div>
      </div>

      {/* Greeting banner with fox */}
      <div className="rounded-3xl mb-4 overflow-hidden flex items-end min-h-[165px]"
        style={{ background: 'linear-gradient(135deg, #fff5ee, #ffe8d6 50%, #ffd8be)' }}>
        <div className="flex-1 p-6 z-[1]">
          <div className="font-heading text-sm font-bold text-fox-d mb-0.5 tracking-wide">Bienvenue</div>
          <h1 className="font-heading text-3xl font-extrabold text-stone leading-tight mb-1">Bonjour {name}!</h1>
          <p className="text-sm font-semibold text-s4">
            {pct >= 70 ? "Tu es en feu! Continue! 🔥" :
             totalQuestions > 0 ? "Continue, tu progresses! 💪" :
             "Prêt pour t'entraîner? Allons-y!"}
          </p>
        </div>
        <div className="flex-shrink-0 mr-2 z-[1]">
          <FoxMascot />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setTab('math')}
          className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
            tab === 'math' ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6 hover:border-lava hover:text-lava'
          }`}>
          Mathématiques
        </button>
        <button onClick={() => setTab('french')}
          className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
            tab === 'french' ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6 hover:border-lava hover:text-lava'
          }`}>
          Français
        </button>
      </div>

      {/* Featured mode */}
      {featured && (
        <button onClick={() => onStartPractice(featured.id)}
          className="w-full rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a)', boxShadow: '0 5px 22px rgba(199,74,21,0.15)' }}>
          <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">⭐</span>
          </div>
          <div className="text-left flex-1">
            <div className="font-heading text-xl font-extrabold text-white leading-tight">{featured.label}</div>
            <div className="text-sm font-semibold text-white/70">{featured.desc}</div>
          </div>
          <span className="text-white/40 text-xl font-extrabold">›</span>
        </button>
      )}

      {/* Module grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {grid.map(mode => (
          <button key={mode.id} onClick={() => onStartPractice(mode.id)}
            className="bg-white border-2 border-s1 rounded-2xl p-4 text-left transition-all
              hover:border-fox hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] relative">
            {mode.badge && (
              <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                mode.badge === 'Priorité' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
              }`}>{mode.badge}</span>
            )}
            <div className="text-2xl mb-2">{mode.icon}</div>
            <div className="font-heading text-base font-bold text-stone leading-tight">{mode.label}</div>
            <div className="text-xs font-semibold text-s4 mt-0.5">{mode.desc}</div>
          </button>
        ))}
      </div>

      {/* AI Tutor */}
      {isRyan && (
        <button onClick={onStartTutor}
          className="w-full flex items-center gap-4 bg-white border-2 border-s1 rounded-2xl p-4 mb-6 transition-all hover:border-info hover:shadow-md">
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #3a5bc7, #5b4ad4)' }}>
            <span className="text-white text-lg">👨‍🚀</span>
          </div>
          <div className="text-left">
            <div className="font-heading text-lg font-bold text-stone leading-tight">Tuteur personnel</div>
            <div className="text-xs font-semibold text-s4">Apprends pas à pas avec ton professeur</div>
          </div>
        </button>
      )}

      {/* Games */}
      <div className="font-heading text-base font-bold text-s4 mb-3">🎮 Jeux</div>
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <button onClick={onStartAquarium}
          className="bg-white border-2 border-s1 rounded-2xl p-3 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="text-2xl mb-1">🐟</div>
          <div className="text-xs font-bold text-s6">Aquarium</div>
        </button>
        <button onClick={onStartSpeed}
          className="bg-white border-2 border-s1 rounded-2xl p-3 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xs font-bold text-s6">Course</div>
        </button>
        <button onClick={onStartMemory}
          className="bg-white border-2 border-s1 rounded-2xl p-3 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="text-2xl mb-1">🎴</div>
          <div className="text-xs font-bold text-s6">Mémoire</div>
        </button>
      </div>

      {/* Stats */}
      {totalQuestions > 0 && (
        <>
          <div className="font-heading text-base font-bold text-s4 mb-3">Progrès</div>
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className="bg-white border-2 border-s1 rounded-xl p-3 text-center">
              <div className="font-heading text-3xl font-extrabold text-ok">{pct}%</div>
              <div className="text-[10px] font-bold text-s4 uppercase tracking-wide">Score</div>
            </div>
            <div className="bg-white border-2 border-s1 rounded-xl p-3 text-center">
              <div className="font-heading text-3xl font-extrabold text-lava">{totalQuestions}</div>
              <div className="text-[10px] font-bold text-s4 uppercase tracking-wide">Questions</div>
            </div>
            <div className="bg-white border-2 border-s1 rounded-xl p-3 text-center">
              <div className="font-heading text-3xl font-extrabold text-fox">{sessionCount}</div>
              <div className="text-[10px] font-bold text-s4 uppercase tracking-wide">Sessions</div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes tailwag { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(15deg)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}
