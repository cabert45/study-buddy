import React, { useState, useRef, useEffect } from 'react';
import { speakAndWait, stopSpeech } from '../utils/speech';
import { ecouterUnTour } from '../utils/micro';
import { saveSession } from '../utils/storage';
import { LECTURES, texteDe, voixDe, corrigerLecture } from '../data/lectures';
import ChasseMarqueurs from './ChasseMarqueurs';
import { IconVoix, IconMicro, IconRepete, IconCoche, IconFleche, IconPause } from './Icones';

// « Écoute, puis lis » — comme Boukili (le parent, 22 nov. 2026):
// « make the app read it so that he really understands how to read it, so
// that he can mimic how the reading is done… then he can repeat it himself,
// and then he can answer the questions. Can we register his voice and grade it? »
//
// Trois étapes:
//   1. J'ÉCOUTE — toute l'histoire, phrase par phrase, la phrase lue en
//      surbrillance pour suivre des yeux. On peut toucher une phrase pour
//      la réentendre.
//   2. JE LIS — un paragraphe à la fois: écouter le modèle, puis lire au micro.
//      L'app compare ce qu'elle a entendu au texte: mots lus en vert, mots
//      sautés en rouge, et le nombre de mots par minute. L'audio n'est pas
//      gardé (il vit le temps d'une requête, voir utils/micro).
//   3. LES QUESTIONS — l'exercice de compréhension.
//
// Ce que la correction ne voit pas: l'intonation, et une petite faute de
// prononciation que la transcription répare toute seule. Elle voit les mots
// sautés, remplacés, et la vitesse.

