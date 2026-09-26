import React, { useState, useRef, useEffect, useCallback } from 'react';
import { speakAndWait, stopSpeech } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { listeCetteSemaine, cleDictee } from '../data/orthographeQuotidien';
import { jugerEpellation, epeler } from '../utils/epellation';
import { ecouterUnTour } from '../utils/micro';
import { recordAnswer, buildSmartQueue } from '../utils/wordMastery';
import Mascot, { MASCOTS } from './Mascots';
import { useSettings, mascotFor } from '../utils/settings';

// Ryan — la dictée à voix haute.
//
// La dictée tapée l'a débloqué en 2e année, et elle reste. Celle-ci travaille
// autre chose: ÉPELER. Il entend le mot, il dit les lettres, l'app écoute.
// C'est ce qu'on lui demandera à l'oral en classe, et ça ne se fait pas au
// clavier.
//
// Trois règles, décidées avant d'écrire l'écran:
//
// 1. LE MOT NE S'AFFICHE PAS. C'est une dictée: le lire serait tricher. Il
//    n'apparaît qu'après trois essais ratés, ou une fois le mot réussi.
//    Le parent, lui, peut tout voir avec le bouton 👁.
//
// 2. ON N'INVENTE JAMAIS UNE FAUTE. Mesuré: quand on épelle nettement, Scribe
//    transcrit parfaitement; quand on hésite, ça part en bouillie
//    (« S... A... V... » ressort « Ça se-- euh, va »). Dans ce cas le verdict
//    est « incompris » et on redemande — on ne lui annonce pas une erreur
//    qu'il n'a pas faite. Il pleure quand il se trompe.
//
// 3. TROIS ESSAIS, PUIS ON MONTRE. On ne laisse pas un enfant s'enfoncer: au
//    troisième échec, le mot s'écrit lettre par lettre, la voix l'épelle, et
//    on passe au suivant sans en faire un drame.
//
// Les mots viennent de la liste de la semaine, dans l'ordre que
// wordMastery juge utile: ce qu'il rate revient en premier.

const CLE_AVATAR = 'sb_ryan_avatar_dictee';
const MOTS_PAR_SEANCE = 8;
const ESSAIS_MAX = 3;

const ETATS = {
  CHOIX: 'choix', PRET: 'pret', PARLE: 'parle', ECOUTE: 'ecoute',
  RELIT: 'relit', REFLECHIT: 'reflechit', REPOND: 'repond', FINI: 'fini',
};

const LIBELLE = {
  [ETATS.PARLE]: '🔊 Écoute bien…',
  [ETATS.ECOUTE]: '🎤 Épelle, je t’écoute',
  [ETATS.RELIT]: '✏️ Vérifie ce que j’ai entendu',
  [ETATS.REFLECHIT]: '💭 Je vérifie…',
  [ETATS.REPOND]: '🔊 …',
};

