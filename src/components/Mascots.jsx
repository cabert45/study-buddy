import React from 'react';

// Les mascottes de l'accueil. Toutes dans le même cadre (130 × 160) pour qu'on
// puisse les échanger dans ⚙️ Réglages sans rien décaler.
// Le lion = skin « courage » de Ryan (devise « try again »); le renard = mascotte
// d'origine de l'app. Ours, panda, chat, lapin et licorne: demandés par Cayla, 14 sept. 2026.

const eye = (cx, cy) => (
  <>
    <ellipse cx={cx} cy={cy} rx="4.5" ry="5" fill="#2c2017" />
    <ellipse cx={cx + 1.5} cy={cy - 1.5} rx="1.5" ry="1.8" fill="white" />
  </>
);

const cheeks = (y = 77, color = '#f4a8a8', opacity = 0.45) => (
  <>
    <ellipse cx="48" cy={y} rx="5" ry="3" fill={color} opacity={opacity} />
    <ellipse cx="82" cy={y} rx="5" ry="3" fill={color} opacity={opacity} />
  </>
);

function Frame({ width = 120, animated = true, children }) {
  return (
    <svg className="fox-svg" viewBox="0 0 130 160" width={width} height={width * 1.25} fill="none"
      style={animated ? { animation: 'sb-mascot-bounce 3s ease-in-out infinite' } : undefined}>
      <style>{`
        @keyframes sb-mascot-tail { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(15deg)} }
        @keyframes sb-mascot-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
      {children}
    </svg>
  );
}

const Tail = ({ animated, children }) => (
  <g style={animated ? { transformOrigin: '25px 45px', animation: 'sb-mascot-tail 1.5s ease-in-out infinite' } : undefined}>
    {children}
  </g>
);

// Corps + pattes communs (couleur du pelage, du ventre, des pieds)
const Body = ({ fur, belly, feet, stroke }) => (
  <>
    <ellipse cx="65" cy="115" rx="32" ry="28" fill={fur} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} />
    <ellipse cx="65" cy="120" rx="22" ry="20" fill={belly} />
    <rect x="48" y="128" width="10" height="22" rx="5" fill={fur} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} />
    <rect x="72" y="128" width="10" height="22" rx="5" fill={fur} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} />
    <ellipse cx="53" cy="150" rx="7" ry="3.5" fill={feet} />
    <ellipse cx="77" cy="150" rx="7" ry="3.5" fill={feet} />
  </>
);

function Fox({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <Tail animated={animated}>
        <path d="M25 110Q5 95 10 75Q15 60 30 70Q20 80 28 95Z" fill="#e2762b" />
        <path d="M10 75Q13 65 22 68Q15 73 18 82Z" fill="white" opacity=".7" />
      </Tail>
      <Body fur="#e2762b" belly="#fde8cc" feet="#2c2017" />
      <ellipse cx="65" cy="72" rx="28" ry="24" fill="#e2762b" />
      <ellipse cx="65" cy="76" rx="20" ry="16" fill="#fde8cc" />
      <path d="M40 60L35 35L52 52Z" fill="#e2762b" /><path d="M42 57L38 40L50 52Z" fill="#ffc68a" />
      <path d="M90 60L95 35L78 52Z" fill="#e2762b" /><path d="M88 57L92 40L80 52Z" fill="#ffc68a" />
      {eye(55, 68)}{eye(75, 68)}
      <ellipse cx="65" cy="78" rx="3.5" ry="2.5" fill="#2c2017" />
      <path d="M62 81Q65 85 68 81" stroke="#2c2017" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {cheeks(76, '#f4a84a', 0.35)}
    </Frame>
  );
}

// Un lion: le symbole du courage — regard déterminé, sourcils décidés.
function Lion({ width, animated }) {
  const criniere = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return { cx: 65 + Math.cos(a) * 30, cy: 72 + Math.sin(a) * 28 };
  });
  return (
    <Frame width={width} animated={animated}>
      <Tail animated={animated}>
        <path d="M26 112Q6 96 13 78" stroke="#e0a341" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="74" r="7.5" fill="#a75d12" />
      </Tail>
      <ellipse cx="65" cy="115" rx="31" ry="27" fill="#f0b350" />
      <ellipse cx="65" cy="120" rx="21" ry="19" fill="#ffe3b0" />
      <rect x="48" y="128" width="10" height="22" rx="5" fill="#f0b350" />
      <rect x="72" y="128" width="10" height="22" rx="5" fill="#f0b350" />
      <ellipse cx="53" cy="150" rx="7" ry="3.5" fill="#8a4b0d" />
      <ellipse cx="77" cy="150" rx="7" ry="3.5" fill="#8a4b0d" />
      <g fill="#c9760f">
        {criniere.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r="11" />)}
      </g>
      <circle cx="65" cy="72" r="28" fill="#e09a3c" />
      <circle cx="45" cy="53" r="8" fill="#e09a3c" /><circle cx="45" cy="53" r="4" fill="#ffd39b" />
      <circle cx="85" cy="53" r="8" fill="#e09a3c" /><circle cx="85" cy="53" r="4" fill="#ffd39b" />
      <ellipse cx="65" cy="74" rx="24" ry="22" fill="#f7c46e" />
      <ellipse cx="65" cy="81" rx="16" ry="12" fill="#ffe9c6" />
      <ellipse cx="56" cy="71" rx="4" ry="4.5" fill="#2c2017" />
      <ellipse cx="57.3" cy="69.6" rx="1.4" ry="1.6" fill="white" />
      <ellipse cx="74" cy="71" rx="4" ry="4.5" fill="#2c2017" />
      <ellipse cx="75.3" cy="69.6" rx="1.4" ry="1.6" fill="white" />
      <path d="M51 64.5L60 65.8" stroke="#8a4b0d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M79 64.5L70 65.8" stroke="#8a4b0d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M61 79L69 79L65 83Z" fill="#2c2017" />
      <path d="M65 83V86" stroke="#2c2017" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M59.5 88Q65 92.5 70.5 88" stroke="#2c2017" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

function Bear({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <circle cx="34" cy="122" r="7" fill="#7a4a22" />
      <Body fur="#8b5a2b" belly="#d9a877" feet="#5a3717" />
      <circle cx="42" cy="50" r="11" fill="#8b5a2b" /><circle cx="42" cy="50" r="6" fill="#d9a877" />
      <circle cx="88" cy="50" r="11" fill="#8b5a2b" /><circle cx="88" cy="50" r="6" fill="#d9a877" />
      <ellipse cx="65" cy="72" rx="28" ry="25" fill="#9c6634" />
      <ellipse cx="65" cy="82" rx="14" ry="11" fill="#e8c39a" />
      {eye(54, 68)}{eye(76, 68)}
      <ellipse cx="65" cy="78" rx="4.5" ry="3.2" fill="#2c2017" />
      <path d="M65 81V84" stroke="#2c2017" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M60 84Q65 89 70 84" stroke="#2c2017" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {cheeks(78)}
    </Frame>
  );
}

function Panda({ width, animated }) {
  const ink = '#2f2f37';
  return (
    <Frame width={width} animated={animated}>
      <Body fur={ink} belly="#fafaf7" feet="#1c1c22" />
      <circle cx="42" cy="50" r="10" fill={ink} />
      <circle cx="88" cy="50" r="10" fill={ink} />
      <ellipse cx="65" cy="72" rx="28" ry="25" fill="#fafaf7" stroke="#dcdcd4" strokeWidth="1.5" />
      <ellipse cx="54" cy="70" rx="7" ry="9.5" fill={ink} transform="rotate(28 54 70)" />
      <ellipse cx="76" cy="70" rx="7" ry="9.5" fill={ink} transform="rotate(-28 76 70)" />
      <circle cx="55" cy="69" r="3.2" fill="white" /><circle cx="55.6" cy="68.6" r="1.9" fill="#111" />
      <circle cx="75" cy="69" r="3.2" fill="white" /><circle cx="75.6" cy="68.6" r="1.9" fill="#111" />
      <ellipse cx="65" cy="80" rx="4" ry="2.8" fill={ink} />
      <path d="M61 85Q65 89 69 85" stroke={ink} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {cheeks(81)}
    </Frame>
  );
}

function Cat({ width, animated }) {
  const fur = '#8e8e9a';
  return (
    <Frame width={width} animated={animated}>
      <Tail animated={animated}>
        <path d="M34 118Q8 110 14 84Q18 70 26 76" stroke={fur} strokeWidth="8" strokeLinecap="round" fill="none" />
      </Tail>
      <Body fur={fur} belly="#ece9f0" feet="#ece9f0" />
      <path d="M40 60L41 33L60 50Z" fill={fur} /><path d="M43 55L44 39L55 50Z" fill="#f6b8c8" />
      <path d="M90 60L89 33L70 50Z" fill={fur} /><path d="M87 55L86 39L75 50Z" fill="#f6b8c8" />
      <ellipse cx="65" cy="72" rx="28" ry="24" fill="#9a9aa6" />
      <path d="M60 51V58M65 50V58M70 51V58" stroke="#6d6d78" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="55" cy="69" rx="5" ry="5.5" fill="#6fbf73" /><ellipse cx="55" cy="69" rx="1.6" ry="4.5" fill="#1d1d1d" />
      <ellipse cx="75" cy="69" rx="5" ry="5.5" fill="#6fbf73" /><ellipse cx="75" cy="69" rx="1.6" ry="4.5" fill="#1d1d1d" />
      <path d="M62 78L68 78L65 81.5Z" fill="#f28aa5" />
      <path d="M65 81.5Q62.5 86 59 83.5M65 81.5Q67.5 86 71 83.5" stroke="#2c2017" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M44 78L55 80M44 84L55 82M86 78L75 80M86 84L75 82" stroke="#e9e9ee" strokeWidth="1.1" strokeLinecap="round" />
    </Frame>
  );
}

function Bunny({ width, animated }) {
  const fur = '#f6f1ea';
  const line = '#ddd2c4';
  return (
    <Frame width={width} animated={animated}>
      <circle cx="34" cy="124" r="8" fill="white" stroke={line} strokeWidth="1.5" />
      <Body fur={fur} belly="white" feet="#f3c9d4" stroke={line} />
      <ellipse cx="52" cy="34" rx="8.5" ry="23" fill={fur} stroke={line} strokeWidth="1.5" transform="rotate(-10 52 34)" />
      <ellipse cx="52" cy="36" rx="4" ry="16" fill="#f6b8c8" transform="rotate(-10 52 36)" />
      <ellipse cx="78" cy="34" rx="8.5" ry="23" fill={fur} stroke={line} strokeWidth="1.5" transform="rotate(10 78 34)" />
      <ellipse cx="78" cy="36" rx="4" ry="16" fill="#f6b8c8" transform="rotate(10 78 36)" />
      <ellipse cx="65" cy="74" rx="27" ry="23" fill={fur} stroke={line} strokeWidth="1.5" />
      {eye(55, 71)}{eye(75, 71)}
      <ellipse cx="65" cy="80" rx="3" ry="2.2" fill="#f28aa5" />
      <path d="M65 82Q62 86 59 84M65 82Q68 86 71 84" stroke="#2c2017" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <rect x="62.5" y="84.5" width="5" height="4.5" rx="1" fill="white" stroke={line} strokeWidth="1" />
      {cheeks(80)}
    </Frame>
  );
}

function Unicorn({ width, animated }) {
  const fur = '#fbf8ff';
  const line = '#ddd3ee';
  const mane = ['#f472b6', '#c084fc', '#60a5fa', '#34d399', '#facc15'];
  return (
    <Frame width={width} animated={animated}>
      <Tail animated={animated}>
        {mane.slice(0, 3).map((c, i) => (
          <path key={c} d={`M32 ${112 + i * 3}Q${8 + i * 3} ${100 + i * 2} ${14 + i * 4} ${78 + i * 3}`}
            stroke={c} strokeWidth="5" strokeLinecap="round" fill="none" />
        ))}
      </Tail>
      <Body fur={fur} belly="white" feet="#c4b5fd" stroke={line} />
      {/* crinière arc-en-ciel derrière la tête */}
      {mane.map((c, i) => <circle key={c} cx={40 + i * 3} cy={54 + i * 8} r="9" fill={c} />)}
      <path d="M44 60L44 40L58 52Z" fill={fur} stroke={line} strokeWidth="1.5" />
      <path d="M86 60L86 40L72 52Z" fill={fur} stroke={line} strokeWidth="1.5" />
      <ellipse cx="65" cy="72" rx="27" ry="24" fill={fur} stroke={line} strokeWidth="1.5" />
      <path d="M65 22L58.5 52H71.5Z" fill="#f6c945" stroke="#e0a82e" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M61.5 43L68 40M60.5 48L69.5 45M63 36L67 34" stroke="#e0a82e" strokeWidth="1.2" strokeLinecap="round" />
      {mane.slice(0, 3).map((c, i) => <circle key={c} cx={52 + i * 7} cy={50 - (i === 1 ? 2 : 0)} r="5" fill={c} />)}
      {/* yeux souriants + cils */}
      <path d="M50 70Q55 64 60 70" stroke="#2c2017" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M70 70Q75 64 80 70" stroke="#2c2017" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M49 68L46.5 66.5M81 68L83.5 66.5" stroke="#2c2017" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="60" cy="83" rx="1.6" ry="1.2" fill="#c9a3c9" />
      <ellipse cx="70" cy="83" rx="1.6" ry="1.2" fill="#c9a3c9" />
      <path d="M61 88Q65 91 69 88" stroke="#2c2017" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {cheeks(78, '#f472b6', 0.35)}
    </Frame>
  );
}

export const MASCOTS = [
  { id: 'renard', label: 'Renard', C: Fox },
  { id: 'lion', label: 'Lion', C: Lion },
  { id: 'ours', label: 'Ours', C: Bear },
  { id: 'panda', label: 'Panda', C: Panda },
  { id: 'chat', label: 'Chat', C: Cat },
  { id: 'lapin', label: 'Lapin', C: Bunny },
  { id: 'licorne', label: 'Licorne', C: Unicorn },
];

export default function Mascot({ id, width = 120, animated = true }) {
  const m = MASCOTS.find((x) => x.id === id);
  if (!m) return null;
  const C = m.C;
  return <C width={width} animated={animated} />;
}
