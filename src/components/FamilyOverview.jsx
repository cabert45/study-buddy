import React, { useState, useEffect } from 'react';

const profileMeta = {
  ryan: { name: 'Ryan', grade: '3e année', emoji: '🧑‍🚀', color: '#c74a15' },
  cayla: { name: 'Cayla', grade: '6e année', emoji: '🌟', color: '#e84393' },
  demo: { name: 'Mes amis', grade: 'Démo', emoji: '👋', color: '#3a5bc7' },
};

function pct(c, t) {
  return t > 0 ? Math.round((c / t) * 100) : 0;
}

export default function FamilyOverview({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/family')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-cream rounded-2xl p-5 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-s1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl font-extrabold text-stone">👨‍👩‍👧‍👦 La famille</h3>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 font-bold hover:border-lava hover:text-lava">✕</button>
        </div>

        {loading && <div className="text-center py-8 text-s4 font-bold">Chargement...</div>}

        {!loading && data && (
          <div className="space-y-3">
            {Object.entries(data).map(([profileId, d]) => {
              const meta = profileMeta[profileId];
              if (!meta) return null;
              const overall = pct(d.totalCorrect, d.totalQuestions);
              const todayPct = pct(d.todayCorrect, d.todayQuestions);
              const weekPct = pct(d.weekCorrect, d.weekQuestions);

              return (
                <div key={profileId}
                  className="bg-white rounded-2xl p-4 border-2 border-s1"
                  style={{ borderLeftWidth: 6, borderLeftColor: meta.color }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{meta.emoji}</div>
                    <div className="flex-1">
                      <div className="font-heading text-lg font-extrabold text-stone">{meta.name}</div>
                      <div className="text-xs font-bold text-s4">{meta.grade}</div>
                    </div>
                    {d.totalQuestions > 0 && (
                      <div className="text-right">
                        <div className="font-heading text-2xl font-extrabold" style={{ color: meta.color }}>{overall}%</div>
                        <div className="text-[10px] font-bold text-s4 uppercase">global</div>
                      </div>
                    )}
                  </div>

                  {d.totalQuestions === 0 ? (
                    <p className="text-xs text-s4 font-semibold">Pas encore de pratique</p>
                  ) : (
                    <>
                      {/* Stats grid */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-cream rounded-lg p-2 text-center border border-s1">
                          <div className="font-heading text-base font-extrabold text-stone">{d.todayQuestions}</div>
                          <div className="text-[9px] font-bold text-s4 uppercase">Aujourd'hui</div>
                          {d.todayQuestions > 0 && <div className="text-[10px] font-bold text-fox-d">{todayPct}%</div>}
                        </div>
                        <div className="bg-cream rounded-lg p-2 text-center border border-s1">
                          <div className="font-heading text-base font-extrabold text-stone">{d.weekQuestions}</div>
                          <div className="text-[9px] font-bold text-s4 uppercase">7 jours</div>
                          {d.weekQuestions > 0 && <div className="text-[10px] font-bold text-fox-d">{weekPct}%</div>}
                        </div>
                        <div className="bg-cream rounded-lg p-2 text-center border border-s1">
                          <div className="font-heading text-base font-extrabold text-stone">{d.totalQuestions}</div>
                          <div className="text-[9px] font-bold text-s4 uppercase">Total</div>
                        </div>
                      </div>

                      {/* Weakest area */}
                      {d.weakestCategory && d.weakestCategory.pct < 70 && (
                        <div className="bg-red-50 rounded-lg p-2 border border-red-200 mb-3">
                          <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Point faible</p>
                          <p className="text-sm font-bold text-stone">{d.weakestCategory.category} <span className="text-red-600">({d.weakestCategory.pct}%)</span></p>
                        </div>
                      )}

                      {/* Recent sessions */}
                      {d.recentSessions && d.recentSessions.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-s4 uppercase mb-1">Dernières sessions</p>
                          <div className="space-y-1">
                            {d.recentSessions.slice(0, 3).map((s, i) => {
                              const sPct = pct(s.correct, s.total);
                              return (
                                <div key={i} className="flex justify-between items-center text-xs">
                                  <span className="text-s4">{s.date}</span>
                                  <span className="text-s6 font-bold flex-1 ml-2 truncate">{s.mode}</span>
                                  <span className={`font-bold ${sPct >= 70 ? 'text-ok' : sPct >= 50 ? 'text-fox' : 'text-red-500'}`}>
                                    {s.correct}/{s.total} ({sPct}%)
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
