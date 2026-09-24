import React, { useState, useRef, useEffect } from 'react';
import { FEUILLE_L2, MOTS_L2 } from '../data/feuilleListe2';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { notifySessionResult } from '../utils/notifications';

// « Ma feuille » — la feuille du cahier, à l'écran.
//
// Demandé par le parent le 24 sept. 2026: « fais-en une version électronique
// pour qu'il puisse travailler dessus » puis « duplique-la à l'écran pour
// qu'il la comprenne ». Donc ce n'est pas un exercice inspiré de la feuille:
// c'est la feuille, dans l'ordre, dans les mots du cahier, avec l'encadré de
// mots en haut comme sur le papier.
//
// Une question à la fois. Il répond, il voit pourquoi, il avance. On ne montre
// jamais la question suivante avant qu'il ait compris celle-là — c'est ce que
// le parent appelle « step by step », et ça évite de rater une question sans
// s'en rendre compte, comme sur le papier où il a laissé la 6 et la 7 vides.

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

function Encadre({ children }) {
  return (
    <div className="rounded-2xl p-4 bg-white" style={{ border: '3px dashed #c9b79a' }}>
      {children}
    </div>
  );
}

// L'encadré de mots du cahier: masculin au-dessus, féminin en dessous.
function BoiteDeMots() {
  return (
    <Encadre>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
        {MOTS_L2.map((x) => (
          <div key={x.m} className="leading-tight">
            <div className="text-base font-extrabold text-stone">{x.m}</div>
            <div className="text-sm font-bold text-lava">{x.f}</div>
          </div>
        ))}
      </div>
    </Encadre>
  );
}

