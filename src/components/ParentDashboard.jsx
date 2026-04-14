import React, { useState, useEffect } from 'react';
import { getDashboard, getAdvice, resetData } from '../utils/storage';

const categoryLabels = {
  calcul: '🔢 Calcul',
  terme: '🔍 Terme manquant',
  multi_step: '🧩 Problemes a etapes',
  relational: '🔗 De plus / de moins',
  compare: '⚖️ Compare',
  pair_impair: '🎯 Pair / Impair',
  mental: '🧠 Calcul mental',
  statistique: '📊 Statistique',
  determinant: '📌 Déterminants',
  verbes: '✏️ Verbes',
  adjectif: '🎨 Adjectifs',
  pemdas: '🧮 PEMDAS',
  conjugaison: '✏️ Conjugaison',
  aquarium: '🐟 Aquarium',
  speed: '⚡ Course',
  memory: '🎴 Mémoire',
};

function ProgressChart({ daily }) {
  if (!daily || daily.length === 0) return null;
  const maxTotal = Math.max(...daily.map((d) => d.total), 1);
  const barWidth = Math.max(20, Math.floor(280 / daily.length));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border-2 border-s1">
      <h3 className="font-bold text-s6 mb-3">📈 Progres par jour</h3>
      <div className="flex items-end gap-1 justify-center" style={{ height: 140 }}>
        {daily.map((d, i) => {
          const pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
          const barH = Math.max(8, (d.total / maxTotal) * 110);
          const fillH = d.total > 0 ? (d.correct / d.total) * barH : 0;
          const color = pct >= 70 ? '#00b894' : pct >= 50 ? '#e2762b' : '#e84393';
          const dateLabel = d.date.slice(5); // MM-DD
          return (
            <div key={i} className="flex flex-col items-center" style={{ width: barWidth }}>
              <span className="text-xs font-bold text-stone mb-1">{pct}%</span>
              <div
                className="rounded-t relative overflow-hidden"
                style={{ width: barWidth - 4, height: barH, background: 'rgba(235,228,219,0.5)' }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t transition-all"
                  style={{ height: fillH, background: color }}
                />
              </div>
              <span className="text-[10px] text-s4 mt-1">{dateLabel}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-4 mt-3 text-xs text-s4">
        <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#00b894' }} />70%+</span>
        <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#e2762b' }} />50-69%</span>
        <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#e84393' }} />&lt;50%</span>
      </div>
    </div>
  );
}

function WeakAreas({ stats, sessions }) {
  // Find categories with lowest scores
  const weak = [...stats]
    .filter((s) => s.total >= 3)
    .sort((a, b) => (a.correct / a.total) - (b.correct / b.total))
    .slice(0, 3);

  // Gather recent wrong answers from session details
  const wrongAnswers = [];
  for (const s of sessions) {
    let details = [];
    try { details = JSON.parse(s.details || '[]'); } catch {}
    for (const d of details) {
      if (!d.correct && d.question) {
        wrongAnswers.push({ ...d, date: s.date });
      }
    }
  }
  const recentWrong = wrongAnswers.slice(0, 8);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border-2 border-s1">
      <h3 className="font-bold text-s6 mb-3">🎯 Points a travailler</h3>

      {weak.length > 0 && (
        <div className="space-y-2 mb-4">
          {weak.map((cat) => {
            const pct = Math.round((cat.correct / cat.total) * 100);
            return (
              <div key={cat.category} className="flex items-center justify-between bg-red-50 rounded-xl p-3 border border-red-400">
                <span className="text-sm font-semibold text-stone">{categoryLabels[cat.category] || cat.category}</span>
                <span className="text-sm font-bold text-red-600">{pct}% ({cat.correct}/{cat.total})</span>
              </div>
            );
          })}
        </div>
      )}

      {recentWrong.length > 0 ? (
        <>
          <h4 className="text-sm font-bold text-s4 mb-2">Erreurs recentes:</h4>
          <div className="space-y-2">
            {recentWrong.map((item, i) => (
              <div key={i} className="bg-cream rounded-xl p-3 border-l-4 border-red-400">
                <p className="font-semibold text-stone text-sm">{item.question}</p>
                <div className="flex gap-4 mt-1 text-xs">
                  <span className="text-red-600">Ryan: {item.userAnswer}</span>
                  <span className="text-green-700 font-bold">Reponse: {item.correctAnswer}</span>
                </div>
                <div className="text-[10px] text-s4 mt-1">
                  {categoryLabels[item.category] || item.category} — {item.date}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-s4">Pas encore assez de donnees</p>
      )}
    </div>
  );
}

function TutorAdvice() {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadAdvice() {
    setLoading(true);
    try {
      const res = await getAdvice();
      setAdvice(res.message);
    } catch {
      setAdvice("Erreur de connexion. Reessayez.");
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border-2 border-s1">
      <h3 className="font-bold text-s6 mb-3">👨‍🏫 Conseils du tuteur IA</h3>
      {!advice && !loading && (
        <button
          onClick={loadAdvice}
          className="w-full py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}
        >
          Obtenir les recommandations
        </button>
      )}
      {loading && (
        <div className="text-center py-4">
          <div className="text-2xl mb-2 animate-pulse">🤔</div>
          <p className="text-sm text-s4">Analyse en cours...</p>
        </div>
      )}
      {advice && (
        <div className="text-sm text-s6 leading-relaxed whitespace-pre-line">
          {advice}
        </div>
      )}
      {advice && (
        <button
          onClick={loadAdvice}
          className="mt-3 text-xs text-s4 font-semibold"
        >
          🔄 Actualiser
        </button>
      )}
    </div>
  );
}

export default function ParentDashboard({ onHome }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    getDashboard().then((res) => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-10 text-center">
        <div className="text-4xl mb-4 animate-pulse">📊</div>
        <p className="text-lg font-semibold text-s4">Chargement...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-10 text-center">
        <button onClick={onHome} className="text-s4 font-bold text-sm mb-6">← Menu</button>
        <p className="text-s4">Erreur de chargement</p>
      </div>
    );
  }

  const { stats, sessions, totals, sessionCount, daily } = data;
  const overallPct = totals.total > 0 ? Math.round((totals.correct / totals.total) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="text-s4 font-bold text-sm">← Menu</button>
        <h2 className="font-bold text-s6">📊 Tableau de bord</h2>
        <div />
      </div>

      {/* Overall stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 text-center border-2 border-s1">
        <div className="text-4xl font-extrabold text-fox">{overallPct}%</div>
        <p className="text-sm text-s4 mt-1">Score global</p>
        <div className="flex justify-around mt-4 text-center">
          <div>
            <div className="text-2xl font-bold text-stone">{totals.total}</div>
            <div className="text-xs text-s4">Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{totals.correct}</div>
            <div className="text-xs text-s4">Correctes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone">{sessionCount}</div>
            <div className="text-xs text-s4">Sessions</div>
          </div>
        </div>
      </div>

      {/* Progress chart */}
      <ProgressChart daily={daily} />

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border-2 border-s1">
        <h3 className="font-bold text-s6 mb-3">Par categorie</h3>
        <div className="space-y-3">
          {stats.map((cat) => {
            const pct = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
            return (
              <div key={cat.category}>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-stone">{categoryLabels[cat.category] || cat.category}</span>
                  <span className="text-s4">{pct}% ({cat.correct}/{cat.total})</span>
                </div>
                <div className="w-full bg-s1 rounded-full h-3 mt-1">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 70 ? '#00b894' : pct >= 50 ? '#e2762b' : '#e84393',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak areas & recent errors */}
      <WeakAreas stats={stats} sessions={sessions} />

      {/* AI tutor advice */}
      <TutorAdvice />

      {/* Recent sessions */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border-2 border-s1">
        <h3 className="font-bold text-s6 mb-3">Dernieres sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-s4">Aucune session encore</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => {
              const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
              return (
                <div key={s.id} className="flex justify-between items-center text-sm border-b border-s1 pb-2">
                  <span className="text-s4">{s.date}</span>
                  <span className="font-semibold text-s6">{s.mode}</span>
                  <span className={`font-bold ${pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-fox' : 'text-red-500'}`}>
                    {s.correct}/{s.total} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset button */}
      <div className="text-center mb-8">
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="text-sm text-red-500 font-semibold"
          >
            🗑️ Reinitialiser les donnees
          </button>
        ) : (
          <div className="bg-red-50 rounded-xl p-4 border border-red-400">
            <p className="text-sm font-bold text-red-600 mb-3">
              Effacer toutes les donnees de Ryan?
            </p>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await resetData();
                  setData(null);
                  setShowReset(false);
                  getDashboard().then(setData);
                }}
                className="flex-1 py-2 rounded-xl font-bold text-white bg-red-500"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 py-2 rounded-xl font-bold text-s4 bg-white border-2 border-s2"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
