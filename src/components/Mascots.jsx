import React from 'react';

// Les mascottes de l'accueil. Toutes dans le même cadre (130 × 160) pour qu'on
// puisse les échanger dans ⚙️ Réglages sans rien décaler.
// Le lion = skin « courage » de Ryan (devise « try again »); le renard = mascotte
// d'origine de l'app. Ours, panda, chat, lapin: demandés par Cayla le 14 sept. 2026; les 10 autres le 22 sept.

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


// ===== 10 nouvelles mascottes — demandées par Cayla le 22 sept. 2026 =====
// Même cadre que les autres (130 × 160): tête posée sur le corps commun.
const Head = ({ cx = 65, cy = 72, rx = 27, ry = 24, fill, stroke }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} />
);
const Smile = (y = 86) => <path d={`M58 ${y}Q65 ${y + 5} 72 ${y}`} stroke="#2c2017" strokeWidth="2" fill="none" strokeLinecap="round" />;
const Snout = (fill = '#2c2017', cy = 80, rx = 5, ry = 4) => <ellipse cx="65" cy={cy} rx={rx} ry={ry} fill={fill} />;

function Dog({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <Tail animated={animated}><path d="M28 108Q12 96 18 84Q26 78 30 88Q24 96 33 102Z" fill="#c98a4b" /></Tail>
      <Body fur="#d9a05b" belly="#f6e3c8" feet="#8b5e3c" />
      <ellipse cx="41" cy="74" rx="9" ry="15" fill="#a9703b" />
      <ellipse cx="89" cy="74" rx="9" ry="15" fill="#a9703b" />
      <Head fill="#d9a05b" />
      <ellipse cx="65" cy="84" rx="13" ry="10" fill="#f6e3c8" />
      {Snout('#2c2017', 79, 5, 4)}
      {eye(55, 68)}{eye(75, 68)}
      <path d="M65 83L65 88" stroke="#2c2017" strokeWidth="1.6" strokeLinecap="round" />
      {Smile(88)}{cheeks(80)}
    </Frame>
  );
}

function Koala({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <Body fur="#9ca3af" belly="#e5e7eb" feet="#6b7280" />
      <circle cx="38" cy="62" r="14" fill="#9ca3af" /><circle cx="38" cy="62" r="8" fill="#d1d5db" />
      <circle cx="92" cy="62" r="14" fill="#9ca3af" /><circle cx="92" cy="62" r="8" fill="#d1d5db" />
      <Head fill="#9ca3af" />
      {eye(55, 70)}{eye(75, 70)}
      <ellipse cx="65" cy="82" rx="8" ry="6.5" fill="#3f3f46" />
      {Smile(92)}{cheeks(84, '#f9a8d4', 0.35)}
    </Frame>
  );
}

function Penguin({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <ellipse cx="65" cy="112" rx="33" ry="30" fill="#1f2937" />
      <ellipse cx="65" cy="118" rx="23" ry="23" fill="#f8fafc" />
      <ellipse cx="34" cy="108" rx="7" ry="17" fill="#111827" />
      <ellipse cx="96" cy="108" rx="7" ry="17" fill="#111827" />
      <ellipse cx="54" cy="150" rx="9" ry="4" fill="#f59e0b" />
      <ellipse cx="76" cy="150" rx="9" ry="4" fill="#f59e0b" />
      <Head fill="#1f2937" />
      <ellipse cx="65" cy="78" rx="19" ry="17" fill="#f8fafc" />
      {eye(57, 70)}{eye(73, 70)}
      <path d="M58 80L72 80L65 89Z" fill="#f59e0b" />
    </Frame>
  );
}

function Frog({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <Body fur="#4ade80" belly="#dcfce7" feet="#16a34a" />
      <circle cx="48" cy="52" r="12" fill="#4ade80" /><circle cx="82" cy="52" r="12" fill="#4ade80" />
      <circle cx="48" cy="52" r="7" fill="white" /><circle cx="82" cy="52" r="7" fill="white" />
      <circle cx="48" cy="53" r="3.6" fill="#14532d" /><circle cx="82" cy="53" r="3.6" fill="#14532d" />
      <Head fill="#4ade80" cy="76" ry="22" />
      <path d="M50 84Q65 96 80 84" stroke="#14532d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="74" r="2" fill="#14532d" /><circle cx="74" cy="74" r="2" fill="#14532d" />
      {cheeks(82, '#fda4af', 0.4)}
    </Frame>
  );
}

function Turtle({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <ellipse cx="65" cy="112" rx="38" ry="30" fill="#16a34a" />
      <ellipse cx="65" cy="112" rx="30" ry="23" fill="#65a30d" />
      {[[52, 104], [78, 104], [65, 120]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="8" fill="#a3e635" />)}
      <ellipse cx="34" cy="132" rx="9" ry="6" fill="#4ade80" />
      <ellipse cx="96" cy="132" rx="9" ry="6" fill="#4ade80" />
      <Head fill="#4ade80" cy="70" rx="24" ry="21" />
      {eye(56, 66)}{eye(74, 66)}
      {Smile(80)}{cheeks(74, '#fca5a5', 0.4)}
    </Frame>
  );
}

