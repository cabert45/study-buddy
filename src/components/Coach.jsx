import React, { useState, useEffect, useRef } from 'react';
import { getDashboard } from '../utils/storage';

// The Coach decides what Ryan does and when.
// Given the time of day, soccer schedule, and what's coming up this week,
// it builds a plan, runs timers, and voice-coaches transitions.

function speak(text, rate = 0.9) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = rate;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
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
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.5);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.5);
    });
  } catch {}
}

function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.4, 0.8].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.3);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch {}
}

function format(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.max(0, secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Identify weakest category from stats
function findWeakest(stats, type = null) {
  if (!stats || stats.length === 0) return null;
  const frenchCats = ['adjectif', 'dictee', 'dictee_semaine', 'on_ont', 'groupe_nom', 'determinant', 'verbes', 'passe_compose'];
  const mathCats = ['calcul', 'terme', 'multi_step', 'relational', 'pair_impair', 'compare', 'mental', 'statistique'];
  const filter = type === 'french' ? frenchCats : type === 'math' ? mathCats : null;

  const filtered = stats.filter(s => s.total >= 3 && (!filter || filter.includes(s.category)));
  if (filtered.length === 0) return null;
  filtered.sort((a, b) => (a.correct / a.total) - (b.correct / b.total));
  return filtered[0];
}

// Build a smart plan based on current time + soccer + dashboard data
// opts.dayOverride: 0-6 to force a specific day's plan (preview mode)
// opts.skipSoccer: true to use the post-soccer (heaviest) plan even if soccer hasn't happened
function buildPlan(dashboardData, opts = {}) {
  const now = new Date();
  const isPreview = opts.dayOverride != null && opts.dayOverride !== now.getDay();
  const day = opts.dayOverride != null ? opts.dayOverride : now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();
  const min = now.getMinutes();
  const minutesNow = hour * 60 + min;

  // Saturday: soccer at 4:30pm = 16:30 = 990 min
  // Sunday: bigger study day
  // Weekday afternoons: dictée + homework prep

  const plan = [];

  // Identify Ryan's weakest French and math from real data
  const stats = dashboardData?.stats || [];
  const weakestFrench = findWeakest(stats, 'french');
  const weakestMath = findWeakest(stats, 'math');
  const weakFrenchMode = weakestFrench?.category || 'adjectif';
  const weakMathMode = weakestMath?.category || 'calcul';

  if (day === 6) {
    // SATURDAY (May 9) — HEAVY DAY: Tuesday dictée s4 + Wednesday futur indicatif + biographie Jean Rostand
    const soccerMin = 16 * 60 + 30;
    const minutesUntilSoccer = soccerMin - minutesNow;
    // If preview mode OR user is skipping soccer → use the heaviest "post-soccer" plan
    const isAfterSoccer = isPreview || opts.skipSoccer || minutesNow > soccerMin + 60;

    if (isAfterSoccer) {
      // Post-soccer (evening) — biographie URGENTE (il échoue, doit avoir 90%+)
      plan.push({ type: 'chore', label: 'Reste des tâches (chambre + salon)', mins: 20, icon: '🧹' });
      plan.push({ type: 'break', label: 'Pause + collation', mins: 10, icon: '🍎' });
      plan.push({ type: 'app', mode: 'biographie_jr', label: 'Biographie Jean Rostand (PRIORITÉ!)', mins: 15, icon: '📖' });
      plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
      plan.push({ type: 'app', mode: 'dictee_s4', label: 'Dictée mardi — n→m devant b/p', mins: 12, icon: '🎧' });
      plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
      plan.push({ type: 'app', mode: 'futur_simple', label: 'Futur simple (test mercredi)', mins: 12, icon: '🔮' });
      plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
      plan.push({ type: 'app', mode: 'multi_step', label: 'Problèmes à étapes', mins: 10, icon: '🧩' });
      plan.push({ type: 'message', label: 'Bravo! Grosse journée! 🌙', mins: 1, icon: '🌙' });
    } else if (minutesUntilSoccer > 120) {
      // 2h+ avant soccer — biographie EN PREMIER (priorité critique)
      plan.push({ type: 'app', mode: 'biographie_jr', label: 'Biographie Jean Rostand (PRIORITÉ!)', mins: 15, icon: '📖' });
      plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
      plan.push({ type: 'chore', label: 'Ramasser vêtements + chambre', mins: 20, icon: '🧸' });
      plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
      plan.push({ type: 'app', mode: 'dictee_s4', label: 'Dictée mardi — campagne, compote', mins: 12, icon: '🎧' });
      plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
      plan.push({ type: 'app', mode: 'futur_simple', label: 'Futur simple (test mercredi)', mins: 12, icon: '🔮' });
      plan.push({ type: 'chore', label: 'Plier vêtements + ranger', mins: 15, icon: '👔' });
      plan.push({ type: 'message', label: 'Reste à faire ce soir après soccer!', mins: 1, icon: '⚽' });
    } else if (minutesUntilSoccer > 60) {
      // 60-120 min — biographie en premier
      plan.push({ type: 'app', mode: 'biographie_jr', label: 'Biographie (PRIORITÉ!)', mins: 15, icon: '📖' });
      plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
      plan.push({ type: 'app', mode: 'dictee_s4', label: 'Dictée mardi (n→m)', mins: 10, icon: '🎧' });
      plan.push({ type: 'break', label: 'Pause', mins: 3, icon: '☕' });
      plan.push({ type: 'app', mode: 'futur_simple', label: 'Futur simple', mins: 10, icon: '🔮' });
      plan.push({ type: 'message', label: 'Reste à faire ce soir après soccer!', mins: 1, icon: '⚽' });
    } else if (minutesUntilSoccer > 25) {
      plan.push({ type: 'app', mode: 'biographie_jr', label: 'Biographie (PRIORITÉ!)', mins: 12, icon: '📖' });
      plan.push({ type: 'message', label: 'Prépare-toi pour le soccer!', mins: 5, icon: '⚽' });
    } else if (minutesUntilSoccer > 0) {
      plan.push({ type: 'message', label: 'Prépare-toi pour le soccer!', mins: 5, icon: '⚽' });
    } else {
      plan.push({ type: 'message', label: 'Soccer en cours / vient de finir. On reprend après!', mins: 1, icon: '⚽' });
    }
  } else if (day === 0) {
    // SUNDAY (May 10) — biographie EN PREMIER (urgence), puis dictée + futur
    plan.push({ type: 'app', mode: 'biographie_jr', label: 'Biographie Jean Rostand (PRIORITÉ!)', mins: 15, icon: '📖' });
    plan.push({ type: 'break', label: 'Pause', mins: 8, icon: '☕' });
    plan.push({ type: 'app', mode: 'dictee_s4', label: 'Dictée mardi — n→m devant b/p', mins: 12, icon: '🎧' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'futur_simple', label: 'Futur simple (test mercredi)', mins: 10, icon: '🔮' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'biographie_jr', label: '2e tour biographie (renforcer!)', mins: 10, icon: '📖' });
    plan.push({ type: 'message', label: 'Bravo! Profite du reste de ta journée!', mins: 1, icon: '🌳' });
  } else if (day === 1) {
    // MONDAY (May 11) — DERNIÈRE prep dictée + biographie + fable + start English
    plan.push({ type: 'app', mode: 'biographie_jr', label: 'DERNIÈRE révision biographie (90%+!)', mins: 15, icon: '📖' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'dictee_s4', label: 'DERNIÈRE révision dictée!', mins: 12, icon: '🎧' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'message', label: 'Lecture fable "La cigale et la fourmi" (La Fontaine) — lis à voix haute, vise 1 minute!', mins: 8, icon: '🐜' });
    plan.push({ type: 'break', label: 'Pause', mins: 3, icon: '☕' });
    plan.push({ type: 'app', mode: 'english_oral', label: '🇬🇧 Anglais — days/months/seasons (test mercredi)', mins: 10, icon: '🌎' });
    plan.push({ type: 'app', mode: 'futur_simple', label: 'Futur simple (test mercredi)', mins: 10, icon: '🔮' });
  } else if (day === 2) {
    // TUESDAY (May 12) — DICTÉE DAY! + prep futur + DERNIÈRE prep anglais
    plan.push({ type: 'message', label: '📢 Aujourd\'hui = dictée! Bonne chance!', mins: 1, icon: '🍀' });
    plan.push({ type: 'app', mode: 'english_oral', label: '🇬🇧 DERNIÈRE prep anglais (test demain!)', mins: 12, icon: '🌎' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'futur_simple', label: 'DERNIÈRE prep futur (test demain!)', mins: 12, icon: '🔮' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'mental', label: 'Calcul mental (sens multiplication demain)', mins: 8, icon: '⚡' });
  } else if (day === 3) {
    // WEDNESDAY (May 13) — futur indicatif test + ENGLISH oral test today
    plan.push({ type: 'message', label: '🇬🇧 Bonne chance pour ton test d\'anglais ET de futur aujourd\'hui!', mins: 1, icon: '🍀' });
    plan.push({ type: 'app', mode: 'english_oral', label: '🇬🇧 Échauffement anglais', mins: 8, icon: '🌎' });
    plan.push({ type: 'app', mode: 'homophones', label: 'Homophones (cahier bleu + examen final)', mins: 12, icon: '🔀' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'passe_compose', label: 'Passé composé (révision pour jeudi)', mins: 10, icon: '📝' });
  } else if (day === 4) {
    // THURSDAY (May 14) — verbes -er composés + start fractions for finals
    plan.push({ type: 'app', mode: 'passe_compose', label: 'Verbes -er composés (passé composé)', mins: 15, icon: '📝' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'fractions', label: 'Fractions (nouveau pour finaux)', mins: 12, icon: '🍕' });
    plan.push({ type: 'message', label: 'Demain = pas d\'école (journée pédagogique)! 🎉', mins: 1, icon: '🎉' });
  } else if (day === 5) {
    // FRIDAY (May 15) — JOURNÉE PÉDAGOGIQUE / PAS D'ÉCOLE — exam-prep rotation
    plan.push({ type: 'message', label: '🎉 Pas d\'école aujourd\'hui! Révision pour les examens.', mins: 1, icon: '🎉' });
    plan.push({ type: 'app', mode: 'fractions', label: 'Fractions (examen final)', mins: 10, icon: '🍕' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'mult_div', label: 'Sens × et ÷ (examen final)', mins: 10, icon: '✖️' });
    plan.push({ type: 'break', label: 'Pause', mins: 5, icon: '☕' });
    plan.push({ type: 'app', mode: 'homophones', label: 'Homophones (examen final)', mins: 10, icon: '🔀' });
    plan.push({ type: 'message', label: 'C\'est tout! Profite de ta journée!', mins: 1, icon: '🌳' });
  }

  return plan;
}

function dayLabel(dayIdx) {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  return days[dayIdx != null ? dayIdx : new Date().getDay()];
}

const dayChips = [
  { idx: 1, label: 'Lun' },
  { idx: 2, label: 'Mar' },
  { idx: 3, label: 'Mer' },
  { idx: 4, label: 'Jeu' },
  { idx: 5, label: 'Ven' },
  { idx: 6, label: 'Sam' },
  { idx: 0, label: 'Dim' },
];

export default function Coach({ onHome, onStartPractice }) {
  const [plan, setPlan] = useState([]);
  const [planReady, setPlanReady] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [warned, setWarned] = useState({});
  const [doneSteps, setDoneSteps] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [dayOverride, setDayOverride] = useState(null); // null = today, 0-6 = preview a different day
  const [skipSoccer, setSkipSoccer] = useState(false);
  const intervalRef = useRef(null);
  const greetedRef = useRef(false);

  const currentStep = plan[stepIdx];
  const today = new Date().getDay();
  const isPreviewMode = dayOverride != null && dayOverride !== today;

  // Load dashboard data once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await getDashboard();
        if (!cancelled) setDashData(d);
      } catch {
        if (!cancelled) setDashData({});
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Build plan whenever dashData / overrides change
  useEffect(() => {
    if (dashData == null) return;
    const built = buildPlan(dashData, { dayOverride, skipSoccer });
    setPlan(built);
    setPlanReady(true);
    // Reset progression when plan changes
    setStepIdx(0);
    setDoneSteps([]);
    setRunning(false);
  }, [dashData, dayOverride, skipSoccer]);

  // Greet on first load
  useEffect(() => {
    if (!greetedRef.current && planReady && plan.length > 0) {
      greetedRef.current = true;
      const total = plan.reduce((s, p) => s + p.mins, 0);
      setTimeout(() => {
        speak(`Salut Ryan! On va travailler ensemble. ${plan.length} étapes, environ ${total} minutes. C'est parti!`);
      }, 500);
    }
  }, [plan, planReady]);

  // Initialize timer for current step
  useEffect(() => {
    if (currentStep) {
      setRemaining(currentStep.mins * 60);
      setWarned({});
      setRunning(true);
      // Announce
      setTimeout(() => {
        if (currentStep.type === 'chore') {
          speak(`Maintenant: ${currentStep.label}. Tu as ${currentStep.mins} minutes. Go!`);
        } else if (currentStep.type === 'break') {
          speak(`Pause de ${currentStep.mins} minutes. Bois de l'eau, étire-toi!`);
        } else if (currentStep.type === 'app') {
          speak(`Maintenant: ${currentStep.label}. Clique sur "Commencer" quand tu es prêt.`);
          setRunning(false); // Don't auto-run for app — wait for him to click start
        } else if (currentStep.type === 'message') {
          speak(currentStep.label);
        }
      }, 800);
    }
  }, [stepIdx]);

  // Tick
  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          const next = r - 1;
          // Voice warnings
          if (next === 120 && !warned.w2) {
            setWarned(w => ({ ...w, w2: true }));
            speak(`Il te reste 2 minutes pour ${currentStep.label}`);
          } else if (next === 30 && !warned.w30) {
            setWarned(w => ({ ...w, w30: true }));
            speak('30 secondes!');
          }
          if (next <= 0) {
            clearInterval(intervalRef.current);
            setRunning(false);
            playDing();
            handleStepEnd();
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining, warned, currentStep]);

  function handleStepEnd() {
    setDoneSteps(d => [...d, stepIdx]);
    if (currentStep?.type === 'break') {
      playAlarm();
      speak('PAUSE TERMINÉE! Retour au travail!');
    } else if (currentStep?.type === 'chore') {
      speak(`Temps écoulé! As-tu fini "${currentStep.label}"? Si oui, clique "Fait!" sinon, "+ 2 min".`);
    } else if (currentStep?.type === 'message') {
      // Just move on
      goNext();
    }
  }

  function goNext() {
    if (stepIdx + 1 >= plan.length) {
      // All done!
      speak('Tu as tout fini! Bravo! Tu mérites une récompense!');
      playDing();
      setStepIdx(plan.length); // out of bounds = finished view
    } else {
      setStepIdx(i => i + 1);
    }
  }

  function markDone() {
    playDing();
    speak('Bravo!');
    setRunning(false);
    setTimeout(() => goNext(), 1200);
  }

  function extend() {
    setRemaining(120);
    setWarned({ w2: false, w30: false });
    setRunning(true);
    speak('+ 2 minutes. Continue!');
  }

  function skipStep() {
    setRunning(false);
    goNext();
  }

  function startAppMode() {
    if (currentStep?.type === 'app' && currentStep.mode) {
      // Mark coach step as done before launching
      setDoneSteps(d => [...d, stepIdx]);
      onStartPractice(currentStep.mode);
    }
  }

  // ALL DONE
  if (stepIdx >= plan.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12 text-center">
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="font-heading text-4xl font-extrabold text-ok mb-2">Tu as tout fait!</h2>
        <p className="text-stone font-semibold mb-6 text-lg">Bravo Ryan! Tu mérites une grosse pause! 🎉</p>
        <button onClick={onHome}
          className="w-full py-4 rounded-xl font-bold text-white text-lg"
          style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>
          ← Menu
        </button>
      </div>
    );
  }

  // EMPTY PLAN
  if (plan.length === 0 || !currentStep) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12 text-center">
        <div className="text-5xl mb-4">😴</div>
        <p className="text-stone font-semibold mb-4">Pas de plan pour cette heure-ci!</p>
        <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          ← Menu
        </button>
      </div>
    );
  }

  const isBreak = currentStep.type === 'break';
  const isApp = currentStep.type === 'app';
  const isMessage = currentStep.type === 'message';
  const color = isBreak ? '#e8a050' : remaining < 30 ? '#c74a15' : remaining < 120 ? '#e8a050' : '#2d7a3a';

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone">🎯 Coach</h2>
        <div className="text-xs font-bold text-s4">{stepIdx + 1}/{plan.length}</div>
      </div>

      {/* Day banner with day picker */}
      <div className={`rounded-xl p-3 mb-3 border-2 ${
        isPreviewMode ? 'bg-blue-50 border-blue-300' : 'bg-orange-50 border-orange-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <p className={`text-xs font-bold uppercase tracking-wide ${
            isPreviewMode ? 'text-blue-700' : 'text-fox-d'
          }`}>
            {isPreviewMode ? `👁 Aperçu — Plan de ${dayLabel(dayOverride)}` : `Plan de ${dayLabel()}`}
          </p>
          {isPreviewMode && (
            <button
              onClick={() => { setDayOverride(null); setSkipSoccer(false); }}
              className="text-[10px] font-bold text-blue-700 underline"
            >
              ← Retour à aujourd'hui
            </button>
          )}
        </div>
        {/* Day picker chips */}
        <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {dayChips.map(({ idx, label }) => {
            const isActive = (dayOverride == null && idx === today) || dayOverride === idx;
            const isToday = idx === today;
            return (
              <button
                key={idx}
                onClick={() => {
                  setDayOverride(idx === today ? null : idx);
                  setSkipSoccer(false);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-stone text-white'
                    : 'bg-white border border-s2 text-s6 hover:border-lava hover:text-lava'
                }`}
              >
                {label}{isToday && !isActive ? ' •' : ''}
              </button>
            );
          })}
        </div>
        {/* Skip soccer button — only Saturday + viewing today + before evening */}
        {today === 6 && !isPreviewMode && new Date().getHours() < 17 && (
          <div className="mt-2 pt-2 border-t border-orange-200/60">
            {!skipSoccer ? (
              <button
                onClick={() => setSkipSoccer(true)}
                className="text-xs font-bold text-fox-d underline"
              >
                ⚽ Pas de soccer aujourd'hui — voir le plan complet
              </button>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fox-d">⚽ Soccer ignoré — plan complet activé</span>
                <button
                  onClick={() => setSkipSoccer(false)}
                  className="text-[10px] font-bold text-s4 underline"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Big current step card */}
      <div className={`rounded-3xl p-6 mb-4 border-2 text-center ${
        isBreak ? 'bg-orange-50 border-orange-300' :
        isApp ? 'bg-blue-50 border-blue-300' :
        'bg-white border-lava shadow-lg'
      }`}>
        <div className="text-xs font-bold uppercase tracking-wide text-s4 mb-1">
          {isBreak ? '☕ Pause' : isApp ? '📚 App' : isMessage ? 'Info' : '🎯 Maintenant'}
        </div>
        <div className="text-6xl mb-3">{currentStep.icon}</div>
        <h3 className="font-heading text-2xl font-extrabold text-stone leading-tight mb-3">
          {currentStep.label}
        </h3>

        {!isMessage && (
          <div className="font-heading font-extrabold leading-none mb-4 transition-colors"
            style={{ fontSize: '5rem', color }}>
            {format(remaining)}
          </div>
        )}

        {/* Action buttons */}
        {isApp && !running && (
          <button onClick={startAppMode}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #3a5bc7, #5b4ad4)' }}>
            ▶ Commencer
          </button>
        )}

        {!isApp && !isMessage && remaining > 0 && (
          <div className="flex gap-2">
            {running ? (
              <button onClick={() => setRunning(false)}
                className="flex-1 py-3 rounded-xl font-bold text-white text-sm bg-yellow-600">
                ⏸ Pause
              </button>
            ) : (
              <button onClick={() => setRunning(true)}
                className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                ▶ Continuer
              </button>
            )}
            <button onClick={markDone}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm bg-ok">
              ✓ Fait!
            </button>
          </div>
        )}

        {!isApp && !isMessage && remaining === 0 && (
          <div className="flex gap-2">
            <button onClick={extend}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm bg-yellow-600">
              + 2 min
            </button>
            <button onClick={markDone}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm bg-ok">
              ✓ Fait!
            </button>
          </div>
        )}

        {isMessage && (
          <button onClick={goNext}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            ▶ Continuer
          </button>
        )}
      </div>

      {/* Skip button */}
      <button onClick={skipStep}
        className="w-full text-xs text-s4 font-bold hover:text-lava py-2 mb-3">
        ↓ Passer cette étape
      </button>

      {/* Mini plan preview */}
      <div className="bg-white rounded-2xl p-3 border-2 border-s1">
        <div className="text-xs font-bold text-s4 uppercase mb-2">Le reste du plan</div>
        <div className="space-y-1.5">
          {plan.map((step, i) => {
            const done = doneSteps.includes(i);
            const current = i === stepIdx;
            return (
              <div key={i}
                className={`flex items-center gap-2 text-sm py-1 px-2 rounded ${
                  current ? 'bg-orange-50 border border-lava' :
                  done ? 'opacity-40' : ''
                }`}>
                <span className="text-base">{step.icon}</span>
                <span className={`flex-1 truncate ${
                  done ? 'line-through text-s4' :
                  current ? 'font-bold text-stone' :
                  'text-s6'
                }`}>{step.label}</span>
                <span className="text-xs font-bold text-s4">{step.mins}m</span>
                {done && <span className="text-ok text-xs">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
