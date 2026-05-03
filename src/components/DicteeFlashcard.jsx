import React, { useState, useEffect, useRef } from 'react';
import { speak, speakSlow } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { dicteeWeeks } from '../data/dicteeWeekly';
import { notifySessionResult } from '../utils/notifications';

// Sentence templates by word — shows the word in context
const sentenceContexts = {
  // ===== RYAN — THEME 6 =====
  // Semaine 1 — verbes en -er
  'aller': "Je vais _____ à l'école.",
  'arriver': "Tu vas _____ en retard!",
  'pincer': "Le crabe peut me _____.",
  'réviser': "Je dois _____ pour la dictée.",
  'amuser': "On va s'_____ au parc.",
  'passer': "Tu peux me _____ le sel?",
  'rester': "Je veux _____ ici.",
  'trouver': "Aide-moi à _____ mon livre.",
  'appeler': "Maman va m'_____.",
  'penser': "Je vais _____ à toi.",
  // Semaine 2 — mots en p
  'paire': "J'ai une _____ de souliers.",
  'parce que': "Je dors _____ je suis fatigué.",
  'partout': "Mes jouets sont _____.",
  'prendre': "Je vais _____ une pomme.",
  'par': "Le voleur est entré _____ la fenêtre.",
  "parce qu'": "Je ris _____ il est drôle.",
  'patate': "Mon plat préféré: la _____.",
  'propre': "Ma chambre est _____.",
  'parasol': "Sous le _____, on a de l'ombre.",
  'parent': "Mon _____ travaille fort.",
  'pépin': "Il y a un _____ dans ma pomme.",
  // Semaine 3 — son o (o, au, eau)
  "aujourd'hui": "_____, c'est samedi!",
  'autre': "Veux-tu _____ chose?",
  'motoneige': "L'hiver, on fait de la _____.",
  'peau': "Ma _____ est douce.",
  'auto': "Papa conduit son _____.",
  'chameau': "Le _____ vit dans le désert.",
  'nouveau': "J'ai un _____ jeu!",
  'tableau': "La maîtresse écrit au _____.",
  'autour': "Les enfants courent _____ de l'arbre.",
  'moto': "Il roule sur sa grosse _____.",
  'nouvelle': "Maman a une _____ robe.",
  // Semaine 4 — n devient m devant b/m/p
  'campagne': "Mes grands-parents vivent à la _____.",
  'compote': "J'aime la _____ de pommes.",
  'printemps': "Au _____, les fleurs poussent.",
  'tomber': "Attention de ne pas _____.",
  'compost': "On met les épluchures dans le _____.",
  'concombre': "Le _____ est vert et long.",
  'temps': "Quel _____ fait-il aujourd'hui?",
  'trombone': "Le _____ est un instrument de musique.",
  // Cayla S1 — eur/eux/euil
  'acteur': "L'_____ joue dans des films.",
  'actrice': "L'_____ a gagné un prix.",
  'amateur': "Il est _____ de musique classique.",
  'amatrice': "Ma sœur est une _____ de poésie.",
  'conducteur': "Le _____ d'autobus est très prudent.",
  'conductrice': "La _____ a son permis depuis 10 ans.",
  'danseur': "Le _____ tournoie sur la scène.",
  'danseuse': "La _____ porte un tutu rose.",
  'électeur': "Chaque _____ doit voter.",
  'électrice': "Cette _____ a choisi son candidat.",
  'largeur': "Quelle est la _____ de cette table?",
  'lenteur': "La _____ de la tortue est célèbre.",
  'menteur': "Ce garçon est un grand _____.",
  'menteuse': "Personne ne la croit, c'est une _____.",
  'nageur': "Le _____ olympique s'entraîne tous les jours.",
  'nageuse': "Cette _____ a battu un record.",
  'pasteur': "Le _____ a donné un beau sermon.",
  'traducteur': "Le _____ travaille en plusieurs langues.",
  'traductrice': "Ma tante est _____ pour les Nations Unies.",
  'travailleur': "Mon père est un homme très _____.",
  'travailleuse': "Cette équipe est très _____.",
  'vendeur': "Le _____ m'a aidé à choisir.",
  'vendeuse': "La _____ a souri en m'accueillant.",
  'vigueur': "Il s'entraîne avec _____.",
  'courageux': "Ce pompier est très _____.",
  'courageuse': "Elle est _____ d'avoir parlé.",
  'creux': "Le tronc de l'arbre est _____.",
  'silencieux': "Sois _____ pendant l'examen.",
  'silencieuse': "La nuit était _____ et calme.",
  'corail': "Le _____ vit dans la mer chaude.",
  'gouvernail': "Le capitaine tient le _____.",
  'chevreuil': "Un _____ traverse la forêt.",
  'deuil': "La famille est en _____.",
  // Cayla S2 — verbes infinitif
  'conserver': "Il faut _____ les aliments au frigo.",
  'demeurer': "Je vais _____ silencieuse.",
  'déranger': "Ne pas _____ s'il vous plaît.",
  'entourer': "Il faut _____ la bonne réponse.",
  'examiner': "Le médecin va m'_____.",
  'goûter': "Veux-tu _____ ma soupe?",
  'gronder': "Maman va _____ le chien.",
  'libérer': "On va _____ le poisson dans la mer.",
  'moquer': "Il ne faut pas se _____ des autres.",
  'murmurer': "Elle aime _____ des secrets.",
  'nager': "Je vais _____ dans la piscine.",
  'noyer': "Attention de ne pas te _____.",
  'plonger': "Veux-tu _____ avec moi?",
  'prêter': "Peux-tu me _____ ton stylo?",
  'rassurer': "Maman vient me _____.",
  'reculer': "Tu peux _____ ta chaise.",
  'réparer': "Papa va _____ mon vélo.",
  'risquer': "Ne pas _____ sa vie.",
  'taper': "Il faut _____ doucement sur le clavier.",
  'venger': "Il veut se _____.",
  // Cayla S3 — finales
  'agréable': "Cette journée est _____.",
  'aimable': "Sois _____ avec ta sœur.",
  'averse': "Une grosse _____ est tombée.",
  'bourse': "J'ai oublié ma _____ à la maison.",
  'brave': "Mon frère est très _____.",
  'diable': "Ce film parle d'un _____.",
  'dispute': "Il y a eu une _____ dans la cour.",
  'formidable': "Ce concert était _____!",
  'intense': "L'effort est _____.",
  'journaliste': "La _____ pose des questions.",
  'marmite': "La soupe mijote dans la _____.",
  'mécanisme': "Le _____ de l'horloge est complexe.",
  'parachute': "Il saute avec un _____.",
  'pétrole': "Le prix du _____ monte.",
  'récolte': "La _____ de blé est bonne cette année.",
  'responsable': "Sois _____ de tes affaires.",
  'spécialiste': "C'est une _____ du cœur.",
  'tourisme': "Le _____ est important ici.",
  'touriste': "Ce _____ vient d'Italie.",
  'vaste': "La maison est _____.",
  'véritable': "Une _____ amitié dure toujours.",
};

