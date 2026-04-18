import React, { useState } from 'react';
import Menu from './components/Menu';
import PracticeSession from './components/PracticeSession';
import TutorSession from './components/TutorSession';
import Results from './components/Results';
import ParentDashboard from './components/ParentDashboard';
import AquariumGame from './components/AquariumGame';
import SpeedGame from './components/SpeedGame';
import MemoryGame from './components/MemoryGame';
import Timer from './components/Timer';
import Chores from './components/Chores';
import Coach from './components/Coach';

export default function App() {
  const [screen, setScreen] = useState('profile');
  const [mode, setMode] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);
  const [profile, setProfile] = useState(null); // 'ryan' or 'cayla'
  const [darkMode, setDarkMode] = useState(false);

  function selectProfile(p) {
    setProfile(p);
    setScreen('menu');
  }

  function startPractice(selectedMode) {
    setMode(selectedMode);
    setScreen('practice');
  }

  function startTutor() {
    setScreen('tutor');
  }

  function startAquarium() {
    setScreen('aquarium');
  }

  function startSpeed() {
    setScreen('speed');
  }

  function startMemory() {
    setScreen('memory');
  }

  function startTimer() {
    setScreen('timer');
  }

  function startChores() {
    setScreen('chores');
  }

  function startCoach() {
    setScreen('coach');
  }

  function finishSession(results) {
    setSessionResults(results);
    setScreen('results');
  }

  function goHome() {
    setScreen('menu');
    setMode(null);
    setSessionResults(null);
  }

  function switchProfile() {
    setScreen('profile');
    setProfile(null);
    setMode(null);
    setSessionResults(null);
  }

  function openDashboard() {
    setScreen('dashboard');
  }

  return (
    <div className={`min-h-screen pb-8 ${darkMode ? 'dark-mode' : ''}`}>
      {screen === 'profile' && (
        <div className="max-w-3xl mx-auto px-4 pt-16 text-center">
          <div className="text-5xl mb-4">🌋</div>
          <h1 className="font-heading text-3xl font-extrabold text-stone mb-1">Study Buddy</h1>
          <p className="text-s4 font-semibold mb-8">Qui es-tu?</p>
          {window.__selectedVoice && (
            <p className="text-[10px] text-s3 mb-4">Voix: {window.__selectedVoice}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => selectProfile('ryan')}
              className="bg-white border-2 border-s1 rounded-2xl p-6 hover:scale-105 hover:border-fox hover:shadow-lg transition-all active:scale-95">
              <div className="text-5xl mb-3">🧑‍🚀</div>
              <div className="font-heading text-xl font-extrabold text-stone">Ryan</div>
              <div className="text-xs font-bold text-s4 mt-1">2e année</div>
            </button>
            <button onClick={() => selectProfile('cayla')}
              className="bg-white border-2 border-s1 rounded-2xl p-6 hover:scale-105 hover:border-pink-400 hover:shadow-lg transition-all active:scale-95">
              <div className="text-5xl mb-3">🌟</div>
              <div className="font-heading text-xl font-extrabold text-stone">Cayla</div>
              <div className="text-xs font-bold text-s4 mt-1">6e année</div>
            </button>
          </div>
        </div>
      )}
      {screen === 'menu' && (
        <Menu
          profile={profile}
          onStartPractice={startPractice}
          onStartTutor={startTutor}
          onStartAquarium={startAquarium}
          onStartSpeed={startSpeed}
          onStartMemory={startMemory}
          onStartTimer={startTimer}
          onStartChores={startChores}
          onStartCoach={startCoach}
          onOpenDashboard={openDashboard}
          onSwitchProfile={switchProfile}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
        />
      )}
      {screen === 'practice' && (
        <PracticeSession
          mode={mode}
          onFinish={finishSession}
          onHome={goHome}
        />
      )}
      {screen === 'tutor' && (
        <TutorSession onHome={goHome} />
      )}
      {screen === 'results' && (
        <Results
          results={sessionResults}
          onHome={goHome}
          onRetry={() => startPractice(mode)}
          onContinueFocused={(weakCategory) => {
            // Switch to weak category mode if we recognize it, else retry same
            const validModes = ['calcul', 'terme', 'multi_step', 'relational', 'compare',
              'pair_impair', 'mental', 'statistique', 'determinant', 'verbes', 'adjectif',
              'pemdas', 'conjugaison', 'dictee', 'on_ont', 'groupe_nom', 'passe_compose'];
            if (weakCategory && validModes.includes(weakCategory)) {
              startPractice(weakCategory);
            } else {
              startPractice(mode);
            }
          }}
        />
      )}
      {screen === 'aquarium' && (
        <AquariumGame onHome={goHome} onFinish={finishSession} />
      )}
      {screen === 'speed' && (
        <SpeedGame onHome={goHome} onFinish={finishSession} />
      )}
      {screen === 'memory' && (
        <MemoryGame onHome={goHome} onFinish={finishSession} />
      )}
      {screen === 'timer' && (
        <Timer onHome={goHome} />
      )}
      {screen === 'chores' && (
        <Chores onHome={goHome} />
      )}
      {screen === 'coach' && (
        <Coach onHome={goHome} onStartPractice={startPractice} />
      )}
      {screen === 'dashboard' && (
        <ParentDashboard onHome={goHome} />
      )}
    </div>
  );
}
