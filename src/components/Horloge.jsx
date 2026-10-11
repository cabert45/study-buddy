import React from 'react';

// L'horloge à aiguilles, dessinée en code — jamais une image.
// Même raison que les blocs base 10 (components/Numeration): sur une image, le
// nombre n'est pas garanti, et ici c'est pire — une aiguille à un degré près
// change la réponse. Chaque question dessine son propre cadran, exact.
//
// Ce que le cahier Matcha (Aide-mémoire p. 12-13) demande à un enfant de 3e:
// la PETITE aiguille donne l'heure, la GRANDE donne les minutes, et les
// minutes se comptent de 5 en 5 sur les mêmes chiffres. Les deux pièges de
// cet âge sont dessinés exprès:
//   1. les deux aiguilles sont de longueur ET de couleur franchement
//      différentes, avec une légende — « j'ai lu les aiguilles à l'envers »
//      est l'erreur n° 1 (2 h 50 lu « 10 h 10 »);
//   2. à 3 h 50 la petite aiguille est presque sur le 4. Elle est donc
//      dessinée à sa vraie position (elle avance avec les minutes), pas collée
//      sur le 3 — sinon l'app enseignerait une horloge qui n'existe pas.

const R = 100;           // rayon du cadran
const PAD = 14;          // marge pour les chiffres des minutes
const SIZE = (R + PAD) * 2;
const CX = R + PAD;
const CY = R + PAD;

const OUTLINE = '#3b3b4f';
const HEURE = '#c2410c';   // petite aiguille — orange foncé (fox-d)
const MINUTE = '#1d4ed8';  // grande aiguille — bleu

// 12 h = en haut, puis on tourne dans le sens des aiguilles.
function pointAt(fraction, rayon) {
  const a = (fraction * 2 * Math.PI) - Math.PI / 2;
  return [CX + Math.cos(a) * rayon, CY + Math.sin(a) * rayon];
}

// `ring24` = l'anneau interieur 13..24 des cadrans du cahier Matcha. Il ne
// decore pas: l'exercice 5 de AS.1.14 demande DEUX reponses par horloge
// (« 1 h 45 ou 13 h 45 »), et c'est cet anneau qui les donne.
// `sansAiguilles` = le cadran vide de l'exercice 6, « dessine les aiguilles ».
// Sans lui, « ou pointe la grande aiguille? » s'affichait sans aucun dessin —
// la question que Ryan a eue a l'ecran le 11 oct.
export function Horloge({ h = 12, min = 0, aide = false, taille = 220,
  ring24 = false, sansAiguilles = false, montrerHeure = false }) {
  const heure12 = ((h % 12) + 12) % 12;
  // La petite aiguille avance pendant l'heure: à 3 h 30 elle est entre 3 et 4.
  const fracHeure = (heure12 + min / 60) / 12;
  const fracMinute = min / 60;

  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const gros = i % 5 === 0;
    const [x1, y1] = pointAt(i / 60, R - (gros ? 12 : 6));
    const [x2, y2] = pointAt(i / 60, R - 2);
    ticks.push(
      <line key={`t${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={gros ? OUTLINE : '#9ca3af'} strokeWidth={gros ? 3 : 1.5} strokeLinecap="round" />
    );
  }

  const chiffres = [];
  for (let i = 1; i <= 12; i++) {
    const [x, y] = pointAt(i / 12, R - 30);
    chiffres.push(
      <text key={`c${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central"
        fontSize="22" fontWeight="800" fill={OUTLINE}>{i}</text>
    );
    // L'anneau des minutes: le 3 vaut aussi 15, le 7 vaut aussi 35. C'est la
    // seule chose à savoir pour lire les minutes, et elle ne s'écrit nulle
    // part sur une vraie horloge — d'où le mode « aide ».
    if (aide) {
      const [mx, my] = pointAt(i / 12, R + 9);
      chiffres.push(
        <text key={`m${i}`} x={mx} y={my} textAnchor="middle" dominantBaseline="central"
          fontSize="13" fontWeight="700" fill={MINUTE}>{(i * 5) % 60}</text>
      );
    }
    // L'anneau 13..24, a l'interieur, comme sur les horloges du cahier.
    if (ring24) {
      const [ix, iy] = pointAt(i / 12, R - 48);
      chiffres.push(
        <text key={`i${i}`} x={ix} y={iy} textAnchor="middle" dominantBaseline="central"
          fontSize="12" fontWeight="700" fill="#6b7280">{i + 12}</text>
      );
    }
  }

  const [hx, hy] = pointAt(fracHeure, R * 0.52);
  const [mx2, my2] = pointAt(fracMinute, R * 0.80);

  return (
    <div className="mb-4">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={taille} height={taille}
        className="block mx-auto" role="img"
        aria-label={`Horloge: ${heure12 === 0 ? 12 : heure12} heures ${min} minutes`}>
        <circle cx={CX} cy={CY} r={R} fill="#ffffff" stroke={OUTLINE} strokeWidth="4" />
        {ticks}
        {chiffres}
        {/* grande aiguille (minutes) — longue et fine */}
        {!sansAiguilles && (
          <line x1={CX} y1={CY} x2={mx2} y2={my2} stroke={MINUTE} strokeWidth="5" strokeLinecap="round" />
        )}
        {/* petite aiguille (heures) — courte et épaisse, dessinée par-dessus.
            `montrerHeure` la garde seule sur un cadran sinon vide: l'enfant
            doit placer la grande, pas deviner l'heure. */}
        {(!sansAiguilles || montrerHeure) && (
          <line x1={CX} y1={CY} x2={hx} y2={hy} stroke={HEURE} strokeWidth="9" strokeLinecap="round" />
        )}
        <circle cx={CX} cy={CY} r="6" fill={OUTLINE} />
      </svg>
      <div className="flex justify-center gap-4 mt-1 text-xs font-bold">
        {(!sansAiguilles || montrerHeure) && <span style={{ color: HEURE }}>▬ petite = les heures</span>}
        {!sansAiguilles && <span style={{ color: MINUTE }}>— grande = les minutes</span>}
        {sansAiguilles && !montrerHeure && <span className="text-s4">cadran vide — à toi de placer les aiguilles</span>}
      </div>
    </div>
  );
}

// L'affichage numérique: « 3 h 45 ». Sert aux questions à l'envers (on donne
// l'heure écrite, il doit dire ce que montrent les aiguilles) et au corrigé.
export function HorlogeNumerique({ h = 12, min = 0 }) {
  return (
    <div className="mx-auto my-3 w-fit px-6 py-3 rounded-xl border-4 border-stone bg-stone"
      style={{ background: '#1f2937' }}>
      <span className="font-extrabold text-4xl tracking-wider" style={{ color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>
        {h} : {String(min).padStart(2, '0')}
      </span>
    </div>
  );
}

export default Horloge;
