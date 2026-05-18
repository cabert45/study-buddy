import React, { useState, useEffect, useRef } from 'react';
import { speak } from '../utils/speech';

// Fables de Jean de La Fontaine — devoirs de mémorisation
// Ryan doit pouvoir réciter chaque fable à voix haute en 1 minute.

const FABLES = {
  papillon: {
    id: 'papillon',
    type: 'poésie',
    title: 'Le papillon',
    subtitle: 'Marc Alyn',
    devoir: 'TEST jeudi 21 mai',
    emoji: '🦋',
    lines: [
      'Jaune ou bleu, vert ou vermeil,',
      'Il vole, il va, il vit sa vie',
      'À petits battements ravis.',
      'Dans l\'air doux, comme un éventail.',
      'Ah ! Mettez au clou vos filets,',
      'Jetez épingles et bouchons,',
      'Laissez-le libre car il est',
      'La poésie, le papillon !',
    ],
    hints: [
      ['vermeil', 'rouge vif (couleur, comme l\'or rouge)'],
      ['il vit sa vie', 'il fait ce qu\'il veut, librement'],
      ['battements', 'mouvements des ailes'],
      ['ravis', 'très heureux'],
      ['éventail', 'un objet qu\'on agite pour avoir de l\'air frais'],
      ['Mettez au clou', 'rangez, mettez de côté (ne les utilisez plus)'],
      ['filets', 'filets pour attraper les papillons'],
      ['Jetez', 'lancez, débarrassez-vous de'],
      ['épingles', 'aiguilles pour épingler les papillons morts'],
      ['bouchons', 'ce qui ferme une bouteille (utilisé pour piquer les insectes)'],
      ['Laissez-le libre', 'ne l\'attrapez pas, laissez-le voler'],
      ['poésie', 'la beauté en mots'],
    ],
  },
  corbeau: {
    id: 'corbeau',
    type: 'fable',
    title: 'Le Corbeau et le Renard',
    subtitle: 'Jean de La Fontaine — Fables, livre 1, fable 2',
    devoir: 'Devoir lundi 18 mai',
    emoji: '🦊',
    lines: [
      'Maître Corbeau, sur un arbre perché,',
      'Tenait en son bec un fromage.',
      'Maître Renard, par l\'odeur alléché,',
      'Lui tint à peu près ce langage :',
      '« Hé ! bonjour, Monsieur du Corbeau.',
      'Que vous êtes joli ! que vous me semblez beau !',
      'Sans mentir, si votre ramage',
      'Se rapporte à votre plumage,',
      'Vous êtes le Phénix des hôtes de ces bois. »',
      'À ces mots le Corbeau ne se sent pas de joie ;',
      'Et pour montrer sa belle voix,',
      'Il ouvre un large bec, laisse tomber sa proie.',
      'Le Renard s\'en saisit, et dit : « Mon bon Monsieur,',
      'Apprenez que tout flatteur',
      'Vit aux dépens de celui qui l\'écoute :',
      'Cette leçon vaut bien un fromage, sans doute. »',
      'Le Corbeau, honteux et confus,',
      'Jura, mais un peu tard, qu\'on ne l\'y prendrait plus.',
    ],
    hints: [
      ['perché', 'installé sur une branche'],
      ['alléché', 'attiré (par une odeur)'],
      ['ramage', 'le chant des oiseaux'],
      ['plumage', 'les plumes'],
      ['Phénix', 'oiseau légendaire — le plus beau de tous'],
      ['hôtes', 'habitants (de ces bois)'],
      ['proie', 'ce qu\'on attrape (le fromage)'],
      ['s\'en saisit', 'l\'attrape vite'],
      ['flatteur', 'quelqu\'un qui dit des faux compliments'],
      ['vit aux dépens de', 'profite de'],
      ['leçon', 'ce qu\'on apprend'],
      ['honteux', 'qui a honte'],
      ['confus', 'mélangé, mal à l\'aise'],
      ['jura', 'promit très fort'],
      ['on ne l\'y prendrait plus', 'il ne se ferait plus avoir'],
    ],
  },
  cigale: {
    id: 'cigale',
    type: 'fable',
    title: 'La cigale et la fourmi',
    subtitle: 'Jean de La Fontaine — Fables, livre 1, fable 1',
    devoir: 'Devoir lundi 11 mai',
    emoji: '🐜',
    lines: [
      'La cigale, ayant chanté',
      'Tout l\'été,',
      'Se trouva fort dépourvue',
      'Quand la bise fut venue:',
      'Pas un seul petit morceau',
      'De mouche ou de vermisseau.',
      'Elle alla crier famine',
      'Chez la fourmi sa voisine,',
      'La priant de lui prêter',
      'Quelque grain pour subsister',
      'Jusqu\'à la saison nouvelle.',
      '« Je vous paierai, lui dit-elle,',
      'Avant l\'oût, foi d\'animal,',
      'Intérêt et principal. »',
      'La fourmi n\'est pas prêteuse:',
      'C\'est là son moindre défaut.',
      '« Que faisiez-vous au temps chaud? »',
      'Dit-elle à cette emprunteuse.',
      '— Nuit et jour à tout venant',
      'Je chantais, ne vous déplaise.',
      '— Vous chantiez? j\'en suis fort aise:',
      'Eh bien! dansez maintenant. »',
    ],
    hints: [
      ['dépourvue', 'elle n\'a plus rien'],
      ['la bise', 'le vent froid d\'hiver'],
      ['vermisseau', 'un petit ver'],
      ['famine', 'pas de nourriture, on a faim'],
      ['prêter', 'donner pour un temps'],
      ['subsister', 'survivre, vivre'],
      ['l\'oût (= août)', 'ancien français pour "août"'],
      ['foi d\'animal', 'je te le promets'],
      ['intérêt et principal', 'ce que je dois + un peu plus'],
      ['prêteuse', 'quelqu\'un qui aime prêter'],
      ['moindre défaut', 'son plus petit défaut'],
      ['emprunteuse', 'quelqu\'un qui emprunte'],
      ['à tout venant', 'à n\'importe qui'],
      ['ne vous déplaise', 'ne te fâche pas'],
      ['fort aise', 'très contente'],
    ],
  },
};

