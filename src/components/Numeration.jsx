import React from 'react';

// Représentations des nombres dessinées par l'app, dans le style du cahier Matcha:
// blocs base 10, tableau de numération (chiffres ou jetons) et abaque.
// Dessinées en code (pas par le graphiste IA): le nombre de blocs est toujours EXACT,
// et chaque question a son propre dessin.

const S = 8; // taille d'un petit cube (px)
const OUTLINE = '#3b3b4f';

const COLORS = {
  um: { front: '#b9d3ee', top: '#d6e6f7', side: '#93b6dc' },
  c: { front: '#b5dcae', top: '#d3ecce', side: '#8fc487' },
  d: { front: '#f7b58a', top: '#fbd2b6', side: '#e39461' },
  u: { front: '#f8e38a', top: '#fcefbb', side: '#e7c95a' },
};

// Un bloc en 3/4: une face avant quadrillée (cols × rows), une face du dessus et une
// face de côté de « depth » cubes de profondeur.
function Block({ x, y, cols, rows, depth, color }) {
  const w = cols * S;
  const h = rows * S;
  const ox = depth * S * 0.5;
  const oy = -depth * S * 0.5;
  const lines = [];
  for (let i = 1; i < cols; i++) lines.push(<line key={`fv${i}`} x1={x + i * S} y1={y} x2={x + i * S} y2={y + h} />);
  for (let j = 1; j < rows; j++) lines.push(<line key={`fh${j}`} x1={x} y1={y + j * S} x2={x + w} y2={y + j * S} />);
  // dessus: lignes de profondeur + lignes parallèles à l'avant
  for (let i = 1; i < cols; i++) lines.push(<line key={`tv${i}`} x1={x + i * S} y1={y} x2={x + i * S + ox} y2={y + oy} />);
  for (let k = 1; k < depth; k++) {
    const f = k / depth;
    lines.push(<line key={`th${k}`} x1={x + ox * f} y1={y + oy * f} x2={x + w + ox * f} y2={y + oy * f} />);
    lines.push(<line key={`sv${k}`} x1={x + w + ox * f} y1={y + oy * f} x2={x + w + ox * f} y2={y + h + oy * f} />);
  }
  for (let j = 1; j < rows; j++) lines.push(<line key={`sh${j}`} x1={x + w} y1={y + j * S} x2={x + w + ox} y2={y + j * S + oy} />);
  return (
    <g stroke={OUTLINE} strokeWidth="0.6" strokeLinejoin="round">
      <polygon points={`${x},${y} ${x + ox},${y + oy} ${x + w + ox},${y + oy} ${x + w},${y}`} fill={color.top} />
      <polygon points={`${x + w},${y} ${x + w + ox},${y + oy} ${x + w + ox},${y + h + oy} ${x + w},${y + h}`} fill={color.side} />
      <rect x={x} y={y} width={w} height={h} fill={color.front} />
      <g strokeWidth="0.35" opacity="0.75">{lines}</g>
    </g>
  );
}

// Dispose n blocs en rangées; `group` = nombre de blocs avant un espace plus grand
function Group({ n, cols, rows, depth, color, perRow, group, gap, bigGap, label }) {
  if (!n) return null;
  const bw = cols * S + depth * S * 0.5;
  const bh = rows * S + depth * S * 0.5;
  const nRows = Math.ceil(n / perRow);
  const inRow = Math.min(n, perRow);
  const groupsInRow = Math.ceil(inRow / group);
  const width = inRow * bw + (inRow - groupsInRow) * gap + (groupsInRow - 1) * bigGap + 4;
  const height = nRows * (bh + gap * 2) + 4;
  const blocks = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / perRow);
    const idx = i % perRow;
    const g = Math.floor(idx / group);
    const x = 2 + idx * bw + (idx - g) * gap + g * bigGap;
    const y = 2 + depth * S * 0.5 + r * (bh + gap * 2);
    blocks.push(<Block key={i} x={x} y={y} cols={cols} rows={rows} depth={depth} color={color} />);
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width * 1.15} height={height * 1.15}
      style={{ maxWidth: '100%', height: 'auto' }} role="img" aria-label={label}>
      {blocks}
    </svg>
  );
}

