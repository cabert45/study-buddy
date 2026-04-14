import React, { useState, useEffect, useCallback } from 'react';
import { generateCalcul } from '../generators/calcul';
import { generateTerme } from '../generators/terme';
import { generateWordProblem } from '../generators/wordProblem';
import { generateRelational } from '../generators/relational';
import { generateMental } from '../generators/mental';
import { generateCompare } from '../generators/compare';
import { generatePairImpair } from '../generators/pairImpair';
import { generateStatistique } from '../generators/statistique';
import { generateDeterminant } from '../generators/determinant';
import { generateVerbes } from '../generators/verbes';
import { generateAdjectif } from '../generators/adjectif';
import { generatePemdas } from '../generators/pemdas';
import { generateConjugaison } from '../generators/conjugaison';
import { saveSession } from '../utils/storage';
import { speak } from '../utils/speech';
import TensOnes from './TensOnes';
import CountingBoxes from './CountingBoxes';
import InteractiveTenFrames from './InteractiveTenFrames';
import { getVideosForCategory } from '../data/videoLinks';

const TOTAL_QUESTIONS = 8;

function getGenerator(mode) {
  switch (mode) {
    case 'calcul': return generateCalcul;
    case 'terme': return generateTerme;
    case 'multi_step': return generateWordProblem;
    case 'relational': return generateRelational;
    case 'mental': return generateMental;
    case 'compare': return generateCompare;
    case 'pair_impair': return generatePairImpair;
    case 'statistique': return generateStatistique;
    case 'determinant': return generateDeterminant;
    case 'verbes': return generateVerbes;
    case 'adjectif': return generateAdjectif;
    case 'pemdas': return generatePemdas;
    case 'conjugaison': return generateConjugaison;
    case 'francais_mix':
      return () => {
        const r = Math.random();
        if (r < 0.35) return generateDeterminant();
        if (r < 0.65) return generateVerbes();
        return generateAdjectif();
      };
    case 'mixed':
    default:
      return () => {
        const r = Math.random();
        if (r < 0.20) return generateCalcul();
        if (r < 0.35) return generateTerme();
        if (r < 0.50) return generateWordProblem();
        if (r < 0.60) return generateRelational();
        if (r < 0.70) return generateCompare();
        if (r < 0.78) return generatePairImpair();
        if (r < 0.88) return generateMental();
        return generateStatistique();
      };
  }
}

