import React, { useState, useEffect } from 'react';

const motivationCards = [
  { text: "Cayla, tu es belle, intelligente et capable. Aujourd'hui, montre-le toi-même.", icon: '🌟' },
  { text: "Chaque défi te rend plus forte. Tu peux te relever de tout.", icon: '💪' },
  { text: "Jéhovah t'aime profondément. Tes parents t'aiment encore plus que tu ne peux l'imaginer.", icon: '❤️' },
  { text: "Vois le bon dans chaque défi — c'est là que tu grandis le plus.", icon: '🌱' },
  { text: "Ton cerveau est comme un muscle. Plus tu le fais travailler, plus il devient fort.", icon: '🧠' },
  { text: "Les erreurs ne sont pas des échecs. Ce sont des leçons.", icon: '📖' },
  { text: "Tu n'as pas besoin d'être parfaite. Tu as juste besoin d'être toi.", icon: '🦋' },
  { text: "Le vrai courage, c'est de continuer même quand c'est difficile.", icon: '🦁' },
  { text: "Sois fière de chaque petit progrès. Les grandes choses se construisent un pas à la fois.", icon: '🪜' },
  { text: "Tu es plus forte que tu ne le crois.", icon: '⚡' },
  { text: "Les gens qui réussissent ne sont pas ceux qui ne tombent jamais — ce sont ceux qui se relèvent toujours.", icon: '🚀' },
  { text: "Aujourd'hui, fais une chose qui rend ton futur toi fière.", icon: '✨' },
  { text: "Sois gentille avec toi-même. Tu fais de ton mieux, et c'est suffisant.", icon: '🤗' },
  { text: "La beauté de ton cœur compte plus que tout le reste.", icon: '💛' },
  { text: "Tu mérites d'être heureuse. Choisis-le aujourd'hui.", icon: '☀️' },
  { text: "Personne d'autre ne peut être toi. C'est ton super-pouvoir.", icon: '🦸' },
  { text: "Respire. Une difficulté ne dure pas pour toujours.", icon: '🌬️' },
  { text: "Ton effort d'aujourd'hui devient ta force de demain.", icon: '🌅' },
  { text: "Jéhovah voit chaque effort que tu fais. Rien n'est en vain.", icon: '👁️' },
  { text: "Tu as déjà surmonté tellement de choses. Tu peux le faire encore.", icon: '🏔️' },
  { text: "Si tu tombes 7 fois, relève-toi 8 fois.", icon: '🎯' },
  { text: "Les pensées négatives passent. Ne les laisse pas s'installer.", icon: '🌤️' },
  { text: "Tes parents sont fiers de toi, même quand ils ne le disent pas assez.", icon: '👨‍👩‍👧' },
  { text: "Chaque jour est une nouvelle chance de grandir.", icon: '🌳' },
  { text: "Tu vaux la peine d'être aimée — par les autres et par toi-même.", icon: '💗' },
];

const promptsMorning = [
  "Comment tu te sens ce matin?",
  "Quelle est ton intention pour aujourd'hui?",
  "Qu'est-ce qui te rend joyeuse en ce moment?",
];

const promptsEvening = [
  "Qu'est-ce qui s'est bien passé aujourd'hui?",
  "Qu'est-ce qui a été difficile?",
  "Comment tu peux faire mieux demain?",
];

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function dateLabel(iso) {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const d = new Date(iso + 'T00:00:00');
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function loadEntry(profile, date) {
  try {
    return JSON.parse(localStorage.getItem(`sb_journal_${profile}_${date}`) || '{}');
  } catch {
    return {};
  }
}

function saveEntry(profile, date, entry) {
  try {
    localStorage.setItem(`sb_journal_${profile}_${date}`, JSON.stringify(entry));
  } catch {}
}

function getStreak(profile) {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const k = d.toISOString().split('T')[0];
    const e = loadEntry(profile, k);
    if (Object.values(e).some(v => v && (typeof v === 'string' ? v.trim() : v.length > 0))) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      // Allow today to be empty without breaking streak (count from yesterday)
      if (i === 0) { d.setDate(d.getDate() - 1); continue; }
      break;
    }
  }
  return streak;
}