export default function LectureHaute({ id = 'monstre_du_lac', morceau: morceauInitial = 0, onHome, onStartPractice }) {
  const L = LECTURES[id];
  // Un morceau à la fois (0 = toute l'histoire). Les indices de paragraphes
  // restent ceux du texte entier: les scores et la voix s'y retrouvent.
  const [morceau, setMorceau] = useState(Number(morceauInitial) || 0);
  const M = morceau && L && L.morceaux ? L.morceaux[morceau - 1] : null;
  const indices = L ? (M ? Array.from({ length: M.a - M.de + 1 }, (_, i) => M.de + i) : L.paragraphes.map((_, i) => i)) : [];
  const modeQuestions = L ? (M ? `${L.questions}:${morceau}` : L.questions) : '';
  const [etape, setEtape] = useState('ecoute'); // ecoute | lis | chasse | fin
  const [lecture, setLecture] = useState(null); // [p, s] en cours de lecture
  const [enLecture, setEnLecture] = useState(false);
  // Pause (le parent, 22 nov.): on garde la suite à partir de la phrase en
  // cours, et « Reprendre » repart de cette phrase-là.
  const [pausee, setPausee] = useState(null);
  const suiteRef = useRef({ suite: [], i: 0 });
  const [para, setPara] = useState(indices[0] || 0);
  const [micro, setMicro] = useState('repos'); // repos | ouvert | transcrit
  const [niveau, setNiveau] = useState(0);
  const [resultat, setResultat] = useState(null);
  const [message, setMessage] = useState('');
  const [scores, setScores] = useState({}); // para → meilleur résultat
  const arreter = useRef(null);
  const seq = useRef(0);

  useEffect(() => () => { seq.current++; stopSpeech(); arreter.current && arreter.current(); }, []);

  if (!L) return null;

  // Lire une suite de phrases: [[p, s], …]
  const lire = async (suite) => {
    stopSpeech();
    const moi = ++seq.current;
    setEnLecture(true);
    setPausee(null);
    suiteRef.current = { suite, i: 0 };
    for (let k = 0; k < suite.length; k++) {
      const [p, s] = suite[k];
      if (seq.current !== moi) return;
      suiteRef.current.i = k;
      setLecture([p, s]);
      await speakAndWait(voixDe(L.paragraphes[p][s]), { rate: 0.85 });
    }
    if (seq.current === moi) { setLecture(null); setEnLecture(false); }
  };
  const tout = () => indices.flatMap((p) => L.paragraphes[p].map((_, s) => [p, s]));
  const unPara = (p) => L.paragraphes[p].map((_, s) => [p, s]);
  const couper = () => { seq.current++; stopSpeech(); setLecture(null); setEnLecture(false); setPausee(null); };
  const mettreEnPause = () => {
    const { suite, i } = suiteRef.current;
    const reste = suite.slice(i);
    seq.current++; stopSpeech(); setEnLecture(false);
    setPausee(reste.length ? reste : null);
  };
  // Les boutons de la voix: lire / pause / reprendre / arrêter.
  const Controles = ({ suite, label }) => (enLecture ? (
    <>
      <button onClick={mettreEnPause} className={`${bouton} bg-white !text-fox-d border-2 border-orange-200`}><IconPause size={20} /> Pause</button>
      <button onClick={couper} className={`${bouton} bg-stone`}>■ Arrêter</button>
    </>
  ) : pausee ? (
    <>
      <button onClick={() => lire(pausee)} className={bouton} style={orange}><IconVoix size={22} /> Reprendre</button>
      <button onClick={() => lire(suite)} className={`${bouton} bg-white !text-fox-d border-2 border-orange-200`}><IconRepete size={20} /> Recommencer</button>
    </>
  ) : (
    <button onClick={() => lire(suite)} className={`${bouton} ${label.includes('abord') ? 'bg-white !text-fox-d border-2 border-orange-200' : ''}`} style={label.includes('abord') ? undefined : orange}>
      <IconVoix size={22} /> {label}
    </button>
  ));

  const lireAuMicro = async () => {
    couper();
    setResultat(null);
    setMessage('');
    const nbMots = L.paragraphes[para].map(texteDe).join(' ').split(/\s+/).length;
    let debut = 0;
    const r = await ecouterUnTour({
      maxMs: Math.min(120000, 6000 + nbMots * 1500),
      onNiveau: setNiveau,
      onOuvert: () => { debut = Date.now(); setMicro('ouvert'); },
      onArret: (f) => { arreter.current = f; },
      onTranscrit: () => setMicro('transcrit'),
    });
    const duree = debut ? (Date.now() - debut) / 1000 : 0;
    arreter.current = null;
    setMicro('repos');
    if (r.refuse) return setMessage("Le micro n'est pas permis. Demande à papa ou maman d'autoriser le micro.");
    if (r.silence || r.invente || r.vide) return setMessage("Je ne t'ai pas entendu. Approche-toi du micro et lis bien fort. On réessaie!");
    if (!r.texte) return setMessage("Oups, l'écoute n'a pas marché. Réessaie.");
    const c = corrigerLecture(L.paragraphes[para], r.texte);
    const mpm = duree > 2 ? Math.round((c.nbOk / duree) * 60) : null;
    const res = { ...c, mpm, entendu: r.texte };
    setResultat(res);
    setScores((s) => (!s[para] || s[para].pct <= res.pct ? { ...s, [para]: res } : s));
  };

  const suivant = () => {
    setResultat(null); setMessage('');
    const j = indices.indexOf(para);
    if (j + 1 < indices.length) setPara(indices[j + 1]);
    else terminer();
  };

  const terminer = () => {
    couper();
    const liste = Object.values(scores);
    const total = liste.reduce((a, r) => a + r.total, 0);
    const ok = liste.reduce((a, r) => a + r.nbOk, 0);
    if (total) {
      saveSession(`lecture_haute:${id}${morceau ? `:${morceau}` : ''}`, total, ok, [{ category: 'lecture_haute', correct: ok / total >= 0.9 }]).catch(() => {});
    }
    setEtape('fin');
  };

  const Onglet = ({ k, n, label }) => (
    <button onClick={() => { couper(); setEtape(k); }}
      className={`flex-1 py-2.5 rounded-xl font-heading font-extrabold text-sm border-2 ${etape === k ? 'bg-lava text-white border-lava' : 'bg-white text-stone border-s2'}`}>
      {n}. {label}
    </button>
  );

  const bouton = 'rounded-2xl px-5 py-3.5 font-heading text-base font-extrabold text-white shadow-sm active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2';
  const orange = { background: 'linear-gradient(90deg, #c74a15, #e8622a)' };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
      <button onClick={() => { couper(); onHome(); }} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
      <h2 className="font-heading text-2xl font-extrabold text-stone mt-2">{L.titre}{M ? ` — ${M.titre}` : ''}</h2>
      <p className="text-xs font-bold text-s4 mb-3">{L.source}{M ? ` · lignes ${M.lignes}` : ''}</p>
      {L.morceaux && (
        <div className="flex gap-1.5 mb-4 flex-wrap items-center">
          <span className="text-xs font-extrabold text-s4 uppercase tracking-wide mr-1">Morceau</span>
          {[...L.morceaux.map((_, i) => i + 1), 0].map((n) => (
            <button key={n} onClick={() => { couper(); setMorceau(n); setEtape('ecoute'); setResultat(null); setMessage('');
              const m2 = n ? L.morceaux[n - 1] : null; setPara(m2 ? m2.de : 0); }}
              className={`px-3 py-1 rounded-full text-sm font-extrabold border-2 ${morceau === n ? 'bg-stone text-white border-stone' : 'bg-white text-stone border-s2'}`}>
              {n ? n : 'Tout'}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-5">
        <Onglet k="ecoute" n={1} label="J'écoute" />
        <Onglet k="lis" n={2} label="Je lis" />
        <Onglet k="chasse" n={3} label="Marqueurs" />
        <button onClick={() => { couper(); onStartPractice(modeQuestions); }}
          className="flex-1 py-2.5 rounded-xl font-heading font-extrabold text-sm border-2 bg-white text-stone border-s2">
          4. Questions
        </button>
      </div>

      {etape === 'ecoute' && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <Controles suite={tout()} label="Écouter toute l'histoire" />
          </div>
          {(morceau === 1 || morceau === 0) && (
            <div className="rounded-2xl bg-orange-50 border-2 border-orange-200 p-3 mb-3">
              <p className="font-heading font-extrabold text-fox-d">Avant de lire: devine!</p>
              <p className="text-sm font-semibold text-stone">Regarde le titre et l'image du cahier. Un monstre dans un lac… Qu'est-ce qui va arriver, d'après toi? Dis-le à voix haute, puis écoute pour savoir si tu avais raison.</p>
            </div>
          )}
          {morceau > 1 && (
            <div className="rounded-2xl bg-orange-50 border-2 border-orange-200 p-3 mb-3">
              <p className="font-heading font-extrabold text-fox-d">Hier, dans l'histoire…</p>
              <p className="text-sm font-semibold text-stone">{morceau === 2 ? "Léo, le grand-père, raconte aux enfants qu'il dormait dans un vieux camp de bûcherons quand il était petit. Qu'est-ce qui va lui arriver une nuit?" : "Une nuit, Léo a vu une étrange créature dans le lac. Ses parents l'ont vue aussi. Qu'est-ce qu'ils vont découvrir?"}</p>
            </div>
          )}
          <p className="text-sm font-semibold text-s4 mb-3">Suis avec ton doigt la phrase en jaune. Écoute comment on fait les pauses aux virgules et aux points, et la voix qui change quand un personnage parle. Touche une phrase pour la réentendre.</p>
          <div className="bg-white border-2 border-s1 rounded-3xl p-4 sm:p-6 space-y-3">
            {indices.map((p) => [L.paragraphes[p], p]).map(([ph, p]) => (
              <React.Fragment key={p}>
              {L.images && L.images[p] && (
                <img src={L.images[p].src} alt={L.images[p].alt} loading="lazy" className="w-full max-w-md mx-auto rounded-2xl my-2" />
              )}
              <p className="text-lg leading-relaxed text-stone">
                {ph.map((s, i) => (
                  <span key={i} onClick={() => lire([[p, i]])}
                    className={`cursor-pointer rounded px-0.5 ${lecture && lecture[0] === p && lecture[1] === i ? 'bg-yellow-200' : 'hover:bg-orange-50'}`}>
                    {texteDe(s)}{' '}
                  </span>
                ))}
              </p>
              </React.Fragment>
            ))}
          </div>
          <button onClick={() => { couper(); setEtape('lis'); }} className={`${bouton} mt-5 w-full`} style={orange}>
            À moi de lire <IconFleche size={20} />
          </button>
        </>
      )}

      {etape === 'lis' && (
        <>
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {indices.map((p) => (
              <button key={p} onClick={() => { couper(); setPara(p); setResultat(null); setMessage(''); }}
                className={`w-7 h-7 rounded-full text-xs font-extrabold border-2 ${p === para ? 'border-lava text-lava bg-white' : scores[p] ? (scores[p].pct >= 90 ? 'bg-green-500 border-green-500 text-white' : 'bg-amber-400 border-amber-400 text-white') : 'bg-white border-s2 text-s4'}`}>
                {p + 1}
              </button>
            ))}
          </div>

          {L.images && L.images[para] && (
            <img src={L.images[para].src} alt={L.images[para].alt} loading="lazy" className="w-full max-w-sm mx-auto rounded-2xl mb-3" />
          )}
          <div className="bg-white border-2 border-s1 rounded-3xl p-4 sm:p-6">
            {!resultat ? (
              <p className="text-xl leading-relaxed text-stone">
                {L.paragraphes[para].map((s, i) => (
                  <span key={i} className={`rounded px-0.5 ${lecture && lecture[0] === para && lecture[1] === i ? 'bg-yellow-200' : ''}`}>{texteDe(s)}{' '}</span>
                ))}
              </p>
            ) : (
              <p className="text-xl leading-relaxed">
                {resultat.mots.map((w, i) => (
                  <span key={i} className={w.ok ? 'text-green-700' : 'text-red-600 underline decoration-2'}>{w.m}{' '}</span>
                ))}
              </p>
            )}
          </div>

          {micro === 'ouvert' && (
            <div className="mt-4 rounded-2xl bg-green-50 border-2 border-green-300 p-4">
              <p className="font-heading font-extrabold text-green-800 mb-2">Je t'écoute… lis le paragraphe à voix haute.</p>
              <div className="h-3 rounded-full bg-green-100 overflow-hidden mb-3">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${Math.round(niveau * 100)}%` }} />
              </div>
              <button onClick={() => arreter.current && arreter.current()} className={`${bouton} bg-green-700 w-full`}>
                <IconCoche size={20} /> J'ai fini
              </button>
            </div>
          )}
          {micro === 'transcrit' && <p className="mt-4 text-center font-bold text-s4">Je vérifie ta lecture…</p>}
          {message && <p className="mt-4 rounded-xl bg-amber-50 border-2 border-amber-200 p-3 font-semibold text-amber-900">{message}</p>}

          {resultat && (
            <div className={`mt-4 rounded-2xl border-2 p-4 ${resultat.pct >= 90 ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
              <p className="font-heading text-lg font-extrabold text-stone">
                {resultat.pct >= 95 ? 'Bravo! Tu as tout lu.' : resultat.pct >= 80 ? 'Presque! Relis les mots en rouge.' : 'Try Again! Écoute encore une fois, puis relis.'}
              </p>
              <p className="text-sm font-semibold text-s4 mt-1">
                {resultat.nbOk} mots sur {resultat.total} ({resultat.pct} %){resultat.mpm ? ` · ${resultat.mpm} mots par minute` : ''}
              </p>
            </div>
          )}

          {micro === 'repos' && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Controles suite={unPara(para)} label="Écoute d'abord" />
              <button onClick={lireAuMicro} className={bouton} style={orange}>
                {resultat ? <><IconRepete size={22} /> Je relis</> : <><IconMicro size={22} /> Je lis</>}
              </button>
              {resultat && (
                <button onClick={suivant} className={`${bouton} bg-stone sm:col-span-2`}>
                  {indices.indexOf(para) + 1 < indices.length ? <>Paragraphe suivant <IconFleche size={20} /></> : <>{M ? "J'ai fini ce morceau" : "J'ai fini l'histoire"} <IconCoche size={20} /></>}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {etape === 'chasse' && (
        <ChasseMarqueurs key={morceau} paragraphes={indices.map((p) => L.paragraphes[p])}
          onFini={() => { couper(); onStartPractice(modeQuestions); }} />
      )}

      {etape === 'fin' && (() => {
        const liste = Object.values(scores);
        const total = liste.reduce((a, r) => a + r.total, 0);
        const ok = liste.reduce((a, r) => a + r.nbOk, 0);
        const mpms = liste.map((r) => r.mpm).filter(Boolean);
        return (
          <div className="bg-white border-2 border-s1 rounded-3xl p-6 text-center">
            <p className="font-heading text-2xl font-extrabold text-stone mb-2">{M ? `Tu as lu le morceau ${morceau}!` : "Tu as lu l'histoire!"}</p>
            {total > 0 && (
              <p className="font-semibold text-s4 mb-4">
                {ok} mots lus sur {total} ({Math.round((ok / total) * 100)} %) · {liste.length} paragraphes sur {indices.length}
                {mpms.length ? ` · environ ${Math.round(mpms.reduce((a, b) => a + b, 0) / mpms.length)} mots par minute` : ''}
              </p>
            )}
            <button onClick={() => setEtape('chasse')} className={`${bouton} w-full`} style={orange}>
              Maintenant, la chasse aux marqueurs <IconFleche size={20} />
            </button>
          </div>
        );
      })()}
    </div>
  );
}
