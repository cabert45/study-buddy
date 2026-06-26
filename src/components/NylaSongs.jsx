import React from 'react';
import { ChevronLeft, Play } from 'lucide-react';

// Nyla — Apprends une chanson.
// The classic comptines taught at Québec maternelle. Each opens a kid-safe
// French video. Where we have a known good video we link it directly; otherwise
// a targeted YouTube search (which never goes dead) surfaces the right song.

function yt(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' comptine enfants')}`;
}

// Long compilation for passive listening / sing-along time
const FEATURED = {
  title: 'Mes comptines préférées',
  desc: '40 minutes de chansons à gestes',
  icon: '🎶',
  url: 'https://www.youtube.com/watch?v=PLNxNajHI8A', // Monde des Titounis — compilation
};

const SONGS = [
  { title: 'Une souris verte', icon: '🐭', url: 'https://www.youtube.com/watch?v=1rrBdkZzALc' },
  { title: 'Tête, épaules, genoux, orteils', icon: '🙆' },
  { title: 'Frère Jacques', icon: '🔔' },
  { title: 'Ainsi font les petites marionnettes', icon: '👐' },
  { title: 'Savez-vous planter les choux', icon: '🥬' },
  { title: 'Alouette, gentille alouette', icon: '🐦' },
  { title: 'Promenons-nous dans les bois', icon: '🐺' },
  { title: 'Dans la ferme de Mathurin', icon: '🚜' },
  { title: 'Un éléphant qui se balançait', icon: '🐘' },
  { title: 'Au clair de la lune', icon: '🌙' },
  { title: 'Bonjour mes amis, bonjour', icon: '👋' },
  { title: 'Pirouette, cacahuète', icon: '🥜' },
  { title: 'Jean Petit qui danse', icon: '💃' },
  { title: "La chanson de l'alphabet", icon: '🔤' },
];

export default function NylaSongs({ onHome }) {
  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="flex items-center gap-1 text-s4 font-bold text-sm hover:text-lava">
          <ChevronLeft size={18} /> Menu
        </button>
        <h2 className="font-heading font-extrabold text-stone">🎵 Mes chansons</h2>
        <div className="w-12" />
      </div>

      <p className="text-center text-sm font-semibold text-s4 mb-4">
        Choisis une chanson, regarde et chante avec! 🎤
      </p>

      {/* Featured compilation */}
      <a href={FEATURED.url} target="_blank" rel="noopener noreferrer"
        className="w-full rounded-2xl p-5 mb-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 6px 24px rgba(124,58,237,0.25)' }}>
        <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0 text-3xl">{FEATURED.icon}</div>
        <div className="text-left flex-1">
          <div className="font-heading text-xl font-extrabold text-white leading-tight">{FEATURED.title}</div>
          <div className="text-xs font-semibold text-white/90">{FEATURED.desc}</div>
        </div>
        <Play className="text-white" size={26} fill="white" />
      </a>

      {/* Song list */}
      <div className="grid grid-cols-2 gap-2.5">
        {SONGS.map((s) => (
          <a key={s.title} href={s.url || yt(s.title)} target="_blank" rel="noopener noreferrer"
            className="bg-white border-2 border-s1 rounded-2xl p-4 text-center transition-all
              hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] flex flex-col items-center">
            <div className="text-4xl mb-2">{s.icon}</div>
            <div className="font-heading text-sm font-bold text-stone leading-tight">{s.title}</div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-purple-600">
              <Play size={12} fill="currentColor" /> Regarder
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
