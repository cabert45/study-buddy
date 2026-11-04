import { useEffect, useMemo, useState } from 'react';
import { X, Trophy, Plus, Camera, TrendingUp, TrendingDown, Minus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { RESULTATS_2E_ANNEE } from '../data/ryanTestResults';

// Le carnet de notes de Ryan — 28 oct. 2026.
// « Please keep Ryan's grades somewhere whenever we get them. We could see
// [...] whatever we added, and then the grade, and we could also view the
// picture if needed. I don't want to lose them. Is he progressing in the
// dictée? Is he decreasing? Like in all the different matières. »
//
// Les notes vivent dans la BASE (/api/carnet), pas dans le code ni dans le
// localStorage: le parent les ajoute de son téléphone, photo comprise, et les
// voit de partout. Pour chaque note: la date, la matière, ce qui était
// évalué, la note (ou seulement l'appréciation: « Bravo »), ses fautes, et
// ce qu'on avait préparé dans l'app avant le test.

const MATIERES = [
  { id: 'français', nom: 'Français', categories: ['Dictée', 'Orthographe (liste)', 'Grammaire', 'Conjugaison', 'Lecture', 'Écriture'] },
  { id: 'math', nom: 'Mathématiques', categories: ['Calcul rapide', 'Arithmétique', 'Résolution de problèmes', 'Géométrie', 'Mesure', 'Statistique'] },
  { id: 'sciences', nom: 'Sciences', categories: ['Test', 'Mini-test'] },
  { id: 'univers', nom: 'Univers social', categories: ['Test'] },
  { id: 'anglais', nom: 'Anglais', categories: ['Test'] },
  { id: 'oral', nom: 'Oral', categories: ['Présentation'] },
  { id: 'autre', nom: 'Autre', categories: [] },
];
const NOM_MATIERE = Object.fromEntries(MATIERES.map((m) => [m.id, m.nom]));
// Les mêmes teintes que le reste de l'app: une couleur par matière, pour la lire d'un coup d'œil.
const TEINTE = { français: '#c2410c', math: '#2563eb', sciences: '#059669', univers: '#7c3aed', anglais: '#db2777', oral: '#ca8a04', autre: '#57534e' };

const pct = (r) => (r.note != null && r.sur ? Math.round((r.note / r.sur) * 100) : null);
const aujourdhui = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  return `${d} ${mois[m - 1]} ${y}`;
}

// Une photo de téléphone fait 3-5 Mo; réduite à 1800 px elle se lit encore
// (on y relit des accents au stylo rouge) et pèse ~300 ko.
function reduirePhoto(fichier) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fichier);
    const img = new Image();
    img.onload = () => {
      const MAX = 1800;
      const k = Math.min(1, MAX / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('photo illisible')); };
    img.src = url;
  });
}

// ===== La tendance =====
// Assez simple pour être juste: la moyenne des 2 dernières notes contre
// celle d'avant. Moins de 5 points d'écart = stable — un test plus dur ne
// fait pas une chute.
function tendance(points) {
  if (points.length < 2) return null;
  const vals = points.map((p) => p.pct);
  const recent = vals.slice(-2);
  const avant = vals.length >= 3 ? vals.slice(0, -2) : vals.slice(0, 1);
  const moy = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const ecart = Math.round(moy(recent) - moy(avant));
  if (ecart >= 5) return { sens: 'hausse', ecart };
  if (ecart <= -5) return { sens: 'baisse', ecart };
  return { sens: 'stable', ecart };
}

function Courbe({ points, couleur }) {
  const W = 220, H = 56, P = 6;
  if (points.length < 2) return null;
  const x = (i) => P + (i * (W - 2 * P)) / (points.length - 1);
  const y = (v) => H - P - (v / 100) * (H - 2 * P);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }} role="img"
      aria-label={`Notes dans l'ordre: ${points.map((p) => p.pct + ' %').join(', ')}`}>
      <line x1={P} x2={W - P} y1={y(60)} y2={y(60)} stroke="#d6d3d1" strokeDasharray="3 3" />
      <polyline fill="none" stroke={couleur} strokeWidth="2.5" strokeLinejoin="round"
        points={points.map((p, i) => `${x(i)},${y(p.pct)}`).join(' ')} />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.pct)} r="3.5" fill={p.archive ? '#fff' : couleur} stroke={couleur} strokeWidth="2" />
      ))}
    </svg>
  );
}

