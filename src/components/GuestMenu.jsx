import React, { useEffect } from 'react';
import { pingGuest } from '../utils/guest';

// Menu du mode invité (camarade de classe de Cayla). Aucun lien vers la famille.
const MODULES = [
  { id: 'univers_social', emoji: '🏺', label: 'Univers social — Dossier 1', desc: 'La sédentarisation: 29 mots de vocabulaire. Cartes, liste et test.' },
  { id: 'sciences_labo', emoji: '🧪', label: 'Sciences — Instruments de labo', desc: 'Nom et utilité des 14 instruments, et les montages.' },
  { id: 'verbes', emoji: '📗', label: 'Verbes avoir & être', desc: 'Tous les modes et temps: tableau, écrire, choix multiple.' },
];

export default function GuestMenu({ onOpen }) {
  useEffect(() => { pingGuest('open'); }, []);
  const open = (id) => { pingGuest(`module:${id}`); onOpen(id); };
  return (
    <div className="max-w-xl mx-auto px-4 pt-10 pb-12">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">📚</div>
        <h1 className="font-heading text-3xl font-extrabold text-stone">Study Buddy</h1>
        <p className="text-sm font-bold text-s4 mt-1">Secondaire 1 · Révision des examens</p>
      </div>
      <div className="space-y-3">
        {MODULES.map((m) => (
          <button key={m.id} onClick={() => open(m.id)}
            className="w-full bg-white border-2 border-s1 rounded-2xl p-4 text-left flex items-center gap-4 hover:border-fox hover:shadow-md transition-all active:scale-[0.98]">
            <div className="text-4xl flex-shrink-0">{m.emoji}</div>
            <div className="flex-1">
              <div className="font-heading text-lg font-extrabold text-stone leading-tight">{m.label}</div>
              <div className="text-xs font-semibold text-s4 mt-0.5">{m.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-[11px] font-semibold text-s4 text-center mt-8">
        Aucun nom ni courriel demandé. Garde ce lien en favori pour revenir à ton progrès.
      </p>
    </div>
  );
}