export default function PracticeSession({ mode, onFinish, onHome }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState([]);
  const [retryInserted, setRetryInserted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [operationPhase, setOperationPhase] = useState(false);
  const [operationAnswer, setOperationAnswer] = useState(null);
  const [operationCorrect, setOperationCorrect] = useState(null);
  const [showScratchPad, setShowScratchPad] = useState(false);

  const generate = useCallback(() => getGenerator(mode), [mode]);

  useEffect(() => {
    const gen = generate();
    const qs = Array.from({ length: TOTAL_QUESTIONS }, () => gen());
    setQuestions(qs);
  }, [generate]);

  const question = questions[currentIndex];

  useEffect(() => {
    if (question) {
      speak(question.text);
    }
  }, [question]);

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-10 text-center">
        <div className="text-4xl mb-4 animate-bounce">🌋</div>
        <p className="text-lg font-semibold text-s4">Chargement...</p>
      </div>
    );
  }

  const isWordProblem = question.type === 'word_problem';

  function handleOperationChoice(op) {
    setOperationAnswer(op);
    setOperationCorrect(op === question.correctOperation);
    setOperationPhase(true);
    setTimeout(() => {
      setOperationPhase(false);
    }, 1500);
  }

  function handleAnswer(value) {
    setSelected(value);
    setShowResult(true);

    const isCorrect = value === question.correct;
    const result = {
      question: question.text,
      category: question.category,
      correct: isCorrect,
      userAnswer: value,
      correctAnswer: question.correct,
      explanation: question.steps || question.explanation || question.hint || null,
      visual: question.visual || null,
    };

    if (isCorrect) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    setResults((prev) => [...prev, result]);
  }

  function handleNext() {
    const wasCorrect = selected === question.correct;

    if (!wasCorrect && !retryInserted) {
      const gen = getGenerator(mode);
      let retry;
      for (let i = 0; i < 10; i++) {
        retry = gen();
        if (retry.category === question.category) break;
      }
      const newQuestions = [...questions];
      newQuestions.splice(currentIndex + 1, 0, retry);
      setQuestions(newQuestions);
      setRetryInserted(true);
    } else {
      setRetryInserted(false);
    }

    if (currentIndex + 1 >= questions.length) {
      finishSession();
      return;
    }

    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setShowResult(false);
    setShowHint(false);
    setOperationAnswer(null);
    setOperationCorrect(null);
    setOperationPhase(false);
    setShowScratchPad(false);
  }

  function finishSession() {
    const correct = results.filter((r) => r.correct).length;
    const details = results.map((r) => ({ category: r.category, correct: r.correct, question: r.question, userAnswer: r.userAnswer, correctAnswer: r.correctAnswer }));
    saveSession(mode, results.length, correct, details);
    onFinish({ results, correct, total: results.length, mode, streak });
  }

  const progress = Math.min(((currentIndex + 1) / questions.length) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">
          ← Menu
        </button>
        <div className="text-sm font-bold text-s4">
          {currentIndex + 1} / {questions.length}
        </div>
        {streak >= 2 && (
          <div className="text-sm font-bold text-fox">🌟 {streak}</div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-s1 rounded-full h-2 mb-6">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-s1 border-l-4 border-l-lava">
        {/* Category badge */}
        <div className="text-xs font-bold text-fox-d uppercase mb-2">
          {question.category === 'calcul' && '🔢 Calcul'}
          {question.category === 'terme' && '🔍 Terme manquant'}
          {question.category === 'multi_step' && '🧩 Probleme a etapes'}
          {question.category === 'relational' && '🔗 De plus / de moins'}
          {question.category === 'mental' && '🧠 Calcul mental'}
          {question.category === 'compare' && '⚖️ Compare'}
          {question.category === 'pair_impair' && '🎯 Pair / Impair'}
          {question.category === 'statistique' && '📊 Statistique'}
          {question.category === 'determinant' && '📌 Déterminant'}
          {question.category === 'verbes' && '✏️ Verbes'}
          {question.category === 'adjectif' && '🎨 Adjectif'}
          {question.category === 'pemdas' && '🧮 PEMDAS'}
          {question.category === 'conjugaison' && '✏️ Conjugaison'}
        </div>

        {/* Question text */}
        <p className="text-xl font-heading font-bold text-stone leading-relaxed mb-4">
          {question.text}
        </p>

        {/* Listen button + scratch pad + video help */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => speak(question.text)}
            className="text-sm text-s4 font-semibold hover:text-lava"
          >
            🔊 Ecouter
          </button>
          {!showResult && (
            <button
              onClick={() => setShowScratchPad((v) => !v)}
              className="text-sm text-fox font-semibold"
            >
              {showScratchPad ? '📝 Fermer les boîtes' : '📝 Mes boîtes de travail'}
            </button>
          )}
          {getVideosForCategory(question.category).length > 0 && (
            <button
              onClick={() => {
                const videos = getVideosForCategory(question.category);
                window.open(videos[0].url, '_blank');
              }}
              className="text-sm text-ok font-semibold"
            >
              📺 Vidéo d'aide
            </button>
          )}
        </div>

        {/* Interactive scratch pad */}
        {showScratchPad && !showResult && (
          <InteractiveTenFrames onClose={() => setShowScratchPad(false)} />
        )}

        {/* Visual for calcul questions — show both tens/ones AND counting boxes */}
        {question.visual && !showResult && (
          <>
            <TensOnes a={question.visual.a} b={question.visual.b} op={question.visual.op} />
            <CountingBoxes a={question.visual.a} b={question.visual.b} op={question.visual.op} showExchange />
          </>
        )}

        {/* Word problem: operation identification step */}
        {isWordProblem && operationAnswer === null && !showResult && (
          <div className="mb-4 p-4 bg-star/10 rounded-xl border border-star/20">
            <p className="text-sm font-bold text-star mb-3">
              {question.operationQuestion}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleOperationChoice('addition')}
                className="flex-1 py-3 rounded-xl font-bold text-lg bg-cosmic/30 text-purple-200 border border-cosmic/40 active:bg-cosmic/50"
              >
                Addition (+)
              </button>
              <button
                onClick={() => handleOperationChoice('soustraction')}
                className="flex-1 py-3 rounded-xl font-bold text-lg bg-rocket/20 text-pink-200 border border-rocket/30 active:bg-rocket/40"
              >
                Soustraction (−)
              </button>
            </div>
          </div>
        )}

        {/* Operation feedback */}
        {operationPhase && (
          <div className={`mb-4 p-3 rounded-xl text-center font-bold ${
            operationCorrect ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {operationCorrect ? '✅ Bonne operation!' : `❌ C'est une ${question.correctOperation}!`}
          </div>
        )}

        {/* Hint button for terme manquant */}
        {question.hint && !showHint && !showResult && (
          <button
            onClick={() => setShowHint(true)}
            className="text-sm text-star font-semibold mb-3 block"
          >
            💡 Indice
          </button>
        )}
        {showHint && !showResult && (
          <div className="bg-star/10 rounded-xl p-3 mb-4 text-sm font-semibold text-star border border-star/20">
            💡 {question.hint}
          </div>
        )}

        {/* Answer options */}
        {(!isWordProblem || operationAnswer !== null) && !operationPhase && (
          <div className={`grid gap-3 mt-4 ${question.isCompare || question.options.length === 3 ? 'grid-cols-3' : question.options.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {question.options.map((opt, i) => {
              let btnClass = 'bg-white border-2 border-s2 text-stone hover:border-fox';
              if (showResult) {
                if (opt === question.correct) {
                  btnClass = 'bg-green-50 border-2 border-green-500 text-green-700';
                } else if (opt === selected && opt !== question.correct) {
                  btnClass = 'bg-red-50 border-2 border-red-400 text-red-600';
                } else {
                  btnClass = 'bg-gray-50 border-2 border-gray-200 text-gray-400';
                }
              }
              // Display label: use optionLabels if present (pair/impair), otherwise the value
              const displayLabel = question.optionLabels ? question.optionLabels[opt] : opt;
              return (
                <button
                  key={i}
                  onClick={() => !showResult && handleAnswer(opt)}
                  disabled={showResult}
                  className={`py-4 rounded-xl font-extrabold text-2xl transition-all ${btnClass}`}
                  style={{ minHeight: '60px' }}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        )}

        {/* Result feedback */}
        {showResult && (
          <div className="mt-4">
            {selected === question.correct ? (
              <div className="text-center p-3 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-2xl">✅</div>
                <p className="font-bold text-green-700">Bravo! 🌟</p>
              </div>
            ) : (
              <div className="p-3 bg-red-50 rounded-xl border-2 border-red-200">
                <div className="text-center text-2xl mb-2">❌</div>
                <p className="font-bold text-red-600 text-center mb-2">
                  La reponse est {question.correct}
                </p>
                {question.steps && (
                  <div className="text-sm text-red-300/80 space-y-1 mt-2">
                    {question.steps.map((step, i) => (
                      <p key={i} className="font-semibold">{step.label}: {step.text}</p>
                    ))}
                  </div>
                )}
                {question.explanation && !question.steps && (
                  <p className="text-sm text-red-300/80 font-semibold mt-1">{question.explanation}</p>
                )}
                {question.visual && (
                  <>
                    <TensOnes a={question.visual.a} b={question.visual.b} op={question.visual.op} />
                    <CountingBoxes a={question.visual.a} b={question.visual.b} op={question.visual.op} showExchange />
                  </>
                )}
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full mt-4 py-4 rounded-xl font-bold text-lg text-white"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}
            >
              {currentIndex + 1 >= questions.length ? 'Voir mes resultats 🏆' : 'Suivant →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