function Tendance({ t }) {
  if (!t) return <span className="text-xs font-bold text-s5">Une seule note chiffrée pour l'instant</span>;
  const s = {
    hausse: { Icone: TrendingUp, txt: `En progrès (+${t.ecart} pts)`, cl: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
    baisse: { Icone: TrendingDown, txt: `En baisse (${t.ecart} pts)`, cl: 'text-red-700 bg-red-50 border-red-300' },
    stable: { Icone: Minus, txt: 'Stable', cl: 'text-amber-800 bg-amber-50 border-amber-300' },
  }[t.sens];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-extrabold border-2 rounded-lg px-2 py-0.5 ${s.cl}`}>
      <s.Icone size={14} /> {s.txt}
    </span>
  );
}

// ===== Le formulaire: ajouter ou corriger une note =====
function Formulaire({ depart, onFini, onAnnuler }) {
  const [f, setF] = useState(() => ({
    date: aujourdhui(), matiere: 'français', categorie: 'Dictée', titre: '',
    note: '', sur: '', appreciation: '', fautes: '', prepare: '', ...(depart || {}),
  }));
  const [photos, setPhotos] = useState([]);
  const [retirer, setRetirer] = useState([]);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const maj = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const cats = MATIERES.find((m) => m.id === f.matiere)?.categories || [];

  async function ajouterPhotos(e) {
    const fichiers = [...e.target.files];
    e.target.value = '';
    try {
      const reduites = await Promise.all(fichiers.map(reduirePhoto));
      setPhotos((p) => [...p, ...reduites]);
    } catch {
      setErreur('Une photo n’a pas pu être lue. Essaie de la reprendre.');
    }
  }

  async function enregistrer() {
    if (!f.titre.trim()) { setErreur('Écris ce qui était évalué (ex.: Dictée du 23 octobre).'); return; }
    setEnvoi(true); setErreur('');
    const corps = { ...f, profile: 'ryan', photos, retirerPhotos: retirer };
    delete corps.id;
    try {
      const r = await fetch(depart?.id ? `/api/carnet/${depart.id}` : '/api/carnet', {
        method: depart?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corps),
      });
      if (!r.ok) throw new Error(String(r.status));
      onFini();
    } catch {
      setErreur('Pas enregistré — vérifie la connexion et réessaie. Rien n’est perdu: le formulaire est encore là.');
      setEnvoi(false);
    }
  }

  const champ = 'w-full border-2 border-s2 rounded-lg px-2.5 py-2 text-sm font-semibold text-stone focus:border-lava outline-none bg-white';
  const etiquette = 'block text-[11px] font-extrabold uppercase tracking-wide text-s5 mb-1';
  return (
    <div className="p-4 space-y-3">
      <h3 className="font-heading text-lg font-extrabold text-stone">{depart?.id ? 'Corriger la note' : 'Nouvelle note'}</h3>
      <div className="grid grid-cols-2 gap-2">
        <label><span className={etiquette}>Date du test</span>
          <input type="date" className={champ} value={f.date} onChange={maj('date')} /></label>
        <label><span className={etiquette}>Matière</span>
          <select className={champ} value={f.matiere}
            onChange={(e) => setF((v) => ({ ...v, matiere: e.target.value, categorie: MATIERES.find((m) => m.id === e.target.value)?.categories[0] || '' }))}>
            {MATIERES.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
          </select></label>
      </div>
      <label className="block"><span className={etiquette}>Sorte (pour suivre la progression)</span>
        <input className={champ} list="carnet-categories" value={f.categorie || ''} onChange={maj('categorie')} placeholder="Dictée, Grammaire, Calcul rapide…" />
        <datalist id="carnet-categories">{cats.map((c) => <option key={c} value={c} />)}</datalist></label>
      <label className="block"><span className={etiquette}>Ce qui était évalué</span>
        <input className={champ} value={f.titre} onChange={maj('titre')} placeholder="Dictée du 23 octobre · Test sur l'arrondissement…" /></label>
      <div className="grid grid-cols-3 gap-2 items-end">
        <label><span className={etiquette}>Note</span>
          <input inputMode="decimal" className={champ} value={f.note ?? ''} onChange={maj('note')} placeholder="8" /></label>
        <label><span className={etiquette}>Sur</span>
          <input inputMode="decimal" className={champ} value={f.sur ?? ''} onChange={maj('sur')} placeholder="10" /></label>
        <label><span className={etiquette}>Mot du prof</span>
          <input className={champ} value={f.appreciation || ''} onChange={maj('appreciation')} placeholder="Bravo" /></label>
      </div>
      <p className="text-[11px] font-semibold text-s5 -mt-1">Pas de chiffre sur la feuille? Laisse la note vide et écris seulement le mot du prof — tu pourras ajouter la note plus tard.</p>
      <label className="block"><span className={etiquette}>Ses fautes</span>
        <textarea rows={2} className={champ} value={f.fautes || ''} onChange={maj('fautes')} placeholder="« les garçon » → garçons…" /></label>
      <label className="block"><span className={etiquette}>Ce qu'on avait préparé dans l'app</span>
        <textarea rows={2} className={champ} value={f.prepare || ''} onChange={maj('prepare')} placeholder="La liste 6 en dictée orale, la fiche PDF de la semaine…" /></label>

      <div>
        <span className={etiquette}>Photos du papier</span>
        <div className="flex flex-wrap gap-2">
          {(depart?.photos || []).filter((id) => !retirer.includes(id)).map((id) => (
            <div key={id} className="relative">
              <img src={`/api/carnet/photo/${id}`} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-s2" />
              <button onClick={() => setRetirer((r) => [...r, id])} title="Retirer cette photo"
                className="absolute -top-2 -right-2 bg-white border-2 border-s2 rounded-full p-0.5 text-s6"><X size={14} /></button>
            </div>
          ))}
          {photos.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-lava" />
              <button onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} title="Retirer cette photo"
                className="absolute -top-2 -right-2 bg-white border-2 border-s2 rounded-full p-0.5 text-s6"><X size={14} /></button>
            </div>
          ))}
          <label className="w-20 h-20 rounded-lg border-2 border-dashed border-s3 flex flex-col items-center justify-center text-s5 cursor-pointer hover:border-lava hover:text-lava">
            <Camera size={20} />
            <span className="text-[10px] font-extrabold mt-0.5">Ajouter</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={ajouterPhotos} />
          </label>
        </div>
      </div>

      {erreur && <p className="text-sm font-bold text-red-700">{erreur}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={onAnnuler} className="flex-1 py-2.5 rounded-xl border-2 border-s2 font-extrabold text-s6">Annuler</button>
        <button onClick={enregistrer} disabled={envoi}
          className="flex-[2] py-2.5 rounded-xl bg-lava text-white font-extrabold disabled:opacity-60">
          {envoi ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

// ===== Une photo en grand =====
function Visionneuse({ ids, depart, onClose }) {
  const [i, setI] = useState(depart);
  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-2" onClick={onClose}>
      <img src={`/api/carnet/photo/${ids[i]}`} alt="" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
      <button onClick={onClose} className="absolute top-3 right-3 bg-white/90 rounded-full p-2"><X size={22} /></button>
      {ids.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setI((i - 1 + ids.length) % ids.length); }}
            className="absolute left-2 top-1/2 bg-white/90 rounded-full p-2"><ChevronLeft size={22} /></button>
          <button onClick={(e) => { e.stopPropagation(); setI((i + 1) % ids.length); }}
            className="absolute right-2 top-1/2 bg-white/90 rounded-full p-2"><ChevronRight size={22} /></button>
          <span className="absolute bottom-3 text-white text-sm font-bold">{i + 1} / {ids.length}</span>
        </>
      )}
    </div>
  );
}

function Fiche({ r, onPhoto, onModifier, onEffacer }) {
  const p = pct(r);
  const couleur = TEINTE[r.matiere] || TEINTE.autre;
  return (
    <div className="rounded-xl border-2 border-s1 bg-white p-3" style={{ borderLeft: `6px solid ${couleur}` }}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: couleur }}>
            {NOM_MATIERE[r.matiere] || r.matiere}{r.categorie ? ` · ${r.categorie}` : ''} · {fmtDate(r.date)}
          </div>
          <div className="text-sm font-extrabold text-stone leading-snug">{r.titre}</div>
        </div>
        <div className="text-right whitespace-nowrap">
          {r.note != null && r.sur ? (
            <>
              <div className="text-lg font-extrabold leading-none text-stone">{r.note}/{r.sur}</div>
              <div className="text-[11px] font-extrabold text-s5">{p} %</div>
            </>
          ) : (
            <div className="text-[11px] font-extrabold text-s5">note à venir</div>
          )}
          {r.appreciation && <div className="text-xs font-extrabold text-emerald-700 italic">« {r.appreciation} »</div>}
        </div>
      </div>
      {r.fautes && <p className="text-xs text-s6 mt-1.5"><span className="font-extrabold">Ses fautes: </span>{r.fautes}</p>}
      {r.prepare && <p className="text-xs text-s6 mt-1"><span className="font-extrabold">Préparé dans l'app: </span>{r.prepare}</p>}
      <div className="flex items-center gap-2 mt-2">
        {r.photos?.map((id, k) => (
          <button key={id} onClick={() => onPhoto(r.photos, k)}>
            <img src={`/api/carnet/photo/${id}`} alt={`Photo ${k + 1}`} loading="lazy" className="w-14 h-14 object-cover rounded-lg border-2 border-s2" />
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => onModifier(r)} title="Corriger ou ajouter la note / une photo"
          className="p-1.5 rounded-lg text-s5 hover:text-lava hover:bg-s1"><Pencil size={16} /></button>
        <button onClick={() => onEffacer(r)} title="Effacer"
          className="p-1.5 rounded-lg text-s5 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

// L'archive de 2e année, au même format, pour comparer si on le veut.
const ARCHIVE = RESULTATS_2E_ANNEE.map((r) => ({
  date: r.date, matiere: r.subject === 'univers' ? 'univers' : r.subject === 'oral' ? 'oral' : r.subject,
  categorie: /dict/i.test(r.test) ? 'Dictée' : null, titre: r.test, note: r.score, sur: r.total, archive: true,
}));

export default function TestResults({ onClose }) {
  const [rows, setRows] = useState(null);
  const [erreur, setErreur] = useState('');
  const [vue, setVue] = useState('progression'); // progression | toutes
  const [filtre, setFiltre] = useState('tout');
  const [edition, setEdition] = useState(null); // null | {} (nouvelle) | ligne
  const [photo, setPhoto] = useState(null);
  const [avec2e, setAvec2e] = useState(false);

  function charger() {
    fetch('/api/carnet?profile=ryan')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => { setRows(d.rows); setErreur(''); })
      .catch(() => setErreur('Le carnet ne se charge pas (connexion?). Les notes sont en sécurité dans la base.'));
  }
  useEffect(charger, []);

  async function effacer(r) {
    if (!window.confirm(`Effacer « ${r.titre} » et ses photos? On ne pourra pas la récupérer.`)) return;
    await fetch(`/api/carnet/${r.id}`, { method: 'DELETE' });
    charger();
  }

  // La progression: une ligne par matière ET sorte (la dictée ne se compare
  // qu'à la dictée), dans l'ordre des dates.
  const groupes = useMemo(() => {
    const toutes = [...(rows || []), ...(avec2e ? ARCHIVE : [])];
    const g = new Map();
    toutes.forEach((r) => {
      const cle = `${r.matiere}|${r.categorie || ''}`;
      if (!g.has(cle)) g.set(cle, { matiere: r.matiere, categorie: r.categorie, lignes: [] });
      g.get(cle).lignes.push(r);
    });
    return [...g.values()]
      .map((x) => {
        const lignes = x.lignes.sort((a, b) => a.date.localeCompare(b.date));
        const points = lignes.filter((r) => pct(r) != null).map((r) => ({ pct: pct(r), archive: r.archive, r }));
        return { ...x, lignes, points, t: tendance(points) };
      })
      // Seulement les sortes qui ont au moins une note de 3e année.
      .filter((x) => x.lignes.some((r) => !r.archive))
      .sort((a, b) => MATIERES.findIndex((m) => m.id === a.matiere) - MATIERES.findIndex((m) => m.id === b.matiere));
  }, [rows, avec2e]);

  const visibles = (rows || []).filter((r) => filtre === 'tout' || r.matiere === filtre);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto p-2 sm:p-4">
      <div className="bg-stone-50 rounded-2xl max-w-3xl w-full my-2 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b-2 border-s1 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Trophy size={22} className="text-lava" />
            <h2 className="text-xl font-heading font-extrabold text-stone">Carnet de notes — Ryan</h2>
          </div>
          <button onClick={onClose} className="bg-s1 hover:bg-s2 rounded-full p-2 text-stone transition-all"><X size={20} /></button>
        </div>

        {edition ? (
          <Formulaire depart={edition.id ? edition : null}
            onFini={() => { setEdition(null); charger(); }} onAnnuler={() => setEdition(null)} />
        ) : (
          <>
            <div className="p-4 pb-2 flex gap-2 items-center flex-wrap">
              <button onClick={() => setEdition({})}
                className="inline-flex items-center gap-1.5 bg-lava text-white font-extrabold rounded-xl px-3.5 py-2 shadow-sm">
                <Plus size={18} /> Ajouter une note
              </button>
              <div className="flex-1" />
              <div className="flex bg-white border-2 border-s2 rounded-xl p-0.5 text-sm font-extrabold">
                {[['progression', 'Progression'], ['toutes', 'Toutes les notes']].map(([id, nom]) => (
                  <button key={id} onClick={() => setVue(id)}
                    className={`px-3 py-1.5 rounded-lg ${vue === id ? 'bg-stone text-white' : 'text-s6'}`}>{nom}</button>
                ))}
              </div>
            </div>

            {erreur && <p className="px-4 text-sm font-bold text-red-700">{erreur}</p>}
            {rows === null && !erreur && <p className="p-6 text-center text-s5 font-bold">Chargement…</p>}
            {rows && rows.length === 0 && (
              <p className="p-6 text-center text-s5 font-semibold">Aucune note encore. Ajoute la première avec la photo du papier.</p>
            )}

            {rows && rows.length > 0 && vue === 'progression' && (
              <div className="p-4 pt-2 space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-s6">
                  <input type="checkbox" checked={avec2e} onChange={(e) => setAvec2e(e.target.checked)} />
                  Comparer avec la 2e année (points vides)
                </label>
                {groupes.map((g) => {
                  const couleur = TEINTE[g.matiere] || TEINTE.autre;
                  const sansChiffre = g.lignes.filter((r) => !r.archive && pct(r) == null);
                  return (
                    <section key={`${g.matiere}|${g.categorie}`} className="bg-white rounded-xl border-2 border-s1 p-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-heading font-extrabold text-stone">
                          <span style={{ color: couleur }}>{NOM_MATIERE[g.matiere] || g.matiere}</span>
                          {g.categorie ? ` · ${g.categorie}` : ''}
                        </h3>
                        <Tendance t={g.t} />
                      </div>
                      <Courbe points={g.points} couleur={couleur} />
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {g.lignes.map((r, k) => (
                          <span key={r.id || `a${k}`}
                            className={`text-[11px] font-bold rounded-md px-1.5 py-0.5 border ${r.archive ? 'text-s5 border-s2 border-dashed' : 'text-stone border-s2 bg-stone-50'}`}
                            title={r.titre}>
                            {fmtDate(r.date)}: {pct(r) != null ? `${r.note}/${r.sur}` : r.appreciation ? `« ${r.appreciation} »` : 'note à venir'}
                          </span>
                        ))}
                      </div>
                      {sansChiffre.length > 0 && g.points.filter((p) => !p.archive).length === 0 && (
                        <p className="text-[11px] text-s5 font-semibold mt-1.5">Pas encore de note chiffrée: ajoute-la avec le crayon quand elle arrive, et la courbe apparaîtra.</p>
                      )}
                    </section>
                  );
                })}
                <p className="text-[11px] text-s5 font-semibold text-center">La ligne pointillée marque 60 %. « En progrès » / « en baisse » = les 2 dernières notes comparées à celles d'avant (5 points d'écart ou plus).</p>
              </div>
            )}

            {rows && rows.length > 0 && vue === 'toutes' && (
              <div className="p-4 pt-2 space-y-2">
                <div className="flex gap-1.5 flex-wrap text-xs mb-1">
                  {[['tout', 'Tout'], ...MATIERES.filter((m) => rows.some((r) => r.matiere === m.id)).map((m) => [m.id, m.nom])].map(([id, nom]) => (
                    <button key={id} onClick={() => setFiltre(id)}
                      className={`px-2.5 py-1 rounded-lg font-bold border-2 ${filtre === id ? 'bg-lava text-white border-lava' : 'bg-white text-stone border-s2'}`}>{nom}</button>
                  ))}
                </div>
                {visibles.map((r) => (
                  <Fiche key={r.id} r={r} onPhoto={(ids, k) => setPhoto({ ids, k })}
                    onModifier={(x) => setEdition(x)} onEffacer={effacer} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {photo && <Visionneuse ids={photo.ids} depart={photo.k} onClose={() => setPhoto(null)} />}
    </div>
  );
}
