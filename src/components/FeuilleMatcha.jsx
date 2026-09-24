import React, { useState, useEffect, useRef } from 'react';
import { FEUILLE_MATCHA, NOMS_BLOCS } from '../data/feuilleMatcha';
import { BlocsBase10, Abaque } from './Numeration';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { notifySessionResult } from '../utils/notifications';

// « Ma feuille de maths » — Matcha AS.1.02 à l'écran.
//
// Il a fait 4/13 sur le papier pendant que l'app lui donnait 88 % sur le même
// sujet. L'écart n'est pas lui: l'app lui proposait quatre réponses à choisir
// là où la feuille demande d'ÉCRIRE, et ne lui a jamais demandé d'échanger
// dix plaques contre un millier. Ici, rien à choisir: il pose les chiffres
// colonne par colonne, et il échange les blocs avec ses doigts.

const fmt = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// ===== Le tableau de numération, en cases à remplir =====
// C'est la pièce qui règle « mille six cent quinze → 16160 »: on n'écrit plus
// le nombre d'un trait, on le pose une colonne à la fois. Une colonne qu'on
// n'entend pas reste vide sous ses yeux, et réclame son zéro.
function CasesUCDU({ valeur, cases, setCases, fige, montrerReponse }) {
  // Autant de cases que le nombre a de chiffres — ni plus, ni moins.
  // Un nombre à 3 chiffres dans 4 cases obligeait à taper un zéro de tête qui
  // n'existe sur aucune feuille (et « Vérifier » ne s'allumait jamais).
  // Les zéros qu'on veut lui faire voir sont ceux du MILIEU et de la fin:
  // 3 080 garde ses quatre cases, et la colonne c réclame son 0.
  const TOUTES = ['um', 'c', 'd', 'u'];
  const chiffresDuNombre = String(valeur).split('');
  const colonnes = TOUTES.slice(TOUTES.length - chiffresDuNombre.length);
  const attendu = chiffresDuNombre;
  const refs = useRef([]);
  const couleurs = {
    um: 'bg-blue-50 text-blue-800', c: 'bg-green-50 text-green-800',
    d: 'bg-orange-50 text-orange-800', u: 'bg-yellow-50 text-yellow-800',
  };

  function taper(i, v) {
    const chiffre = v.replace(/\D/g, '').slice(-1);
    const suivant = [...cases];
    suivant[i] = chiffre;
    setCases(suivant);
    if (chiffre && i + 1 < colonnes.length) refs.current[i + 1]?.focus();
  }

  return (
    <div className="flex justify-center gap-2 my-4">
      {colonnes.map((col, i) => {
        const bon = montrerReponse && cases[i] === attendu[i];
        const mauvais = montrerReponse && cases[i] !== attendu[i];
        return (
          <div key={col} className="text-center">
            <div className={`text-xs font-extrabold rounded-t-lg px-3 py-1 ${couleurs[col]}`}>{col}</div>
            <input
              ref={(el) => { refs.current[i] = el; }}
              value={cases[i] || ''}
              onChange={(e) => taper(i, e.target.value)}
              disabled={fige}
              inputMode="numeric"
              className={`w-14 h-16 text-center font-heading text-3xl font-extrabold border-2 rounded-b-lg focus:outline-none ${
                bon ? 'bg-green-50 border-green-500 text-green-700'
                  : mauvais ? 'bg-red-50 border-red-400 text-red-600'
                    : 'bg-white border-s2 text-stone focus:border-lava'
              }`}
            />
            {mauvais && <div className="text-sm font-extrabold text-green-700 mt-1">{attendu[i]}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ===== L'échange — le cœur de la feuille =====
// Dix plaques, pour lui, c'est « dix ». Le bouton ne donne pas la réponse: il
// fait le geste du cahier, et le nombre de blocs À L'ÉCRAN change sous ses
// yeux. Tant qu'une colonne a 10 pièces ou plus, on ne peut pas écrire.
function Echange({ depart, onPret, fige }) {
  const [b, setB] = useState(depart);
  const [echanges, setEchanges] = useState(0);
  useEffect(() => { setB(depart); setEchanges(0); }, [depart]);

  const paliers = [
    { de: 'u', vers: 'd' }, { de: 'd', vers: 'c' }, { de: 'c', vers: 'um' },
  ].filter((p) => b[p.de] >= 10);

  function echanger(p) {
    setB((x) => ({ ...x, [p.de]: x[p.de] - 10, [p.vers]: x[p.vers] + 1 }));
    setEchanges((n) => n + 1);
    speak('On échange!');
  }

  const pret = paliers.length === 0;
  // On annonce les DEUX états. Avant, on n'annonçait que « prêt », et
  // l'effet du parent (qui remet tout à zéro au changement de question)
  // passait APRÈS celui de l'enfant: il effaçait aussitôt l'annonce, les
  // cases ne s'affichaient jamais et la question 4 était impossible.
  useEffect(() => { onPret(pret ? b : null); }, [pret, b.um, b.c, b.d, b.u]);

  return (
    <div>
      <BlocsBase10 um={b.um} c={b.c} d={b.d} u={b.u} />
      {!pret ? (
        <>
          <p className="text-sm font-bold text-fox-d mb-2">
            ⚠️ Une colonne a 10 pièces ou plus. On ne peut pas encore écrire le nombre —
            il faut échanger.
          </p>
          <div className="space-y-2">
            {paliers.map((p) => (
              <button key={p.de} onClick={() => echanger(p)} disabled={fige}
                className="w-full min-h-[56px] rounded-xl font-bold text-white text-base px-3"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                🔁 Échanger 10 {NOMS_BLOCS[p.de].plusieurs} contre 1 {NOMS_BLOCS[p.vers].un}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm font-bold text-green-800 mb-1">
          ✓ Plus aucune colonne n'a 10 pièces{echanges > 0 ? ` (${echanges} échange${echanges > 1 ? 's' : ''})` : ''}.
          Maintenant tu peux lire le nombre.
        </p>
      )}
    </div>
  );
}

// ===== Compter par paquets de 10 =====
function TasDeGraines({ total }) {
  const rangees = Math.floor(total / 10);
  const reste = total % 10;
  const graine = (k) => (
    <span key={k} className="inline-block w-3.5 h-5 rounded-full mx-[2px]"
      style={{ background: '#4a3c2a', transform: `rotate(${(k * 37) % 40 - 20}deg)` }} />
  );
  return (
    <div className="bg-white rounded-xl border-2 border-s1 p-3 mb-3">
      {Array.from({ length: rangees }).map((_, r) => (
        <div key={r} className="flex items-center gap-2 mb-1">
          <span className="text-xs font-extrabold text-s4 w-10 text-right">{(r + 1) * 10}</span>
          <span className="rounded-lg px-1.5 py-1" style={{ background: '#fdf1e0' }}>
            {Array.from({ length: 10 }).map((_, k) => graine(r * 10 + k))}
          </span>
        </div>
      ))}
      {reste > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-s4 w-10 text-right">+{reste}</span>
          <span>{Array.from({ length: reste }).map((_, k) => graine(1000 + k))}</span>
        </div>
      )}
    </div>
  );
}

export default function FeuilleMatcha({ onHome, onFinish }) {
  const f = FEUILLE_MATCHA;
  const [idx, setIdx] = useState(0);
  const [cases, setCases] = useState([]);
  const [choix, setChoix] = useState(null);
  const [etapesFaites, setEtapesFaites] = useState([]);
  const [blocsPrets, setBlocsPrets] = useState(null);
  const [verifie, setVerifie] = useState(null);
  const [resultats, setResultats] = useState([]);
  const [fini, setFini] = useState(false);

  const q = f.questions[idx];

  useEffect(() => {
    setCases([]); setChoix(null); setEtapesFaites([]); setVerifie(null);
  }, [idx]);

  const valeurAttendue = q?.type === 'deux_etapes'
    ? q.depart + q.etapes.reduce((s, e) => s + e.valeur, 0)
    : q?.valeur;

  const nbColonnes = String(valeurAttendue ?? '').length;
  const saisie = cases.join('');

  function verifier() {
    let bon = false;
    if (q.type === 'deux_etapes') bon = choix === valeurAttendue;
    else bon = saisie.length === nbColonnes && Number(saisie) === valeurAttendue;
    setVerifie({ bon });
    setResultats((xs) => [...xs.filter((x) => x.id !== q.id), { id: q.id, numero: q.numero, correct: bon }]);
    speak(bon ? 'Oui! C\'est exactement ça.' : 'Presque. Regarde les colonnes.');
  }

  function suivant() {
    if (idx + 1 < f.questions.length) return setIdx(idx + 1);
    const bonnes = resultats.filter((r) => r.correct).length;
    saveSession('feuille_matcha_as102', resultats.length, bonnes,
      resultats.map((r) => ({ category: 'matcha_nombres', type: 'as102_q' + r.numero, correct: r.correct })));
    notifySessionResult({
      profile: localStorage.getItem('sb_profile') || 'ryan',
      mode: 'feuille Matcha AS.1.02', correct: bonnes, total: resultats.length, streak: 0, results: [],
    });
    setFini(true);
  }

  const peutVerifier = q && (
    q.type === 'deux_etapes'
      ? choix !== null && etapesFaites.length === q.etapes.length
      : q.type === 'echange'
        ? blocsPrets && saisie.length === nbColonnes
        : saisie.length === nbColonnes
  );

  if (fini) {
    const bonnes = resultats.filter((r) => r.correct).length;
    return (
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-10 text-center">
        <div className="text-6xl mb-3">{bonnes === resultats.length ? '🏆' : '💪'}</div>
        <h2 className="font-heading text-3xl font-extrabold text-stone mb-2">Feuille de maths terminée!</h2>
        <p className="text-stone font-semibold mb-5">{bonnes} / {resultats.length}</p>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-5 text-left">
          <p className="text-sm font-bold text-fox-d">
            🔁 Le truc à retenir: dès qu'une colonne a 10 pièces, on échange.
            10 petits cubes = 1 bâtonnet · 10 bâtonnets = 1 plaque · 10 plaques = 1 gros cube.
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={() => { setIdx(0); setResultats([]); setFini(false); }}
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

  if (!q) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-10">
      <div className="flex items-center justify-between gap-2 mb-3">
        <button onClick={onHome} className="min-h-[44px] -ml-2 px-2 text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone text-sm truncate">Ma feuille de maths · {f.code}</h2>
        <span className="text-xs font-bold text-s4">{idx + 1}/{f.questions.length}</span>
      </div>

      <div className="w-full bg-s1 rounded-full h-2 mb-4 overflow-hidden">
        <div className="h-2 transition-all" style={{ width: `${(idx / f.questions.length) * 100}%`, background: '#c74a15' }} />
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-s1 border-l-4 border-l-lava">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-extrabold bg-stone text-white rounded-md px-2 py-0.5">{q.numero}</span>
          {q.sousTitre && <span className="text-xs font-bold text-s4">{q.sousTitre}</span>}
        </div>

        {q.type === 'ecrire' && (
          <>
            <p className="text-base font-bold text-stone mb-1">Écris ce nombre en chiffres:</p>
            <p className="font-heading text-2xl font-extrabold text-lava mb-1">« {q.mots} »</p>
            <p className="text-xs font-semibold text-s4">Pose-le colonne par colonne. Une colonne qu'on n'entend pas prend un <b>0</b>.</p>
          </>
        )}

        {q.type === 'compter_dizaines' && (
          <>
            <p className="text-base font-bold text-stone mb-1">{q.consigne}</p>
            <p className="text-xs font-semibold text-s4 mb-2">💡 {q.aide}</p>
            <TasDeGraines total={q.total} />
          </>
        )}

        {q.type === 'lire_abaque' && (
          <>
            <p className="text-base font-bold text-stone mb-2">Quel nombre est représenté sur l'abaque?</p>
            <Abaque {...{
              um: Math.floor(q.valeur / 1000), c: Math.floor(q.valeur / 100) % 10,
              d: Math.floor(q.valeur / 10) % 10, u: q.valeur % 10,
            }} />
          </>
        )}

        {q.type === 'echange' && (
          <>
            <p className="text-base font-bold text-stone mb-2">Quel nombre est représenté?</p>
            <Echange key={q.id} depart={q.depart} fige={!!verifie} onPret={setBlocsPrets} />
          </>
        )}

        {q.type === 'deux_etapes' && (
          <>
            <p className="text-sm font-semibold text-s5 mb-2">{q.histoire}</p>
            <p className="text-base font-bold text-stone mb-1">
              Ajoute {q.etapes.map((e) => e.mot).join(' ET ')} au nombre {fmt(q.depart)}.
            </p>
            <p className="text-xs font-extrabold text-fox-d uppercase mb-2">
              ⚠️ Il y a DEUX choses à ajouter. Coche-les une par une.
            </p>
            <div className="space-y-2 mb-3">
              {q.etapes.map((e, i) => {
                const fait = etapesFaites.includes(i);
                const cumul = q.depart + q.etapes.filter((_, j) => etapesFaites.includes(j) || j === i)
                  .reduce((s, x) => s + x.valeur, 0);
                return (
                  <button key={i} onClick={() => !verifie && setEtapesFaites((xs) => (xs.includes(i) ? xs.filter((x) => x !== i) : [...xs, i]))}
                    className={`w-full min-h-[52px] rounded-xl border-2 font-bold text-left px-4 ${
                      fait ? 'bg-green-50 border-green-500 text-green-800' : 'bg-white border-s2 text-stone'
                    }`}>
                    {fait ? '✓' : '☐'} Ajouter {e.mot} ( + {fmt(e.valeur)} )
                    {fait && <span className="block text-xs font-semibold">→ ça fait {fmt(cumul)}</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-sm font-bold text-stone mb-1">Entoure le bon sac:</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {q.sacs.map((s) => (
                <button key={s} onClick={() => !verifie && setChoix(s)}
                  className={`min-h-[56px] px-5 rounded-xl border-2 font-heading text-lg font-extrabold ${
                    verifie
                      ? (s === valeurAttendue ? 'bg-green-50 border-green-500 text-green-800'
                        : choix === s ? 'bg-red-50 border-red-400 text-red-600 line-through' : 'bg-white border-s2 text-stone')
                      : choix === s ? 'bg-orange-50 border-fox text-fox-d' : 'bg-white border-s2 text-stone'
                  }`}>
                  🎒 {fmt(s)}
                </button>
              ))}
            </div>
          </>
        )}

        {q.type !== 'deux_etapes' && (q.type !== 'echange' || blocsPrets) && (
          <CasesUCDU valeur={valeurAttendue} cases={cases} setCases={setCases}
            fige={!!verifie} montrerReponse={!!verifie} />
        )}

        {verifie && (
          <div className={`rounded-xl p-3 border-2 ${verifie.bon ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-300'}`}>
            <p className={`font-heading font-extrabold mb-1 ${verifie.bon ? 'text-green-800' : 'text-fox-d'}`}>
              {verifie.bon ? '✓ Oui! C\'est exactement ça.' : `🔁 La réponse est ${fmt(valeurAttendue)}`}
            </p>
            {q.piege && <p className="text-sm font-semibold text-stone">{q.piege}</p>}
            {q.type === 'echange' && (
              <p className="text-sm font-semibold text-stone">
                Après les échanges: {fmt(valeurAttendue)}. Dix pièces dans une colonne valent
                toujours UNE pièce de la colonne d'à côté.
              </p>
            )}
            {q.type === 'deux_etapes' && (
              <p className="text-sm font-semibold text-stone">
                {fmt(q.depart)} + {fmt(q.etapes[0].valeur)} = {fmt(q.depart + q.etapes[0].valeur)},
                puis + {fmt(q.etapes[1].valeur)} = {fmt(valeurAttendue)}.
                {' '}{fmt(q.depart + q.etapes[0].valeur)}, c'est la réponse si on oublie les {q.etapes[1].mot}.
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
              <button onClick={() => { setVerifie(null); setCases([]); setChoix(null); }}
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
