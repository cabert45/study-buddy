import React, { useState } from 'react';
import { sendTestPush } from '../utils/pushNotifications';
import { X, Send, Heart, MessageCircle, Trophy, Sparkles } from 'lucide-react';

const quickTemplates = [
  { icon: Heart, title: 'Je t\'aime', body: 'Maman pense à toi ❤️', tag: 'love' },
  { icon: Trophy, title: 'Bravo!', body: 'Je suis fière de toi pour aujourd\'hui!', tag: 'praise' },
  { icon: Sparkles, title: "C'est l'heure d'étudier", body: '15 minutes de pratique = grande victoire!', tag: 'study' },
  { icon: MessageCircle, title: 'Comment ça va?', body: 'Pense à écrire dans ton journal aujourd\'hui.', tag: 'checkin' },
];

export default function ComposeMessage({ onClose, profile }) {
  const [recipient, setRecipient] = useState(profile === 'cayla' ? 'cayla' : 'ryan');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  function applyTemplate(tpl) {
    setTitle(tpl.title);
    setBody(tpl.body);
  }

  async function send() {
    if (!title.trim()) {
      setStatus('Ajoute un titre');
      return;
    }
    setBusy(true);
    setStatus('Envoi...');
    try {
      const result = await sendTestPush(recipient, title.trim(), body.trim());
      if (result.sent === 0 && result.total === 0) {
        setStatus(`⚠️ Personne n'est inscrit aux notifications push pour ${recipient}. Demande-leur d'activer dans 📚.`);
      } else {
        setStatus(`✓ Envoyé à ${result.sent}/${result.total} appareil(s)`);
        setTimeout(() => {
          setTitle('');
          setBody('');
          setStatus('');
        }, 2500);
      }
    } catch (err) {
      setStatus('Erreur: ' + err.message);
    }
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-cream rounded-2xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-s1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl font-extrabold text-stone flex items-center gap-2">
            <MessageCircle size={20} /> Envoyer un message
          </h3>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 hover:border-lava hover:text-lava flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-s4 font-semibold mb-4">
          Le message arrive en notification push sur leur iPad/téléphone — même si l'app est fermée.
        </p>

        {/* Recipient */}
        <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-3">
          <label className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2 block">À qui?</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ryan', label: 'Ryan' },
              { id: 'cayla', label: 'Cayla' },
              { id: 'all', label: 'Les deux' },
            ].map(r => (
              <button key={r.id} onClick={() => setRecipient(r.id)}
                className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                  recipient === r.id ? 'bg-lava text-white' : 'bg-white border-2 border-s2 text-s6 hover:border-lava'
                }`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick templates */}
        <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-3">
          <label className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2 block">Modèles rapides</label>
          <div className="grid grid-cols-2 gap-2">
            {quickTemplates.map((t, i) => {
              const Icon = t.icon;
              return (
                <button key={i} onClick={() => applyTemplate(t)}
                  className="bg-orange-50 border-2 border-orange-200 rounded-xl p-2.5 text-left hover:border-fox transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className="text-fox-d" />
                    <span className="font-heading font-bold text-xs text-stone">{t.title}</span>
                  </div>
                  <div className="text-[10px] text-s4 line-clamp-2">{t.body}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-3">
          <label className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2 block">Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Je t'aime, Bravo, C'est l'heure d'étudier..."
            maxLength={60}
            className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone font-bold focus:outline-none focus:border-lava" />
          <p className="text-[10px] text-s4 mt-1">{title.length}/60</p>
        </div>

        {/* Body */}
        <div className="bg-white rounded-2xl p-4 border-2 border-s1 mb-4">
          <label className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2 block">Message (optionnel)</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="Ex: 15 min de dictée et c'est gagné!"
            rows={3}
            maxLength={150}
            className="w-full px-3 py-2 rounded-xl border-2 border-s2 text-stone focus:outline-none focus:border-lava" />
          <p className="text-[10px] text-s4 mt-1">{body.length}/150</p>
        </div>

        {/* Send button */}
        <button onClick={send} disabled={busy || !title.trim()}
          className="w-full py-4 rounded-xl font-bold text-white text-lg disabled:opacity-40 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          <Send size={18} /> Envoyer maintenant
        </button>

        {status && (
          <p className="text-sm font-bold text-center mt-3 text-fox-d">{status}</p>
        )}

        <p className="text-[10px] text-s4 font-semibold mt-3 text-center">
          💡 Pour qu'ils reçoivent: ils doivent avoir activé les notifications push sur leur appareil (📚 dans le menu).
        </p>
      </div>
    </div>
  );
}