export function BlocsBase10({ um = 0, c = 0, d = 0, u = 0 }) {
  return (
    <div className="bg-white rounded-xl border-2 border-s1 p-3 mb-4 flex flex-wrap items-end justify-center gap-x-6 gap-y-4">
      <Group n={um} cols={10} rows={10} depth={10} color={COLORS.um} perRow={3} group={3} gap={6} bigGap={6} label={`${um} gros cubes`} />
      <Group n={c} cols={10} rows={10} depth={1} color={COLORS.c} perRow={5} group={5} gap={6} bigGap={6} label={`${c} plaques`} />
      {/* bâtonnets: par paquets de 10, comme au cahier */}
      <Group n={d} cols={1} rows={10} depth={1} color={COLORS.d} perRow={10} group={10} gap={3} bigGap={3} label={`${d} bâtonnets`} />
      {/* petits cubes: par 5 pour les compter facilement */}
      <Group n={u} cols={1} rows={1} depth={1} color={COLORS.u} perRow={10} group={5} gap={4} bigGap={12} label={`${u} petits cubes`} />
    </div>
  );
}

const COLONNES = [
  { cle: 'um', nom: 'um', couleur: 'bg-blue-50 text-blue-800', jeton: '#6b9bd1' },
  { cle: 'c', nom: 'c', couleur: 'bg-green-50 text-green-800', jeton: '#6fb563' },
  { cle: 'd', nom: 'd', couleur: 'bg-orange-50 text-orange-800', jeton: '#e8864a' },
  { cle: 'u', nom: 'u', couleur: 'bg-yellow-50 text-yellow-800', jeton: '#d9b52c' },
];

// Tableau de numération: `jetons` = des jetons à compter dans chaque colonne; sinon des chiffres
export function TableauNumeration({ um = 0, c = 0, d = 0, u = 0, jetons = false }) {
  const v = { um, c, d, u };
  return (
    <div className="mb-4 overflow-x-auto">
      <table className="mx-auto border-2 border-stone rounded-xl overflow-hidden text-center" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {COLONNES.map((col) => (
              <th key={col.cle} className={`px-4 py-1.5 font-heading font-extrabold text-sm border-b-2 border-stone ${col.couleur}`}>{col.nom}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {COLONNES.map((col, i) => (
              <td key={col.cle} className={`bg-white align-middle ${i > 0 ? 'border-l-2 border-stone' : ''}`} style={{ width: jetons ? 84 : 64, height: jetons ? 84 : 56 }}>
                {jetons ? (
                  <div className="grid grid-cols-3 gap-1 justify-items-center px-1.5 py-1.5">
                    {Array.from({ length: v[col.cle] }, (_, k) => (
                      <span key={k} className="block rounded-full" style={{ width: 16, height: 16, background: col.jeton, border: `1.5px solid ${OUTLINE}` }} />
                    ))}
                  </div>
                ) : (
                  <span className="font-heading text-3xl font-extrabold text-stone">{v[col.cle]}</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Abaque: 4 tiges (um, c, d, u) avec des anneaux empilés
export function Abaque({ um = 0, c = 0, d = 0, u = 0 }) {
  const v = [um, c, d, u];
  const ring = 11;
  const width = 250;
  const baseY = 150;
  return (
    <div className="mb-4 flex justify-center">
      <svg viewBox={`0 0 ${width} 185`} width={width * 1.2} style={{ maxWidth: '100%', height: 'auto' }} role="img" aria-label={`abaque ${um} ${c} ${d} ${u}`}>
        <rect x="10" y={baseY} width={width - 20} height="14" rx="4" fill="#c9a27a" stroke={OUTLINE} strokeWidth="1.2" />
        {COLONNES.map((col, i) => {
          const x = 45 + i * 53;
          return (
            <g key={col.cle}>
              <rect x={x - 2.5} y="28" width="5" height={baseY - 28} fill="#8a8a9a" stroke={OUTLINE} strokeWidth="0.8" />
              {Array.from({ length: v[i] }, (_, k) => (
                <rect key={k} x={x - 16} y={baseY - (k + 1) * ring} width="32" height={ring - 1.5} rx="5" fill={col.jeton} stroke={OUTLINE} strokeWidth="1" />
              ))}
              <text x={x} y="180" textAnchor="middle" fontSize="13" fontWeight="800" fill={OUTLINE}>{col.nom}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
