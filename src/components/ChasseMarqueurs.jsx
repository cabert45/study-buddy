import React, { useState, useMemo } from 'react';
import { texteDe } from '../data/lectures';
import { saveSession } from '../utils/storage';

// La chasse aux marqueurs (le parent, 22 nov.): « Ryan is not good at this ».
// On ne lui demande pas « tous les marqueurs »: UN mot à la fois. D'abord
// tous les « et », puis tous les « puis », puis « alors », « de plus »,
// « c'est-à-dire ». Il touche le mot dans le texte; il s'allume de la couleur
// de sa chasse. Au bout de trois chasses, il sait ce qu'est un marqueur.
//
// Seulement les marqueurs qui le sont toujours (« et », « puis »…). « pour »
// ou « quand » dépendent de la phrase: on ne les fait pas chasser.

const CHASSES = [
  { cle: 'et', mots: ['et'], couleur: '#fde68a', bord: '#d97706', role: 'ajoute une idée' },
  { cle: 'puis', mots: ['puis'], couleur: '#bbf7d0', bord: '#16a34a', role: 'dit ce qui vient ensuite' },
  { cle: 'alors', mots: ['alors'], couleur: '#bfdbfe', bord: '#2563eb', role: 'dit « à ce moment-là »' },
  { cle: 'de plus', mots: ['de', 'plus'], couleur: '#fbcfe8', bord: '#db2777', role: 'ajoute encore une idée' },
  { cle: "c'est-à-dire", mots: ["c'est-à-dire"], couleur: '#ddd6fe', bord: '#7c3aed', role: 'explique' },
];

const norm = (t) => t.toLowerCase().replace(/[’]/g, "'").replace(/^[«"(—–-]+|[»".,;:!?…)]+$/g, '');

// Les mots du texte, chacun avec sa chasse (ou aucune).
function decouper(paragraphes) {
  const out = [];
  paragraphes.forEach((ph, p) => {
    const toks = ph.map(texteDe).join(' ').replace(/\s*\[…\]\s*/g, ' ').split(/\s+/).filter(Boolean);
    toks.forEach((t, i) => {
      const n = norm(t);
      let chasse = null;
      let groupe = null;
      if (n === 'et') chasse = 'et';
      else if (n === 'puis') chasse = 'puis';
      else if (n === 'alors') chasse = 'alors';
      else if (n === "c'est-à-dire") chasse = "c'est-à-dire";
      else if (n === 'de' && toks[i + 1] && norm(toks[i + 1]) === 'plus') { chasse = 'de plus'; groupe = `${p}-${i}`; }
      else if (n === 'plus' && i > 0 && norm(toks[i - 1]) === 'de') { chasse = 'de plus'; groupe = `${p}-${i - 1}`; }
      out.push({ t, p, id: `${p}-${i}`, chasse, groupe: groupe || `${p}-${i}` });
    });
  });
  return out;
}

export default function ChasseMarqueurs({ paragraphes, onFini }) {
  const mots = useMemo(() => decouper(paragraphes), [paragraphes]);
  // Seulement les chasses qui ont quelque chose à trouver dans CE morceau.
  const chasses = CHASSES.filter((c) => mots.some((m) => m.chasse === c.cle));
  const [k, setK] = useState(0);
  const [trouves, setTrouves] = useState({}); // groupe → cle
  const [rate, setRate] = useState(null);
  const [erreurs, setErreurs] = useState(0);

  const c = chasses[k];
  const groupes = (cle) => [...new Set(mots.filter((m) => m.chasse === cle).map((m) => m.groupe))];
  const aTrouver = c ? groupes(c.cle) : [];
  const nbTrouves = aTrouver.filter((g) => trouves[g]).length;
  const fini = k >= chasses.length;

  const toucher = (m) => {
    if (!c || trouves[m.groupe]) return;
    if (m.chasse === c.cle) {
      setTrouves({ ...trouves, [m.groupe]: c.cle });
      setRate(null);
    } else {
      setErreurs(erreurs + 1);
      setRate(m.id);
      setTimeout(() => setRate(null), 700);
    }
  };

  const suivante = () => {
    if (k + 1 >= chasses.length) {
      const total = chasses.reduce((a, ch) => a + groupes(ch.cle).length, 0);
      saveSession('chasse_marqueurs', total + erreurs, total, [{ category: 'marqueurs_relation', correct: erreurs <= 2 }]).catch(() => {});
    }
    setK(k + 1);
  };

  const couleurDe = (cle) => CHASSES.find((x) => x.cle === cle);

  return (
    <div>
      {!fini ? (
        <div className="rounded-2xl border-2 p-3 mb-3" style={{ background: c.couleur, borderColor: c.bord }}>
          <p className="font-heading text-lg font-extrabold text-stone">
            Chasse {k + 1} sur {chasses.length}: trouve tous les « {c.cle} »
          </p>
          <p className="text-sm font-semibold text-stone">
            « {c.cle} » est un marqueur de relation: il {c.role}. Touche-le dans le texte. Trouvés: {nbTrouves} sur {aTrouver.length}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-3 mb-3">
          <p className="font-heading text-lg font-extrabold text-green-800">Bravo, détective! Tous les marqueurs sont trouvés.</p>
          <p className="text-sm font-semibold text-green-900">Les marqueurs sont les petits mots qui RELIENT les idées. Dans ton cahier, encercle les mêmes mots avec les mêmes couleurs.</p>
        </div>
      )}

      <div className="bg-white border-2 border-s1 rounded-3xl p-4 sm:p-6 space-y-3 select-none">
        {paragraphes.map((_, p) => (
          <p key={p} className="text-lg leading-loose text-stone">
            {mots.filter((m) => m.p === p).map((m) => {
              const cle = trouves[m.groupe];
              const col = cle ? couleurDe(cle) : null;
              return (
                <React.Fragment key={m.id}>
                  <span onClick={() => toucher(m)}
                    className={`cursor-pointer rounded px-0.5 transition-colors ${rate === m.id ? 'bg-red-200' : col ? '' : 'hover:bg-orange-50'}`}
                    style={col ? { background: col.couleur, outline: `2px solid ${col.bord}`, borderRadius: 999, padding: '0 6px' } : undefined}>
                    {m.t}
                  </span>{' '}
                </React.Fragment>
              );
            })}
          </p>
        ))}
      </div>

      {rate && c && <p className="mt-2 text-sm font-bold text-red-700">Ce mot-là n'est pas « {c.cle} ». Cherche encore!</p>}

      {!fini && nbTrouves === aTrouver.length && (
        <button onClick={suivante}
          className="mt-4 w-full rounded-2xl py-3.5 font-heading text-base font-extrabold text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          {k + 1 < chasses.length ? `Tous trouvés! Chasse suivante: « ${chasses[k + 1].cle} » →` : 'Tous trouvés! →'}
        </button>
      )}
      {fini && onFini && (
        <button onClick={onFini}
          className="mt-4 w-full rounded-2xl py-3.5 font-heading text-base font-extrabold text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          Maintenant, les questions →
        </button>
      )}
    </div>
  );
}