export default function Journal({ onHome, profile }) {
  const date = todayKey();
  const [entry, setEntry] = useState(() => loadEntry(profile, date));
  const [cardIdx, setCardIdx] = useState(() => Math.floor(Math.random() * motivationCards.length));
  const streak = getStreak(profile);

  useEffect(() => {
    saveEntry(profile, date, entry);
  }, [entry, profile, date]);

  function update(field, value) {
    setEntry(e => ({ ...e, [field]: value }));
  }

  function updateGratitude(idx, value) {
    const grats = entry.gratitude || ['', '', ''];
    const updated = [...grats];
    updated[idx] = value;
    setEntry(e => ({ ...e, gratitude: updated }));
  }

  const grats = entry.gratitude || ['', '', ''];
  const card = motivationCards[cardIdx];

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone">Mon journal</h2>
        <div className="text-xs font-bold text-fox-d">🔥 {streak}j</div>
      </div>

      {/* Date */}
      <p className="text-center text-xs font-bold text-fox-d uppercase tracking-wide mb-3">{dateLabel(date)}</p>

      {/* Motivation card */}
      <div className="rounded-2xl p-5 mb-4 border-2 border-pink-300 text-center"
        style={{ background: 'linear-gradient(135deg, #fce8ec, #fef0e4)' }}>
        <div className="text-4xl mb-2">{card.icon}</div>
        <p className="font-heading text-base font-bold text-stone leading-snug">{card.text}</p>
        <button onClick={() => setCardIdx((cardIdx + 1) % motivationCards.length)}
          className="mt-3 text-xs text-fox-d font-bold hover:text-lava">
          🔄 Une autre pensée
        </button>
      </div>

      {/* Gratitude */}
      <div className="bg-white rounded-2xl p-4 mb-3 border-2 border-s1">
        <h3 className="font-heading font-bold text-stone text-base mb-2">🙏 Trois choses pour lesquelles je suis reconnaissante</h3>
        <p className="text-xs text-s4 font-semibold mb-3">Même les petites choses comptent.</p>
        {[0, 1, 2].map(i => (
          <input key={i} type="text" value={grats[i] || ''} onChange={(e) => updateGratitude(i, e.target.value)}
            placeholder={`${i + 1}. ...`}
            className="w-full px-3 py-2 mb-2 rounded-xl border-2 border-s2 text-stone font-semibold focus:outline-none focus:border-pink-400" />
        ))}
      </div>

      {/* Today challenge */}
      <div className="bg-white rounded-2xl p-4 mb-3 border-2 border-s1">
        <h3 className="font-heading font-bold text-stone text-base mb-2">💪 Mon défi du jour</h3>
        <p className="text-xs text-s4 font-semibold mb-2">Qu'est-ce qui a été difficile?</p>
        <textarea value={entry.challenge || ''} onChange={(e) => update('challenge', e.target.value)}
          placeholder="Aujourd'hui, j'ai eu de la difficulté avec..."
          rows={2}
          className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-semibold focus:outline-none focus:border-fox" />
      </div>

      {/* Improvement plan */}
      <div className="bg-white rounded-2xl p-4 mb-3 border-2 border-s1">
        <h3 className="font-heading font-bold text-stone text-base mb-2">🌅 Comment je vais m'améliorer demain</h3>
        <p className="text-xs text-s4 font-semibold mb-2">Une seule chose suffit.</p>
        <textarea value={entry.improvement || ''} onChange={(e) => update('improvement', e.target.value)}
          placeholder="Demain, je vais..."
          rows={2}
          className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-semibold focus:outline-none focus:border-ok" />
      </div>

      {/* Win of the day */}
      <div className="bg-white rounded-2xl p-4 mb-3 border-2 border-s1">
        <h3 className="font-heading font-bold text-stone text-base mb-2">🏆 Ma victoire d'aujourd'hui</h3>
        <p className="text-xs text-s4 font-semibold mb-2">Qu'est-ce qui s'est bien passé?</p>
        <textarea value={entry.win || ''} onChange={(e) => update('win', e.target.value)}
          placeholder="Aujourd'hui, j'ai réussi à..."
          rows={2}
          className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-semibold focus:outline-none focus:border-fox-d" />
      </div>

      {/* Mood */}
      <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-s1">
        <h3 className="font-heading font-bold text-stone text-base mb-3">😊 Mon humeur en ce moment</h3>
        <div className="flex justify-around text-3xl">
          {['😢', '😕', '😐', '🙂', '😄'].map((e, i) => (
            <button key={i} onClick={() => update('mood', i + 1)}
              className={`p-2 rounded-xl transition-all ${
                entry.mood === i + 1 ? 'bg-orange-100 ring-2 ring-lava scale-110' : 'hover:bg-cream'
              }`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-s4 font-semibold">
        ✓ Sauvegardé automatiquement · {streak}j de série
      </p>
    </div>
  );
}