export default function DicteeOrale({ onHome, onFinish }) {
  const reglages = useSettings('ryan');
  const liste = listeCetteSemaine();
  const cle = cleDictee(liste.id);

  const [avatar, setAvatar] = useState(() => {
    try { return localStorage.getItem(CLE_AVATAR) || ''; } catch { return ''; }
  });
  const [mots] = useState(() =>
    buildSmartQueue('ryan', cle, liste.mots.map((m) => ({ ...m, correct: m.mot })))
      .slice(0, MOTS_PAR_SEANCE));
  const [i, setI] = useState(0);
  const [essai, setEssai] = useState(0);
  const [etat, setEtat] = useState(avatar ? ETATS.PRET : ETATS.CHOIX);
  const [fil, setFil] = useState([]);
  const [brouillon, setBrouillon] = useState('');
  const [niveau, setNiveau] = useState(0);
  const [micRefuse, setMicRefuse] = useState(false);
  const [devoile, setDevoile] = useState(false);   // 👁 parent
  const [resultats, setResultats] = useState([]);  // le petit rapport de fin

  const vivant = useRef(true);
  const arretRef = useRef(null);
  const basRef = useRef(null);
  const filRef = useRef([]);

  const mot = mots[i] ? mots[i].mot : null;
  const mascotteLabel = (MASCOTS.find((m) => m.id === avatar) || {}).label || 'ton coach';

  useEffect(() => () => { vivant.current = false; stopSpeech(); }, []);
  useEffect(() => { basRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [fil, etat, brouillon]);

  // Dans le fil, le mot en cours reste masqué: c'est une dictée.
  function ajouter(qui, texte, { motCache } = {}) {
    filRef.current = [...filRef.current, { qui, texte, motCache: motCache || null }];
    setFil(filRef.current);
  }

  const direPuisEcouter = useCallback(async (phrase, opts) => {
    if (!vivant.current) return null;
    setBrouillon('');
    setEtat(ETATS.PARLE);
    ajouter('coach', phrase, opts);
    await speakAndWait(phrase);
    if (!vivant.current) return null;

    const r = await ecouterUnTour({
      onNiveau: setNiveau,
      onOuvert: () => setEtat(ETATS.ECOUTE),
      onArret: (f) => { arretRef.current = f; },
      onTranscrit: () => setEtat(ETATS.REFLECHIT),
    });
    if (!vivant.current) return null;
    if (r.refuse) { setMicRefuse(true); return null; }
    setBrouillon(r.texte);
    setEtat(ETATS.RELIT);
    return r;
  }, []);

  // ===== Demander un mot =====
  const demander = useCallback(async (nouveau) => {
    const m = mots[nouveau ?? i];
    if (!m) return;
    const premier = (nouveau ?? i) === 0;
    const phrase = premier
      ? `Pour ta liste de cette semaine. Le premier mot, c'est « ${m.mot} ». Épelle ${m.mot}.`
      : `Passons à l'autre mot. « ${m.mot} ». Épelle ${m.mot}.`;
    // Le fil affiche la consigne SANS le mot (dictée), sauf pour le parent.
    await direPuisEcouter(phrase, { motCache: m.mot });
  }, [mots, i, direPuisEcouter]);

  async function envoyer() {
    const dit = brouillon.trim();
    setBrouillon('');
    if (!dit) { await redemander(); return; }

    ajouter('ryan', dit.toUpperCase());
    setEtat(ETATS.REFLECHIT);
    const v = jugerEpellation(mot, dit);

    // Transcription inexploitable: on redemande, on ne compte pas d'essai.
    if (v.verdict === 'incompris') {
      await reagir('Je ne t’ai pas bien compris. Redis-moi les lettres, une par une, bien détachées.');
      if (vivant.current) await direPuisEcouter(`Épelle ${mot}.`, { motCache: mot });
      return;
    }

    if (v.verdict === 'bravo') {
      recordAnswer('ryan', cle, mot, true);
      setResultats((r) => [...r, { mot, ok: true, essais: essai + 1 }]);
      await reagir(`Bravo Ryan! ${epeler(mot)}. C’est exactement ça.`, { motCache: mot, reveler: true });
      return suivant();
    }

    const n = essai + 1;
    setEssai(n);
    if (n >= ESSAIS_MAX) {
      recordAnswer('ryan', cle, mot, false);
      setResultats((r) => [...r, { mot, ok: false, essais: n }]);
      await reagir(`On le regarde ensemble: ${mot}, ça s’écrit ${epeler(mot)}.`,
        { motCache: mot, reveler: true });
      return suivant();
    }

    // Un indice qui vise juste, sans donner le mot.
    // Quand on sait QUELLE lettre cloche, on le dit: c'est ça qui fait
    // progresser. Quand on ne sait pas (l'epellation etait trop loin du mot),
    // on redit le mot au lieu d'un « non » sec.
    const indice = v.manque && v.bonneLettre ? `Il manque le ${v.bonneLettre.toUpperCase()}.`
      : v.trop ? 'Il y a une lettre de trop.'
      : v.bonneLettre ? `La lettre numéro ${v.position + 1}, ce n’est pas ça.`
      : `Écoute encore: ${mot}.`;
    await reagir(['C’est pas tout à fait ça.', indice, 'Essaie encore.'].join(' '),
      { motCache: mot });
    if (vivant.current) await direPuisEcouter(`Épelle ${mot}.`, { motCache: mot });
  }

  async function reagir(phrase, opts) {
    setEtat(ETATS.REPOND);
    ajouter('coach', phrase, opts);
    await speakAndWait(phrase);
  }

  async function redemander() {
    await direPuisEcouter(`Épelle ${mot}.`, { motCache: mot });
  }

  function suivant() {
    setEssai(0);
    if (i + 1 >= mots.length) {
      setEtat(ETATS.FINI);
      const justes = resultats.filter((r) => r.ok).length;
      const phrase = 'C’est fini pour aujourd’hui. Bravo Ryan!';
      ajouter('coach', phrase);
      speakAndWait(phrase);
      try {
        saveSession('dictee_orale', mots.length, justes,
          resultats.map((r) => ({ category: 'dictee_orale', type: liste.id, correct: r.ok, question: r.mot })));
      } catch {}
      return;
    }
    const n = i + 1;
    setI(n);
    setTimeout(() => demander(n), 400);
  }

  // ===== Choisir l'avatar =====
  if (etat === ETATS.CHOIX) {
    const suggere = mascotFor('ryan', reglages);
    return (
      <div className="max-w-xl mx-auto px-4 pt-4 pb-10">
        <Tete onHome={onHome} />
        <p className="text-center font-heading text-xl font-extrabold text-stone mb-1">Qui te fait la dictée?</p>
        <p className="text-center text-sm font-semibold text-s4 mb-5">Liste {liste.numero} — {liste.titre}</p>
        <div className="grid grid-cols-3 gap-3">
          {MASCOTS.map((m) => (
            <button key={m.id}
              onClick={() => {
                setAvatar(m.id);
                try { localStorage.setItem(CLE_AVATAR, m.id); } catch {}
                setEtat(ETATS.PRET);
              }}
              className={`rounded-2xl p-2 border-2 bg-white transition-all active:scale-[0.96] ${
                m.id === suggere ? 'border-lava shadow-sm' : 'border-s1 hover:border-fox'
              }`}>
              <Mascot id={m.id} width={72} animated={false} />
              <div className="text-xs font-bold text-s6 mt-1">{m.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (micRefuse) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-10 text-center">
        <div className="text-6xl mb-4">🎤</div>
        <h2 className="font-heading text-2xl font-extrabold text-stone mb-2">Le micro est fermé</h2>
        <p className="text-sm text-s4 mb-6">Autorise le microphone dans le navigateur, puis rouvre la page.</p>
        <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>← Retour</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-10">
      <Tete onHome={onHome} droite={`${Math.min(i + 1, mots.length)}/${mots.length}`} />

      <div className="w-full bg-s1 rounded-full h-2 mb-4">
        <div className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${(i / mots.length) * 100}%`, background: 'linear-gradient(90deg, #c74a15, #e8622a)' }} />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className={`flex-shrink-0 transition-transform duration-300 ${
          etat === ETATS.PARLE || etat === ETATS.REPOND ? 'scale-110' : ''}`}>
          <Mascot id={avatar} width={56} animated={etat === ETATS.PARLE || etat === ETATS.REPOND} />
        </div>
        <div className="flex-1">
          <div className="font-heading font-extrabold text-stone">
            {LIBELLE[etat] || (etat === ETATS.FINI ? '🏆 Fini!' : 'Prêt?')}
          </div>
          {etat === ETATS.ECOUTE && (
            <div className="mt-1 h-3 rounded-full bg-s1 overflow-hidden">
              <div className="h-3 rounded-full transition-[width] duration-75"
                style={{ width: `${Math.max(4, niveau * 100)}%`, background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }} />
            </div>
          )}
          {essai > 0 && etat !== ETATS.FINI && (
            <div className="text-[11px] font-bold text-fox-d mt-0.5">essai {essai + 1} sur {ESSAIS_MAX}</div>
          )}
        </div>
        {/* Le parent peut lire les mots; Ryan, non. */}
        <button onClick={() => setDevoile((v) => !v)}
          className="text-[11px] font-bold text-s4 underline flex-shrink-0">
          {devoile ? '🙈 cacher' : '👁 parent'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border-2 border-s1 p-3 mb-4 max-h-[42vh] overflow-y-auto">
        {fil.length === 0 && <p className="text-sm text-s4 font-semibold text-center py-4">La dictée s’écrira ici.</p>}
        {fil.map((t, k) => (
          <div key={k} className={`flex mb-2 ${t.qui === 'ryan' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[15px] font-semibold leading-snug ${
              t.qui === 'ryan'
                ? 'bg-orange-50 border-2 border-orange-200 text-stone rounded-br-md tracking-[0.2em]'
                : 'bg-cream border-2 border-s2 text-stone rounded-bl-md'}`}>
              <div className="text-[10px] font-extrabold uppercase tracking-wide text-s4 mb-0.5">
                {t.qui === 'ryan' ? 'Ryan' : mascotteLabel}
              </div>
              {t.qui === 'coach' && t.motCache && !devoile
                ? t.texte.replace(new RegExp(t.motCache, 'gi'), '•••')
                : t.texte}
            </div>
          </div>
        ))}
        <div ref={basRef} />
      </div>

      {etat === ETATS.PRET && (
        <button onClick={() => demander(i)}
          className="w-full py-6 rounded-3xl font-heading font-extrabold text-white text-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a)' }}>
          🎤 Commencer la dictée
        </button>
      )}

      {etat === ETATS.ECOUTE && (
        <button onClick={() => arretRef.current?.()}
          className="w-full py-6 rounded-3xl font-heading font-extrabold text-white text-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #2d7a3a, #4ca65b)' }}>
          ✓ J’ai fini d’épeler
        </button>
      )}

      {etat === ETATS.RELIT && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wide text-fox-d mb-1">
            J’ai entendu — corrige si c’est mal transcrit
          </div>
          <input value={brouillon} onChange={(e) => setBrouillon(e.target.value)}
            placeholder="(rien entendu)"
            className="w-full px-3 py-2.5 rounded-xl border-2 border-orange-200 focus:border-lava focus:outline-none text-base text-stone font-semibold bg-white tracking-[0.2em]" />
          <div className="flex gap-2 mt-2">
            <button onClick={redemander}
              className="flex-1 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2 hover:border-lava text-sm">
              ↺ Reprendre
            </button>
            <button onClick={envoyer}
              className="flex-1 py-3 rounded-xl font-extrabold text-white text-sm"
              style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>
              ✓ Envoyer
            </button>
          </div>
        </div>
      )}

      {(etat === ETATS.PARLE || etat === ETATS.REFLECHIT || etat === ETATS.REPOND) && (
        <div className="w-full py-5 rounded-3xl bg-s1 text-center font-heading font-bold text-s6 text-lg">
          {LIBELLE[etat]}
        </div>
      )}

      {/* Le petit rapport de fin — ce que le parent vient voir */}
      {etat === ETATS.FINI && (
        <div>
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🏆</div>
            <p className="font-heading text-2xl font-extrabold text-ok">
              {resultats.filter((r) => r.ok).length} sur {resultats.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-s1 p-3 mb-4">
            <div className="text-xs font-bold text-s4 uppercase mb-2">Les mots de cette séance</div>
            {resultats.map((r, k) => (
              <div key={k} className="flex items-center justify-between py-1.5 border-b border-s1 last:border-0">
                <span className={`font-heading font-bold ${r.ok ? 'text-stone' : 'text-red-600'}`}>{r.mot}</span>
                <span className="text-xs font-bold text-s4">
                  {r.ok ? (r.essais === 1 ? '✓ du premier coup' : `✓ en ${r.essais} essais`) : '✗ à revoir'}
                </span>
              </div>
            ))}
          </div>
          <button onClick={onFinish || onHome}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>← Retour</button>
        </div>
      )}
    </div>
  );
}

function Tete({ onHome, droite }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
      <h2 className="font-heading font-bold text-stone">🎙️ Dictée à voix haute</h2>
      <div className="text-xs font-bold text-s4 min-w-[42px] text-right">{droite || ''}</div>
    </div>
  );
}
