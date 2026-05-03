import React, { useState, useEffect } from 'react';
import { requestPermission, hasPermission, isActive, getInterval, getWeek, startReminders, stopReminders } from '../utils/studyReminder';
import { dicteeWeeks } from '../data/dicteeWeekly';

export default function StudyReminderSettings({ onClose, profile }) {
  const [permitted, setPermitted] = useState(hasPermission());
  const [active, setActive] = useState(isActive());
  const [interval, setInt] = useState(getInterval());
  const [week, setWeek] = useState(getWeek());

  // Filter weeks for this profile
  const availableWeeks = Object.entries(dicteeWeeks)
    .filter(([k, w]) => {
      if (profile === 'cayla') return k.startsWith('cayla_');
      if (profile === 'ryan') return k.startsWith('theme6_') || k === 'dictee_revision';
      return true;
    });

  async function ask() {
    const ok = await requestPermission();
    setPermitted(ok);
  }

  function start() {
    startReminders(interval, week);
    setActive(true);
  }

  function stop() {
    stopReminders();
    setActive(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-cream rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-s1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl font-extrabold text-stone">📚 Rappels d'étude</h3>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 font-bold hover:border-lava hover:text-lava">
            ✕
          </button>
        </div>

        <p className="text-sm text-s4 font-semibold mb-4">
          Reçois un mot à mémoriser sur ton iPad pendant que tu fais autre chose.
          Marche tant que ton iPad est allumé et que le navigateur tourne.
        </p>

        {!permitted ? (
          <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200 mb-4">
            <p className="text-sm font-bold text-fox-d mb-3">
              D'abord, autorise les notifications sur ton iPad.
            </p>
            <button onClick={ask}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              ✓ Autoriser les notifications
            </button>
            <p className="text-[10px] text-s4 font-semibold mt-2">
              Sur iPad: l'app doit être installée sur ton écran d'accueil (Safari → Partager → Sur l'écran d'accueil).
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-3">
              <label className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2 block">Quel test étudies-tu?</label>
              <select value={week} onChange={(e) => setWeek(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-bold focus:outline-none focus:border-lava">
                {availableWeeks.map(([k, w]) => (
                  <option key={k} value={k}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-3">
              <label className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2 block">Fréquence des rappels</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 30, 60].map(m => (
                  <button key={m} onClick={() => setInt(m)}
                    className={`py-2 rounded-lg font-bold text-sm transition-all ${
                      interval === m ? 'bg-lava text-white' : 'bg-white border-2 border-s2 text-s6 hover:border-lava'
                    }`}>
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            {active ? (
              <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-300 mb-3 text-center">
                <p className="font-heading text-lg font-extrabold text-ok mb-1">✓ Rappels actifs</p>
                <p className="text-xs text-s4 font-semibold">Toutes les {interval} min · {dicteeWeeks[week]?.name}</p>
                <button onClick={stop}
                  className="mt-3 px-6 py-2 rounded-xl font-bold text-white text-sm bg-red-500">
                  Arrêter les rappels
                </button>
              </div>
            ) : (
              <button onClick={start}
                className="w-full py-4 rounded-xl font-bold text-white text-lg"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                ▶ Démarrer les rappels
              </button>
            )}

            <p className="text-[10px] text-s4 font-semibold mt-3 text-center">
              Note: si tu fermes complètement l'app, les rappels s'arrêtent.
              Garde-la ouverte en arrière-plan pour continuer.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
