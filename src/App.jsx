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
import { setProfile as persistProfile } from './utils/storage';
import InstallPrompt from './components/InstallPrompt';
import OwnerLock, { isOwnerUnlocked, lockOwner } from './components/OwnerLock';
import NotificationsPanel from './components/Notifications';
import DicteeFlashcard from './components/DicteeFlashcard';
import StudyReminderSettings from './components/StudyReminderSettings';
import FamilyOverview from './components/FamilyOverview';
import Journal from './components/Journal';
import ComposeMessage from './components/ComposeMessage';
import { autoResume } from './utils/studyReminder';
import { addNotification } from './utils/notifications';
import { getUnseenForProfile, markSeen } from './data/whatsNew';
import Presentation from './components/Presentation';
import FableReader from './components/FableReader';

export default function App() {
  const [screen, setScreen] = useState('profile');
  const [mode, setMode] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);
  const [profile, setProfile] = useState(null); // 'ryan' or 'cayla'
  const [darkMode, setDarkMode] = useState(false);
  const [showLock, setShowLock] = useState(false);
  const [unlockedTick, setUnlockedTick] = useState(0); // forces re-render after unlock
  const [showNotifs, setShowNotifs] = useState(false);
  const [showStudyReminder, setShowStudyReminder] = useState(false);
  const [flashcardWeek, setFlashcardWeek] = useState(null);
  const [showFamily, setShowFamily] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  // Auto-resume study reminders on app load
  React.useEffect(() => { autoResume(); }, []);

  function selectProfile(p) {
    setProfile(p);
    persistProfile(p);
    setScreen('menu');
    // Fire "what's new" notifications for this profile
    const unseen = getUnseenForProfile(p);
    unseen.forEach(n => {
      addNotification({
        title: `🆕 ${n.title}`,
        message: n.body,
        type: 'info',
        profile: p,
      });
      markSeen(n.id);
    });
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

  function startJournal() {
    setScreen('journal');
  }

  function startPresentation() {
    setScreen('presentation');
  }

  function startFable() {
    setScreen('fable');
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
      <InstallPrompt />
      {screen === 'profile' && (() => {
        const unlocked = isOwnerUnlocked();
        return (
          <div className="max-w-3xl mx-auto px-4 pt-16 text-center">
            <div className="text-5xl mb-4">🌋</div>
            <h1 className="font-heading text-3xl font-extrabold text-stone mb-1">Study Buddy</h1>
            <p className="text-s4 font-semibold mb-8">Qui es-tu?</p>
            <div className={`grid gap-4 ${unlocked ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 max-w-sm mx-auto'}`}>
              {unlocked && (
                <>
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
                </>
              )}
              <button onClick={() => selectProfile('demo')}
                className={`border-2 border-s1 rounded-2xl p-6 hover:scale-105 hover:border-blue-400 hover:shadow-lg transition-all active:scale-95 ${unlocked ? 'col-span-2 md:col-span-1' : ''}`}
                style={{ background: 'linear-gradient(135deg, #fff, #fef0e4)' }}>
                <div className="text-5xl mb-3">👋</div>
                <div className="font-heading text-xl font-extrabold text-stone">{unlocked ? 'Mes amis' : 'Commencer'}</div>
                <div className="text-xs font-bold text-s4 mt-1">{unlocked ? 'Castiel · Rivant · Alexis' : 'Pratique de 2e année'}</div>
                {unlocked && <div className="text-[10px] font-bold text-fox-d mt-1 uppercase tracking-wide">Démo · 2e année</div>}
              </button>
            </div>

            {/* Mode parent — small button at bottom */}
            <div className="mt-12">
              {unlocked ? (
                <button onClick={() => { lockOwner(); setUnlockedTick(t => t + 1); }}
                  className="text-xs text-s4 font-bold hover:text-lava">
                  🔒 Verrouiller (cacher Ryan & Cayla)
                </button>
              ) : (
                <button onClick={() => setShowLock(true)}
                  className="text-xs text-s4 font-bold hover:text-lava">
                  🔓 Mode parent
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {showLock && (
        <OwnerLock
          onUnlock={() => { setShowLock(false); setUnlockedTick(t => t + 1); }}
          onCancel={() => setShowLock(false)}
        />
      )}

      {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
      {showStudyReminder && <StudyReminderSettings onClose={() => setShowStudyReminder(false)} profile={profile} />}
      {flashcardWeek && (
        <DicteeFlashcard
          weekKey={flashcardWeek}
          onHome={() => setFlashcardWeek(null)}
          onFinish={() => setFlashcardWeek(null)}
        />
      )}
      {showFamily && <FamilyOverview onClose={() => setShowFamily(false)} />}
      {showCompose && <ComposeMessage onClose={() => setShowCompose(false)} profile={profile} />}
      {screen === 'journal' && <Journal onHome={goHome} profile={profile} />}
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
          onStartPresentation={startPresentation}
          onStartFable={startFable}
          onOpenDashboard={openDashboard}
          onOpenNotifications={() => setShowNotifs(true)}
          onOpenStudyReminder={() => setShowStudyReminder(true)}
          onStartFlashcard={(weekKey) => {
            // Menu uses dictee_sN; DicteeFlashcard looks up by theme7_sN
            const aliases = {
              dictee_s1: 'theme7_s1',
              dictee_s2: 'theme7_s2',
              dictee_s3: 'theme7_s3',
              dictee_s4: 'theme7_s4',
            };
            setFlashcardWeek(aliases[weekKey] || weekKey);
          }}
          onOpenFamily={() => setShowFamily(true)}
          onStartJournal={startJournal}
          onOpenCompose={() => setShowCompose(true)}
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
        <Chores onHome={goHome} profile={profile} />
      )}
      {screen === 'coach' && (
        <Coach onHome={goHome} onStartPractice={startPractice} />
      )}
      {screen === 'presentation' && (
        <Presentation onHome={goHome} />
      )}
      {screen === 'fable' && (
        <FableReader onHome={goHome} />
      )}
      {screen === 'dashboard' && (
        <ParentDashboard onHome={goHome} />
      )}
    </div>
  );
}
