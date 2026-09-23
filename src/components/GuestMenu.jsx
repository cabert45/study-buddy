import React, { useEffect, useMemo, useState } from 'react';
import {
  GraduationCap, Landmark, FlaskConical, BookOpenText, ArrowRight, ShieldCheck,
  Layers, PenLine, RotateCcw, CalendarClock, BookMarked, ListChecks, BookOpen, Target,
  RefreshCw, Sigma, Shapes, Type, Repeat, ChevronRight, Settings, Gamepad2,
} from 'lucide-react';
import Mascot from './Mascots';
import { useSettings, mascotFor } from '../utils/settings';
import { pingGuest, guestProfile, leaveGuestMode, isFamilyDevice } from '../utils/guest';
import { getWeekSummary } from '../utils/wordMastery';
import { IconTile } from './sec/SecUi';
import { NotificationBell } from './Notifications';
import { masteryItems as usItems } from '../data/universSocialD1';
import { masteryItems as labItems } from '../data/sciencesLabo';
import { buildItems, loadSelection } from '../data/verbesAvoirEtre';

// Accueil « secondaire ».
//   variant="guest" — camarade de classe (/laval): aucun lien vers la famille
//   variant="cayla" — même accueil + son espace (journal, tâches, lectures, coach)
//                     et ses autres exercices

const MODULES = [
  {
    id: 'univers_social', key: 'univers_social_d1', icon: Landmark, tone: 'amber',
    subject: 'Univers social · Histoire', title: 'La sédentarisation',
    desc: 'Dossier 1 — les 29 notions du vocabulaire, du Paléolithique au troc.',
    modes: ['Cartes', 'Liste', 'Test'],
  },
  {
    id: 'sciences_labo', key: 'sciences_labo', icon: FlaskConical, tone: 'teal',
    subject: 'Sciences et technologie', title: 'Instruments de laboratoire',
    desc: 'Le nom exact et l’utilité de chaque instrument, et les montages.',
    modes: ['Cartes', 'Écrire', 'Quiz'],
  },
  {
    id: 'verbes', key: 'verbes_avoir_etre', icon: BookOpenText, tone: 'indigo',
    subject: 'Français', title: 'Verbes avoir et être',
    desc: 'Tous les modes et tous les temps, du présent au subjonctif.',
    modes: ['Tableau', 'Écrire', 'Choix multiple'],
  },
];

// Autres exercices de Cayla (moteur de pratique habituel)
const MORE = [
  { id: 'pemdas', icon: Sigma, tone: 'indigo', subject: 'Mathématique', title: 'Priorité des opérations', desc: 'PEMDAS: parenthèses, exposants, × ÷, + −' },
  { id: 'conjugaison', icon: Repeat, tone: 'indigo', subject: 'Français', title: 'Conjugaison — autres verbes', desc: 'manger, finir, prendre, venir, pouvoir…' },
  { id: 'classe_de_mots', icon: Shapes, tone: 'amber', subject: 'Français', title: 'Classes de mots', desc: 'Nom, verbe, adjectif, déterminant, pronom' },
  { id: 'pluriels_cayla', icon: Type, tone: 'teal', subject: 'Français', title: 'Pluriels particuliers', desc: 'corail → coraux, les 7 noms en -oux…' },
];

function itemsFor(m) {
  if (m.id === 'univers_social') return usItems;
  if (m.id === 'sciences_labo') return labItems;
  const sel = loadSelection();
  return buildItems(sel.verbs, sel.tenses);
}

const card = { boxShadow: '0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.05)' };

