import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Grid3x3, Circle, Crown } from 'lucide-react';
import { Chess } from 'chess.js';

// 🎮 Les jeux — demandés par Cayla le 22 sept. 2026: tic-tac-toe, échecs…
// Trois jeux, tous jouables seul (contre l'app) ou à deux sur le même appareil.
// Rien n'est enregistré sur le serveur: c'est la pause, pas un exercice.

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const card = { boxShadow: '0 1px 2px rgba(44,32,23,.04), 0 4px 16px rgba(44,32,23,.05)' };

function Choix({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={`rounded-full px-3.5 py-2 text-sm font-semibold border transition-all ${
            value === o.id ? 'text-white border-transparent' : 'bg-white text-s6 border-s2 hover:border-fox'}`}
          style={value === o.id ? { background: 'var(--sb-grad)', boxShadow: '0 4px 12px var(--sb-grad-shadow)' } : undefined}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Bandeau({ children, ton = 'info' }) {
  const bg = ton === 'gagne' ? '#dcfce7' : ton === 'perdu' ? '#fee2e2' : 'var(--sb-brand-bg)';
  const fg = ton === 'gagne' ? '#166534' : ton === 'perdu' ? '#991b1b' : 'var(--sb-brand-fg)';
  return (
    <p className="rounded-xl px-4 py-2.5 text-sm font-semibold text-center mb-3" style={{ background: bg, color: fg }}>
      {children}
    </p>
  );
}

// ==================================================================== Tic-tac-toe
const LIGNES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const gagnant = (g) => LIGNES.find(([a, b, c]) => g[a] && g[a] === g[b] && g[a] === g[c]);
const libres = (g) => g.map((v, i) => (v ? null : i)).filter((i) => i !== null);

// minimax: l'app joue parfaitement au niveau « difficile »
function minimax(g, joueur, moi) {
  const w = gagnant(g);
  if (w) return { score: g[w[0]] === moi ? 1 : -1 };
  if (!libres(g).length) return { score: 0 };
  let best = null;
  for (const i of libres(g)) {
    const suite = [...g];
    suite[i] = joueur;
    const { score } = minimax(suite, joueur === 'X' ? 'O' : 'X', moi);
    if (!best || (joueur === moi ? score > best.score : score < best.score)) best = { score, coup: i };
  }
  return best;
}

function coupOrdi(g, moi, niveau) {
  const vides = libres(g);
  if (niveau === 'facile') return pick(vides);
  if (niveau === 'moyen') {
    const adv = moi === 'X' ? 'O' : 'X';
    for (const j of [moi, adv]) { // gagner, sinon bloquer
      for (const i of vides) { const t = [...g]; t[i] = j; if (gagnant(t)) return i; }
    }
    return vides.includes(4) ? 4 : pick(vides);
  }
  return minimax(g, moi, moi).coup;
}

function TicTacToe() {
  const [niveau, setNiveau] = useState('moyen');
  const [aDeux, setADeux] = useState(false);
  const [g, setG] = useState(Array(9).fill(null));
  const [tour, setTour] = useState('X');
  const [scores, setScores] = useState({ X: 0, O: 0, nul: 0 });
  const comptee = useRef(false);

  const win = gagnant(g);
  const fini = !!win || libres(g).length === 0;

  useEffect(() => {
    if (!fini || comptee.current) return;
    comptee.current = true;
    setScores((sc) => ({ ...sc, [win ? g[win[0]] : 'nul']: sc[win ? g[win[0]] : 'nul'] + 1 }));
  }, [fini, win, g]);

  useEffect(() => {
    if (aDeux || fini || tour !== 'O') return;
    const t = setTimeout(() => {
      const i = coupOrdi(g, 'O', niveau);
      if (i == null) return;
      setG((prev) => { const n = [...prev]; n[i] = 'O'; return n; });
      setTour('X');
    }, 420);
    return () => clearTimeout(t);
  }, [tour, fini, aDeux, g, niveau]);

  function joue(i) {
    if (g[i] || fini || (!aDeux && tour === 'O')) return;
    setG((prev) => { const n = [...prev]; n[i] = tour; return n; });
    setTour(tour === 'X' ? 'O' : 'X');
  }

  function rejouer() {
    comptee.current = false;
    setG(Array(9).fill(null));
    setTour('X');
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Choix value={aDeux ? 'deux' : 'seul'} onChange={(v) => { setADeux(v === 'deux'); rejouer(); }}
          options={[{ id: 'seul', label: '👤 Contre l’app' }, { id: 'deux', label: '👥 À deux' }]} />
        {!aDeux && (
          <Choix value={niveau} onChange={(v) => { setNiveau(v); rejouer(); }}
            options={[{ id: 'facile', label: 'Facile' }, { id: 'moyen', label: 'Moyen' }, { id: 'difficile', label: 'Difficile' }]} />
        )}
      </div>

      <Bandeau ton={fini && win ? (g[win[0]] === 'X' ? 'gagne' : aDeux ? 'gagne' : 'perdu') : 'info'}>
        {fini
          ? win ? `${g[win[0]]} gagne la partie!` : 'Partie nulle — personne ne gagne.'
          : aDeux ? `Au tour de ${tour}` : tour === 'X' ? 'À toi (X)' : 'L’app réfléchit…'}
      </Bandeau>

      <div className="grid grid-cols-3 gap-2 mx-auto mb-4" style={{ maxWidth: 320 }}>
        {g.map((v, i) => {
          const gagnante = win && win.includes(i);
          return (
            <button key={i} onClick={() => joue(i)} disabled={!!v || fini}
              className="aspect-square rounded-2xl border bg-white font-heading text-5xl font-extrabold flex items-center justify-center transition-all active:scale-95 disabled:cursor-default"
              style={{
                borderColor: gagnante ? 'var(--fox)' : 'rgb(var(--c-s1))',
                background: gagnante ? 'var(--sb-brand-bg)' : 'white',
                color: v === 'X' ? 'var(--fox-d)' : '#0f766e',
                ...card,
              }}>
              {v}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-s4">
          <b className="text-stone">X {scores.X}</b> · <b className="text-stone">O {scores.O}</b> · nulles {scores.nul}
        </p>
        <button onClick={rejouer} className="inline-flex items-center gap-1.5 text-sm font-semibold text-fox-d">
          <RotateCcw size={15} /> Nouvelle partie
        </button>
      </div>
    </div>
  );
}

// ==================================================================== Puissance 4
const COLS = 7, ROWS = 6;
const caseP4 = (grille, c, r) => grille[c * ROWS + r];

function gagnantP4(grille) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const v = caseP4(grille, c, r);
      if (!v) continue;
      for (const [dc, dr] of dirs) {
        const suite = [[c, r]];
        for (let k = 1; k < 4; k++) {
          const cc = c + dc * k, rr = r + dr * k;
          if (cc < 0 || cc >= COLS || rr < 0 || rr >= ROWS || caseP4(grille, cc, rr) !== v) break;
          suite.push([cc, rr]);
        }
        if (suite.length === 4) return { joueur: v, cases: suite.map(([x, y]) => x * ROWS + y) };
      }
    }
  }
  return null;
}

const colonnesLibres = (grille) => Array.from({ length: COLS }, (_, c) => c).filter((c) => !caseP4(grille, c, ROWS - 1));
function pose(grille, c, joueur) {
  const n = [...grille];
  for (let r = 0; r < ROWS; r++) if (!caseP4(n, c, r)) { n[c * ROWS + r] = joueur; return n; }
  return n;
}

function Puissance4() {
  const [grille, setGrille] = useState(Array(COLS * ROWS).fill(null));
  const [tour, setTour] = useState('R');
  const [aDeux, setADeux] = useState(false);
  const win = useMemo(() => gagnantP4(grille), [grille]);
  const fini = !!win || colonnesLibres(grille).length === 0;

  useEffect(() => {
    if (aDeux || fini || tour !== 'J') return;
    const t = setTimeout(() => {
      const libres = colonnesLibres(grille);
      // gagner, sinon bloquer, sinon le plus au centre
      const choisir = () => {
        for (const j of ['J', 'R']) {
          for (const c of libres) if (gagnantP4(pose(grille, c, j))) return c;
        }
        return libres.sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3))[0];
      };
      setGrille((g) => pose(g, choisir(), 'J'));
      setTour('R');
    }, 450);
    return () => clearTimeout(t);
  }, [tour, fini, aDeux, grille]);

  function joue(c) {
    if (fini || (!aDeux && tour === 'J') || caseP4(grille, c, ROWS - 1)) return;
    setGrille((g) => pose(g, c, tour));
    setTour(tour === 'R' ? 'J' : 'R');
  }

  const couleur = (v) => (v === 'R' ? '#ef4444' : v === 'J' ? '#facc15' : '#fff');

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Choix value={aDeux ? 'deux' : 'seul'}
          onChange={(v) => { setADeux(v === 'deux'); setGrille(Array(COLS * ROWS).fill(null)); setTour('R'); }}
          options={[{ id: 'seul', label: '👤 Contre l’app' }, { id: 'deux', label: '👥 À deux' }]} />
      </div>

      <Bandeau ton={win ? (win.joueur === 'R' ? 'gagne' : aDeux ? 'gagne' : 'perdu') : 'info'}>
        {win ? `${win.joueur === 'R' ? '🔴 Rouge' : '🟡 Jaune'} aligne 4 jetons!`
          : fini ? 'Grille pleine — partie nulle.'
            : aDeux ? `Au tour de ${tour === 'R' ? '🔴 Rouge' : '🟡 Jaune'}` : tour === 'R' ? 'À toi 🔴' : 'L’app réfléchit…'}
      </Bandeau>

      <div className="mx-auto mb-4 rounded-2xl p-2" style={{ maxWidth: 360, background: 'var(--sb-grad)' }}>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: COLS }, (_, c) => (
            <div key={c} className="flex flex-col-reverse gap-1.5">
              {Array.from({ length: ROWS }, (_, r) => {
                const v = caseP4(grille, c, r);
                const dansWin = win && win.cases.includes(c * ROWS + r);
                return (
                  <button key={r} onClick={() => joue(c)} disabled={fini}
                    className="aspect-square rounded-full border-2 transition-transform active:scale-95"
                    style={{ background: couleur(v), borderColor: dansWin ? '#111' : 'rgba(255,255,255,.65)' }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => { setGrille(Array(COLS * ROWS).fill(null)); setTour('R'); }}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-fox-d">
        <RotateCcw size={15} /> Nouvelle partie
      </button>
    </div>
  );
}

// ==================================================================== Échecs
const PIECES = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};
const NOM_FR = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
const VALEUR = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

// L'app joue: elle prend la meilleure pièce si elle peut, sinon au hasard (sans gaffe évidente)
function coupEchecs(jeu, niveau) {
  const coups = jeu.moves({ verbose: true });
  if (!coups.length) return null;
  if (niveau === 'facile') return pick(coups);
  const note = (c) => {
    let n = c.captured ? VALEUR[c.captured] * 10 : 0;
    const essai = new Chess(jeu.fen());
    essai.move(c);
    if (essai.isCheckmate()) n += 1000;
    else if (essai.isCheck()) n += 3;
    if (niveau === 'moyen') return n + Math.random() * 4;
    // « fort »: on regarde aussi ce que l'adversaire peut reprendre juste après
    const ripostes = essai.moves({ verbose: true });
    const pire = ripostes.reduce((m, r) => Math.max(m, r.captured ? VALEUR[r.captured] * 10 : 0), 0);
    return n - pire + Math.random();
  };
  return coups.reduce((best, c) => (note(c) > note(best) ? c : best), coups[0]);
}

function Echecs() {
  const [jeu] = useState(() => new Chess());
  const [fen, setFen] = useState(jeu.fen());
  const [aDeux, setADeux] = useState(false);
  const [niveau, setNiveau] = useState('moyen');
  const [depart, setDepart] = useState(null);
  const [dernier, setDernier] = useState(null);
  const [pris, setPris] = useState({ w: [], b: [] });

  const cases = useMemo(() => {
    const plateau = jeu.board();
    return plateau.flatMap((rang, r) => rang.map((p, c) => ({
      case: 'abcdefgh'[c] + (8 - r),
      piece: p ? PIECES[p.color + p.type] : '',
      sombre: (r + c) % 2 === 1,
    })));
  }, [fen, jeu]);

  const possibles = useMemo(
    () => (depart ? jeu.moves({ square: depart, verbose: true }).map((m) => m.to) : []),
    [depart, fen, jeu],
  );

  useEffect(() => {
    if (aDeux || jeu.isGameOver() || jeu.turn() !== 'b') return;
    const t = setTimeout(() => {
      const c = coupEchecs(jeu, niveau);
      if (!c) return;
      const fait = jeu.move(c);
      if (fait?.captured) setPris((p) => ({ ...p, b: [...p.b, PIECES['w' + fait.captured]] }));
      setDernier({ from: fait.from, to: fait.to });
      setFen(jeu.fen());
    }, 480);
    return () => clearTimeout(t);
  }, [fen, aDeux, niveau, jeu]);

  function touche(sq) {
    if (jeu.isGameOver()) return;
    if (!aDeux && jeu.turn() === 'b') return;
    if (depart && possibles.includes(sq)) {
      const fait = jeu.move({ from: depart, to: sq, promotion: 'q' });
      if (fait?.captured) {
        const couleurPrise = fait.color === 'w' ? 'b' : 'w';
        setPris((p) => ({ ...p, [fait.color]: [...p[fait.color], PIECES[couleurPrise + fait.captured]] }));
      }
      setDernier({ from: fait.from, to: fait.to });
      setDepart(null);
      setFen(jeu.fen());
      return;
    }
    const p = jeu.get(sq);
    setDepart(p && p.color === jeu.turn() ? sq : null);
  }

  function rejouer() {
    jeu.reset();
    setDepart(null); setDernier(null); setPris({ w: [], b: [] }); setFen(jeu.fen());
  }

  const message = () => {
    if (jeu.isCheckmate()) return jeu.turn() === 'w' ? 'Échec et mat — les noirs gagnent!' : 'Échec et mat — les blancs gagnent!';
    if (jeu.isStalemate()) return 'Pat: personne ne gagne.';
    if (jeu.isDraw()) return 'Partie nulle.';
    if (jeu.isCheck()) return 'Échec au roi!';
    if (!aDeux && jeu.turn() === 'b') return 'L’app réfléchit…';
    return jeu.turn() === 'w' ? 'Aux blancs de jouer' : 'Aux noirs de jouer';
  };
  const ton = jeu.isCheckmate() ? (jeu.turn() === 'w' ? 'perdu' : 'gagne') : 'info';

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Choix value={aDeux ? 'deux' : 'seul'} onChange={(v) => { setADeux(v === 'deux'); rejouer(); }}
          options={[{ id: 'seul', label: '👤 Contre l’app' }, { id: 'deux', label: '👥 À deux' }]} />
        {!aDeux && (
          <Choix value={niveau} onChange={setNiveau}
            options={[{ id: 'facile', label: 'Facile' }, { id: 'moyen', label: 'Moyen' }, { id: 'fort', label: 'Fort' }]} />
        )}
      </div>

      <Bandeau ton={ton}>{message()}</Bandeau>

      <div className="mx-auto mb-3" style={{ maxWidth: 380 }}>
        <div className="grid grid-cols-8 rounded-xl overflow-hidden" style={{ boxShadow: '0 6px 20px rgba(44,32,23,.18)' }}>
          {cases.map((c) => {
            const cible = possibles.includes(c.case);
            const choisie = depart === c.case;
            const bouge = dernier && (dernier.from === c.case || dernier.to === c.case);
            return (
              <button key={c.case} onClick={() => touche(c.case)}
                className="aspect-square flex items-center justify-center relative"
                style={{
                  background: choisie ? '#fbbf24' : bouge ? '#fde68a' : c.sombre ? '#b58863' : '#f0d9b5',
                  fontSize: 'clamp(20px, 6.4vw, 34px)',
                  lineHeight: 1,
                }}>
                <span style={{ color: '#1c1917', textShadow: '0 1px 0 rgba(255,255,255,.35)' }}>{c.piece}</span>
                {cible && (
                  <span className="absolute rounded-full" style={{
                    width: c.piece ? '78%' : '30%', height: c.piece ? '78%' : '30%',
                    border: c.piece ? '3px solid rgba(22,101,52,.75)' : 'none',
                    background: c.piece ? 'transparent' : 'rgba(22,101,52,.55)',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-s4">
          {pris.w.length > 0 && <>Tu as pris {pris.w.join(' ')} </>}
          {pris.b.length > 0 && <>· l’app a pris {pris.b.join(' ')}</>}
        </span>
        <button onClick={rejouer} className="inline-flex items-center gap-1.5 font-semibold text-fox-d">
          <RotateCcw size={15} /> Nouvelle partie
        </button>
      </div>
      <p className="text-[12px] text-s4 mt-2">
        Touche une pièce: les points verts montrent où elle a le droit d’aller. {NOM_FR.n[0].toUpperCase() + NOM_FR.n.slice(1)}, fou, tour, dame, roi: toutes les règles sont respectées (roque, prise en passant, promotion en dame).
      </p>
    </div>
  );
}

// ==================================================================== Écran
const JEUX = [
  { id: 'morpion', label: 'Tic-tac-toe', icon: Grid3x3, desc: 'Trois de suite', C: TicTacToe },
  { id: 'p4', label: 'Puissance 4', icon: Circle, desc: 'Quatre jetons alignés', C: Puissance4 },
  { id: 'echecs', label: 'Échecs', icon: Crown, desc: 'Les vraies règles', C: Echecs },
];

export default function Jeux({ onHome }) {
  const [jeu, setJeu] = useState('morpion');
  const Actif = JEUX.find((j) => j.id === jeu).C;

  return (
    <div className="relative z-[1] max-w-2xl mx-auto px-5 pt-6 pb-16">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onHome} className="inline-flex items-center gap-1.5 text-sm font-semibold text-s4 hover:text-stone">
          <ArrowLeft size={16} /> Accueil
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fox-d bg-white rounded-full px-3 py-1.5 border border-s1">
          <Trophy size={13} /> La pause
        </span>
      </div>

      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-stone mb-1">🎮 Les jeux</h1>
      <p className="text-sm text-s4 mb-5">Joue contre l’app ou à deux sur le même appareil.</p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {JEUX.map((j) => {
          const on = jeu === j.id;
          const Icon = j.icon;
          return (
            <button key={j.id} onClick={() => setJeu(j.id)}
              className={`rounded-2xl border px-2 py-3 text-center transition-all active:scale-95 ${on ? 'border-transparent' : 'border-s1 bg-white hover:border-fox'}`}
              style={on ? { background: 'var(--sb-brand-bg)', boxShadow: 'inset 0 0 0 2px var(--fox)' } : card}>
              <Icon size={22} className="mx-auto mb-1" style={{ color: on ? 'var(--fox-d)' : 'rgb(var(--c-s4))' }} />
              <span className={`block text-[13px] leading-tight ${on ? 'font-bold text-stone' : 'font-semibold text-s6'}`}>{j.label}</span>
              <span className="block text-[11px] text-s4">{j.desc}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-s1 p-4 sm:p-5" style={card}>
        <Actif />
      </div>
    </div>
  );
}
