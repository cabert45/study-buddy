import { useState, useEffect } from 'react';
import { X, Copy, Eye, EyeOff, ExternalLink, Pencil } from 'lucide-react';

const STORAGE_KEY = 'sb_boukili_creds';
const BOUKILI_URL = 'https://app.boukili.ca/'; // the reading app (boukili.ca is just the info site)

function loadCreds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCreds(c) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch {}
}

export default function BoukiliLauncher({ onClose }) {
  const [creds, setCreds] = useState(loadCreds);
  const [editing, setEditing] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [usernameInput, setUsernameInput] = useState(creds?.username || '');
  const [passwordInput, setPasswordInput] = useState(creds?.password || '');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!creds) setEditing(true);
  }, [creds]);

  function handleSave() {
    const next = { username: usernameInput.trim(), password: passwordInput };
    saveCreds(next);
    setCreds(next);
    setEditing(false);
  }

  async function copyToClipboard(text, which) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  function openBoukili() {
    window.open(BOUKILI_URL, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b-2 border-s1">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-lg font-heading font-extrabold text-stone leading-tight">Boukili</h2>
              <p className="text-xs text-s5">Lecture en français · Télé-Québec</p>
            </div>
          </div>
          <button onClick={onClose}
            className="bg-s1 hover:bg-s2 rounded-full p-2 text-stone">
            <X size={18} />
          </button>
        </div>

        {editing ? (
          <div className="p-4 space-y-3">
            <p className="text-xs text-s6">
              {creds ? 'Modifie les identifiants de Nyla.' : 'Mets les identifiants de Nyla une fois — on les gardera ici pour la prochaine fois.'}
            </p>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-s5 block mb-1">Nom d'utilisateur</label>
              <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="nyla@..."
                className="w-full px-3 py-2.5 rounded-xl border-2 border-s2 focus:border-lava focus:outline-none text-base text-stone" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-s5 block mb-1">Mot de passe</label>
              <div className="relative">
                <input value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  className="w-full px-3 py-2.5 pr-10 rounded-xl border-2 border-s2 focus:border-lava focus:outline-none text-base text-stone" />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-s5 hover:text-stone">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-s5 leading-snug">
              ⚠ Les identifiants sont gardés dans le navigateur de cet appareil seulement.
            </p>
            <div className="flex gap-2 pt-1">
              {creds && (
                <button onClick={() => setEditing(false)}
                  className="px-3 py-2.5 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
                  Annuler
                </button>
              )}
              <button onClick={handleSave}
                disabled={!usernameInput.trim() || !passwordInput}
                className="flex-1 py-2.5 rounded-xl font-extrabold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                Enregistrer
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <p className="text-sm text-stone">
              Bonjour Nyla! Voici tes identifiants. Tape sur les boutons pour les copier, puis ouvre Boukili.
            </p>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3 space-y-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-purple-700 mb-1">Nom d'utilisateur</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-base font-bold text-stone break-all bg-white rounded-lg px-2 py-1.5 border border-purple-200">
                    {creds.username}
                  </div>
                  <button onClick={() => copyToClipboard(creds.username, 'u')}
                    className="px-2 py-1.5 rounded-lg bg-white border border-purple-300 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
                    <Copy size={12} /> {copied === 'u' ? 'Copié!' : 'Copier'}
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-purple-700 mb-1">Mot de passe</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-base font-bold text-stone bg-white rounded-lg px-2 py-1.5 border border-purple-200 font-mono">
                    {showPw ? creds.password : '•'.repeat(Math.min(creds.password.length, 12))}
                  </div>
                  <button onClick={() => setShowPw((v) => !v)}
                    className="px-2 py-1.5 rounded-lg bg-white border border-purple-300 hover:bg-purple-100 text-purple-800 text-xs font-bold">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => copyToClipboard(creds.password, 'p')}
                    className="px-2 py-1.5 rounded-lg bg-white border border-purple-300 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
                    <Copy size={12} /> {copied === 'p' ? 'Copié!' : 'Copier'}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={openBoukili}
              className="w-full py-3 rounded-xl font-extrabold text-white text-lg flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)' }}>
              <ExternalLink size={18} /> Ouvrir Boukili
            </button>

            <button onClick={() => setEditing(true)}
              className="w-full py-2 rounded-xl font-bold text-s6 bg-white border-2 border-s2 hover:border-lava flex items-center justify-center gap-1 text-sm">
              <Pencil size={14} /> Modifier les identifiants
            </button>

            <p className="text-[10px] text-s5 leading-snug text-center">
              Après ta première connexion, le navigateur va se souvenir de toi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
