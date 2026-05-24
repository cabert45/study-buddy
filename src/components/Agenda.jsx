import { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { EXAMS, DICTEE_WEEKS, dicteeWeekForDate, daysBetween, frDateLabel, DICTEE_T7_START } from '../data/examSchedule';

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function urgencyColor(days) {
  if (days === 0) return { bg: '#fce8ec', border: '#c74a60', text: '#a02a45' }; // red
  if (days <= 3) return { bg: '#fef0e4', border: '#c74a15', text: '#9a3a10' }; // orange
  if (days <= 7) return { bg: '#fef5e4', border: '#b85d1a', text: '#7a3e10' }; // amber
  return { bg: '#e8eef8', border: '#3a5bc7', text: '#2a3f8a' }; // blue
}

// What's scheduled on a given date?
function eventsForDate(date) {
  const events = [];
  const day = date.getDay();

  // Exam on this date?
  EXAMS.forEach((ex) => {
    if (daysBetween(date, ex.date) === 0) {
      events.push({ kind: 'exam', icon: ex.icon, label: `EXAMEN — ${ex.name}` });
    }
  });

  // Tuesday = dictée
  if (day === 2 && date >= DICTEE_T7_START) {
    const w = dicteeWeekForDate(date);
    events.push({ kind: 'dictee', icon: '🎧', label: `Dictée Thème 7 ${w.short} — ${w.label}` });
  }

  // Weekly markers (no exam scheduled, but known recurring activities)
  return events;
}

export default function Agenda({ onClose, onLaunchMode }) {
  const today = startOfDay(new Date());
  const [weekOffset, setWeekOffset] = useState(0);

  // Sort exams by date, only show upcoming ones
  const upcomingExams = EXAMS
    .map((ex) => ({ ...ex, daysAway: daysBetween(today, ex.date) }))
    .filter((ex) => ex.daysAway >= 0)
    .sort((a, b) => a.daysAway - b.daysAway);

  // 14-day window starting from today + weekOffset*7
  const windowStart = addDays(today, weekOffset * 7);
  const calendar = Array.from({ length: 14 }, (_, i) => addDays(windowStart, i));

  // Today's events
  const todayEvents = eventsForDate(today);
  const tomorrowEvents = eventsForDate(addDays(today, 1));

  // Current dictée week
  const dicteeNow = dicteeWeekForDate(today);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-s1 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Calendar size={22} className="text-lava" />
            <h2 className="text-xl font-heading font-extrabold text-stone">Agenda — Ryan</h2>
          </div>
          <button onClick={onClose}
            className="bg-s1 hover:bg-s2 rounded-full p-2 text-stone transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* ===== AUJOURD'HUI ===== */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-s5 mb-2">Aujourd'hui</h3>
            <div className="bg-gradient-to-br from-lava to-fox rounded-2xl p-4 text-white shadow-sm">
              <div className="text-sm font-semibold opacity-90 capitalize">{frDateLabel(today)}</div>
              {todayEvents.length === 0 ? (
                <div className="mt-2 text-sm">Pas d'examen prévu aujourd'hui — bonne journée d'étude!</div>
              ) : (
                <ul className="mt-2 space-y-1">
                  {todayEvents.map((e, i) => (
                    <li key={i} className="text-sm font-bold flex items-start gap-2">
                      <span>{e.icon}</span><span>{e.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tomorrowEvents.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/30">
                  <div className="text-xs opacity-90 font-semibold mb-1">Demain ({frDateLabel(addDays(today, 1))})</div>
                  <ul className="space-y-1">
                    {tomorrowEvents.map((e, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span>{e.icon}</span><span>{e.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* ===== PROCHAINS EXAMENS ===== */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-s5 mb-2">Prochains examens ({upcomingExams.length})</h3>
            {upcomingExams.length === 0 ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">🎉</div>
                <div className="text-sm font-bold text-emerald-900">Tous les examens sont finis! Bravo Ryan!</div>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingExams.map((ex) => {
                  const c = urgencyColor(ex.daysAway);
                  return (
                    <div key={ex.name}
                      className="rounded-2xl p-3 flex items-center gap-3 border-2"
                      style={{ background: c.bg, borderColor: c.border }}>
                      <div className="text-3xl">{ex.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-extrabold text-stone">{ex.name}</div>
                        <div className="text-xs text-s6 capitalize">{frDateLabel(ex.date)} · {ex.cahier}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold leading-none" style={{ color: c.text }}>
                          {ex.daysAway === 0 ? "AUJOURD'HUI" : ex.daysAway === 1 ? 'DEMAIN' : `${ex.daysAway}j`}
                        </div>
                        {ex.daysAway > 1 && (
                          <div className="text-[10px] uppercase font-bold tracking-wide" style={{ color: c.text }}>restants</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ===== CALENDRIER 14 JOURS ===== */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-s5">Calendrier 14 jours</h3>
              <div className="flex gap-1">
                <button onClick={() => setWeekOffset((w) => w - 1)}
                  className="bg-s1 hover:bg-s2 rounded-lg p-1 text-stone transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setWeekOffset(0)} disabled={weekOffset === 0}
                  className="bg-s1 hover:bg-s2 rounded-lg px-2 py-1 text-xs font-bold text-stone transition-all disabled:opacity-40">
                  Aujourd'hui
                </button>
                <button onClick={() => setWeekOffset((w) => w + 1)}
                  className="bg-s1 hover:bg-s2 rounded-lg p-1 text-stone transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <div key={`h${i}`} className="text-center text-[10px] font-bold text-s5 py-1">{d}</div>
              ))}
              {/* Pad to align first day to Monday-start week */}
              {Array.from({ length: (calendar[0].getDay() + 6) % 7 }).map((_, i) => (
                <div key={`pad${i}`} />
              ))}
              {calendar.map((d) => {
                const isToday = daysBetween(today, d) === 0;
                const events = eventsForDate(d);
                const hasExam = events.some((e) => e.kind === 'exam');
                const hasDictee = events.some((e) => e.kind === 'dictee');
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                let bg = 'bg-white';
                let border = 'border-s2';
                if (hasExam) { bg = 'bg-red-50'; border = 'border-red-400'; }
                else if (hasDictee) { bg = 'bg-amber-50'; border = 'border-amber-400'; }
                else if (isWeekend) { bg = 'bg-stone-50'; }
                if (isToday) { border = 'border-lava'; }
                return (
                  <div key={d.toISOString()}
                    className={`${bg} border-2 ${border} rounded-xl p-1.5 min-h-[60px] text-left ${isToday ? 'ring-2 ring-lava ring-offset-1' : ''}`}>
                    <div className={`text-xs font-extrabold ${isToday ? 'text-lava' : 'text-stone'}`}>
                      {d.getDate()}
                    </div>
                    {events.map((e, i) => (
                      <div key={i} className="text-[10px] leading-tight mt-0.5 truncate" title={e.label}>
                        {e.icon}{hasExam && e.kind === 'exam' ? ' EX' : ''}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 text-[10px] text-s5 mt-2 flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-50 border border-red-400 rounded"></span> Examen</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-50 border border-amber-400 rounded"></span> Dictée</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white border-2 border-lava rounded"></span> Aujourd'hui</span>
            </div>
          </section>

          {/* ===== DICTÉES THÈME 7 ===== */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-s5 mb-2">Dictées Thème 7 (mardis)</h3>
            <div className="space-y-1.5">
              {DICTEE_WEEKS.map((w, idx) => {
                const tuesdayDate = addDays(DICTEE_T7_START, idx * 7);
                const daysAway = daysBetween(today, tuesdayDate);
                const isPast = daysAway < 0;
                const isCurrent = w.short === dicteeNow.short && daysAway >= 0 && daysAway <= 7;
                return (
                  <button key={w.short}
                    onClick={() => onLaunchMode && onLaunchMode(w.mode)}
                    className={`w-full text-left rounded-xl p-2.5 border-2 transition-all flex items-center gap-3 ${
                      isCurrent ? 'bg-amber-50 border-amber-400' : isPast ? 'bg-stone-50 border-s1 opacity-60' : 'bg-white border-s2 hover:border-lava'
                    }`}>
                    <div className="text-xs font-extrabold w-8 text-center" style={{ color: isCurrent ? '#9a3a10' : isPast ? '#7a7a7a' : '#3a5bc7' }}>
                      {w.short}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-stone truncate">{w.label}</div>
                      <div className="text-[11px] text-s5 truncate">{w.preview}</div>
                    </div>
                    <div className="text-[10px] font-bold text-s5 capitalize">
                      {isPast ? '✓ passé' : daysAway === 0 ? "AUJ." : daysAway <= 7 ? `dans ${daysAway}j` : frDateLabel(tuesdayDate).split(' ').slice(1, 3).join(' ')}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== MODES À PRATIQUER (raccourcis) ===== */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-s5 mb-2">Raccourcis prep — examens à venir</h3>
            <div className="space-y-3">
              {upcomingExams.slice(0, 3).map((ex) => (
                <div key={ex.name}>
                  <div className="text-xs font-bold text-stone mb-1">{ex.icon} {ex.name} <span className="text-s5 font-normal">(dans {ex.daysAway}j)</span></div>
                  <div className="flex gap-1.5 flex-wrap">
                    {ex.modes.map((m) => (
                      <button key={m.mode}
                        onClick={() => onLaunchMode && onLaunchMode(m.mode)}
                        className="bg-s1 hover:bg-lava hover:text-white rounded-lg px-2.5 py-1 text-xs font-semibold text-stone border border-s2 transition-all">
                        {m.icon} {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
