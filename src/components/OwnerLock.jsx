import React, { useState, useEffect } from 'react';

// Simple PIN lock for parent profile (Ryan/Cayla)
// Just deters curious kids — not real security

const STORAGE_KEY = 'sb_owner_pin';
const UNLOCK_KEY = 'sb_owner_unlocked';

export function isOwnerUnlocked() {
  return localStorage.getItem(UNLOCK_KEY) === 'yes';
}

export function lockOwner() {
  localStorage.removeItem(UNLOCK_KEY);
}

export function hasPinSet() {
  return !!localStorage.getItem(STORAGE_KEY);
}

export default function OwnerLock({ onUnlock, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState(hasPinSet() ? 'enter' : 'setup');
  const [setupStep, setSetupStep] = useState('first'); // 'first' or 'confirm'
  const [firstPin, setFirstPin] = useState('');

  function handleDigit(d) {
    if (pin.length >= 4) return;
    setPin(p => p + d);
    setError('');
  }

  function handleDelete() {
    setPin(p => p.slice(0, -1));
    setError('');
  }

  function handleSubmit() {
    if (pin.length !== 4) return;

    if (mode === 'setup') {
      if (setupStep === 'first') {
        setFirstPin(pin);
        setPin('');
        setSetupStep('confirm');
        return;
      }
      // Confirm step
      if (pin !== firstPin) {
        setError('Les codes ne correspondent pas. Recommence.');
        setPin('');
        setFirstPin('');
        setSetupStep('first');
        return;
      }
      localStorage.setItem(STORAGE_KEY, pin);
      localStorage.setItem(UNLOCK_KEY, 'yes');
      onUnlock();
      return;
    }

    // Enter mode
    const stored = localStorage.getItem(STORAGE_KEY);
    if (pin === stored) {
      localStorage.setItem(UNLOCK_KEY, 'yes');
      onUnlock();
    } else {
      setError('Code incorrect');
      setPin('');
    }
  }

  // Auto-submit on 4th digit
  useEffect(() => {
    if (pin.length === 4) {
      const t = setTimeout(handleSubmit, 200);
      return () => clearTimeout(t);
    }
  }, [pin]);

  const title = mode === 'setup'
    ? (setupStep === 'first' ? 'Crée ton code parent' : 'Confirme le code')
    : 'Entre ton code parent';

  const subtitle = mode === 'setup'
    ? (setupStep === 'first' ? 'Choisis 4 chiffres faciles à retenir' : 'Tape le même code à nouveau')
    : 'Pour voir les profils de tes enfants';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border-2 border-s1">
        <div className="text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="font-heading text-xl font-extrabold text-stone mb-1">{title}</h2>
          <p className="text-sm text-s4 font-semibold mb-5">{subtitle}</p>

          {/* PIN dots */}
          <div className="flex justify-center gap-3 mb-5">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-extrabold transition-all ${
                  i < pin.length
                    ? 'bg-orange-50 border-lava text-lava'
                    : 'bg-white border-s2'
                }`}>
                {i < pin.length ? '•' : ''}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-600 font-bold text-sm mb-3">{error}</p>
          )}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <button key={n} onClick={() => handleDigit(String(n))}
                className="py-4 rounded-xl font-bold text-2xl text-stone bg-white border-2 border-s2 hover:border-lava active:scale-95">
                {n}
              </button>
            ))}
            <div />
            <button onClick={() => handleDigit('0')}
              className="py-4 rounded-xl font-bold text-2xl text-stone bg-white border-2 border-s2 hover:border-lava active:scale-95">
              0
            </button>
            <button onClick={handleDelete}
              className="py-4 rounded-xl font-bold text-xl text-s4 bg-white border-2 border-s2 hover:border-lava active:scale-95">
              ←
            </button>
          </div>

          <button onClick={onCancel}
            className="text-sm text-s4 font-bold hover:text-lava">
            ✕ Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
