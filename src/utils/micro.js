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

const MIN_AUDIO_OCTETS = 2000;   // en dessous, il n'y a rien du tout
// Il faut avoir VRAIMENT parle: un niveau au-dessus de ce seuil, pendant au
// moins ce temps-la. Sans ce garde-fou, on envoyait du bruit de piece a Scribe
// — et Scribe, devant du bruit, n'avoue pas qu'il n'a rien compris: il invente
// une phrase francaise plausible. Nyla s'est vue attribuer « Trop con. Est-ce
// que tu es tres fort en maths? », qu'elle n'a jamais dit. Mieux vaut
// redemander que de lui preter des mots.
const SEUIL_VOIX = 0.14;
const MS_VOIX_MIN = 350;

// Scribe marque lui-meme ce qu'il juge vide. On ne montre jamais ces marqueurs.
const MARQUEURS = /^[\s(\[]*(silence|bruit|musique|inaudible|blank_audio|no speech|music|noise)[\s)\]]*$/i;

// Une transcription doit tenir dans le temps qu'a dure l'audio. Un enfant de
// cinq ans ne place pas quinze mots en deux secondes: au-dela, c'est invente.
const MOTS_PAR_SECONDE_MAX = 4.5;

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

  const mesure = { max: 0, msVoix: 0 };
  const arreterNiveau = suivreLeNiveau(stream, onNiveau, mesure);
  const debut = Date.now();

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

  const duree = (Date.now() - debut) / 1000;
  if (!blob || blob.size < MIN_AUDIO_OCTETS) return { texte: '', vide: true, refuse: false };

  // Elle n'a pas parle: on ne demande rien a Scribe. C'est plus rapide, ca ne
  // coute rien, et surtout ca ne peut pas inventer.
  if (mesure.msVoix < MS_VOIX_MIN) {
    return { texte: '', vide: true, refuse: false, silence: true };
  }

  onTranscrit && onTranscrit();
  try {
    const res = await fetch('/api/ecoute', {
      method: 'POST',
      headers: { 'Content-Type': blob.type || 'audio/webm' },
      body: blob,
    });
    if (!res.ok) return { texte: '', vide: false, refuse: false };
    const j = await res.json();
    let texte = String(j.texte || '').trim();

    // Les marqueurs de Scribe (« [silence] ») ne sont pas des paroles.
    if (MARQUEURS.test(texte)) texte = '';

    // Trop de mots pour la duree: c'est une invention, pas une transcription.
    const mots = texte ? texte.split(/\s+/).length : 0;
    if (mots > 3 && duree > 0 && mots / duree > MOTS_PAR_SECONDE_MAX) {
      return { texte: '', vide: true, refuse: false, invente: true };
    }
    return { texte, vide: !texte, refuse: false };
  } catch {
    return { texte: '', vide: false, refuse: false };
  }
}

// La barre verte qui bouge avec la voix. C'est la seule preuve visible, pour
// un enfant, que le micro l'entend vraiment.
function suivreLeNiveau(stream, onNiveau, mesure) {
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
      const niveau = Math.min(1, max / 60);
      if (mesure) {
        mesure.max = Math.max(mesure.max, niveau);
        // ~16 ms par image: on cumule le temps passe au-dessus du seuil.
        if (niveau >= SEUIL_VOIX) mesure.msVoix += 16;
      }
      onNiveau && onNiveau(niveau);
      raf = requestAnimationFrame(boucle);
    };
    boucle();
  } catch {}
  return () => {
    cancelAnimationFrame(raf);
    onNiveau && onNiveau(0);
    try { ctx && ctx.close(); } catch {}
  };
}