function diffWords(typed, correct) {
  const result = [];
  const max = Math.max(typed.length, correct.length);
  for (let i = 0; i < max; i++) {
    const t = typed[i] || '';
    const c = correct[i] || '';
    if (t === c) result.push({ char: c || '_', status: 'ok' });
    else if (i >= correct.length) result.push({ char: t, status: 'extra' });
    else if (i >= typed.length) result.push({ char: c, status: 'missing' });
    else result.push({ char: t, status: 'wrong', expected: c });
  }
  return result;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DicteeFlashcard({ weekKey, onHome, onFinish }) {
  const week = dicteeWeeks[weekKey];
  if (!week) return null;

  // Round-based: do all words, then re-do the missed ones, until none missed
  const [round, setRound] = useState(1);
  const [queue, setQueue] = useState(() => shuffle(week.words));
  const [missedThisRound, setMissedThisRound] = useState([]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const inputRef = useRef(null);

  const word = queue[idx];

  // Speak the word when shown
  useEffect(() => {
    if (word) {
      setTimeout(() => speakSlow(word.correct), 400);
      setTimeout(() => inputRef.current?.focus(), 800);
    }
  }, [word]);

  if (allDone) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-6 text-center">
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="font-heading text-3xl font-extrabold text-ok mb-2">Tu maîtrises tous les mots!</h2>
        <p className="text-stone font-semibold mb-6">{stats.correct}/{stats.total} bonnes réponses au total · {round - 1} tour{round > 2 ? 's' : ''}</p>
        <div className="space-y-3">
          <button onClick={onFinish}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            Voir les résultats
          </button>
          <button onClick={onHome}
            className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  if (!word) return null;

  const sentence = sentenceContexts[word.correct] || `Écris le mot que tu entends.`;
  const sentenceWithBlank = sentence.replace('_____', '______');

  function handleSubmit(e) {
    e?.preventDefault();
    if (showResult) return nextWord();
    const isCorrect = typed.trim().toLowerCase() === word.correct.toLowerCase();
    setStats(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    if (!isCorrect) {
      setMissedThisRound(prev => [...prev, word]);
    }
    setShowResult(true);
    setRevealed(true);
  }

  function nextWord() {
    if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      setTyped('');
      setShowResult(false);
      setRevealed(false);
      return;
    }
    // End of round
    if (missedThisRound.length === 0) {
      // All correct → done!
      setAllDone(true);
      // Save session
      saveSession(`dictee_flashcard_${weekKey}`, stats.total + 1, stats.correct + (typed.trim().toLowerCase() === word.correct.toLowerCase() ? 1 : 0),
        [{ category: 'dictee_semaine', correct: true }]);
      const profile = localStorage.getItem('sb_profile') || 'cayla';
      notifySessionResult({
        profile, mode: `dictée flashcard ${week.name}`,
        correct: stats.correct + (typed.trim().toLowerCase() === word.correct.toLowerCase() ? 1 : 0),
        total: stats.total + 1, streak: 0, results: [],
      });
      return;
    }
    // Next round with missed words only
    setRound(r => r + 1);
    setQueue(shuffle(missedThisRound));
    setMissedThisRound([]);
    setIdx(0);
    setTyped('');
    setShowResult(false);
    setRevealed(false);
  }

  function skip() {
    setMissedThisRound(prev => [...prev, word]);
    setStats(s => ({ ...s, total: s.total + 1 }));
    nextWord();
  }

  const diff = revealed ? diffWords(typed.trim(), word.correct) : null;
  const isCorrect = revealed && typed.trim().toLowerCase() === word.correct.toLowerCase();

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone text-sm">{week.name}</h2>
        <div className="text-xs font-bold text-s4">Tour {round} · {idx + 1}/{queue.length}</div>
      </div>

      {/* Rule reminder */}
      <div className="bg-orange-50 rounded-xl p-3 mb-4 border-2 border-orange-200">
        <p className="text-xs font-bold text-fox-d uppercase tracking-wide mb-1">Règle</p>
        <p className="text-sm font-semibold text-stone">{week.rule}</p>
      </div>

      {/* Word card */}
      <div className="bg-white rounded-2xl p-6 border-2 border-s1 border-l-4 border-l-lava mb-4">
        <p className="text-xs font-bold text-fox-d uppercase tracking-wide mb-2">Écoute et écris le mot</p>
        <p className="text-base font-semibold text-stone leading-relaxed mb-3">{sentenceWithBlank}</p>

        <button onClick={() => speakSlow(word.correct)}
          className="text-sm text-fox-d font-bold mb-4 hover:text-lava">
          🔊 Réécouter le mot
        </button>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={showResult}
            placeholder="Tape le mot ici..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className={`w-full px-4 py-3 rounded-xl border-2 font-heading text-2xl font-bold text-center focus:outline-none ${
              !showResult ? 'border-s2 text-stone focus:border-lava' :
              isCorrect ? 'bg-green-50 border-green-500 text-green-700' :
              'bg-red-50 border-red-400 text-red-600'
            }`}
          />

          {/* Diff display when revealed */}
          {revealed && (
            <div className="mt-3 p-3 bg-cream rounded-xl border-2 border-s1">
              <p className="text-xs font-bold text-s4 uppercase mb-1">Réponse correcte:</p>
              <div className="font-heading text-2xl font-extrabold text-stone">{word.correct}</div>
              {!isCorrect && (
                <>
                  <p className="text-xs font-bold text-s4 uppercase mt-2 mb-1">Ta réponse:</p>
                  <div className="font-heading text-xl font-bold">
                    {diff.map((d, i) => (
                      <span key={i}
                        className={
                          d.status === 'ok' ? 'text-green-700' :
                          d.status === 'wrong' ? 'text-red-600 underline' :
                          d.status === 'extra' ? 'text-red-600 line-through' :
                          'text-orange-500 underline'
                        }>
                        {d.char}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-s4 font-semibold mt-2">
                    💡 Truc: lis bien la règle ci-dessus. Tu reverras ce mot au prochain tour!
                  </p>
                </>
              )}
              {isCorrect && (
                <p className="text-xs font-bold text-ok mt-2">✓ Parfait! Tu maîtrises ce mot.</p>
              )}
            </div>
          )}

          {!showResult ? (
            <div className="flex gap-2 mt-3">
              <button type="submit" disabled={!typed.trim()}
                className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                ✓ Vérifier
              </button>
              <button type="button" onClick={skip}
                className="px-4 py-3 rounded-xl font-bold text-s4 bg-white border-2 border-s2">
                Skip
              </button>
            </div>
          ) : (
            <button type="button" onClick={nextWord}
              className="w-full mt-3 py-3 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              {idx + 1 < queue.length ? 'Suivant →' : (missedThisRound.length === 0 ? 'Terminer 🏆' : `Tour suivant (${missedThisRound.length} à revoir)`)}
            </button>
          )}
        </form>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-xl p-2 border-2 border-s1">
          <div className="font-heading text-lg font-extrabold text-ok">{stats.correct}</div>
          <div className="text-[10px] font-bold text-s4 uppercase">Justes</div>
        </div>
        <div className="bg-white rounded-xl p-2 border-2 border-s1">
          <div className="font-heading text-lg font-extrabold text-red-500">{stats.total - stats.correct}</div>
          <div className="text-[10px] font-bold text-s4 uppercase">Erreurs</div>
        </div>
        <div className="bg-white rounded-xl p-2 border-2 border-s1">
          <div className="font-heading text-lg font-extrabold text-fox">{missedThisRound.length}</div>
          <div className="text-[10px] font-bold text-s4 uppercase">À revoir</div>
        </div>
      </div>
    </div>
  );
}
