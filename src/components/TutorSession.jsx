import React, { useState, useEffect, useCallback } from 'react';
import { generateCalcul } from '../generators/calcul';
import { generateTerme } from '../generators/terme';
import { generateWordProblem } from '../generators/wordProblem';
import { askTutor } from '../utils/storage';
import { speak } from '../utils/speech';
import TutorBubble from './TutorBubble';
import TensOnes from './TensOnes';
import InteractiveTenFrames from './InteractiveTenFrames';

function generateTutorQuestion() {
  const r = Math.random();
  if (r < 0.4) return generateCalcul();
  if (r < 0.7) return generateTerme();
  return generateWordProblem();
}

export default function TutorSession({ onHome }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [tutorMessages, setTutorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showScratchPad, setShowScratchPad] = useState(false);

  const newQuestion = useCallback(() => {
    const q = generateTutorQuestion();
    setQuestion(q);
    setSelected(null);
    setShowResult(false);
    setShowScratchPad(false);
    setTutorMessages([{ text: 'Lis bien! 📖', isLoading: false }]);
    speak('Lis bien!');
    setQuestionCount((c) => c + 1);
  }, []);

  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  if (!question) return null;

  async function handleAnswer(value) {
    setSelected(value);
    setShowResult(true);

    if (value === question.correct) {
      const cheers = [
        'Super Ryan! Tu as compris! 🌟',
        'Excellent! Tu es un champion! 🏆',
        'Bravo! Continue comme ca! 💪',
        'Parfait! Tu progresses! 🚀',
        'Genial Ryan! 🎉',
      ];
      const cheer = cheers[Math.floor(Math.random() * cheers.length)];
      setTutorMessages((prev) => [...prev, { text: cheer, isLoading: false }]);
    } else {
      setLoading(true);
      setTutorMessages((prev) => [...prev, { text: '', isLoading: true }]);

      const prompt = `Ryan vient de se tromper sur ce problème:
Problème: ${question.text}
Sa réponse: ${value}
Bonne réponse: ${question.correct}
Type d'erreur: ${question.category === 'calcul' ? (question.type === 'addition' ? 'erreur de retenue' : 'erreur d\'emprunt') : question.category === 'terme' ? 'terme manquant' : 'problème à étapes'}
Explique-lui pourquoi sa réponse est incorrecte et guide-le vers la bonne réponse.`;

      try {
        const res = await askTutor(prompt);
        setTutorMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { text: res.message, isLoading: false };
          return updated;
        });
      } catch {
        setTutorMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            text: `La bonne reponse est ${question.correct}. Essaie de comprendre pourquoi! 🤔`,
            isLoading: false,
          };
          return updated;
        });
      }
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="text-s4 font-bold text-sm">← Menu</button>
        <div className="text-sm font-bold text-info">👨‍🏫 Mode Tuteur</div>
        <div className="text-sm text-s4">Q{questionCount}</div>
      </div>

      {/* Tutor messages */}
      <div className="mb-4 space-y-2">
        {tutorMessages.map((msg, i) => (
          <TutorBubble key={i} message={msg.text} isLoading={msg.isLoading} />
        ))}
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-info border-2 border-s1">
        <p className="text-xl font-bold text-stone leading-relaxed mb-2">
          {question.text}
        </p>
        <div className="flex gap-4 mb-4">
          <button onClick={() => speak(question.text)} className="text-sm text-s4 font-semibold">
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
        </div>

        {showScratchPad && !showResult && (
          <InteractiveTenFrames onClose={() => setShowScratchPad(false)} />
        )}

        {question.visual && <TensOnes a={question.visual.a} b={question.visual.b} op={question.visual.op} />}

        {/* Answer options */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {question.options.map((opt, i) => {
            let btnClass = 'bg-white border-2 border-s2 text-stone';
            if (showResult) {
              if (opt === question.correct) {
                btnClass = 'bg-green-50 border-2 border-green-500 text-green-700';
              } else if (opt === selected && opt !== question.correct) {
                btnClass = 'bg-red-50 border-2 border-red-400 text-red-600';
              } else {
                btnClass = 'bg-cream border-2 border-s1 text-s4';
              }
            }
            return (
              <button
                key={i}
                onClick={() => !showResult && handleAnswer(opt)}
                disabled={showResult}
                className={`py-4 rounded-xl font-extrabold text-2xl ${btnClass}`}
                style={{ minHeight: '60px' }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <button
            onClick={newQuestion}
            className="w-full mt-4 py-4 rounded-xl font-bold text-lg text-white"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}
          >
            Question suivante →
          </button>
        )}
      </div>
    </div>
  );
}
