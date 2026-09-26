import React from 'react';

// Nos icônes, pas des émojis.
//
// Les émojis ne sont pas à nous: ils changent de dessin d'un appareil à
// l'autre (le 🎤 d'un iPad n'est pas celui d'un PC), ils ne suivent pas la
// couleur du profil, et ils donnent à l'app l'air d'un message texte plutôt
// que d'un outil. Les modules de Ryan avaient déjà des SVG propres — le reste
// suit maintenant.
//
// Ce qui reste en émoji, volontairement: les IMAGES DES EXERCICES de Nyla.
// Quand on lui demande de compter des pommes ou de trouver le carré rouge,
// l'émoji EST la question. Ce sont des dessins de contenu, pas des icônes
// d'interface — et les remplacer demande de vraies illustrations (voir
// studio/), pas des SVG d'interface.
//
// Toutes prennent la couleur du texte parent (`currentColor`), donc elles
// s'adaptent au profil et au mode sombre sans réglage.

function Svg({ size = 20, children, ...r }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: '-0.2em', flexShrink: 0 }} {...r}>
      {children}
    </svg>
  );
}

// Elle parle: un haut-parleur avec deux ondes.
export const IconVoix = (p) => (
  <Svg {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M17 8.5a5 5 0 0 1 0 7" />
    <path d="M19.5 6a8.5 8.5 0 0 1 0 12" />
  </Svg>
);

// À toi de parler / j'écoute: un micro.
export const IconMicro = (p) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </Svg>
);

// Redire la consigne: une flèche qui tourne.
export const IconRepete = (p) => (
  <Svg {...p}>
    <path d="M20 11a8 8 0 1 0-2.3 5.7" />
    <path d="M20 5v6h-6" />
  </Svg>
);

// Je réfléchis: trois points dans une bulle.
export const IconReflechit = (p) => (
  <Svg {...p}>
    <path d="M21 12a8 8 0 1 1-3.1-6.3" />
    <circle cx="8.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="12" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

// Vérifie le texte: un crayon.
export const IconCrayon = (p) => (
  <Svg {...p}>
    <path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4z" />
    <path d="M13.5 6.5l4 4" />
  </Svg>
);

// C'est bon.
export const IconCoche = (p) => (
  <Svg {...p}><path d="M4 12.5l5.5 5.5L20 7" /></Svg>
);

// On y va / suivant.
export const IconFleche = (p) => (
  <Svg {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Svg>
);

// Fini: une coupe.
export const IconTrophee = (p) => (
  <Svg {...p}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 4" />
    <path d="M17 6h2.5a2.5 2.5 0 0 1-2.5 4" />
    <path d="M10 18h4" /><path d="M12 14v4" /><path d="M8 21h8" />
  </Svg>
);

// Le départ du chemin.
export const IconMaison = (p) => (
  <Svg {...p}>
    <path d="M4 11l8-6 8 6" />
    <path d="M6 10v9h12v-9" />
  </Svg>
);

// Une pause.
export const IconPause = (p) => (
  <Svg {...p}><path d="M9 5v14" /><path d="M15 5v14" /></Svg>
);

// Lire / le livre.
export const IconLivre = (p) => (
  <Svg {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" />
    <path d="M19 18v3H6.5A2.5 2.5 0 0 1 4 18.5" />
  </Svg>
);

// L'œil du parent: voir ce qui est caché à l'enfant.
export const IconOeil = (p) => (
  <Svg {...p}>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
    <circle cx="12" cy="12" r="2.5" />
  </Svg>
);

export const IconOeilBarre = (p) => (
  <Svg {...p}>
    <path d="M2 12s3.5-6 10-6c2 0 3.7.6 5.1 1.4" />
    <path d="M21.5 13.5A15 15 0 0 1 12 18C5.5 18 2 12 2 12" />
    <path d="M4 20L20 4" />
  </Svg>
);

// Une bulle de conversation: « On jase ».
export const IconBulle = (p) => (
  <Svg {...p}>
    <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6.5A8 8 0 0 1 11 4h2a8 8 0 0 1 8 8z" />
  </Svg>
);

// Une cible: « Les questions », des consignes precises.
export const IconCible = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </Svg>
);