function Owl({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <ellipse cx="65" cy="112" rx="33" ry="32" fill="#a16207" />
      <ellipse cx="65" cy="118" rx="22" ry="24" fill="#fde68a" />
      <path d="M32 100Q24 118 34 134Q40 120 38 104Z" fill="#854d0e" />
      <path d="M98 100Q106 118 96 134Q90 120 92 104Z" fill="#854d0e" />
      <ellipse cx="55" cy="150" rx="7" ry="3.5" fill="#f59e0b" />
      <ellipse cx="75" cy="150" rx="7" ry="3.5" fill="#f59e0b" />
      <Head fill="#a16207" ry="25" />
      <path d="M42 56L50 44L56 54Z" fill="#a16207" />
      <path d="M88 56L80 44L74 54Z" fill="#a16207" />
      <circle cx="55" cy="72" r="11" fill="#fde68a" /><circle cx="75" cy="72" r="11" fill="#fde68a" />
      {eye(55, 72)}{eye(75, 72)}
      <path d="M60 82L70 82L65 90Z" fill="#f59e0b" />
    </Frame>
  );
}

function Pig({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <Tail animated={animated}><path d="M30 108Q18 104 22 96Q28 92 28 100Q24 104 32 104Z" stroke="#f9a8d4" strokeWidth="3" fill="none" /></Tail>
      <Body fur="#f9a8d4" belly="#fce7f3" feet="#db2777" />
      <path d="M44 56L40 44L56 52Z" fill="#f9a8d4" />
      <path d="M86 56L90 44L74 52Z" fill="#f9a8d4" />
      <Head fill="#f9a8d4" />
      {eye(55, 68)}{eye(75, 68)}
      <ellipse cx="65" cy="83" rx="11" ry="8" fill="#f472b6" />
      <ellipse cx="61" cy="83" rx="2" ry="2.6" fill="#be185d" /><ellipse cx="69" cy="83" rx="2" ry="2.6" fill="#be185d" />
      {cheeks(76, '#fb7185', 0.4)}
    </Frame>
  );
}

function Monkey({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <Tail animated={animated}><path d="M30 110Q10 104 14 88Q18 78 28 82Q20 90 26 100Z" stroke="#a16207" strokeWidth="4" fill="none" strokeLinecap="round" /></Tail>
      <Body fur="#a16207" belly="#fde68a" feet="#78350f" />
      <circle cx="40" cy="70" r="11" fill="#a16207" /><circle cx="40" cy="70" r="6.5" fill="#fcd9a0" />
      <circle cx="90" cy="70" r="11" fill="#a16207" /><circle cx="90" cy="70" r="6.5" fill="#fcd9a0" />
      <Head fill="#a16207" />
      <ellipse cx="65" cy="80" rx="19" ry="15" fill="#fcd9a0" />
      <ellipse cx="65" cy="62" rx="16" ry="9" fill="#fcd9a0" opacity=".55" />
      {eye(56, 69)}{eye(74, 69)}
      <ellipse cx="61" cy="78" rx="1.6" ry="1.2" fill="#78350f" /><ellipse cx="69" cy="78" rx="1.6" ry="1.2" fill="#78350f" />
      {Smile(85)}
    </Frame>
  );
}

function Elephant({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <Body fur="#94a3b8" belly="#e2e8f0" feet="#64748b" />
      <ellipse cx="38" cy="72" rx="15" ry="18" fill="#94a3b8" />
      <ellipse cx="92" cy="72" rx="15" ry="18" fill="#94a3b8" />
      <ellipse cx="38" cy="72" rx="9" ry="12" fill="#cbd5e1" />
      <ellipse cx="92" cy="72" rx="9" ry="12" fill="#cbd5e1" />
      <Head fill="#94a3b8" />
      {eye(55, 68)}{eye(75, 68)}
      <path d="M59 82Q59 104 70 106Q78 106 76 98" stroke="#94a3b8" strokeWidth="9" fill="none" strokeLinecap="round" />
      {cheeks(76, '#fda4af', 0.35)}
    </Frame>
  );
}

function Dragon({ width, animated }) {
  return (
    <Frame width={width} animated={animated}>
      <Tail animated={animated}><path d="M28 112Q8 100 16 84Q24 76 30 86Q20 94 32 104Z" fill="#34d399" /></Tail>
      <Body fur="#34d399" belly="#fef08a" feet="#047857" />
      <path d="M50 124L60 116L70 124L80 116" stroke="#047857" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M46 54L52 40L58 52Z" fill="#fbbf24" />
      <path d="M84 54L78 40L72 52Z" fill="#fbbf24" />
      <Head fill="#34d399" />
      <path d="M52 50L58 34L64 50Z" fill="#10b981" />
      <path d="M66 50L72 34L78 50Z" fill="#10b981" />
      {eye(55, 68)}{eye(75, 68)}
      <ellipse cx="65" cy="84" rx="12" ry="9" fill="#6ee7b7" />
      <ellipse cx="61" cy="82" rx="1.6" ry="1.2" fill="#065f46" /><ellipse cx="69" cy="82" rx="1.6" ry="1.2" fill="#065f46" />
      {Smile(90)}
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
  { id: 'chien', label: 'Chien', C: Dog },
  { id: 'koala', label: 'Koala', C: Koala },
  { id: 'pingouin', label: 'Pingouin', C: Penguin },
  { id: 'grenouille', label: 'Grenouille', C: Frog },
  { id: 'tortue', label: 'Tortue', C: Turtle },
  { id: 'hibou', label: 'Hibou', C: Owl },
  { id: 'cochon', label: 'Cochon', C: Pig },
  { id: 'singe', label: 'Singe', C: Monkey },
  { id: 'elephant', label: 'Éléphant', C: Elephant },
  { id: 'dragon', label: 'Dragon', C: Dragon },
];

export default function Mascot({ id, width = 120, animated = true }) {
  const m = MASCOTS.find((x) => x.id === id);
  if (!m) return null;
  const C = m.C;
  return <C width={width} animated={animated} />;
}
