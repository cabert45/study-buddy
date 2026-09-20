import React, { useEffect, useState } from 'react';
import { X, Volume2, VolumeX, Palette, PawPrint, Type, Play, Check, RotateCcw } from 'lucide-react';
import Mascot, { MASCOTS } from './Mascots';
import {
  ACCENTS, COLORS, FONTS, DEFAULT_SETTINGS, loadFonts, saveSettings, useSettings, mascotFor,
} from '../utils/settings';
import { listFrenchVoices, onVoicesChanged, normLang, speak, stopSpeech, listPremiumVoices } from '../utils/speech';

// ⚙️ Réglages de l'enfant: voix, couleur, mascotte, écriture.
// Chaque choix s'applique tout de suite (on voit l'app changer derrière) et est
// gardé pour ce profil sur cet appareil. Voir utils/settings.js.

// « Microsoft Sylvie Online (Natural) - French (Canada) » → « Sylvie »
const shortVoiceName = (name) =>
  name.replace(/^Microsoft\s+/i, '').split(/\s+Online|\s+-\s+|\s+\(/)[0];

function Section({ icon: Icon, title, children }) {
  return (
    <section className="bg-white rounded-2xl border border-s1 p-4 sm:p-5 mb-3"
      style={{ boxShadow: '0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.05)' }}>
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-stone mb-3">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--sb-brand-bg)', color: 'var(--sb-brand-fg)' }}>
          <Icon size={17} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Chip({ on, onClick, children, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold border transition-all disabled:opacity-40 ${
        on ? 'text-white border-transparent' : 'bg-white text-s6 border-s2 hover:border-fox'}`}
      style={on ? { background: 'var(--sb-grad)', boxShadow: '0 4px 12px var(--sb-grad-shadow)' } : undefined}>
      {on && <Check size={14} />} {children}
    </button>
  );
}

export default function Settings({ profile, name, onClose }) {
  const s = useSettings(profile);
  const set = (patch) => saveSettings(profile, patch);
  const [voices, setVoices] = useState(() => listFrenchVoices());
  // Voix ElevenLabs du compte. Vide tant que le serveur n'a pas de clé: dans ce
  // cas l'écran reste exactement celui d'avant (accent + voix de l'appareil).
  const [premium, setPremium] = useState([]);

  useEffect(() => {
    loadFonts(); // pour voir chaque écriture dans sa vraie police
    const refresh = () => setVoices(listFrenchVoices());
    const off = onVoicesChanged(refresh);
    const t = setTimeout(refresh, 600); // iPad: la liste arrive parfois sans événement
    return () => { off(); clearTimeout(t); stopSpeech(); };
  }, []);

  useEffect(() => {
    let alive = true;
    listPremiumVoices().then((list) => { if (alive) setPremium(list); });
    return () => { alive = false; };
  }, []);

  // Les réglages d'accent et de voix de l'appareil ne servent à rien quand c'est
  // ElevenLabs qui lit: on ne les montre que si c'est l'appareil qui parle.
  const deviceReads = !premium.length || s.ttsVoice === 'appareil';

  // Accents qui ont au moins une voix sur cet appareil (tous si la liste n'est pas encore là)
  const accents = ACCENTS.filter((a) => a.id === 'auto' || !voices.length
    || voices.some((v) => normLang(v.lang) === a.id.toLowerCase()));
  const accentVoices = s.accent === 'auto' ? voices
    : voices.filter((v) => normLang(v.lang) === s.accent.toLowerCase());
  const mascot = mascotFor(profile, s);

  const tryVoice = () => {
    if (s.muted) set({ muted: false });
    // setTimeout: laisse setVoicePrefs choisir la voix avant de parler
    setTimeout(() => speak(`Bonjour ${name || ''}! Voici ma voix. On apprend ensemble?`), 50);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'var(--cream, #fefaf6)' }}>
      <div className="max-w-xl mx-auto px-4 pt-5 pb-16">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-s4">{name ? `Profil de ${name}` : 'Mon profil'}</p>
            <h1 className="font-heading text-3xl font-extrabold text-stone leading-tight">⚙️ Réglages</h1>
          </div>
          <button onClick={onClose} aria-label="Fermer"
            className="w-10 h-10 rounded-xl bg-white border border-s2 text-s6 hover:text-stone flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        {/* ---- Voix ---- */}
        <Section icon={s.muted ? VolumeX : Volume2} title="La voix">
          <button onClick={() => set({ muted: !s.muted })}
            className="w-full flex items-center justify-between rounded-xl border border-s1 px-4 py-3 mb-4 text-left">
            <span>
              <span className="block font-semibold text-stone">{s.muted ? '🔇 La voix est coupée' : '🔊 La voix est allumée'}</span>
              <span className="block text-[13px] text-s4">{s.muted ? 'L’app ne lira rien à voix haute.' : 'L’app lit les questions et les mots.'}</span>
            </span>
            <span className="relative w-14 h-8 rounded-full transition-colors flex-shrink-0"
              style={{ background: s.muted ? 'rgb(var(--c-s2))' : 'var(--fox)' }}>
              <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all"
                style={{ left: s.muted ? 4 : 28 }} />
            </span>
          </button>

          {premium.length > 0 && (
            <>
              <p className="text-sm font-semibold text-stone mb-2">Qui lit?</p>
              <div className="flex flex-wrap gap-2 mb-1">
                <Chip on={s.ttsVoice === 'auto'} disabled={s.muted} onClick={() => set({ ttsVoice: 'auto' })}>
                  ✨ Automatique
                </Chip>
                {premium.map((v) => (
                  <Chip key={v.id} on={s.ttsVoice === v.id} disabled={s.muted} onClick={() => set({ ttsVoice: v.id })}>
                    🎙️ {v.name}
                  </Chip>
                ))}
                <Chip on={s.ttsVoice === 'appareil'} disabled={s.muted} onClick={() => set({ ttsVoice: 'appareil' })}>
                  📱 Cet appareil
                </Chip>
              </div>
              <p className="text-[12px] text-s4 mb-4">
                {deviceReads
                  ? 'La voix intégrée à l’iPad ou à l’ordinateur.'
                  : 'Une vraie voix enregistrée — la même sur tous les appareils.'}
              </p>
            </>
          )}

          {deviceReads && (
            <>
              <p className="text-sm font-semibold text-stone mb-2">L’accent</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {accents.map((a) => (
                  <Chip key={a.id} on={s.accent === a.id} disabled={s.muted}
                    onClick={() => set({ accent: a.id, voice: '' })}>
                    <span>{a.flag}</span> {a.label}
                  </Chip>
                ))}
              </div>

              {accentVoices.length > 1 && (
                <>
                  <p className="text-sm font-semibold text-stone mb-2">La voix</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Chip on={!s.voice} disabled={s.muted} onClick={() => set({ voice: '' })}>✨ Automatique</Chip>
                    {accentVoices.map((v) => (
                      <Chip key={v.name} on={s.voice === v.name} disabled={s.muted} onClick={() => set({ voice: v.name })}>
                        {shortVoiceName(v.name)}
                      </Chip>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <button onClick={tryVoice}
            className="sb-btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
            <Play size={16} /> Essayer la voix
          </button>
          {deviceReads && voices.length === 0 && (
            <p className="text-[12px] text-s4 mt-2">Les accents dépendent des voix installées sur cet appareil.</p>
          )}
        </Section>

        {/* ---- Couleur ---- */}
        <Section icon={Palette} title="La couleur">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {COLORS.map((c) => {
              const on = s.color === c.id;
              return (
                <button key={c.id} onClick={() => set({ color: c.id })}
                  className="flex flex-col items-center gap-1.5 rounded-xl py-2 transition-transform active:scale-95">
                  <span className="relative w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{
                      background: c.swatch,
                      boxShadow: on ? `0 0 0 3px white, 0 0 0 5px ${c.lava || c.swatch}` : 'inset 0 0 0 1px rgba(0,0,0,.06)',
                    }}>
                    {on && <Check size={22} strokeWidth={3} />}
                  </span>
                  <span className={`text-[12px] ${on ? 'font-bold text-stone' : 'font-medium text-s4'}`}>{c.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ---- Mascotte ---- */}
        <Section icon={PawPrint} title="La mascotte">
          <div className="grid grid-cols-4 gap-2">
            {[...MASCOTS, { id: 'aucun', label: 'Aucune' }].map((m) => {
              const on = mascot === m.id;
              return (
                <button key={m.id} onClick={() => set({ mascot: m.id })}
                  className={`flex flex-col items-center rounded-xl border pt-2 pb-1.5 transition-all active:scale-95 ${on ? 'border-transparent' : 'border-s1 hover:border-fox'}`}
                  style={on ? { background: 'var(--sb-brand-bg)', boxShadow: 'inset 0 0 0 2px var(--fox)' } : undefined}>
                  <span className="h-[70px] flex items-center justify-center">
                    {m.C ? <Mascot id={m.id} width={56} animated={on} /> : <span className="text-3xl text-s3">🚫</span>}
                  </span>
                  <span className={`text-[12px] ${on ? 'font-bold text-stone' : 'font-medium text-s4'}`}>{m.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ---- Écriture ---- */}
        <Section icon={Type} title="L’écriture">
          <div className="grid sm:grid-cols-2 gap-2">
            {FONTS.map((f) => {
              const on = s.font === f.id;
              const family = f.family || "'Quicksand', system-ui, sans-serif";
              return (
                <button key={f.id} onClick={() => set({ font: f.id })}
                  className={`text-left rounded-xl border px-4 py-3 transition-all active:scale-[0.98] ${on ? 'border-transparent' : 'border-s1 hover:border-fox'}`}
                  style={on ? { background: 'var(--sb-brand-bg)', boxShadow: 'inset 0 0 0 2px var(--fox)' } : undefined}>
                  <span className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.06em] text-s4 mb-0.5"
                    style={{ fontFamily: "'Quicksand', system-ui, sans-serif" }}>
                    {f.label} {on && <Check size={14} style={{ color: 'var(--fox)' }} />}
                  </span>
                  <span className="block text-lg text-stone leading-snug" style={{ fontFamily: f.id === 'default' ? "'Baloo 2', cursive" : family }}>
                    Bonjour {name || 'toi'}!
                  </span>
                  <span className="block text-sm text-s6" style={{ fontFamily: family }}>
                    Les élèves écrivent: 1 2 3 4 5
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
          <button onClick={() => saveSettings(profile, DEFAULT_SETTINGS)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-s4 hover:text-stone">
            <RotateCcw size={15} /> Remettre comme avant
          </button>
          <button onClick={onClose} className="sb-btn-primary rounded-xl px-6 py-3 font-semibold">
            C’est parfait!
          </button>
        </div>
      </div>
    </div>
  );
}
