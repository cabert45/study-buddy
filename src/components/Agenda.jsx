import { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { buildPlan } from './Coach';
import { listeCetteSemaine, semaineCourante } from '../data/orthographeQuotidien';
import { moduleCetteSemaine, titreModule } from '../data/cahierFrancais';
import { mathsCetteSemaine } from '../data/mathsSemaines';
import { TESTS } from '../data/testsPonctuels';
import { CONGES } from '../data/congesScolaires';

// L'AGENDA DE RYAN — ce qu'il y a à faire, jour par jour.
//
// Le parent, le 12 oct. 2026: « j'aimais la vue calendrier. Quand il clique sur
// une journée, ça lui dit quoi faire. Là il n'y a rien dans le calendrier. Le
// test, la dictée, tout ça devrait y être. »
//
// Il avait raison: l'agenda lisait `EXAMS` et le cycle de dictées du Thème 7 —
// deux choses de 2e ANNÉE, vides depuis septembre. Le calendrier s'affichait
// donc parfaitement… et ne contenait rien.
//
// Maintenant il lit les mêmes sources que le Coach:
//   la liste d'orthographe et sa date de remise · le module du cahier Jazz ·
//   la leçon de maths · les tests annoncés (data/testsPonctuels) · les congés.
// Et quand on touche une journée, il construit SON plan avec `buildPlan`,
// la fonction du Coach — pas une deuxième liste qui pourrait le contredire.

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
// La grille commence le LUNDI (debut = le lundi de la semaine), alors
// l'en-tete doit commencer par L. Avec D..S en tete, le 12 octobre (un lundi)
// s'affichait sous la colonne « dimanche ».
const JOURS_COURTS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
const memeJour = (a, b) => a.getFullYear() === b.getFullYear()
  && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dateOf = ([y, m, d]) => new Date(y, m - 1, d);
const label = (d) => `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;

// Ce qui est MARQUÉ sur une journée: ce qu'on remet, ce qu'on passe, les congés.
// (Le travail de la journée, lui, vient du plan — voir plus bas.)
function marqueursDuJour(date) {
  const m = [];
  const jour = date.getDay();

  CONGES.forEach((c) => {
    if (memeJour(dateOf(c.date), date)) m.push({ kind: 'conge', icon: '🍁', label: c.nom });
  });

  TESTS.forEach((t) => {
    // Une semaine de révision n'a pas de jour de test: ne pas en inventer un.
    if (t.revision) return;
    if (memeJour(dateOf(t.date), date)) m.push({ kind: 'test', icon: t.icon, label: t.nom });
  });

  const sem = semaineCourante(date);
  if (sem && sem.remise && memeJour(dateOf(sem.remise), date)) {
    const l = listeCetteSemaine(date);
    m.push({ kind: 'remise', icon: '📌', label: `Remise — feuille liste ${l.numero} + feuille de maths` });
  }

  // La dictée se fait le jour de la remise (ou le vendredi quand rien n'est dit).
  const estRemise = sem && sem.remise && memeJour(dateOf(sem.remise), date);
  if (estRemise || (jour === 5 && !(sem && sem.remise))) {
    const l = listeCetteSemaine(date);
    m.push({ kind: 'dictee', icon: '🎧', label: `Dictée — liste ${l.numero}` });
  }

  return m;
}

const COULEURS = {
  test: { bg: '#fce8ec', border: '#c74a60', text: '#a02a45' },
  remise: { bg: '#fef0e4', border: '#c74a15', text: '#9a3a10' },
  dictee: { bg: '#e8eef8', border: '#3a5bc7', text: '#2a3f8a' },
  conge: { bg: '#eef2e8', border: '#6b8e4e', text: '#44602f' },
};

export default function Agenda({ onClose, onLaunchMode, profile = 'ryan' }) {
  const today = startOfDay(new Date());
  const [offset, setOffset] = useState(0);
  const [choisi, setChoisi] = useState(today);

  // Deux semaines à la fois: assez pour voir ce qui s'en vient, assez court
  // pour tenir sur un téléphone sans faire défiler.
  const debut = addDays(today, offset * 7 - today.getDay() + 1); // on part du lundi
  const jours = Array.from({ length: 14 }, (_, i) => addDays(debut, i));

  const plan = buildPlan({}, { dateOverride: choisi, profile }) || [];
  const marqueurs = marqueursDuJour(choisi);
  const liste = listeCetteSemaine(choisi);
  const mod = moduleCetteSemaine(choisi);
  const maths = mathsCetteSemaine(choisi);

  // Les étapes qu'on peut vraiment ouvrir d'ici (un exercice de l'app).
  const exercices = plan.filter((e) => e.type === 'app');
  const autres = plan.filter((e) => e.type === 'chore');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-4 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b-2 border-s1 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Calendar size={22} className="text-lava" />
            <h2 className="text-xl font-heading font-extrabold text-stone">Mon agenda</h2>
          </div>
          <button onClick={onClose}
            className="bg-s1 hover:bg-s2 rounded-full p-2 text-stone transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* ===== Les deux semaines ===== */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setOffset((o) => o - 1)}
                className="p-2 rounded-xl bg-s1 text-stone active:bg-s2" aria-label="Deux semaines avant">
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm font-extrabold text-stone capitalize">
                {MOIS[jours[0].getMonth()]}
                {jours[13].getMonth() !== jours[0].getMonth() ? ` – ${MOIS[jours[13].getMonth()]}` : ''}
              </div>
              <button onClick={() => setOffset((o) => o + 1)}
                className="p-2 rounded-xl bg-s1 text-stone active:bg-s2" aria-label="Deux semaines après">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {JOURS_COURTS.map((j, i) => (
                <div key={i} className="text-center text-[10px] font-extrabold uppercase text-s4 pb-1">{j}</div>
              ))}
              {jours.map((d) => {
                const marques = marqueursDuJour(d);
                const estAujourdhui = memeJour(d, today);
                const estChoisi = memeJour(d, choisi);
                const principal = marques.find((m) => m.kind === 'test')
                  || marques.find((m) => m.kind === 'remise')
                  || marques.find((m) => m.kind === 'conge')
                  || marques[0];
                const c = principal ? COULEURS[principal.kind] : null;
                return (
                  <button key={d.toISOString()} onClick={() => setChoisi(d)}
                    className={`rounded-xl p-1.5 text-center transition-all border-2 ${estChoisi ? 'border-fox' : 'border-transparent'}`}
                    style={{
                      background: c ? c.bg : estAujourdhui ? '#fff3e8' : '#f7f7f5',
                      minHeight: 52,
                    }}>
                    <div className={`text-sm font-extrabold ${estAujourdhui ? 'text-lava' : 'text-stone'}`}>
                      {d.getDate()}
                    </div>
                    <div className="flex justify-center gap-0.5 flex-wrap leading-none">
                      {marques.slice(0, 3).map((m, i) => (
                        <span key={i} className="text-[10px]">{m.icon}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== La journée choisie ===== */}
          <section>
            <div className="rounded-2xl p-4 text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a)' }}>
              <div className="text-sm font-extrabold capitalize">
                {label(choisi)}{memeJour(choisi, today) ? " — aujourd'hui" : ''}
              </div>
              {marqueurs.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {marqueurs.map((m, i) => (
                    <li key={i} className="text-sm font-bold flex items-start gap-2">
                      <span>{m.icon}</span><span>{m.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-1 text-sm opacity-90">Rien de spécial à remettre ce jour-là.</div>
              )}
            </div>
          </section>

          {/* ===== Ce qu'il étudie cette semaine ===== */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-s5 mb-2">Cette semaine</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="rounded-xl border-2 border-s2 p-2.5">
                <div className="text-[10px] font-extrabold uppercase text-s4">Vocabulaire</div>
                <div className="text-sm font-bold text-stone leading-tight">Liste {liste.numero}</div>
                <div className="text-xs text-s5 leading-tight">{liste.titre}</div>
              </div>
              <div className="rounded-xl border-2 border-s2 p-2.5">
                <div className="text-[10px] font-extrabold uppercase text-s4">Grammaire</div>
                <div className="text-sm font-bold text-stone leading-tight">
                  {mod ? titreModule(mod) : 'Cahier Jazz'}
                </div>
                <div className="text-xs text-s5 leading-tight">Verbe : {liste.verbe}</div>
              </div>
              <div className="rounded-xl border-2 border-s2 p-2.5">
                <div className="text-[10px] font-extrabold uppercase text-s4">Mathématiques</div>
                <div className="text-sm font-bold text-stone leading-tight">{maths.nom}</div>
                <div className="text-xs text-s5 leading-tight">Aide-mémoire Matcha {maths.page}</div>
              </div>
            </div>
          </section>

          {/* ===== Ce qu'il fait ce jour-là ===== */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-s5 mb-2">
              Ce que je fais {memeJour(choisi, today) ? "aujourd'hui" : `${JOURS[choisi.getDay()]}`}
              {' '}({exercices.length + autres.length} choses)
            </h3>
            <div className="space-y-1.5">
              {exercices.map((e, i) => (
                <button key={i} onClick={() => onLaunchMode && onLaunchMode(e.mode)}
                  className="w-full text-left rounded-xl border-2 border-s2 p-3 flex items-center gap-3 bg-white active:bg-orange-50 hover:border-fox transition-all">
                  <span className="text-xl">{e.icon}</span>
                  <span className="flex-1 text-sm font-bold text-stone leading-tight">
                    {e.label.replace(/^[^\s]*\s/, (m) => (/[A-Za-zÀ-ÿ]/.test(m) ? m : ''))}
                  </span>
                  <span className="text-xs font-bold text-s4">{e.mins} min</span>
                </button>
              ))}
              {autres.map((e, i) => (
                <div key={`c${i}`}
                  className="rounded-xl border-2 border-dashed border-s2 p-3 flex items-center gap-3 bg-s1/30">
                  <span className="text-xl">{e.icon}</span>
                  <span className="flex-1 text-sm font-bold text-stone leading-tight">{e.label}</span>
                  <span className="text-xs font-bold text-s4">{e.mins} min</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-s4 mt-2">
              Touche une ligne pour la commencer tout de suite.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
