import React, { useState } from 'react';

// Interactive 10-frame workspace — Ryan taps cells to add/remove dots
// Matches his exam format: 2x5 grids, dots for units, bars for tens

function TenFrameGrid({ cells, onToggle, color = 'bg-red-500' }) {
  return (
    <div className="inline-grid grid-cols-5 gap-0.5 bg-white rounded-lg p-1 border-2 border-s2">
      {cells.map((filled, i) => (
        <button
          key={i}
          onClick={() => onToggle(i)}
          className="w-8 h-8 border border-gray-500/30 rounded-sm flex items-center justify-center active:bg-white/10 transition-all"
        >
          {filled === 'dot' && (
            <div className={`w-5 h-5 rounded-full ${color} shadow-sm`} />
          )}
          {filled === 'cross' && (
            <div className="relative">
              <div className={`w-5 h-5 rounded-full ${color} opacity-30`} />
              <span className="absolute inset-0 flex items-center justify-center text-red-400 font-bold text-sm">✕</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

export default function InteractiveTenFrames({ onClose }) {
  // 4 grids of 10 cells each — enough for numbers up to 40
  const [grids, setGrids] = useState(() =>
    Array.from({ length: 4 }, () => Array(10).fill('empty'))
  );
  const [mode, setMode] = useState('dot'); // 'dot' or 'cross'

  function toggleCell(gridIdx, cellIdx) {
    setGrids((prev) => {
      const next = prev.map((g) => [...g]);
      const current = next[gridIdx][cellIdx];
      if (current === 'empty') {
        next[gridIdx][cellIdx] = mode;
      } else if (current === mode) {
        next[gridIdx][cellIdx] = 'empty';
      } else {
        // Switch between dot and cross
        next[gridIdx][cellIdx] = mode;
      }
      return next;
    });
  }

  function clearAll() {
    setGrids(Array.from({ length: 4 }, () => Array(10).fill('empty')));
  }

  // Count totals
  const totalDots = grids.flat().filter((c) => c === 'dot').length;
  const totalCrossed = grids.flat().filter((c) => c === 'cross').length;

  return (
    <div className="bg-orange-50 rounded-xl p-4 mt-3 border-2 border-s1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-fox-d">📝 Boîtes de travail</span>
        <button onClick={onClose} className="text-xs text-s4 font-semibold">Fermer ✕</button>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('dot')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === 'dot'
              ? 'bg-red-500/30 text-red-300 border border-red-500/40'
              : 'bg-white text-s4 border-2 border-s2'
          }`}
        >
          ● Ajouter un point
        </button>
        <button
          onClick={() => setMode('cross')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === 'cross'
              ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40'
              : 'bg-white text-s4 border-2 border-s2'
          }`}
        >
          ✕ Barrer
        </button>
      </div>

      {/* Grids */}
      <div className="grid grid-cols-2 gap-3 justify-items-center">
        {grids.map((cells, gi) => (
          <TenFrameGrid
            key={gi}
            cells={cells}
            onToggle={(ci) => toggleCell(gi, ci)}
            color={mode === 'cross' ? 'bg-orange-400' : 'bg-red-500'}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="flex justify-between mt-3 text-xs font-bold">
        <span className="text-red-300">● Points: {totalDots}</span>
        {totalCrossed > 0 && <span className="text-orange-300">✕ Barres: {totalCrossed}</span>}
        {totalCrossed > 0 && (
          <span className="text-green-300">Reste: {totalDots - totalCrossed}</span>
        )}
      </div>

      <button
        onClick={clearAll}
        className="w-full mt-2 py-2 rounded-lg text-xs font-semibold text-s4 bg-white border-2 border-s2"
      >
        🗑️ Effacer tout
      </button>
    </div>
  );
}
