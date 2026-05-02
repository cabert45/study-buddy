import React, { useState, useEffect, useRef } from 'react';

const presentation = {
  title: 'La fourmi',
  subtitle: 'Des petites bêtes pas si bêtes',
  date: 'Mercredi 6 mai 2026',
  videoUrl: 'https://www.youtube.com/results?search_query=la+fourmi+documentaire+enfants',
  videoLabel: '🎥 Regarde une vidéo sur la fourmi',
  // Sections suivent l'ordre EXACT de la feuille de la maîtresse
  sections: [
    {
      label: '1. Introduction',
      hint: 'Salue tes amis',
      text: "Bonjour! Aujourd'hui, je vais vous parler d'un insecte super fort: la fourmi.",
    },
    {
      label: '2. Description / Classement',
      hint: 'À quelle famille? Combien de pattes? Quelles parties?',
      text: "La fourmi fait partie de la famille des insectes. Elle a six pattes et son corps est divisé en trois parties: la tête, le thorax et l'abdomen.",
    },
    {
      label: '3. Mode de vie',
      hint: 'Comment elle vit? Sa maison? Les rôles?',
      text: "La fourmi vit en colonie dans une maison qu'on appelle une fourmilière. Dans la fourmilière, il y a différents rôles: la reine pond les œufs — jusqu'à mille par jour! Les ouvrières construisent et cherchent de la nourriture. Les soldats défendent la colonie.",
    },
    {
      label: '4. Où on peut la trouver',
      hint: 'Dans quels endroits?',
      text: "On peut trouver des fourmis presque partout dans le monde! Elles vivent sous la terre, sous les roches, dans les arbres et même dans nos jardins. Elles n'aiment pas seulement les endroits très froids comme l'Antarctique.",
    },
    {
      label: '5. Équipement pour observer',
      hint: 'Avec quoi tu peux les regarder?',
      text: "Pour observer les fourmis, j'utilise une loupe pour les voir de plus près, un petit pot en verre avec des trous pour les attraper sans les blesser, et un carnet pour dessiner ce que je vois.",
    },
    {
      label: '6. Les prédateurs',
      hint: 'Qui mange les fourmis?',
      text: "Les fourmis ont plusieurs prédateurs: la chauve-souris, le pic-bois et l'araignée. Le pic-bois adore manger les fourmis avec sa longue langue!",
    },
    {
      label: '7. Utile ou nuisible?',
      hint: 'Est-ce que la fourmi est utile? Pourquoi?',
      text: "La fourmi est un insecte UTILE. Pourquoi? Parce qu'elle nettoie la nature en mangeant les insectes morts, elle aère le sol comme un petit jardinier, et elle aide les plantes à pousser.",
    },
    {
      label: '8. Le saviez-vous?',
      hint: 'Quelque chose de surprenant',
      text: "Le saviez-vous? La fourmi peut transporter 25 fois son poids! C'est comme si moi, je transportais une voiture sur mon dos!",
    },
    {
      label: '9. Conclusion',
      hint: 'Remercie et invite les questions',
      text: "Merci de m'avoir écouté! Avez-vous des questions?",
    },
  ],
  criteria: [
    'Connais-tu ton sujet?',
    'As-tu une belle posture?',
    'Parles-tu assez fort?',
    'Parles-tu trop vite ou trop lentement?',
    'Prononces-tu bien tes mots?',
    'Regardes-tu les spectateurs ou le plancher?',
    'Respectes-tu le temps demandé?',
    'As-tu assez d\'informations sur ton sujet?',
    'Respectes-tu tes camarades en les écoutant?',
  ],
  tips: [
    {
      criterion: 'Connais-tu ton sujet?',
      tip: '3 points clés à retenir: 6 pattes / 3 parties — colonie (reine, ouvrières, soldats) — 25× son poids',
      icon: '🧠',
    },
    {
      criterion: 'Belle posture',
      tip: 'Pieds plantés au sol, dos droit, tête haute. Les bras le long du corps ou tenant l\'affiche.',
      icon: '🧍',
    },
    {
      criterion: 'Parles-tu assez fort?',
      tip: 'Imagine que tu parles à quelqu\'un au fond de la classe. Pratique avec papa/maman dans une autre pièce.',
      icon: '📢',
    },
    {
      criterion: 'Trop vite ou lentement?',
      tip: 'Pause après chaque point. Respire entre les phrases. Si on entend ton cœur battre = trop vite!',
      icon: '🐢',
    },
    {
      criterion: 'Prononce bien',
      tip: 'Mots difficiles à pratiquer: "fourmi-LIÈRE", "an-TENNES", "ab-DO-MEN", "tho-RAX", "pré-da-TEURS"',
      icon: '🗣️',
    },
    {
      criterion: 'Regarde les amis',
      tip: 'Choisis 3 amis dans la classe. Regarde l\'un, puis l\'autre, puis le 3e. JAMAIS le plancher!',
      icon: '👀',
    },
    {
      criterion: 'Temps (1-2 min)',
      tip: 'Utilise le mode pratique de l\'app. Le chronomètre te dit si c\'est bon!',
      icon: '⏱',
    },
    {
      criterion: 'Assez d\'infos',
      tip: 'Le texte couvre déjà 8 faits! Si tu finis trop tôt, ajoute "Le saviez-vous?" Si trop long, coupe les détails.',
      icon: '📚',
    },
    {
      criterion: 'Respecte les camarades',
      tip: 'Quand les autres parlent, regarde-les et écoute-les. Pas de bruits, pas de chuchotements.',
      icon: '👂',
    },
  ],
  vocabularyHelp: [
    { word: 'fourmilière', meaning: 'la maison des fourmis (sous la terre)' },
    { word: 'colonie', meaning: 'un groupe de fourmis qui vivent ensemble' },
    { word: 'thorax', meaning: 'la partie du milieu du corps' },
    { word: 'abdomen', meaning: 'la partie arrière du corps (le ventre)' },
    { word: 'antennes', meaning: 'les petits "fils" sur la tête' },
    { word: 'prédateur', meaning: 'un animal qui mange un autre animal' },
    { word: 'utile', meaning: 'qui aide, qui est bon' },
  ],
};

