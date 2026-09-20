import React from 'react';
import { listeCetteSemaine } from '../data/orthographeQuotidien';
import { strategiesCetteSemaine, ecrireFait } from '../data/tablesStrategies';

// L'aide-mémoire de la semaine — la page du cahier, à l'écran.
//
// Demandé par le parent le 20 sept. 2026: « donne-lui la liste au complet,
// qu'il puisse regarder les mots avant de faire les exercices ». C'est exact:
// on ne peut pas mémoriser ce qu'on ne nous a jamais montré, et le cahier
// présente toujours les mots dans un encadré AVANT les questions.
//
// Même présentation que le cahier papier: un cadre pointillé, les mots en
// colonnes, et la règle en une phrase. Il s'ouvre au début d'une session
// d'orthographe ou de stratégies, et le bouton « 📋 La liste » le rouvre
// n'importe quand pendant la session.

function CadreCahier({ children }) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 bg-white"
      style={{ border: '3px dashed #c9b79a' }}
    >
      {children}
    </div>
  );
}

// ===== Orthographe: les mots de la semaine =====
function ListeOrthographe({ liste }) {
  // Les listes à lettre muette vont par paires masculin/féminin: on les garde
  // côte à côte, c'est ce qui rend la lettre muette visible.
  const paires = liste.mots.filter((m) => m.fem);
  const simples = liste.mots.filter((m) => !m.fem);

  return (
    <>
      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
        <span className="text-xs font-extrabold bg-stone text-white rounded-md px-2 py-1">
          LISTE {liste.numero}
        </span>
        <span className="font-heading text-lg font-extrabold text-stone leading-tight">
          {liste.titre}
        </span>
      </div>
      <p className="text-xs font-bold text-s4 mb-3">
        Verbe{liste.verbe.includes(',') ? 's' : ''} à l'étude : {liste.verbe}
      </p>

      <CadreCahier>
        {paires.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 mb-3">
            {paires.map((m) => (
              <div key={m.mot} className="leading-tight">
                <div className="text-base font-extrabold text-stone">{m.mot}</div>
                <div className="text-sm font-bold text-lava">{m.fem}</div>
              </div>
            ))}
          </div>
        )}
        {simples.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-base font-bold text-stone">
            {simples.map((m) => (
              <div key={m.mot} className="leading-tight">{m.mot}</div>
            ))}
          </div>
        )}
      </CadreCahier>

      {paires.length > 0 && (
        <p className="text-xs font-semibold text-s5 mt-3 leading-relaxed">
          👀 Regarde bien: le mot au féminin fait <b>entendre</b> la lettre muette.
          court → cour<b className="text-lava">t</b>e
        </p>
      )}
    </>
  );
}

// ===== Stratégies: le tableau de faits, comme dans le cahier =====
function TableauStrategies({ strats }) {
  return (
    <>
      <div className="flex items-baseline gap-2 mb-3 flex-wrap">
        <span className="text-xs font-extrabold bg-stone text-white rounded-md px-2 py-1">
          TABLES +/−
        </span>
        <span className="font-heading text-lg font-extrabold text-stone leading-tight">
          {strats.map((s) => s.court).join(' · ')}
        </span>
      </div>

      <div className={`grid gap-3 ${strats.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {strats.map((s) => (
          <div key={s.id}>
            <div className="text-center text-sm font-extrabold text-stone mb-1.5">
              {s.titre}
            </div>
            <CadreCahier>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-center">
                {s.faits.map((f) => (
                  <div key={ecrireFait(f)} className="text-sm font-bold text-stone whitespace-nowrap">
                    {ecrireFait(f)}
                  </div>
                ))}
              </div>
            </CadreCahier>
          </div>
        ))}
      </div>
    </>
  );
}

export default function AideMemoire({ mode, onStart, onClose, dejaCommence }) {
  const estOrtho = mode === 'orthographe';
  const liste = estOrtho ? listeCetteSemaine() : null;
  const strats = estOrtho ? null : strategiesCetteSemaine();
  if (estOrtho ? !liste : !strats?.length) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-10">
      <div className="bg-cream border-2 border-s1 rounded-3xl p-4 sm:p-6 shadow-sm">
        {estOrtho
          ? <ListeOrthographe liste={liste} />
          : <TableauStrategies strats={strats} />}

        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onStart}
            className="flex-1 rounded-2xl py-4 font-heading text-lg font-extrabold text-white shadow-sm active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}
          >
            {dejaCommence ? 'Revenir aux questions →' : "J'ai regardé — on commence! →"}
          </button>
          {dejaCommence && (
            <button
              onClick={onClose}
              className="rounded-2xl py-4 px-5 font-bold text-s5 bg-white border-2 border-s2 active:scale-[0.98] transition-all"
            >
              Fermer
            </button>
          )}
        </div>

        {!dejaCommence && (
          <p className="text-center text-xs font-semibold text-s4 mt-3">
            Prends 30 secondes pour <b>regarder</b> les mots. Tu pourras revenir
            les voir avec le bouton « 📋 La liste ».
          </p>
        )}
      </div>
    </div>
  );
}
