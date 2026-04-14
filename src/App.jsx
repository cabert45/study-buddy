import React, { useState } from 'react';
import Menu from './components/Menu';
import PracticeSession from './components/PracticeSession';
import TutorSession from './components/TutorSession';
import Results from './components/Results';
import ParentDashboard from './components/ParentDashboard';
import AquariumGame from './components/AquariumGame';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [mode, setMode] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);

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

  function finishSession(results) {
    setSessionResults(results);
    setScreen('results');
  }

  function goHome() {
    setScreen('menu');
    setMode(null);
    setSessionResults(null);
  }

  function openDashboard() {
    setScreen('dashboard');
  }

  return (
    <div className="min-h-screen pb-8">
      {screen === 'menu' && (
        <Menu
          onStartPractice={startPractice}
          onStartTutor={startTutor}
          onStartAquarium={startAquarium}
          onOpenDashboard={openDashboard}
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
        />
      )}
      {screen === 'aquarium' && (
        <AquariumGame
          onHome={goHome}
          onFinish={finishSession}
        />
      )}
      {screen === 'dashboard' && (
        <ParentDashboard onHome={goHome} />
      )}
    </div>
  );
}
