import React, { useState, useEffect } from 'react';
import { requestPermission, hasPermission, isActive, getInterval, getWeek, startReminders, stopReminders } from '../utils/studyReminder';
import { isPushSupported, getSubscription, subscribeToPush, unsubscribeFromPush, sendTestPush } from '../utils/pushNotifications';
import { dicteeWeeks } from '../data/dicteeWeekly';
import { X, Bell, Smartphone, Send } from 'lucide-react';

export default function StudyReminderSettings({ onClose, profile }) {
  const [permitted, setPermitted] = useState(hasPermission());
  const [active, setActive] = useState(isActive());
  const [interval, setInt] = useState(getInterval());
  const [week, setWeek] = useState(getWeek());

  // Push notifications state
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushMsg, setPushMsg] = useState('');

  useEffect(() => {
    (async () => {
      const supported = await isPushSupported();
      setPushSupported(supported);
      if (supported) {
        const sub = await getSubscription();
        setPushSubscribed(!!sub);
      }
    })();
  }, []);

  const availableWeeks = Object.entries(dicteeWeeks)
    .filter(([k]) => {
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

  async function handleSubscribePush() {
    setPushBusy(true);
    setPushMsg('');
    try {
      await subscribeToPush(profile);
      setPushSubscribed(true);
      setPushMsg('✓ Notifications activées sur cet appareil');
    } catch (err) {
      setPushMsg('Erreur: ' + err.message);
    }
    setPushBusy(false);
  }

  async function handleUnsubscribePush() {
    setPushBusy(true);
    try {
      await unsubscribeFromPush();
      setPushSubscribed(false);
      setPushMsg('Désinscrit. Tu ne recevras plus de notifications.');
    } catch (err) {
      setPushMsg('Erreur: ' + err.message);
    }
    setPushBusy(false);
  }

  async function handleTestPush() {
    setPushBusy(true);
    setPushMsg('Envoi du test...');
    try {
      const profileName = profile === 'cayla' ? 'Cayla' : 'Ryan';
      const result = await sendTestPush(
        profile,
        `Test push pour ${profileName}`,
        `Si tu vois ça, les notifications marchent! 🎉`
      );
      setPushMsg(`✓ Envoyé à ${result.sent} appareil(s)`);
    } catch (err) {
      setPushMsg('Erreur: ' + err.message);
    }
    setPushBusy(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-cream rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-s1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl font-extrabold text-stone flex items-center gap-2"><Bell size={20} />Rappels</h3>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 hover:border-lava hover:text-lava flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        {/* === PUSH NOTIFICATIONS (true iOS push) === */}
        <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone size={18} className="text-info" />
            <h4 className="font-heading text-base font-bold text-stone">Notifications push</h4>
          </div>
          <p className="text-xs text-s4 font-semibold mb-3">
            Reçois les notifications même quand l'app est fermée. Marche sur iPad (iOS 16.4+, app installée) et Android.
          </p>

          {!pushSupported && (
            <p className="text-xs text-red-600 font-semibold">
              Ton navigateur ne supporte pas les notifications push.
            </p>
          )}

          {pushSupported && (
            <>
              {pushSubscribed ? (
                <div className="space-y-2">
                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-ok">✓ Notifications push activées</p>
                  </div>
                  <button onClick={handleTestPush} disabled={pushBusy}
                    className="w-full py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(90deg, #3a5bc7, #5b4ad4)' }}>
                    <Send size={14} /> Envoyer un test
                  </button>
                  <button onClick={handleUnsubscribePush} disabled={pushBusy}
                    className="w-full py-2 rounded-xl font-bold text-s6 text-sm bg-white border-2 border-s2">
                    Désactiver
                  </button>
                </div>
              ) : (
                <button onClick={handleSubscribePush} disabled={pushBusy}
                  className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                  {pushBusy ? '...' : '🔔 Activer les notifications push'}
                </button>
              )}
              {pushMsg && (
                <p className="text-xs text-s4 font-semibold mt-2 text-center">{pushMsg}</p>
              )}
              <p className="text-[10px] text-s4 font-semibold mt-2">
                💡 Sur iPad: l'app doit être installée sur l'écran d'accueil.
              </p>
            </>
          )}
        </div>

        {/* === LOCAL STUDY REMINDERS (in-app, while open) === */}
        <div className="bg-white rounded-2xl p-4 border-2 border-s1">
          <h4 className="font-heading text-base font-bold text-stone mb-2">📚 Rappels d'étude (en-app)</h4>
          <p className="text-xs text-s4 font-semibold mb-3">
            Pop des mots à mémoriser pendant que tu fais autre chose. Marche tant que l'app est ouverte.
          </p>

          {!permitted ? (
            <button onClick={ask}
              className="w-full py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              ✓ Autoriser
            </button>
          ) : (
            <>
              <div className="mb-2">
                <label className="text-xs font-bold text-fox-d uppercase mb-1 block">Test à étudier</label>
                <select value={week} onChange={(e) => setWeek(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-bold text-sm focus:outline-none focus:border-lava">
                  {availableWeeks.map(([k, w]) => (
                    <option key={k} value={k}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="text-xs font-bold text-fox-d uppercase mb-1 block">Fréquence</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 30, 60].map(m => (
                    <button key={m} onClick={() => setInt(m)}
                      className={`py-1.5 rounded-lg font-bold text-xs ${
                        interval === m ? 'bg-lava text-white' : 'bg-white border-2 border-s2 text-s6'
                      }`}>
                      {m} min
                    </button>
                  ))}
                </div>
              </div>

              {active ? (
                <div className="bg-green-50 rounded-xl p-3 border-2 border-green-300 text-center">
                  <p className="text-sm font-bold text-ok mb-2">✓ Actifs · {interval} min · {dicteeWeeks[week]?.name}</p>
                  <button onClick={stop}
                    className="px-4 py-1.5 rounded-lg font-bold text-white text-xs bg-red-500">
                    Arrêter
                  </button>
                </div>
              ) : (
                <button onClick={start}
                  className="w-full py-2.5 rounded-xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                  ▶ Démarrer
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
