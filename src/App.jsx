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
import BiographieFlashcard from './components/BiographieFlashcard';
import StudyReminderSettings from './components/StudyReminderSettings';
import FamilyOverview from './components/FamilyOverview';
import Journal from './components/Journal';
import ComposeMessage from './components/ComposeMessage';
import { autoResume } from './utils/studyReminder';
import { addNotification } from './utils/notifications';
import { getUnseenForProfile, markSeen } from './data/whatsNew';
import Presentation from './components/Presentation';
import FableReader from './components/FableReader';
import Agenda from './components/Agenda';
import TestResults from './components/TestResults';
import BoukiliLauncher from './components/BoukiliLauncher';
import Reading from './components/Reading';
import NylaFlashcard from './components/NylaFlashcard';
import NylaSpeed from './components/NylaSpeed';
import NylaSongs from './components/NylaSongs';
import NylaAddition from './components/NylaAddition';
import NylaCompare from './components/NylaCompare';

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
  const [nylaDeck, setNylaDeck] = useState(null);
  const [showFamily, setShowFamily] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);
  const [showBioFlashcard, setShowBioFlashcard] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);
  const [showBoukili, setShowBoukili] = useState(false);

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
    setNylaDeck(null);
    setFlashcardWeek(null);
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

  function startReading() {
    setScreen('reading');
  }

  function startNylaSpeed() {
    setScreen('nylaspeed');
  }

  function startNylaSongs() {
    setScreen('nylasongs');
  }

  function startNylaAddition() {
    setScreen('nylaadd');
  }

  function startNylaCompare() {
    setScreen('nylacompare');
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
    setNylaDeck(null);
    setFlashcardWeek(null);
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
            <div className="text-5xl mb-4">🍁</div>
            <h1 className="font-heading text-3xl font-extrabold text-stone mb-1">Study Buddy</h1>
            <div className="inline-block text-xs font-extrabold text-fox-d bg-fox-belly rounded-full px-3 py-1 mb-3">🍁 Rentrée 2026-2027</div>
            <p className="text-s4 font-semibold mb-8">Qui es-tu?</p>
            <div className={`grid gap-4 ${unlocked ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 max-w-sm mx-auto'}`}>
              {unlocked && (
                <>
                  <button onClick={() => selectProfile('ryan')}
                    className="bg-white border-2 border-s1 rounded-2xl p-6 hover:scale-105 hover:border-fox hover:shadow-lg transition-all active:scale-95">
                    <div className="text-5xl mb-3">🧑‍🚀</div>
                    <div className="font-heading text-xl font-extrabold text-stone">Ryan</div>
                    <div className="text-xs font-bold text-s4 mt-1">3e année</div>
                  </button>
                  <button onClick={() => selectProfile('cayla')}
                    className="bg-white border-2 border-s1 rounded-2xl p-6 hover:scale-105 hover:border-pink-400 hover:shadow-lg transition-all active:scale-95">
                    <div className="text-5xl mb-3">🌟</div>
                    <div className="font-heading text-xl font-extrabold text-stone">Cayla</div>
                    <div className="text-xs font-bold text-s4 mt-1">6e année</div>
                  </button>
                  <button onClick={() => selectProfile('nyla')}
                    className="bg-white border-2 border-s1 rounded-2xl p-6 hover:scale-105 hover:border-purple-400 hover:shadow-lg transition-all active:scale-95">
                    <div className="text-5xl mb-3">🌸</div>
                    <div className="font-heading text-xl font-extrabold text-stone">Nyla</div>
                    <div className="text-xs font-bold text-s4 mt-1">Pré-maternelle · 5 ans</div>
                  </button>
                </>
              )}
              {/* Démo « Commencer » — visible seulement quand l'app est verrouillée
                  (c'est la seule porte d'entrée pour un visiteur). La carte
                  « Mes amis » a été retirée de l'écran famille. */}
              {!unlocked && (
                <button onClick={() => selectProfile('demo')}
                  className="border-2 border-s1 rounded-2xl p-6 hover:scale-105 hover:border-blue-400 hover:shadow-lg transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #fff, #fef0e4)' }}>
                  <div className="text-5xl mb-3">👋</div>
                  <div className="font-heading text-xl font-extrabold text-stone">Commencer</div>
                  <div className="text-xs font-bold text-s4 mt-1">Pratique de 2e année</div>
                </button>
              )}
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
      {showBioFlashcard && (
        <BiographieFlashcard
          onHome={() => setShowBioFlashcard(false)}
          onFinish={() => setShowBioFlashcard(false)}
        />
      )}
      {flashcardWeek && screen === 'menu' && (
        <DicteeFlashcard
          weekKey={flashcardWeek}
          onHome={() => setFlashcardWeek(null)}
          onFinish={() => setFlashcardWeek(null)}
        />
      )}
      {showFamily && <FamilyOverview onClose={() => setShowFamily(false)} />}
      {showCompose && <ComposeMessage onClose={() => setShowCompose(false)} profile={profile} />}
      {showAgenda && (
        <Agenda
          onClose={() => setShowAgenda(false)}
          onLaunchMode={(m) => { setShowAgenda(false); startPractice(m); }}
        />
      )}
      {showTestResults && (
        <TestResults onClose={() => setShowTestResults(false)} />
      )}
      {showBoukili && (
        <BoukiliLauncher onClose={() => setShowBoukili(false)} />
      )}
      {screen === 'journal' && <Journal onHome={goHome} profile={profile} />}
      {screen === 'reading' && <Reading onHome={goHome} profile={profile} />}
      {screen === 'nylaspeed' && <NylaSpeed onHome={goHome} />}
      {screen === 'nylasongs' && <NylaSongs onHome={goHome} />}
      {screen === 'nylaadd' && <NylaAddition onHome={goHome} />}
      {screen === 'nylacompare' && <NylaCompare onHome={goHome} />}
      {nylaDeck && screen === 'menu' && (
        <NylaFlashcard
          deck={nylaDeck}
          onHome={() => setNylaDeck(null)}
          onFinish={() => setNylaDeck(null)}
        />
      )}
      {screen === 'menu' && !nylaDeck && !flashcardWeek && (
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
          onOpenAgenda={() => setShowAgenda(true)}
          onOpenBioFlashcard={() => setShowBioFlashcard(true)}
          onOpenTestResults={() => setShowTestResults(true)}
          onOpenBoukili={() => setShowBoukili(true)}
          onStartJournal={startJournal}
          onStartReading={startReading}
          onStartNylaFlashcard={(deck) => { setScreen('menu'); setNylaDeck(deck); }}
          onStartNylaSpeed={startNylaSpeed}
          onStartNylaSongs={startNylaSongs}
          onStartNylaAddition={startNylaAddition}
          onStartNylaCompare={startNylaCompare}
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
