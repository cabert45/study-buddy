import React from 'react';

// Visual tens bars (red rectangles) + unit dots (blue circles)
// Matches Ryan's textbook: red bars = dizaines, blue dots = unites

function NumberVisual({ value, label }) {
  const tens = Math.floor(value / 10);
  const ones = value % 10;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-sm font-bold text-stone">{label} = {value}</div>
      <div className="flex items-end gap-2">
        {/* Tens bars - red like the textbook */}
        <div className="flex gap-1">
          {Array.from({ length: tens }, (_, i) => (
            <div
              key={`t${i}`}
              className="w-3 h-12 bg-red-500 rounded-sm"
              title="1 dizaine"
            />
          ))}
        </div>
        {/* Ones dots - blue like the textbook */}
        <div className="flex flex-wrap gap-1 w-12">
          {Array.from({ length: ones }, (_, i) => (
            <div
              key={`o${i}`}
              className="w-3 h-3 bg-blue-400 rounded-full"
              title="1 unite"
            />
          ))}
        </div>
      </div>
      <div className="text-xs text-s4 font-semibold">
        {tens} dizaine{tens !== 1 ? 's' : ''}, {ones} unite{ones !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default function TensOnes({ a, b, op }) {
  return (
    <div className="bg-orange-50 rounded-xl p-4 mt-3 border-2 border-s1">
      <div className="flex justify-around items-end">
        <NumberVisual value={a} label={String(a)} />
        <div className="text-2xl font-bold text-stone mb-4">{op}</div>
        <NumberVisual value={b} label={String(b)} />
      </div>
    </div>
  );
}