export default function Feuille({ onHome, onFinish }) {
  const f = FEUILLE_L2;
  const [idx, setIdx] = useState(0);
  const [listeOuverte, setListeOuverte] = useState(true);
  const [choisis, setChoisis] = useState([]);       // choix multiple + ordre
  const [texte, setTexte] = useState('');           // phrase libre
  const [verifie, setVerifie] = useState(null);     // { bon, details }
  const [resultats, setResultats] = useState([]);
  const [fini, setFini] = useState(false);
  const inputRef = useRef(null);

  const q = f.questions[idx];

  useEffect(() => {
    setChoisis([]); setTexte(''); setVerifie(null);
    if (q && q.type === 'phrase') setTimeout(() => inputRef.current?.focus(), 300);
  }, [idx]);

  // ===== La correction, par type de question =====
  function corriger() {
    if (q.type === 'un_choix') {
      const bon = choisis[0] === q.bonne;
      return { bon, details: [] };
    }
    if (q.type === 'choix_multiple') {
      const manques = q.bonnes.filter((m) => !choisis.includes(m));
      const enTrop = choisis.filter((m) => !q.bonnes.includes(m));
      const trouves = choisis.filter((m) => q.bonnes.includes(m));
      // Un mur de sept lignes rouges, c'est ce qui le fait pleurer — et ses
      // vraies erreurs s'y perdent. On commence donc par ce qu'il a RÉUSSI,
      // on explique au plus deux erreurs en détail, et les oublis tiennent en
      // une seule ligne: un oubli n'est pas une faute, c'est un oubli.
      const details = [];
      if (trouves.length) {
        details.push({ ton: 'ok', texte: `Tu en as trouvé ${trouves.length} de bons: ${trouves.join(', ')}.` });
      }
      enTrop.slice(0, 2).forEach((m) => {
        details.push({ ton: 'ko', texte: q.pourquoiFaux?.[m] || `${m} n'en fait pas partie.` });
      });
      if (enTrop.length > 2) {
        details.push({ ton: 'ko', texte: `Même chose pour ${enTrop.slice(2).join(' et ')}.` });
      }
      if (manques.length) {
        details.push({
          ton: 'manque',
          texte: manques.length === 1
            ? `Il en manquait un: ${manques[0]}.`
            : `Il en manquait ${manques.length}: ${manques.join(', ')}.`,
        });
      }
      return { bon: manques.length === 0 && enTrop.length === 0, details };
    }
    if (q.type === 'ordre') {
      const bon = choisis.length === q.bonne.length && choisis.every((m, i) => m === q.bonne[i]);
      return { bon, details: [] };
    }
    // La phrase libre: on vérifie ce qui est vérifiable, sans jamais l'écrire
    // à sa place.
    const t = texte.trim();
    const faits = {
      mots: q.motsObligatoires.every((m) => norm(t).includes(norm(m))),
      majuscule: /^[A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ]/.test(t),
      point: /[.!?]$/.test(t),
      // « La renarde est méchante. » fait quatre mots et c'est une phrase
      // complète. Exiger cinq mots refusait une bonne réponse — le genre de
      // faux « non » qui le décourage pour rien.
      longueur: t.split(/\s+/).filter(Boolean).length >= 4,
    };
    return {
      bon: Object.values(faits).every(Boolean),
      details: q.verifications.map((v) => ({ ton: faits[v.id] ? 'ok' : 'ko', texte: v.label })),
      faits,
    };
  }

  function verifier() {
    const r = corriger();
    setVerifie(r);
    // « Réessayer » repasse par ici: on REMPLACE le résultat de cette question
    // au lieu d'en ajouter un deuxième, sinon le total final dépasse le nombre
    // de questions (et le serveur reçoit des réponses fantômes).
    setResultats((xs) => {
      const sansCelleCi = xs.filter((x) => x.id !== q.id);
      return [...sansCelleCi, { id: q.id, numero: q.numero, correct: r.bon }];
    });
    speak(r.bon ? 'Oui, c\'est ça!' : 'Presque. Regarde bien.');
  }

  function suivant() {
    if (idx + 1 < f.questions.length) return setIdx(idx + 1);
    // Fin: on enregistre, avec le détail par question (le tuteur en a besoin).
    const bonnes = resultats.filter((r) => r.correct).length;
    saveSession('feuille_l2', resultats.length, bonnes,
      resultats.map((r) => ({ category: 'feuille_orthographe', type: 'q' + r.numero, correct: r.correct })));
    notifySessionResult({
      profile: localStorage.getItem('sb_profile') || 'ryan',
      mode: `feuille Liste ${f.numero}`, correct: bonnes, total: resultats.length, streak: 0, results: [],
    });
    setFini(true);
  }

  const peutVerifier = q && (
    q.type === 'phrase' ? texte.trim().length > 0
      : q.type === 'ordre' ? choisis.length === q.bonne.length
        : choisis.length > 0
  );

  // ===== Écran final =====
  if (fini) {
    const bonnes = resultats.filter((r) => r.correct).length;
    const ratees = resultats.filter((r) => !r.correct);
    return (
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-10 text-center">
        <div className="text-6xl mb-3">{bonnes === resultats.length ? '🏆' : '💪'}</div>
        <h2 className="font-heading text-3xl font-extrabold text-stone mb-2">
          Feuille terminée!
        </h2>
        <p className="text-stone font-semibold mb-5">{bonnes} / {resultats.length}</p>
        {ratees.length > 0 && (
          <div className="bg-white border-2 border-s1 rounded-2xl p-4 mb-5 text-left">
            <p className="text-xs font-extrabold text-s4 uppercase mb-2">À revoir avant de la remettre</p>
            <p className="text-sm font-semibold text-stone">
              Question{ratees.length > 1 ? 's' : ''} {[...new Set(ratees.map((r) => r.numero))].join(', ')}.
              Recommence la feuille: les mots restent, c'est le tri qui s'apprend.
            </p>
          </div>
        )}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-5 text-left">
          <p className="text-sm font-bold text-fox-d">
            📌 Maintenant, recopie tes réponses sur ta vraie feuille — c'est elle qu'il faut remettre.
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={() => { setIdx(0); setResultats([]); setFini(false); setListeOuverte(true); }}
            className="w-full min-h-[52px] rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            🔁 Refaire la feuille
          </button>
          <button onClick={onFinish || onHome}
            className="w-full min-h-[52px] rounded-xl font-bold text-s6 bg-white border-2 border-s2">
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  // ===== La page du cahier, avant de commencer =====
  if (listeOuverte) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-10">
        <button onClick={onHome} className="min-h-[44px] -ml-2 px-2 text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <div className="flex items-baseline gap-2 flex-wrap mt-1 mb-1">
          <span className="text-xs font-extrabold bg-stone text-white rounded-md px-2 py-1">LISTE {f.numero}</span>
          <span className="font-heading text-lg font-extrabold text-stone leading-tight">{f.titre}</span>
        </div>
        <p className="text-xs font-bold text-s4 mb-3">{f.verbes}</p>
        <BoiteDeMots />
        <p className="text-xs font-semibold text-s5 mt-3 leading-relaxed">
          👀 Regarde bien: le mot au féminin fait <b>entendre</b> la lettre muette.
          court → cour<b className="text-lava">t</b>e
        </p>
        <button onClick={() => setListeOuverte(false)}
          className="w-full mt-5 min-h-[56px] rounded-2xl font-heading text-lg font-extrabold text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          J'ai regardé — on commence! →
        </button>
      </div>
    );
  }

  // ===== Une question =====
  const toggle = (mot) => {
    if (verifie) return;
    if (q.type === 'un_choix') return setChoisis([mot]);
    if (q.type === 'ordre') {
      return setChoisis((xs) => (xs.includes(mot) ? xs.filter((x) => x !== mot) : [...xs, mot]));
    }
    setChoisis((xs) => (xs.includes(mot) ? xs.filter((x) => x !== mot) : [...xs, mot]));
  };

  const etatDuChoix = (mot) => {
    if (!verifie) return choisis.includes(mot) ? 'choisi' : 'neutre';
    const estBon = q.type === 'un_choix' ? mot === q.bonne : (q.bonnes || []).includes(mot);
    if (estBon) return 'bon';
    return choisis.includes(mot) ? 'mauvais' : 'neutre';
  };

  const classesChoix = {
    neutre: 'bg-white border-s2 text-stone',
    choisi: 'bg-orange-50 border-fox text-fox-d',
    bon: 'bg-green-50 border-green-500 text-green-800',
    mauvais: 'bg-red-50 border-red-400 text-red-700 line-through',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-10">
      <div className="flex items-center justify-between gap-2 mb-3">
        <button onClick={onHome} className="min-h-[44px] -ml-2 px-2 text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone text-sm truncate">Ma feuille · Liste {f.numero}</h2>
        <button onClick={() => setListeOuverte(true)}
          className="min-h-[44px] text-xs font-bold text-lava bg-orange-50 border-2 border-orange-200 rounded-xl px-3">
          📋 La liste
        </button>
      </div>

      <div className="w-full bg-s1 rounded-full h-2 mb-4 overflow-hidden">
        <div className="h-2 transition-all" style={{ width: `${(idx / f.questions.length) * 100}%`, background: '#c74a15' }} />
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-s1 border-l-4 border-l-lava">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-extrabold bg-stone text-white rounded-md px-2 py-0.5">{q.numero}</span>
          {q.sousTitre && <span className="text-xs font-bold text-s4">{q.sousTitre}</span>}
        </div>
        <p className="text-base sm:text-lg font-bold text-stone leading-snug mb-1 whitespace-pre-line">{q.consigne}</p>
        {q.aide && !verifie && <p className="text-xs font-semibold text-s4 mb-3">💡 {q.aide}</p>}
        {q.image && (
          <img src={q.image} alt={q.imageAlt || ''} className="w-28 h-28 object-cover rounded-xl my-2" />
        )}

        {q.type === 'choix_multiple' && (
          <p className="text-[11px] font-bold text-fox-d uppercase tracking-wide mb-2">
            Touche TOUS les bons mots
          </p>
        )}

        {q.type !== 'phrase' && (
          <div className="flex flex-wrap gap-2 mb-3">
            {q.choix.map((mot) => {
              const rang = q.type === 'ordre' ? choisis.indexOf(mot) : -1;
              return (
                <button key={mot} onClick={() => toggle(mot)} disabled={!!verifie}
                  className={`min-h-[48px] px-4 rounded-xl border-2 font-bold text-base transition-all ${classesChoix[etatDuChoix(mot)]}`}>
                  {rang >= 0 && <span className="text-xs font-extrabold mr-1.5">{rang + 1}.</span>}
                  {mot}
                </button>
              );
            })}
          </div>
        )}

        {q.type === 'ordre' && !verifie && (
          <p className="text-xs font-semibold text-s4 mb-3">
            Touche-les dans le bon ordre. {choisis.length}/{q.bonne.length} choisis.
            {choisis.length > 0 && (
              <button onClick={() => setChoisis([])} className="ml-2 font-bold text-lava underline">recommencer</button>
            )}
          </p>
        )}

        {q.type === 'phrase' && (
          <>
            <div className="flex gap-2 mb-2">
              {q.motsObligatoires.map((m) => (
                <span key={m} className="text-sm font-extrabold bg-orange-50 text-fox-d border-2 border-orange-200 rounded-lg px-2.5 py-1">{m}</span>
              ))}
            </div>
            <textarea ref={inputRef} value={texte} onChange={(e) => setTexte(e.target.value)}
              disabled={!!verifie} rows={3} placeholder="Écris ta phrase ici…"
              className="w-full px-3 py-3 rounded-xl border-2 border-s2 text-base font-semibold text-stone focus:outline-none focus:border-lava" />
          </>
        )}

        {verifie && (
          <div className={`mt-3 rounded-xl p-3 border-2 ${verifie.bon ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-300'}`}>
            <p className={`font-heading font-extrabold mb-1 ${verifie.bon ? 'text-green-800' : 'text-fox-d'}`}>
              {verifie.bon ? '✓ Oui, c\'est ça!' : '🔁 Presque — regarde:'}
            </p>
            {q.explication && <p className="text-sm font-semibold text-stone whitespace-pre-line">{q.explication}</p>}
            {verifie.details.length > 0 && (
              <ul className="mt-1.5 space-y-1">
                {verifie.details.map((d, i) => (
                  <li key={i} className={`text-sm font-semibold ${
                    d.ton === 'ko' ? 'text-red-700' : d.ton === 'manque' ? 'text-fox-d' : 'text-green-800'
                  }`}>
                    {d.ton === 'ko' ? '✗' : d.ton === 'manque' ? '➕' : '✓'} {d.texte}
                  </li>
                ))}
              </ul>
            )}
            {q.type === 'phrase' && !verifie.bon && (
              <p className="text-xs font-semibold text-s5 mt-2">
                C'est TA phrase: corrige-la toi-même, je ne l'écris pas à ta place.
              </p>
            )}
          </div>
        )}

        {!verifie ? (
          <button onClick={verifier} disabled={!peutVerifier}
            className="w-full mt-3 min-h-[52px] rounded-xl font-bold text-white text-lg disabled:opacity-40"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            ✓ Vérifier
          </button>
        ) : (
          <div className="flex gap-2 mt-3">
            {!verifie.bon && (
              <button onClick={() => { setVerifie(null); setChoisis([]); }}
                className="flex-1 min-h-[52px] rounded-xl font-bold text-fox-d bg-white border-2 border-orange-300">
                🔁 Réessayer
              </button>
            )}
            <button onClick={suivant}
              className="flex-1 min-h-[52px] rounded-xl font-bold text-white text-lg"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              {idx + 1 < f.questions.length ? 'Suivant →' : 'Terminer 🏆'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
