import { useState } from 'react';
import { X, Trophy, AlertTriangle } from 'lucide-react';
import { testResults, TAG_STYLES, SUBJECT_LABELS } from '../data/ryanTestResults';

function pctOf(r) {
  return r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['janv', 'févr', 'mars', 'avril', 'mai', 'juin', 'juill', 'août', 'sept', 'oct', 'nov', 'déc'];
  return `${d} ${months[m - 1]} ${y}`;
}

export default function TestResults({ onClose }) {
  const [filter, setFilter] = useState('all'); // all | win | weak | critical | math | français

  // Group by week (YYYY-MM-DD truncated to nearest Mon)
  const groups = {};
  testResults.forEach((r) => {
    const matchesFilter =
      filter === 'all' ||
      (['win', 'ok', 'weak', 'critical', 'exam-prep'].includes(filter) && r.tag === filter) ||
      (['math', 'français', 'univers', 'oral'].includes(filter) && r.subject === filter);
    if (!matchesFilter) return;
    if (!groups[r.date]) groups[r.date] = [];
    groups[r.date].push(r);
  });

  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  // Stats
  const wins = testResults.filter((r) => r.tag === 'win').length;
  const criticals = testResults.filter((r) => r.tag === 'critical').length;
  const totalScore = testResults.reduce((s, r) => s + r.score, 0);
  const totalMax = testResults.reduce((s, r) => s + r.total, 0);
  const overallPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-s1 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Trophy size={22} className="text-lava" />
            <h2 className="text-xl font-heading font-extrabold text-stone">Résultats d'examens — Ryan</h2>
          </div>
          <button onClick={onClose}
            className="bg-s1 hover:bg-s2 rounded-full p-2 text-stone transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-2 p-4 border-b border-s1">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-2.5 text-center">
            <div className="text-xs font-bold text-emerald-700 uppercase">Total tests</div>
            <div className="text-2xl font-extrabold text-emerald-900">{testResults.length}</div>
          </div>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-2.5 text-center">
            <div className="text-xs font-bold text-amber-700 uppercase">Moyenne</div>
            <div className="text-2xl font-extrabold text-amber-900">{overallPct}%</div>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-2.5 text-center">
            <div className="text-xs font-bold text-green-700 uppercase">🏆 Wins</div>
            <div className="text-2xl font-extrabold text-green-900">{wins}</div>
          </div>
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-2.5 text-center">
            <div className="text-xs font-bold text-red-700 uppercase">🔴 Critiques</div>
            <div className="text-2xl font-extrabold text-red-900">{criticals}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-s1 flex gap-1.5 flex-wrap text-xs">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'win', label: '🏆 Wins' },
            { id: 'ok', label: '✓ OK' },
            { id: 'weak', label: '⚠ Faibles' },
            { id: 'critical', label: '🔴 Critiques' },
            { id: 'exam-prep', label: '📚 Examen' },
            { id: 'math', label: '🧮 Math' },
            { id: 'français', label: '📝 Français' },
          ].map((f) => (
            <button key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg font-bold border-2 transition-all ${
                filter === f.id ? 'bg-lava text-white border-lava' : 'bg-white text-stone border-s2 hover:border-lava'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Results table */}
        <div className="p-4 space-y-4">
          {dates.length === 0 && (
            <div className="text-center text-s5 py-10">Aucun résultat pour ce filtre.</div>
          )}
          {dates.map((date) => (
            <section key={date}>
              <h3 className="text-xs font-bold uppercase tracking-wide text-s5 mb-2">
                Semaine du {fmtDate(date)} ({groups[date].length} test{groups[date].length > 1 ? 's' : ''})
              </h3>
              <div className="space-y-1.5">
                {groups[date].map((r, i) => {
                  const c = TAG_STYLES[r.tag] || TAG_STYLES.ok;
                  const pct = pctOf(r);
                  return (
                    <div key={`${date}-${i}`}
                      className="rounded-xl p-2.5 border-2 flex items-center gap-3"
                      style={{ background: c.bg, borderColor: c.border }}>
                      <div className="text-xs font-bold w-16 text-center" style={{ color: c.text }}>
                        {SUBJECT_LABELS[r.subject] || r.subject}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-extrabold text-stone leading-snug">{r.test}</div>
                        {r.teacherNote && (
                          <div className="text-[11px] text-s6 italic leading-snug truncate" title={r.teacherNote}>« {r.teacherNote} »</div>
                        )}
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <div className="text-base font-extrabold leading-none" style={{ color: c.text }}>
                          {r.score}/{r.total}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wide" style={{ color: c.text }}>
                          {pct}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Legend */}
        <div className="p-3 border-t-2 border-s1 bg-stone-50 rounded-b-2xl">
          <div className="flex gap-3 text-[10px] text-s6 flex-wrap justify-center">
            {Object.entries(TAG_STYLES).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded" style={{ background: v.bg, border: `2px solid ${v.border}` }}></span>
                {v.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
