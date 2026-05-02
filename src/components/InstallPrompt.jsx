import React, { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem('sb_install_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    // Detect iOS (no beforeinstallprompt support)
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    setIsIos(ios);

    if (ios) {
      // iOS — show manual install instructions after a delay
      setTimeout(() => setShowPrompt(true), 3000);
      return;
    }

    // Android/desktop — wait for beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    setShowPrompt(false);
    localStorage.setItem('sb_install_dismissed', String(Date.now()));
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  }

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-lava">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a)' }}>
            <span className="text-white text-2xl">📱</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-base font-extrabold text-stone">Installer Study Buddy</div>
            {isIos ? (
              <p className="text-xs text-s4 font-semibold mt-1">
                Touche <span className="font-bold">⎋ Partager</span> en bas, puis <span className="font-bold">"Sur l'écran d'accueil"</span>.
              </p>
            ) : (
              <p className="text-xs text-s4 font-semibold mt-1">
                Ajoute l'app à ton écran d'accueil pour y accéder en un clic.
              </p>
            )}
            <div className="flex gap-2 mt-3">
              {!isIos && (
                <button onClick={install}
                  className="flex-1 py-2 rounded-lg font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                  Installer
                </button>
              )}
              <button onClick={dismiss}
                className={`${isIos ? 'flex-1' : ''} py-2 px-4 rounded-lg font-bold text-s6 text-sm bg-white border-2 border-s2`}>
                {isIos ? 'OK, compris' : 'Plus tard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
