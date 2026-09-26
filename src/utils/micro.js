// Enregistrer un tour de parole, et le faire transcrire.
//
// Deux écrans en ont besoin — « On parle ensemble » (Nyla) et la dictée orale
// (Ryan) — et le code est assez subtil pour qu'on ne veuille pas deux copies
// qui divergent: le micro ne doit s'ouvrir qu'APRÈS la fin de la phrase, le
// niveau sonore doit remonter à l'écran pour qu'on voie qu'on est entendu, et
// tous les flux doivent être coupés même si l'enfant quitte l'écran en plein
// milieu.
//
// Rien n'est gardé: l'audio vit le temps d'une requête.

const MIN_AUDIO_OCTETS = 2000; // en dessous, c'est un silence

/**
 * Ouvre le micro, enregistre, puis rend le texte transcrit.
 *
 * @param {object} o
 * @param {number} o.maxMs        coupure automatique (l'enfant oublie d'appuyer)
 * @param {function} o.onNiveau   (0..1) le volume, pour la barre à l'écran
 * @param {function} o.onOuvert   appelé quand le micro est vraiment ouvert
 * @param {function} o.onArret    reçoit la fonction « arrête maintenant »
 * @param {function} o.onTranscrit appelé quand on passe à la transcription
 * @returns {Promise<{texte:string, vide:boolean, refuse:boolean}>}
 */
export async function ecouterUnTour({
  maxMs = 20000, onNiveau, onOuvert, onArret, onTranscrit,
} = {}) {
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return { texte: '', vide: true, refuse: true };
  }

  const arreterNiveau = suivreLeNiveau(stream, onNiveau);

  const blob = await new Promise((resolve) => {
    let mime = '';
    for (const m of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) { mime = m; break; }
    }
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const morceaux = [];
    let minuterie = null;
    rec.ondataavailable = (e) => { if (e.data && e.data.size) morceaux.push(e.data); };
    rec.onstop = () => {
      clearTimeout(minuterie);
      arreterNiveau();
      try { stream.getTracks().forEach((t) => t.stop()); } catch {}
      resolve(new Blob(morceaux, { type: rec.mimeType || 'audio/webm' }));
    };
    const arrete = () => { if (rec.state === 'recording') rec.stop(); };
    onArret && onArret(arrete);
    rec.start();
    onOuvert && onOuvert();
    minuterie = setTimeout(arrete, maxMs);
  });

  if (!blob || blob.size < MIN_AUDIO_OCTETS) return { texte: '', vide: true, refuse: false };

  onTranscrit && onTranscrit();
  try {
    const res = await fetch('/api/ecoute', {
      method: 'POST',
      headers: { 'Content-Type': blob.type || 'audio/webm' },
      body: blob,
    });
    if (!res.ok) return { texte: '', vide: false, refuse: false };
    const j = await res.json();
    return { texte: String(j.texte || '').trim(), vide: false, refuse: false };
  } catch {
    return { texte: '', vide: false, refuse: false };
  }
}

// La barre verte qui bouge avec la voix. C'est la seule preuve visible, pour
// un enfant, que le micro l'entend vraiment.
function suivreLeNiveau(stream, onNiveau) {
  if (!onNiveau) return () => {};
  let raf = null;
  let ctx = null;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    ctx = new Ctx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const boucle = () => {
      analyser.getByteTimeDomainData(data);
      let max = 0;
      for (let i = 0; i < data.length; i++) max = Math.max(max, Math.abs(data[i] - 128));
      onNiveau(Math.min(1, max / 60));
      raf = requestAnimationFrame(boucle);
    };
    boucle();
  } catch {}
  return () => {
    cancelAnimationFrame(raf);
    onNiveau(0);
    try { ctx && ctx.close(); } catch {}
  };
}
