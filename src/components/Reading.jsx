import React, { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, Plus, Check, X } from 'lucide-react';

// Read-to-earn tracker — encourage books over screens.
// Kid logs a finished book, earns a per-book reward. Parent settles up.
// Stored per-profile in localStorage (same safe storage as the journal).

const DEFAULT_RATE = 20;

function loadData(profile) {
  try {
    const raw = JSON.parse(localStorage.getItem(`sb_reading_${profile}`) || '{}');
    return { rate: raw.rate || DEFAULT_RATE, books: Array.isArray(raw.books) ? raw.books : [] };
  } catch {
    return { rate: DEFAULT_RATE, books: [] };
  }
}

function saveData(profile, data) {
  try {
    localStorage.setItem(`sb_reading_${profile}`, JSON.stringify(data));
  } catch {}
}

function dateLabel(iso) {
  const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juill', 'août', 'sept', 'oct', 'nov', 'déc'];
  const d = new Date(iso);
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

export default function Reading({ onHome, profile }) {
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingRate, setEditingRate] = useState(false);

  useEffect(() => {
    const d = loadData(profile);
    setRate(d.rate);
    setBooks(d.books);
  }, [profile]);

  function persist(nextBooks, nextRate = rate) {
    setBooks(nextBooks);
    setRate(nextRate);
    saveData(profile, { rate: nextRate, books: nextBooks });
  }

  function addBook() {
    const clean = title.trim();
    const book = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: clean || `Livre #${books.length + 1}`,
      date: new Date().toISOString(),
      paid: false,
    };
    persist([book, ...books]);
    setTitle('');
  }

  function removeBook(id) {
    if (!window.confirm('Enlever ce livre de la liste?')) return;
    persist(books.filter((b) => b.id !== id));
  }

  function markAllPaid() {
    const owedCount = books.filter((b) => !b.paid).length;
    if (owedCount === 0) return;
    if (!window.confirm(`Marquer ${owedCount} livre(s) comme payé(s)? (${owedCount * rate}$)`)) return;
    persist(books.map((b) => ({ ...b, paid: true })));
  }

  function changeRate(v) {
    const n = Math.max(0, parseInt(v, 10) || 0);
    persist(books, n);
  }

  const unpaid = books.filter((b) => !b.paid);
  const owed = unpaid.length * rate;
  const paidOut = (books.length - unpaid.length) * rate;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="flex items-center gap-1 text-s4 font-bold text-sm hover:text-lava">
          <ChevronLeft size={18} /> Menu
        </button>
        <h2 className="font-heading font-extrabold text-stone flex items-center gap-2">
          <BookOpen size={18} /> Mes lectures
        </h2>
        <div className="w-12" />
      </div>

      {/* Encouragement */}
      <p className="text-center text-sm font-semibold text-s4 mb-4">
        Lis un livre au lieu d'un écran — et gagne de l'argent! 📚💰
      </p>

      {/* Money hero */}
      <div className="rounded-3xl p-6 mb-4 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #2d7a3a, #6cc24a)', boxShadow: '0 6px 24px rgba(45,122,58,0.25)' }}>
        <div className="text-xs font-bold uppercase tracking-wide text-white/80 mb-1">À recevoir</div>
        <div className="font-heading text-6xl font-extrabold leading-none mb-1">{owed}$</div>
        <div className="text-sm font-semibold text-white/85">
          {unpaid.length} livre{unpaid.length > 1 ? 's' : ''} non payé{unpaid.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-white border-2 border-s1 rounded-2xl p-4 text-center">
          <div className="font-heading text-3xl font-extrabold text-stone">{books.length}</div>
          <div className="text-xs font-bold text-s4 mt-0.5">📚 livres lus</div>
        </div>
        <div className="bg-white border-2 border-s1 rounded-2xl p-4 text-center">
          <div className="font-heading text-3xl font-extrabold text-ok">{paidOut}$</div>
          <div className="text-xs font-bold text-s4 mt-0.5">✅ déjà payés</div>
        </div>
      </div>

      {/* Add a book */}
      <div className="bg-white border-2 border-s1 rounded-2xl p-4 mb-4">
        <label className="text-xs font-bold text-s4 uppercase tracking-wide mb-2 block">J'ai fini un livre!</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addBook(); }}
          placeholder="Titre du livre (optionnel)"
          className="w-full bg-cream border-2 border-s2 rounded-xl px-3 py-2.5 text-stone font-semibold mb-2.5 outline-none focus:border-fox"
        />
        <button onClick={addBook}
          className="w-full py-3 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(90deg, #2d7a3a, #6cc24a)' }}>
          <Plus size={20} strokeWidth={3} /> J'ai fini un livre! +{rate}$
        </button>
      </div>

      {/* Book list */}
      {books.length > 0 && (
        <div className="bg-white border-2 border-s1 rounded-2xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-s4 uppercase tracking-wide">Mes livres</span>
            {owed > 0 && (
              <button onClick={markAllPaid}
                className="text-xs font-bold text-ok bg-ok-bg px-3 py-1 rounded-full hover:opacity-80">
                <Check size={12} className="inline mr-1" strokeWidth={3} /> Marquer payé
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            {books.map((b) => (
              <div key={b.id}
                className={`flex items-center gap-2 py-2 px-2.5 rounded-xl ${b.paid ? 'bg-cream opacity-60' : 'bg-ok-bg'}`}>
                <span className="text-lg">{b.paid ? '✅' : '📖'}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone text-sm truncate">{b.title}</div>
                  <div className="text-[11px] font-semibold text-s4">{dateLabel(b.date)} · {b.paid ? 'payé' : `${rate}$ à recevoir`}</div>
                </div>
                <button onClick={() => removeBook(b.id)} className="text-s3 hover:text-lava p-1">
                  <X size={15} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parent: rate setting */}
      <div className="text-center">
        {editingRate ? (
          <div className="inline-flex items-center gap-2 bg-white border-2 border-s2 rounded-xl px-3 py-2">
            <span className="text-xs font-bold text-s4">Récompense par livre:</span>
            <input
              type="number"
              defaultValue={rate}
              onBlur={(e) => { changeRate(e.target.value); setEditingRate(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { changeRate(e.target.value); setEditingRate(false); } }}
              className="w-16 bg-cream border-2 border-s2 rounded-lg px-2 py-1 text-stone font-bold text-center outline-none focus:border-fox"
              autoFocus
            />
            <span className="text-xs font-bold text-s4">$</span>
          </div>
        ) : (
          <button onClick={() => setEditingRate(true)} className="text-xs font-bold text-s4 hover:text-lava">
            ⚙️ Récompense: {rate}$ par livre (modifier)
          </button>
        )}
      </div>
    </div>
  );
}
