import React from 'react';

// Visual chart components for statistique questions
// BarChart  — diagramme à bandes (vertical bars)
// Pictogram — symbols × légende
// DataTable — tableau de données

export function BarChart({ data, title, unit }) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const step = maxValue <= 10 ? 1 : maxValue <= 25 ? 5 : 10;
  const ticks = [];
  for (let v = 0; v <= maxValue + step; v += step) ticks.push(v);
  const chartHeight = 180;
  const scale = chartHeight / (ticks[ticks.length - 1] || 1);

  return (
    <div className="bg-orange-50 rounded-xl p-4 mt-3 border-2 border-s1">
      {title && (
        <div className="text-sm font-bold text-stone text-center mb-3">{title}</div>
      )}
      <div className="flex">
        {/* Y-axis ticks */}
        <div className="flex flex-col-reverse justify-between pr-2 text-xs font-semibold text-s4" style={{ height: chartHeight }}>
          {ticks.map((t) => (
            <div key={t} style={{ lineHeight: '1' }}>{t}</div>
          ))}
        </div>
        {/* Bars */}
        <div className="flex-1 flex items-end justify-around gap-2 border-l-2 border-b-2 border-stone/40 pl-2 pb-1" style={{ height: chartHeight + 4 }}>
          {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center justify-end gap-1 flex-1" style={{ height: chartHeight }}>
              <div className="text-xs font-bold text-fox-d">{d.value}</div>
              <div
                className="w-full max-w-[40px] rounded-t-sm"
                style={{
                  height: `${d.value * scale}px`,
                  background: 'linear-gradient(180deg, #e8622a, #c74a15)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="flex pl-6 mt-1">
        <div className="flex-1 flex justify-around gap-2 pl-2">
          {data.map((d, i) => (
            <div key={i} className="flex-1 text-center text-xs font-semibold text-stone">
              {d.label}
            </div>
          ))}
        </div>
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
