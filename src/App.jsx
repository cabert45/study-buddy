import React, { useState } from 'react';
import Menu from './components/Menu';
import PracticeSession from './components/PracticeSession';
import TutorSession from './components/TutorSession';
import Results from './components/Results';
import ParentDashboard from './components/ParentDashboard';
import AquariumGame from './components/AquariumGame';
import SpeedGame from './components/SpeedGame';
import MemoryGame from './components/MemoryGame';

export default function App() {
  const [screen, setScreen] = useState('profile');
  const [mode, setMode] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);
  const [profile, setProfile] = useState(null); // 'ryan' or 'cayla'

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
    <div className={`min-h-screen pb-8 ${profile === 'cayla' ? 'cayla-theme' : ''}`}>
      {screen === 'profile' && (
        <div className="max-w-md mx-auto px-4 pt-16 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">🚀 Study Buddy</h1>
          <p className="text-purple-300 mb-8">Qui es-tu?</p>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => selectProfile('ryan')}
              className="rounded-2xl p-6 bg-gradient-to-br from-cosmic/40 to-rocket/30 border-2 border-cosmic/50
                hover:scale-105 transition-all active:scale-95">
              <div className="text-5xl mb-3">🧑‍🚀</div>
              <div className="text-xl font-extrabold text-white">Ryan</div>
              <div className="text-xs text-purple-300 mt-1">2e année</div>
            </button>
            <button onClick={() => selectProfile('cayla')}
              className="rounded-2xl p-6 border-2 hover:scale-105 transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.3), rgba(255,217,61,0.2))', borderColor: 'rgba(255,107,107,0.5)' }}>
              <div className="text-5xl mb-3">🌟</div>
              <div className="text-xl font-extrabold text-white">Cayla</div>
              <div className="text-xs text-pink-300 mt-1">6e année</div>
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
          onOpenDashboard={openDashboard}
          onSwitchProfile={switchProfile}
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
        <AquariumGame onHome={goHome} onFinish={finishSession} />
      )}
      {screen === 'speed' && (
        <SpeedGame onHome={goHome} onFinish={finishSession} />
      )}
      {screen === 'memory' && (
        <MemoryGame onHome={goHome} onFinish={finishSession} />
      )}
      {screen === 'dashboard' && (
        <ParentDashboard onHome={goHome} />
      )}
    </div>
  );
}
