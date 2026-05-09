import React from 'react';

// Visual chart components for statistique questions
// BarChart  — diagramme à bandes (vertical bars)
// Pictogram — symbols × légende
// DataTable — tableau de données

export function BarChart({ data, title, unit }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const step = maxValue <= 10 ? 1 : maxValue <= 25 ? 5 : 10;
  const ticks = [];
  for (let v = 0; v <= maxValue + step; v += step) ticks.push(v);
  const yMax = ticks[ticks.length - 1] || 1;

  // SVG-based chart for reliable rendering across all browsers/PWA
  const chartHeight = 180;
  const yAxisWidth = 28;
  const barAreaPaddingX = 12;
  const barCount = data.length;
  // Allocate viewBox width based on number of bars
  const barSlot = 56; // px per bar in viewBox
  const barAreaWidth = Math.max(barCount * barSlot, 200);
  const totalWidth = yAxisWidth + barAreaWidth + barAreaPaddingX * 2;

  const scale = chartHeight / yMax;
  const baseY = chartHeight + 6;

  return (
    <div className="bg-orange-50 rounded-xl p-4 mt-3 border-2 border-s1">
      {title && (
        <div className="text-sm font-bold text-stone text-center mb-3">{title}</div>
      )}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalWidth} ${chartHeight + 38}`}
          width="100%"
          style={{ minWidth: totalWidth, maxWidth: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis grid + ticks */}
          {ticks.map((t) => {
            const y = baseY - t * scale;
            return (
              <g key={t}>
                <line
                  x1={yAxisWidth}
                  x2={totalWidth - 4}
                  y1={y}
                  y2={y}
                  stroke="#d6ccc0"
                  strokeWidth="1"
                  strokeDasharray={t === 0 ? '0' : '3 3'}
                />
                <text
                  x={yAxisWidth - 4}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="600"
                  fill="#9a8878"
                >
                  {t}
                </text>
              </g>
            );
          })}
          {/* Y-axis line */}
          <line x1={yAxisWidth} x2={yAxisWidth} y1={6} y2={baseY} stroke="#2c2017" strokeOpacity="0.4" strokeWidth="2" />

          {/* Bars */}
          {data.map((d, i) => {
            const slotX = yAxisWidth + barAreaPaddingX + i * (barAreaWidth / barCount);
            const slotW = barAreaWidth / barCount;
            const barW = Math.min(40, slotW - 8);
            const x = slotX + (slotW - barW) / 2;
            const h = d.value * scale;
            const y = baseY - h;
            return (
              <g key={i}>
                <defs>
                  <linearGradient id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e8622a" />
                    <stop offset="100%" stopColor="#c74a15" />
                  </linearGradient>
                </defs>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  fill={`url(#barGrad${i})`}
                  rx="2"
                />
                {/* Value label above bar */}
                <text
                  x={x + barW / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#b85a1a"
                >
                  {d.value}
                </text>
                {/* X-axis label */}
                <text
                  x={slotX + slotW / 2}
                  y={baseY + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#2c2017"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {unit && (
        <div className="text-xs text-s4 text-center mt-2 italic">Nombre de {unit}</div>
      )}
    </div>
  );
}

export function Pictogram({ data, title, legend, legendUnit, symbol = '⭐' }) {
  return (
    <div className="bg-orange-50 rounded-xl p-4 mt-3 border-2 border-s1">
      {title && (
        <div className="text-sm font-bold text-stone text-center mb-3">{title}</div>
      )}
      <div className="bg-white rounded-lg p-2 mb-3 text-center text-sm font-bold text-fox-d border border-s2">
        Légende : 1 {symbol} = {legend} {legendUnit || ''}
      </div>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-24 text-xs font-semibold text-stone text-right pr-2 capitalize">
              {d.label}
            </div>
            <div className="flex flex-wrap gap-1 flex-1">
              {Array.from({ length: d.symbols }, (_, j) => (
                <span key={j} className="text-2xl leading-none">{symbol}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataTable({ rows, cols, data, hideRow, hideCol, rowTotals, colTotals, title }) {
  return (
    <div className="bg-orange-50 rounded-xl p-4 mt-3 border-2 border-s1">
      {title && (
        <div className="text-sm font-bold text-stone text-center mb-3">{title}</div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="bg-fox-d text-white">
              <th className="px-2 py-2 border border-s2 text-left">&nbsp;</th>
              {cols.map((c) => (
                <th key={c} className="px-2 py-2 border border-s2 font-bold">{c}</th>
              ))}
              {rowTotals && <th className="px-2 py-2 border border-s2 font-bold">Total</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row} className={r % 2 ? 'bg-s1/30' : ''}>
                <td className="px-2 py-2 border border-s2 font-semibold text-stone capitalize">{row}</td>
                {cols.map((col, c) => {
                  const isHidden = r === hideRow && c === hideCol;
                  return (
                    <td key={c} className="px-2 py-2 border border-s2 text-center font-bold">
                      {isHidden ? <span className="text-fox text-lg">?</span> : data[r][c]}
                    </td>
                  );
                })}
                {rowTotals && (
                  <td className="px-2 py-2 border border-s2 text-center font-bold text-fox-d bg-orange-50">
                    {rowTotals[r]}
                  </td>
                )}
              </tr>
            ))}
            {colTotals && (
              <tr className="bg-orange-50">
                <td className="px-2 py-2 border border-s2 font-bold text-fox-d">Total</td>
                {colTotals.map((t, i) => (
                  <td key={i} className="px-2 py-2 border border-s2 text-center font-bold text-fox-d">{t}</td>
                ))}
                {rowTotals && <td className="px-2 py-2 border border-s2 text-center font-bold text-fox-d">&nbsp;</td>}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