function format(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function Section({ section, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border-2 border-s1 mb-2 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-3 flex items-center gap-3 text-left hover:bg-cream"
      >
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 font-heading font-bold text-fox-d">
          {idx + 1}
        </div>
        <div className="flex-1">
          <div className="font-heading font-bold text-stone text-sm">{section.label}</div>
          <div className="text-xs text-s4 italic">{section.hint}</div>
        </div>
        <div className="text-s4 text-xl font-bold flex-shrink-0">
          {open ? '−' : '+'}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 border-t-2 border-s1">
          <p className="text-stone leading-relaxed mb-2">{section.text}</p>
          <button
            onClick={() => speak(section.text)}
            className="text-xs text-fox-d font-bold hover:text-lava">
            🔊 Écouter
          </button>
        </div>
      )}
    </div>
  );
}

export default function Presentation({ onHome }) {
  const [showAll, setShowAll] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function startPractice() {
    setPracticeMode(true);
    setSeconds(0);
    setRunning(true);
    speak('Vas-y Ryan! Je chronomètre.');
  }

  function stopPractice() {
    setRunning(false);
    if (seconds >= 60 && seconds <= 120) {
      speak(`Excellent! ${seconds} secondes, c'est parfait!`);
    } else if (seconds < 60) {
      speak(`${seconds} secondes, c'est trop court. Ajoute des détails!`);
    } else {
      speak(`${seconds} secondes, c'est trop long. Reste sur les points importants!`);
    }
  }

  const fullText = presentation.sections.map(s => s.text).join(' ');

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone">🎤 Présentation</h2>
        <div className="w-12" />
      </div>

      {/* Title card */}
      <div className="bg-white rounded-2xl p-5 mb-4 border-2 border-s1 text-center">
        <div className="text-xs font-bold text-fox-d uppercase tracking-wide mb-1">{presentation.subtitle}</div>
        <h1 className="font-heading text-3xl font-extrabold text-stone mb-1">🐜 {presentation.title}</h1>
        <div className="text-sm text-s4 font-semibold">📅 {presentation.date}</div>
      </div>

      {/* Video button — first */}
      <a href={presentation.videoUrl} target="_blank" rel="noopener noreferrer"
        className="block bg-white border-2 border-blue-300 rounded-2xl p-4 mb-4 hover:bg-blue-50 transition-all">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📺</div>
          <div className="flex-1">
            <div className="font-heading font-bold text-stone">{presentation.videoLabel}</div>
            <div className="text-xs text-s4 font-semibold">Regarde d'abord pour mieux comprendre</div>
          </div>
          <div className="text-blue-500 font-bold">→</div>
        </div>
      </a>

      {/* Practice mode */}
      <div className="bg-orange-50 rounded-2xl p-4 mb-4 border-2 border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-heading font-bold text-stone">⏱ Mode pratique</div>
            <div className="text-xs text-s4 font-semibold">Pratique à voix haute! 1-2 minutes idéales.</div>
          </div>
          {practiceMode && (
            <div className="font-heading text-2xl font-extrabold text-lava">{format(seconds)}</div>
          )}
        </div>
        {!practiceMode ? (
          <button onClick={startPractice}
            className="w-full py-2.5 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            ▶ Je suis prêt à pratiquer!
          </button>
        ) : (
          <div className="flex gap-2">
            {running ? (
              <button onClick={stopPractice}
                className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm bg-yellow-600">
                ⏸ J'ai fini
              </button>
            ) : (
              <button onClick={() => { setSeconds(0); setRunning(true); speak('On recommence!'); }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                🔄 Encore
              </button>
            )}
          </div>
        )}
      </div>

      {/* Show/hide all toggle */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-base font-bold text-s4 uppercase tracking-wide">📝 Mon texte</h3>
        <button onClick={() => setShowAll(s => !s)}
          className="text-xs font-bold text-fox-d hover:text-lava">
          {showAll ? '🙈 Cacher tout' : '👁 Voir tout'}
        </button>
      </div>

      {/* Sections */}
      {showAll ? (
        <div className="bg-white rounded-2xl border-2 border-s1 p-4 mb-4">
          <p className="text-stone leading-relaxed mb-3">{fullText}</p>
          <button onClick={() => speak(fullText)}
            className="text-sm text-fox-d font-bold hover:text-lava">
            🔊 Écouter tout le texte
          </button>
        </div>
      ) : (
        <div className="mb-4">
          {presentation.sections.map((s, i) => (
            <Section key={i} section={s} idx={i} />
          ))}
        </div>
      )}

      {/* Practice tips */}
      <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-4">
        <h3 className="font-heading text-base font-bold text-stone mb-3">💡 Trucs pour bien réussir</h3>
        <div className="space-y-3">
          {presentation.tips.map((t, i) => (
            <div key={i} className="bg-orange-50 rounded-xl p-3 border-l-4 border-fox">
              <div className="flex items-start gap-2">
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <div>
                  <div className="font-heading font-bold text-stone text-sm mb-1">{t.criterion}</div>
                  <div className="text-xs text-s6 leading-relaxed">{t.tip}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary help */}
      <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-4">
        <h3 className="font-heading text-base font-bold text-stone mb-3">📖 Mots difficiles</h3>
        <div className="space-y-2">
          {presentation.vocabularyHelp.map((v, i) => (
            <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-s1 last:border-0">
              <button onClick={() => speak(v.word)}
                className="font-heading font-bold text-fox-d hover:text-lava text-sm">
                🔊 {v.word}
              </button>
              <span className="text-xs text-s4 text-right flex-1">{v.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation criteria */}
      <div className="bg-white rounded-2xl p-4 border-2 border-s1">
        <h3 className="font-heading text-base font-bold text-stone mb-3">✅ Ce que la maîtresse va évaluer</h3>
        <ul className="space-y-1.5">
          {presentation.criteria.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-s6">
              <span className="text-fox font-bold flex-shrink-0">·</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