export default function GuestMenu({
  onOpen, variant = 'guest', name, profileId,
  onLaunchMode, onStartJournal, onStartChores, onStartReading, onStartCoach,
  onOpenNotifications, onOpenSettings, onStartJeux, onSwitchProfile,
}) {
  const isGuest = variant === 'guest';
  useEffect(() => { if (isGuest) pingGuest('open'); }, [isGuest]);
  const open = (id) => { if (isGuest) pingGuest(`module:${id}`); onOpen(id); };
  const [refreshing, setRefreshing] = useState(false);
  const taps = React.useRef({ n: 0, t: 0 });
  // 5 touches rapides sur le logo (invité seulement) → code « famille » → retour au mode famille
  const onLogoTap = () => {
    if (!isGuest) return;
    const now = Date.now();
    taps.current = { n: now - taps.current.t < 1500 ? taps.current.n + 1 : 1, t: now };
    if (taps.current.n >= 5) {
      taps.current = { n: 0, t: 0 };
      const code = window.prompt('Appareil de la famille? Tape le code pour quitter le mode invité:');
      if (code && code.trim().toLowerCase() === 'famille') leaveGuestMode();
    }
  };

  const profile = profileId || guestProfile();
  const mascot = mascotFor(profile, useSettings(profile));
  const progress = useMemo(() => MODULES.map((m) => {
    const s = getWeekSummary(profile, m.key, itemsFor(m));
    const seen = s.total - s.new;
    return { ...m, s, pct: Math.round((s.mastered / Math.max(1, s.total)) * 100), started: seen > 0 };
  }), [profile]);

  const mastered = progress.reduce((a, m) => a + m.s.mastered, 0);
  const total = progress.reduce((a, m) => a + m.s.total, 0);
  const next = [...progress].sort((a, b) => a.pct - b.pct)[0];

  async function refresh() {
    setRefreshing(true);
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(async (r) => { try { await r.update(); } catch {} if (r.waiting) r.waiting.postMessage({ type: 'SKIP_WAITING' }); }));
      }
      if (window.caches && navigator.onLine !== false) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {}
    window.location.reload();
  }

  const tools = isGuest ? [] : [
    onStartJournal && { icon: BookMarked, tone: 'rose', title: 'Mon journal', desc: 'Gratitude, défis, motivation', on: onStartJournal },
    onStartChores && { icon: ListChecks, tone: 'emerald', title: 'Tâches du jour', desc: 'Coche au fur et à mesure', on: onStartChores },
    onStartReading && { icon: BookOpen, tone: 'amber', title: 'Mes lectures', desc: '20 $ par livre terminé', on: onStartReading },
    onStartCoach && { icon: Target, tone: 'indigo', title: 'Mon coach', desc: 'Le plan du jour', on: onStartCoach },
    onStartJeux && { icon: Gamepad2, tone: 'teal', title: 'Les jeux', desc: 'Tic-tac-toe, Puissance 4, échecs', on: onStartJeux },
  ].filter(Boolean);

  return (
    <div className="relative z-[1] max-w-3xl mx-auto px-5 pt-6 pb-16">
      {/* Barre du haut */}
      <nav className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5 select-none" onClick={onLogoTap}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{ background: 'var(--sb-grad)', boxShadow: '0 6px 16px var(--sb-grad-shadow)' }}>
            <GraduationCap size={19} />
          </div>
          <span className="font-heading text-lg font-bold text-stone">Study Buddy</span>
        </div>
        {isGuest ? (
          <div className="flex items-center gap-2">
            {isFamilyDevice() ? (
              <button onClick={leaveGuestMode}
                className="text-xs font-semibold text-fox-d bg-white rounded-full px-3 py-1.5 border border-s1 hover:border-lava">
                👨‍👩‍👧 Mode famille
              </button>
            ) : (
              <span className="text-xs font-semibold text-fox-d bg-white rounded-full px-3 py-1.5 border border-s1">Secondaire 1</span>
            )}
            {onOpenSettings && (
              <button onClick={onOpenSettings} aria-label="Réglages" title="Réglages"
                className="w-9 h-9 rounded-xl bg-white border border-s1 text-s4 hover:text-stone flex items-center justify-center">
                <Settings size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={refresh} aria-label="Rafraîchir" title="Rafraîchir l'app"
              className="w-9 h-9 rounded-xl bg-white border border-s1 text-s4 hover:text-stone flex items-center justify-center">
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            {onOpenNotifications && <NotificationBell onClick={onOpenNotifications} />}
            {onOpenSettings && (
              <button onClick={onOpenSettings} aria-label="Réglages" title="Réglages: voix, couleur, mascotte, écriture"
                className="w-9 h-9 rounded-xl bg-white border border-s1 text-s4 hover:text-stone flex items-center justify-center">
                <Settings size={16} />
              </button>
            )}
            {onSwitchProfile && (
              <button onClick={onSwitchProfile} title="Changer de profil"
                className="h-9 pl-1 pr-3 rounded-xl bg-white border border-s1 flex items-center gap-2 text-sm font-semibold text-stone">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'var(--sb-grad)' }}>{(name || '?').charAt(0)}</span>
                {name}
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Héros */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8 text-white"
        style={{ background: 'var(--sb-hero)', boxShadow: '0 20px 50px var(--sb-hero-shadow)' }}>
        <div aria-hidden className="absolute -right-16 -top-16 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, var(--sb-glow-1), transparent 70%)' }} />
        <div aria-hidden className="absolute right-10 -bottom-20 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, var(--sb-glow-2), transparent 70%)' }} />
        {mascot !== 'aucun' && (
          <div aria-hidden className="hidden sm:block absolute right-6 bottom-0 pointer-events-none">
            <Mascot id={mascot} width={96} />
          </div>
        )}
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--sb-hero-eyebrow)' }}>
            <CalendarClock size={14} /> {name ? `Bonjour ${name} · Révision d’examens` : 'Révision d’examens'}
          </p>
          <h1 className="font-heading text-[28px] sm:text-4xl font-bold leading-[1.1] mb-3 text-white" style={{ letterSpacing: '-0.025em' }}>
            Arrive à ton examen<br />en sachant que tu sais.
          </h1>
          <p className="text-sm sm:text-base max-w-md mb-6" style={{ color: 'var(--sb-hero-muted)' }}>
            Des modules bâtis à partir des documents de ta classe. Apprends, pratique comme à l’examen, et revois seulement ce que tu rates.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => open(next.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 hover:opacity-90 transition-opacity">
              {next.started ? 'Continuer' : 'Commencer'} : {next.title} <ArrowRight size={16} />
            </button>
            <span className="text-sm" style={{ color: 'var(--sb-hero-muted)' }}>
              <span className="font-semibold text-white">{mastered}</span> / {total} notions maîtrisées
            </span>
            {/* Téléphone: la mascotte suit la ligne du bas, sans cacher le bouton */}
            {mascot !== 'aucun' && (
              <span aria-hidden className="sm:hidden ml-auto -mb-6 -mr-2"><Mascot id={mascot} width={56} /></span>
            )}
          </div>
        </div>
      </section>

      {/* Modules d'examen */}
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-heading text-lg font-bold text-stone">Tes révisions d’examens</h2>
        <span className="text-xs text-s4">{MODULES.length} modules</span>
      </div>
      <div className="grid gap-3 mb-10">
        {progress.map((m) => (
          <button key={m.id} onClick={() => open(m.id)}
            className="group w-full text-left bg-white rounded-2xl border border-s1 p-5 transition-all hover:-translate-y-0.5" style={card}>
            <div className="flex items-start gap-4">
              <IconTile icon={m.icon} tone={m.tone} size={48} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-s4">{m.subject}</p>
                <h3 className="font-heading text-lg font-bold text-stone leading-snug">{m.title}</h3>
                <p className="text-sm text-s4 mt-0.5">{m.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {m.modes.map((x) => (
                    <span key={x} className="text-[11px] font-medium text-s6 bg-cream rounded-md px-2 py-0.5 border border-s1">{x}</span>
                  ))}
                </div>
              </div>
              <ArrowRight size={18} className="text-s3 group-hover:text-fox-d transition-colors mt-1 flex-shrink-0" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--sb-track)' }}>
                <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: 'var(--sb-grad)' }} />
              </div>
              <span className="text-xs text-s4 w-24 text-right">{m.started ? `${m.pct}% maîtrisé` : 'Pas commencé'}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Son espace (Cayla) */}
      {tools.length > 0 && (
        <>
          <h2 className="font-heading text-lg font-bold text-stone mb-3">Ton espace</h2>
          <div className="grid grid-cols-2 gap-3 mb-10">
            {tools.map((t) => (
              <button key={t.title} onClick={t.on}
                className="text-left bg-white rounded-2xl border border-s1 p-4 transition-all hover:-translate-y-0.5" style={card}>
                <IconTile icon={t.icon} tone={t.tone} size={40} />
                <p className="font-semibold text-stone mt-3 text-sm">{t.title}</p>
                <p className="text-[13px] text-s4 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Autres exercices (Cayla) */}
      {!isGuest && onLaunchMode && (
        <>
          <h2 className="font-heading text-lg font-bold text-stone mb-3">Autres exercices</h2>
          <div className="bg-white rounded-2xl border border-s1 divide-y divide-slate-100 mb-10 overflow-hidden" style={card}>
            {MORE.map((m) => (
              <button key={m.id} onClick={() => onLaunchMode(m.id)}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors">
                <IconTile icon={m.icon} tone={m.tone} size={38} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone">{m.title}</p>
                  <p className="text-[13px] text-s4 truncate">{m.subject} · {m.desc}</p>
                </div>
                <ChevronRight size={18} className="text-s3 flex-shrink-0" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Méthode */}
      {isGuest && (
        <>
          <h2 className="font-heading text-lg font-bold text-stone mb-3">Comment ça marche</h2>
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            {[
              [Layers, 'indigo', '1. Apprends', 'Cartes et listes, avec la voix, pour découvrir chaque notion.'],
              [PenLine, 'amber', '2. Pratique', 'Des questions dans le format de l’examen: associer, compléter, écrire.'],
              [RotateCcw, 'emerald', '3. Revois', 'Ce que tu rates revient plus souvent, jusqu’à ce que ce soit acquis.'],
            ].map(([Icon, tone, t, d]) => (
              <div key={t} className="bg-white rounded-2xl border border-s1 p-4">
                <IconTile icon={Icon} tone={tone} size={36} />
                <p className="font-semibold text-stone mt-3 text-sm">{t}</p>
                <p className="text-[13px] text-s4 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="flex items-center justify-center gap-2 text-xs text-s4 text-center">
            <ShieldCheck size={14} className="flex-shrink-0" /> Aucun nom ni courriel demandé. Garde ce lien en favori pour retrouver ton progrès.
          </p>
        </>
      )}
    </div>
  );
}
