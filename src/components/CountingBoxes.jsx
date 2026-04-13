import React from 'react';

// 10-frame counting boxes (boîtes à compter) — matches Ryan's textbook exactly
// Each box is a 2x5 grid that holds up to 10 dots
// First number shown in red dots, second number in blue dots

function TenFrame({ filled, color = 'bg-red-500', crossedOut = 0 }) {
  const cells = Array.from({ length: 10 }, (_, i) => {
    const isFilled = i < filled;
    const isCrossed = isFilled && i >= filled - crossedOut;
    return (
      <div
        key={i}
        className="w-6 h-6 border border-gray-500/30 rounded-sm flex items-center justify-center"
      >
        {isFilled && !isCrossed && (
          <div className={`w-4 h-4 rounded-full ${color}`} />
        )}
        {isCrossed && (
          <div className="relative">
            <div className={`w-4 h-4 rounded-full ${color} opacity-40`} />
            <span className="absolute inset-0 flex items-center justify-center text-red-400 font-bold text-xs">✕</span>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="inline-grid grid-cols-5 gap-0.5 bg-white/5 rounded-lg p-1 border border-white/10">
      {cells}
    </div>
  );
}

export default function CountingBoxes({ a, b, op, showExchange }) {
  if (op === '+') {
    // Addition: show a in red, b in blue, demonstrate carrying
    const totalDots = a + b;
    const aFrames = Math.ceil(a / 10);
    const bFrames = Math.ceil(b / 10);

    // Build frames for number a (red)
    const redFrames = [];
    let remaining = a;
    for (let i = 0; i < aFrames; i++) {
      const dots = Math.min(remaining, 10);
      redFrames.push(<TenFrame key={`r${i}`} filled={dots} color="bg-red-500" />);
      remaining -= dots;
    }

    // Build frames for number b (blue)
    const blueFrames = [];
    remaining = b;
    const bFrameCount = Math.ceil(b / 10);
    for (let i = 0; i < bFrameCount; i++) {
      const dots = Math.min(remaining, 10);
      blueFrames.push(<TenFrame key={`b${i}`} filled={dots} color="bg-blue-400" />);
      remaining -= dots;
    }

    return (
      <div className="bg-white/5 rounded-xl p-4 mt-3 border border-white/10">
        <div className="text-xs font-bold text-purple-300 mb-2">Boîtes à compter</div>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-xs text-red-400 font-bold">{a} (rouge)</span>
            <div className="flex flex-wrap gap-2 mt-1">{redFrames}</div>
          </div>
          <div>
            <span className="text-xs text-blue-400 font-bold">{b} (bleu)</span>
            <div className="flex flex-wrap gap-2 mt-1">{blueFrames}</div>
          </div>
          {showExchange && (a % 10) + (b % 10) >= 10 && (
            <div className="text-xs text-star font-bold bg-star/10 rounded-lg p-2 border border-star/20">
              💡 Les unites font {(a % 10) + (b % 10)} → echange 10 unites contre 1 dizaine!
            </div>
          )}
        </div>
      </div>
    );
  }

  // Subtraction: show a, then cross out b
  const aFrames = Math.ceil(a / 10);
  const frames = [];
  let remaining = a;
  let toCross = b;

  for (let i = aFrames - 1; i >= 0; i--) {
    const dotsInFrame = i === aFrames - 1 ? (a % 10 || 10) : 10;
    const crossInFrame = Math.min(toCross, dotsInFrame);
    toCross -= crossInFrame;
    frames.unshift(
      <TenFrame key={`s${i}`} filled={dotsInFrame} color="bg-red-500" crossedOut={crossInFrame} />
    );
  }

  return (
    <div className="bg-white/5 rounded-xl p-4 mt-3 border border-white/10">
      <div className="text-xs font-bold text-purple-300 mb-2">Boîtes à compter</div>
      <div>
        <span className="text-xs text-red-400 font-bold">{a} - on barre {b}</span>
        <div className="flex flex-wrap gap-2 mt-1">{frames}</div>
      </div>
      {showExchange && (a % 10) < (b % 10) && (
        <div className="mt-2 text-xs text-star font-bold bg-star/10 rounded-lg p-2 border border-star/20">
          💡 Pas assez d'unites! Echange 1 dizaine contre 10 unites.
        </div>
      )}
      <div className="mt-2 text-sm font-bold text-green-400">
        Il reste {a - b} points = la reponse!
      </div>
    </div>
  );
}
