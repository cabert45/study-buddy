import React from 'react';

// La droite numérique, dessinée en code — jamais une image.
// Même raison que l'horloge et les blocs: un trait mal placé change la
// réponse, et un modèle d'images ne sait pas compter.
//
// Deux usages, les deux de la feuille AS.2.02 (19 oct.):
//   • `vides` > 0 : la droite du cahier, des nombres sous les traits et des
//     cases vides au bout (« trouve le pas, écris les 2 nombres manquants »);
//   • `point` : arrondir. Le nombre est posé ENTRE ses deux centaines (ou
//     dizaines), au trait près. On voit qu'il reste dans les 1 000 — c'est
//     exactement ce qu'il perdait (1 312 → « 300 »).

const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const W = 340;
const PAD = 26;
const Y = 46;
const TRAIT = '#3b3b4f';
const ACCENT = '#c2410c';

export default function DroiteNumerique({ marques, vides = 0, point = null, etiquettes = null }) {
  const n = marques.length + vides;
  const x = (i) => PAD + (i * (W - 2 * PAD)) / Math.max(1, n - 1);
  // `etiquettes` = les indices dont on écrit le nombre (arrondir: les deux bouts et le milieu).
  const montre = (i) => !etiquettes || etiquettes.includes(i);
  let px = null;
  if (point) {
    const a = marques[0];
    const b = marques[marques.length - 1];
    px = PAD + ((point.valeur - a) / (b - a)) * (W - 2 * PAD);
  }
  return (
    <div className="flex justify-center mb-4">
      <svg viewBox={`0 0 ${W} 92`} width="100%" style={{ maxWidth: 420 }} role="img"
        aria-label={`Droite numérique: ${marques.map(fmt).join(', ')}${vides ? `, puis ${vides} cases vides` : ''}`}>
        <line x1={PAD - 10} y1={Y} x2={W - 8} y2={Y} stroke={TRAIT} strokeWidth="2.5" />
        <path d={`M ${W - 8} ${Y} l -9 -5 v 10 z`} fill={TRAIT} />
        {Array.from({ length: n }, (_, i) => (
          <line key={`t${i}`} x1={x(i)} y1={Y - 8} x2={x(i)} y2={Y + 8} stroke={TRAIT}
            strokeWidth={montre(i) ? 2.5 : 1.5} />
        ))}
        {marques.map((m, i) => montre(i) && (
          <text key={`m${i}`} x={x(i)} y={Y + 26} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={TRAIT}>
            {fmt(m)}
          </text>
        ))}
        {Array.from({ length: vides }, (_, k) => {
          const i = marques.length + k;
          return (
            <rect key={`v${k}`} x={x(i) - 22} y={Y + 13} width="44" height="20" rx="3"
              fill="#fff7ed" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 3" />
          );
        })}
        {point && (
          <g>
            <path d={`M ${px} ${Y - 10} l -6 -10 h 12 z`} fill={ACCENT} />
            <text x={px} y={Y - 25} textAnchor="middle" fontSize="13" fontWeight="800" fill={ACCENT}>
              {fmt(point.valeur)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