const DEFAULT_FABLE = 'corbeau'; // semaine du 18 mai

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function FableReader({ onHome }) {
  const [fableId, setFableId] = useState(DEFAULT_FABLE);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const intervalRef = useRef(null);

  const fable = FABLES[fableId];
  const fableFull = fable.lines.join('\n');

  // Timer tick
  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            // Ding sound
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              [523.25, 659.25, 783.99].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
                gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.15 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.5);
                osc.start(ctx.currentTime + i * 0.15);
                osc.stop(ctx.currentTime + i * 0.15 + 0.5);
              });
            } catch {}
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function startTimer() {
    setSeconds(60);
    setDone(false);
    setRunning(true);
  }
  function pauseTimer() { setRunning(false); }
  function resetTimer() {
    setRunning(false);
    setSeconds(60);
    setDone(false);
  }
  function playModel() { speak(fableFull); }
  function stopAudio() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function switchFable(id) {
    stopAudio();
    resetTimer();
    setShowHints(false);
    setFableId(id);
  }

  const timerColor = done ? '#2d7a3a' : seconds <= 10 ? '#c74a15' : seconds <= 30 ? '#e8a050' : '#3a5bc7';

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { stopAudio(); onHome(); }} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone text-base">{fable.emoji} Lecture de la {fable.type}</h2>
        <div />
      </div>

      {/* Fable picker */}
      <div className="flex gap-2 mb-3">
        {Object.values(FABLES).map((f) => (
          <button key={f.id} onClick={() => switchFable(f.id)}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border-2 transition-colors ${
              fableId === f.id
                ? 'bg-fox-d text-white border-fox-d'
                : 'bg-white text-stone border-s2 hover:border-s4'
            }`}>
            {f.emoji} {f.title}
          </button>
        ))}
      </div>

      {/* Title banner */}
      <div className="bg-orange-50 rounded-2xl p-4 mb-3 border-2 border-orange-200 text-center">
        <p className="text-[10px] font-bold text-fox-d uppercase tracking-wide">{fable.devoir}</p>
        <h1 className="font-heading text-2xl font-extrabold text-stone leading-tight mt-1">{fable.title}</h1>
        <p className="text-xs font-semibold text-s4 mt-1">{fable.subtitle}</p>
        <p className="text-xs font-bold text-fox-d mt-2">Objectif: lire toute la fable à voix haute en 1 minute!</p>
      </div>

      {/* Timer + controls */}
      <div className="bg-white rounded-2xl p-4 mb-3 border-2 border-s1 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] font-bold text-s4 uppercase tracking-wide">Chrono</p>
            <div className="font-heading font-extrabold leading-none transition-colors" style={{ fontSize: '3rem', color: timerColor }}>
              {fmt(seconds)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {!running && !done && (
              <button onClick={startTimer}
                className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                ▶ Démarrer 1 min
              </button>
            )}
            {running && (
              <button onClick={pauseTimer}
                className="px-4 py-2 rounded-xl font-bold text-white text-sm bg-yellow-600">
                ⏸ Pause
              </button>
            )}
            {done && (
              <button onClick={startTimer}
                className="px-4 py-2 rounded-xl font-bold text-white text-sm bg-ok">
                ↻ Recommencer
              </button>
            )}
            {(seconds !== 60 || done) && !running && (
              <button onClick={resetTimer}
                className="px-4 py-2 rounded-xl font-bold text-s6 text-xs bg-white border-2 border-s2">
                Réinitialiser
              </button>
            )}
          </div>
        </div>
        {done && (
          <div className="mt-3 bg-green-50 rounded-xl p-3 border-2 border-green-200 text-center">
            <p className="font-heading text-lg font-extrabold text-ok">🎉 Temps écoulé!</p>
            <p className="text-xs font-semibold text-s6">As-tu fini la fable? Si non, essaie encore!</p>
          </div>
        )}
      </div>

      {/* Audio model */}
      <div className="flex gap-2 mb-3">
        <button onClick={playModel}
          className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(90deg, #3a5bc7, #5b4ad4)' }}>
          🔊 Écouter le modèle (à suivre)
        </button>
        <button onClick={stopAudio}
          className="px-4 py-3 rounded-xl font-bold text-s6 text-sm bg-white border-2 border-s2">
          ⏹ Stop
        </button>
      </div>

      {/* Fable text */}
      <div className="bg-cream rounded-2xl p-5 border-2 border-s1 shadow-sm mb-3">
        <div className="font-heading text-lg leading-relaxed text-stone whitespace-pre-line" style={{ fontSize: '1.15rem' }}>
          {fable.lines.map((line, i) => (
            <p key={i} className={`${i > 0 && (fable.lines[i - 1].endsWith('.') || fable.lines[i - 1].endsWith('»') || fable.lines[i - 1].endsWith(':')) ? 'mt-3' : ''}`}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Pronunciation hints */}
      <button onClick={() => setShowHints((v) => !v)}
        className="w-full py-2 rounded-xl text-sm font-bold text-fox-d bg-orange-50 border-2 border-orange-200 mb-3">
        💡 {showHints ? 'Cacher' : 'Voir'} les mots difficiles
      </button>

      {showHints && (
        <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200 mb-3">
          <p className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2">Mots à bien comprendre</p>
          <ul className="text-sm font-semibold text-stone space-y-1">
            {fable.hints.map(([word, meaning], i) => (
              <li key={i}><b>{word}</b> = {meaning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Done button */}
      <button onClick={() => { stopAudio(); onHome(); }}
        className="w-full py-3 rounded-xl font-bold text-white text-sm"
        style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>
        ✓ J'ai fini — retour au menu
      </button>
    </div>
  );
}
