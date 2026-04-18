import React, { useEffect, useState } from 'react';
import { getProgress } from '../utils/storage';

// SVG icons for modules — clean, no emojis
const icons = {
  calcul: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="5" width="6" height="11" rx="1" stroke="currentColor" strokeWidth="1.4"/><line x1="4" y1="9" x2="6" y2="9" stroke="currentColor" strokeWidth="1.4"/><line x1="5" y1="8" x2="5" y2="10" stroke="currentColor" strokeWidth="1.4"/></svg> },
  terme: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4"/><text x="9" y="13" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">?</text></svg> },
  multi_step: { bg: '#e6f5f0', color: '#0f766e', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="6" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg> },
  relational: { bg: '#e8eef8', color: '#3a5bc7', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 13L9 4L14 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><line x1="6" y1="9.5" x2="12" y2="9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  compare: { bg: '#fef5e4', color: '#b85d1a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 14L9 4L15 14H3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><line x1="7" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.4"/></svg> },
  pair_impair: { bg: '#fce8ec', color: '#c74a60', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6.5" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="11.5" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.4"/></svg> },
  mental: { bg: '#eef0f4', color: '#5c6378', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9 4.5V9L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  statistique: { bg: '#e8f5ea', color: '#2d7a3a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="11" width="3" height="4.5" rx=".5" fill="currentColor"/><rect x="7.5" y="7.5" width="3" height="8" rx=".5" fill="currentColor"/><rect x="12" y="4" width="3" height="11.5" rx=".5" fill="currentColor"/></svg> },
  dictee: { bg: '#fce8ec', color: '#c74a60', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3C6 3 4 5 4 7C4 9 6 10 6 12H12C12 10 14 9 14 7C14 5 12 3 9 3Z" stroke="currentColor" strokeWidth="1.4"/><path d="M7 14H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8 16H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  determinant: { bg: '#e8eef8', color: '#3a5bc7', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/><text x="9" y="13" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">A</text></svg> },
  verbes: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 14L7 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M7 4L14 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M10 4V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  adjectif: { bg: '#fef0e4', color: '#b85d1a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 16C4 12.7 6.2 10.5 9 10.5C11.8 10.5 14 12.7 14 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  pemdas: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="9" y="13" textAnchor="middle" fontSize="12" fontWeight="800" fill="currentColor">()</text></svg> },
  on_ont: { bg: '#fef5e4', color: '#b85d1a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="3" y="11" fontSize="7" fontWeight="700" fill="currentColor">ON</text><text x="10" y="11" fontSize="7" fontWeight="700" fill="currentColor">T</text></svg> },
  groupe_nom: { bg: '#e6f5f0', color: '#0f766e', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="6" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.4"/><line x1="7" y1="6" x2="7" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1"/><line x1="12" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1"/></svg> },
  conjugaison: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5H15M3 9H12M3 13H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
};

const ryanMathModes = [
  { id: 'mixed', label: 'Pratique ciblée', desc: 'Mix de tous tes exercices', featured: true },
  { id: 'calcul', label: 'Calcul', desc: 'Addition et soustraction', badge: 'Priorité' },
  { id: 'terme', label: 'Terme manquant', desc: 'Trouve le nombre mystère', badge: 'Priorité' },
  { id: 'multi_step', label: 'Problèmes', desc: 'Problèmes à étapes', badge: 'À travailler' },
  { id: 'relational', label: 'De plus / moins', desc: 'Comparaisons' },
  { id: 'compare', label: 'Compare', desc: '>, < ou =' },
  { id: 'pair_impair', label: 'Pair / Impair', desc: 'Nombres pairs et impairs' },
  { id: 'mental', label: 'Mental', desc: 'Calcul rapide' },
  { id: 'statistique', label: 'Statistique', desc: 'Diagrammes et tableaux' },
];

const ryanFrenchModes = [
  { id: 'dictee_s1', label: '🎧 Dictée mardi', desc: 'Verbes en -er (semaine 1)', featured: true, special: true },
  { id: 'dictee_revision', label: '🔄 Révision dictées', desc: 'Toutes les semaines mélangées' },
  { id: 'francais_mix', label: 'Mix Français', desc: 'Grammaire, verbes, adjectifs' },
  { id: 'dictee', label: 'Dictée', desc: 'Écoute et choisis la bonne orthographe' },
  { id: 'determinant', label: 'Déterminants', desc: 'le, la, un, une, mon...' },
  { id: 'verbes', label: 'Verbes', desc: 'être, avoir, aller, faire...' },
  { id: 'adjectif', label: 'Adjectifs', desc: 'Accord et familles de mots' },
  { id: 'dictee_s2', label: '🎧 Dictée semaine 2', desc: 'Mots en p- (futur)' },
  { id: 'dictee_s3', label: '🎧 Dictée semaine 3', desc: 'Le son o (o, au, eau)' },
  { id: 'dictee_s4', label: '🎧 Dictée semaine 4', desc: 'n devient m devant b/p' },
  { id: 'on_ont', label: 'ON / ONT', desc: 'Pronom ou verbe avoir?' },
  { id: 'groupe_nom', label: 'Groupe du nom', desc: 'GN: nom seul, dét+nom, dét+nom+adj' },
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

export default function Menu({ profile, onStartPractice, onStartTutor, onStartAquarium, onStartSpeed, onStartMemory, onOpenDashboard, onSwitchProfile, darkMode, onToggleDark }) {
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
          {onToggleDark && (
            <button onClick={onToggleDark}
              className="bg-white border-2 border-s2 rounded-xl px-3 py-2 text-sm font-bold text-s6 hover:border-lava hover:text-lava transition-all">
              {darkMode ? '☀️' : '🌙'}
            </button>
          )}
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
            {icons[mode.id] && (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: icons[mode.id].bg, color: icons[mode.id].color }}>
                {icons[mode.id].svg}
              </div>
            )}
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
      <div className="font-heading text-base font-bold text-s4 mb-3">Jeux</div>
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <button onClick={onStartAquarium}
          className="bg-white border-2 border-s1 rounded-2xl p-4 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: '#e6f5f0', color: '#0f766e' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9C2 5 5 3 9 3C13 3 16 5 16 9C16 13 13 15 9 15C5 15 2 13 2 9Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="7" cy="8" r="1" fill="currentColor"/><path d="M11 7Q13 9 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <div className="text-xs font-bold text-s6">Aquarium</div>
        </button>
        <button onClick={onStartSpeed}
          className="bg-white border-2 border-s1 rounded-2xl p-4 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: '#fef0e4', color: '#c74a15' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M10 2L4 10H9L8 16L14 8H9L10 2Z" fill="currentColor"/></svg>
          </div>
          <div className="text-xs font-bold text-s6">Course</div>
        </button>
        <button onClick={onStartMemory}
          className="bg-white border-2 border-s1 rounded-2xl p-4 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: '#f0ecfb', color: '#6d28d9' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="2" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M5 6L5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M13 6L13 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
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
