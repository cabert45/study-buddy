import React from 'react';
import { listeCetteSemaine, LISTES } from '../data/orthographeQuotidien';
import { strategiesCetteSemaine, ecrireFait } from '../data/tablesStrategies';
import { CLASSES, TESTS } from '../generators/quatreClasses';
import { tableauVerbe, verbeCourant } from '../generators/verbeSemaine';
// `CLASSES` existe deja ici (les 4 classes de MOTS, generators/quatreClasses):
// les classes de VERTEBRES sont donc renommees a l'import.
import { CLASSES as CLASSES_VERTEBRES, UTILITES, DEPLACEMENTS } from '../data/sciencesVertebres';

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

// Les quatre classes côte à côte — parce que c'est la COMPARAISON qui manque.
// Son père, le 26 sept. 2026: « Ryan ne sait pas ce qu'est un adjectif comparé
// à un verbe et à un nom commun ou un nom propre. » Une classe seule ne veut
// rien dire; ce qui compte, c'est le test qui les sépare.
function TableauClasses() {
  const couleurs = {
    'nom commun': { bg: '#eef5ff', bord: '#b9d3f5', txt: '#1d4e89' },
    'nom propre': { bg: '#f0ecfb', bord: '#cfc0ef', txt: '#5b34a8' },
    adjectif: { bg: '#fff1e6', bord: '#f5c9a3', txt: '#a6501a' },
    verbe: { bg: '#e9f7ee', bord: '#b2e0c3', txt: '#1e6b3a' },
  };
  return (
    <>
      <h2 className="font-heading text-xl font-extrabold text-stone mb-1">
        Les 4 sortes de mots
      </h2>
      <p className="text-sm font-semibold text-s4 mb-4">
        Pour chaque mot, il y a un <b>test</b>. C'est le test qui décide — pas l'impression.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {CLASSES.map((c) => {
          const t = TESTS[c];
          const k = couleurs[c];
          return (
            <div key={c} className="rounded-2xl p-4 border-2" style={{ background: k.bg, borderColor: k.bord }}>
              <div className="font-heading text-lg font-extrabold mb-1" style={{ color: k.txt }}>
                {c}
              </div>
              <div className="text-sm font-bold text-stone mb-1.5">{t.quoi}</div>
              <div className="text-sm font-semibold text-s6 mb-2 flex gap-1.5">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-none mt-0.5" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="10.4" y1="10.4" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>{t.test}</span>
              </div>
              <div className="text-sm font-extrabold" style={{ color: k.txt }}>{t.exemple}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded-2xl bg-white border-2 border-s1 p-3">
        <div className="text-[10px] font-extrabold uppercase tracking-wide text-s4 mb-1">
          La même phrase, les 4 sortes
        </div>
        <p className="text-base font-bold text-stone leading-relaxed">
          <span style={{ color: couleurs['nom propre'].txt }}>Ryan</span>{' '}
          <span style={{ color: couleurs.verbe.txt }}>lance</span> un{' '}
          <span style={{ color: couleurs['nom commun'].txt }}>ballon</span>{' '}
          <span style={{ color: couleurs.adjectif.txt }}>rouge</span>.
        </p>
      </div>
    </>
  );
}

// ===== Le verbe de la semaine: sa table de conjugaison =====
// Meme regle que la liste de mots: on ne fait pas ecrire « ils aiment » a un
// enfant a qui on n'a pas montre « ils aiment ». Le pluriel est mis en avant,
// c'est la qu'il perd ses points (« le verbe aimer au pluriel », 11 oct.).
function TableauVerbe() {
  const v = verbeCourant();
  const lignes = tableauVerbe(v);
  return (
    <>
      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
        <span className="text-xs font-extrabold bg-stone text-white rounded-md px-2 py-1">
          MON VERBE
        </span>
        <span className="font-heading text-lg font-extrabold text-stone leading-tight">
          {v.verbe} au {v.temps}
        </span>
      </div>
      <p className="text-xs font-bold text-s4 mb-3">{v.groupe}</p>

      <CadreCahier>
        {/* Deux colonnes comme dans le tableau de conjugaison du cahier:
            le SINGULIER a gauche, le PLURIEL a droite. En remplissant ligne
            par ligne, « nous aimons » se retrouvait a cote de « il aime » et
            l'orange du pluriel partait dans tous les sens. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2" style={{ gridAutoFlow: 'column', gridTemplateRows: 'repeat(3, auto)' }}>
          {lignes.map((l, i) => (
            <div key={l.personne} className="leading-tight">
              <div className={`text-base font-extrabold ${i >= 3 ? 'text-lava' : 'text-stone'}`}>
                {l.forme}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs font-bold text-s4 mt-3 pt-2" style={{ borderTop: '1px dashed #c9b79a' }}>
          En orange, les trois personnes du <b>pluriel</b> — celles qui ne s&apos;entendent presque pas.
        </p>
      </CadreCahier>

      <div className="mt-3 rounded-xl bg-orange-50 border-2 border-orange-200 p-3">
        <p className="text-sm font-extrabold text-fox-d">{v.regle}</p>
        <p className="text-sm font-semibold text-stone mt-1">{v.note}</p>
      </div>
    </>
  );
}

// ===== Sciences: la fiche du mini-test (Éclair de génie, Étape 1) =====
// Un mini-test se révise sur SA page de cahier. Les trois encadrés sont les
// trois choses que le test demande, et la première est celle qu'il a ratée.
function FicheSciences() {
  return (
    <>
      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
        <span className="text-xs font-extrabold bg-stone text-white rounded-md px-2 py-1">
          SCIENCES
        </span>
        <span className="font-heading text-lg font-extrabold text-stone leading-tight">
          Pourquoi certains animaux ont-ils une queue?
        </span>
      </div>
      <p className="text-xs font-bold text-s4 mb-3">Éclair de génie · p. 3 à 12 · mini-test jeudi</p>

      <div className="rounded-xl bg-orange-50 border-2 border-orange-200 p-3 mb-3">
        <p className="text-sm font-extrabold text-fox-d mb-1">LA PHRASE À SAVOIR PAR CŒUR</p>
        <p className="text-base font-bold text-stone leading-snug">
          La queue est un <b>prolongement de la colonne vertébrale</b>.
          Donc tous les animaux à queue sont des <b>vertébrés</b>.
        </p>
        <p className="text-sm font-semibold text-s4 mt-1">
          Un vertébré a une colonne vertébrale · un <b>in</b>vertébré n’en a pas
          (la méduse, la limace, l’étoile de mer, l’escargot, l’araignée, la pieuvre).
        </p>
      </div>

      <CadreCahier>
        <p className="text-sm font-extrabold text-stone mb-2">LES 5 CLASSES DE VERTÉBRÉS</p>
        {CLASSES_VERTEBRES.map((c) => (
          <div key={c.id} className="mb-2 leading-tight">
            <div className="text-base font-extrabold text-lava">{c.nom}</div>
            <div className="text-sm font-semibold text-stone">{c.traits.join(' · ')}</div>
            <div className="text-xs font-bold text-s4">{c.animaux.slice(0, 4).join(', ')}…</div>
          </div>
        ))}
        <p className="text-xs font-bold text-fox-d mt-2 pt-2" style={{ borderTop: '1px dashed #c9b79a' }}>
          Celle qu’on oublie: <b>les amphibiens</b>. Il y en a <b>CINQ</b>, pas quatre.
        </p>
      </CadreCahier>

      <div className="mt-3 rounded-xl bg-white border-2 border-s2 p-3">
        <p className="text-sm font-extrabold text-stone mb-1">LES 7 UTILITÉS DE LA QUEUE</p>
        <div className="text-sm font-semibold text-stone leading-snug">
          {UTILITES.slice(0, 7).map((u) => (
            <div key={u.action}>• {u.action} <span className="text-s4">({u.qui})</span></div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-white border-2 border-s2 p-3">
        <p className="text-sm font-extrabold text-stone mb-1">SE DÉPLACER, C’EST AUTRE CHOSE</p>
        <p className="text-sm font-semibold text-stone leading-snug">
          {DEPLACEMENTS.map((d) => `${d.verbe} (${d.qui})`).join(' · ')}
        </p>
        <p className="text-xs font-bold text-fox-d mt-1">
          Se déplacer = <b>changer de place</b>. Exprimer son humeur, ce n’est pas un déplacement.
        </p>
      </div>
    </>
  );
}

export default function AideMemoire({ mode, onStart, onClose, dejaCommence, listeNumero }) {
  const estOrtho = mode === 'orthographe';
  const estClasses = mode === 'quatre_classes';
  const estVerbe = typeof mode === 'string' && mode.startsWith('verbe_semaine');
  const estSciences = mode === 'sciences_queue';
  // Par defaut la liste de la semaine. `listeNumero` sert quand on revient sur
  // une liste deja vue (revision) : la page du cahier doit montrer CES mots-la,
  // pas ceux de cette semaine.
  const liste = estOrtho
    ? (listeNumero ? LISTES.find((l) => l.numero === listeNumero) : null) || listeCetteSemaine()
    : null;
  const strats = estOrtho || estClasses || estVerbe || estSciences ? null : strategiesCetteSemaine();
  if (estOrtho && !liste) return null;
  if (!estOrtho && !estClasses && !estVerbe && !estSciences && !strats?.length) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-10">
      <div className="bg-cream border-2 border-s1 rounded-3xl p-4 sm:p-6 shadow-sm">
        {estOrtho && <ListeOrthographe liste={liste} />}
        {estClasses && <TableauClasses />}
        {estVerbe && <TableauVerbe />}
        {estSciences && <FicheSciences />}
        {!estOrtho && !estClasses && !estVerbe && !estSciences && <TableauStrategies strats={strats} />}

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
            Prends 30 secondes pour <b>regarder</b>{estClasses ? ' les 4 sortes de mots' : estVerbe ? ' le verbe au complet' : estSciences ? ' ta fiche' : ' les mots'}. Tu pourras revenir
            {' les voir'} avec le bouton « 📋 {estClasses ? 'Les 4 sortes' : estVerbe ? 'Mon verbe' : estSciences ? 'Ma fiche' : 'La liste'} ».
          </p>
        )}
      </div>
    </div>
  );
}
