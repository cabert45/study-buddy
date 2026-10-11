import React from 'react';

// Droites et angles, dessinés en code — Matcha 3e, thème 1 (p. 25 et 28),
// feuille de consolidation AS.1.11.
//
// Même règle que les blocs base 10 et l'horloge (components/Numeration,
// components/Horloge): ce qui doit être EXACT se dessine, ne se photographie
// pas et ne se demande pas à une image générée. Ici c'est encore plus vrai
// qu'ailleurs: un angle « droit » dessiné à 85° est un angle aigu, et la
// bonne réponse devient fausse. Chaque figure vient donc d'un angle en
// degrés, calculé.

const TRAIT = '#3b3b4f';
const ACCENT = '#c2410c';

// Un cadre comme ceux du cahier: coins arrondis, fond blanc.
function Cadre({ children, taille = 150 }) {
  return (
    <svg viewBox="0 0 160 160" width={taille} height={taille}
      className="block" style={{ flex: 'none' }}>
      <rect x="2" y="2" width="156" height="156" rx="16"
        fill="#ffffff" stroke={TRAIT} strokeWidth="2.5" />
      {children}
    </svg>
  );
}

// ===== Un angle, à partir de sa mesure en degrés =====
// Le sommet est en bas à gauche; un côté part à `base` degrés, l'autre à
// `base + mesure`. L'arc (ou le petit carré de l'angle droit) marque le coin,
// exactement comme dans le cahier.
export function Angle({ mesure = 90, base = 0, taille = 150, marque = true, couleur = TRAIT }) {
  const rad = (d) => (d * Math.PI) / 180;
  // Les deux cotes partent du sommet; on calcule d'abord la figure en unites,
  // PUIS on la recadre pour qu'elle remplisse le cadre.
  //
  // Le sommet etait fixe en bas a gauche: un angle de 160 degres sortait du
  // cadre par la gauche et son cote se coupait net au bord. Vu a l'ecran le
  // 11 oct. Un angle tronque, c'est un angle qu'on ne peut plus reconnaitre.
  const pts = [[0, 0], [Math.cos(rad(base)), -Math.sin(rad(base))],
    [Math.cos(rad(base + mesure)), -Math.sin(rad(base + mesure))]];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const PAD = 26, BOITE = 160 - PAD * 2;
  const ech = Math.min(BOITE / Math.max(maxX - minX, 0.35), BOITE / Math.max(maxY - minY, 0.35));
  const dx = 80 - ((minX + maxX) / 2) * ech;
  const dy = 80 - ((minY + maxY) / 2) * ech;
  const place = ([x, y]) => [x * ech + dx, y * ech + dy];
  const [cx, cy] = place(pts[0]);
  const [x1, y1] = place(pts[1]);
  const [x2, y2] = place(pts[2]);

  // L'angle droit se marque par un petit carre, les autres par un arc: c'est
  // la convention du cahier, et elle se lit d'un coup d'oeil.
  const estDroit = Math.abs(mesure - 90) < 0.5;
  const r = Math.min(26, ech * 0.3);
  const surRayon = (deg, rr) => [cx + Math.cos(rad(deg)) * rr, cy - Math.sin(rad(deg)) * rr];
  const [ax, ay] = surRayon(base, r);
  const [bx, by] = surRayon(base + mesure, r);
  const grandArc = mesure > 180 ? 1 : 0;
  const [qx, qy] = surRayon(base, r);
  const [q2x, q2y] = surRayon(base + 90, r);
  const [q3x, q3y] = [qx + (q2x - cx), qy + (q2y - cy)];

  return (
    <Cadre taille={taille}>
      <line x1={cx} y1={cy} x2={x1} y2={y1} stroke={couleur} strokeWidth="2.6" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={couleur} strokeWidth="2.6" strokeLinecap="round" />
      {marque && (estDroit ? (
        <path d={`M ${qx} ${qy} L ${q3x} ${q3y} L ${q2x} ${q2y}`}
          fill="none" stroke={ACCENT} strokeWidth="2" />
      ) : (
        <path d={`M ${ax} ${ay} A ${r} ${r} 0 ${grandArc} 0 ${bx} ${by}`}
          fill="none" stroke={ACCENT} strokeWidth="2" />
      ))}
      <circle cx={cx} cy={cy} r="3.5" fill={TRAIT} />
    </Cadre>
  );
}

// ===== Deux droites: parallèles, perpendiculaires, ou ni l'un ni l'autre =====
export function DeuxDroites({ relation = 'paralleles', taille = 150 }) {
  // Une inclinaison au hasard serait jolie et illisible: on garde des pentes
  // franches, pour que « parallèle » se voie sans rapporteur.
  const cas = {
    paralleles: [[20, 50, 140, 95], [20, 95, 140, 140]],
    perpendiculaires: [[30, 80, 130, 80], [80, 25, 80, 135]],
    secantes: [[20, 40, 140, 120], [25, 130, 135, 55]],
  };
  const [a, b] = cas[relation] || cas.paralleles;
  const estPerp = relation === 'perpendiculaires';
  return (
    <Cadre taille={taille}>
      <line x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]} stroke={TRAIT} strokeWidth="2.6" strokeLinecap="round" />
      <line x1={b[0]} y1={b[1]} x2={b[2]} y2={b[3]} stroke={TRAIT} strokeWidth="2.6" strokeLinecap="round" />
      {estPerp && (
        <path d="M 80 68 L 92 68 L 92 80" fill="none" stroke={ACCENT} strokeWidth="2" />
      )}
    </Cadre>
  );
}

// ===== Un triangle décrit par ses trois angles =====
// On construit le triangle À PARTIR de ses angles: impossible de dessiner un
// « triangle rectangle » qui n'en serait pas un.
export function Triangle({ angles = [60, 60, 60], taille = 150 }) {
  const [A, B] = angles;
  const rad = (d) => (d * Math.PI) / 180;
  // Côté AB posé à l'horizontale, longueur 1; loi des sinus pour le 3e sommet.
  const C = 180 - A - B;
  const cote = Math.sin(rad(B)) / Math.sin(rad(C));   // longueur AC
  const pts = [
    [0, 0],
    [1, 0],
    [Math.cos(rad(A)) * cote, -Math.sin(rad(A)) * cote],
  ];
  // Recadrer dans la boîte
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const ech = Math.min(110 / (maxX - minX), 110 / (maxY - minY));
  const dx = 80 - ((minX + maxX) / 2) * ech;
  const dy = 80 - ((minY + maxY) / 2) * ech;
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x * ech + dx} ${y * ech + dy}`).join(' ') + ' Z';
  return (
    <Cadre taille={taille}>
      <path d={d} fill="none" stroke={TRAIT} strokeWidth="2.6" strokeLinejoin="round" />
    </Cadre>
  );
}

// Une rangée de figures numérotées, pour les questions « laquelle? ».
export function RangeeFigures({ figures = [], taille = 118 }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      {figures.map((f, i) => (
        <div key={i} className="text-center">
          <div className="text-xs font-extrabold text-s4 mb-1">{f.etiquette || ['a', 'b', 'c', 'd'][i]}</div>
          {f.kind === 'angle' && <Angle {...f} taille={taille} />}
          {f.kind === 'droites' && <DeuxDroites {...f} taille={taille} />}
          {f.kind === 'triangle' && <Triangle {...f} taille={taille} />}
        </div>
      ))}
    </div>
  );
}

export default Angle;
