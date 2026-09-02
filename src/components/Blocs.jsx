import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { getBlocs } from '../utils/storage';
import { BLOCS, ETATS, BLOC_TEST_LENGTH, blocsParMatiere } from '../data/blocs';

// Un bloc LEGO: des tenons sur le dessus + le corps.
function Bloc({ bloc, etat, onClick, active }) {
  const style = ETATS[etat] || ETATS.neuf;
  const solide = etat === 'solide';
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 min-w-0 text-left transition-all active:scale-[0.97] ${
        active ? '-translate-y-1' : 'hover:-translate-y-0.5'
      }`}
      style={{ minHeight: 68 }}
    >
      {/* tenons */}
      <div className="flex gap-2 pl-3 pr-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2 w-4 rounded-t-md" style={{ background: style.color, opacity: 0.55 }} />
        ))}
      </div>
      {/* corps */}
      <div
        className="rounded-lg px-2.5 py-2 h-[54px] flex flex-col justify-center border-2"
        style={{
          background: style.bg,
          borderColor: active ? style.color : 'transparent',
          boxShadow: solide ? `inset 0 -3px 0 rgba(0,0,0,.08)` : 'none',
        }}
      >
        <div className="font-heading text-[12px] font-extrabold leading-tight" style={{ color: style.color }}>
          {bloc.nom}
        </div>
        <div className="text-[10px] font-bold mt-0.5" style={{ color: style.color, opacity: 0.75 }}>
          {etat === 'neuf' ? 'à tester' : style.label}
        </div>
      </div>
    </button>
  );
}

export default function Blocs({ onHome, onTestBloc }) {
  const [etats, setEtats] = useState({});
  const [matiere, setMatiere] = useState('francais');
  const [ouvert, setOuvert] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    getBlocs()
      .then((d) => setEtats(d || {}))
      .catch(() => setEtats({}))
      .finally(() => setChargement(false));
  }, []);

  const etatDe = (id) => etats[id]?.etat || 'neuf';
  const solides = BLOCS.filter((b) => etatDe(b.id) === 'solide').length;
  const liste = blocsParMatiere(matiere);
  const rangees = [3, 2, 1]; // le mur se lit du haut vers le bas: la rangée 1 est la fondation

  const blocOuvert = ouvert ? BLOCS.find((b) => b.id === ouvert) : null;
  const infoOuvert = ouvert ? etats[ouvert] : null;

  return (
    <div className="relative z-[1] max-w-3xl mx-auto px-4 pt-4 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onHome}
          className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-heading text-2xl font-extrabold text-stone">Mes blocs</h1>
      </div>

      {/* Motto de l'année */}
      <div className="rounded-2xl p-4 mb-4 text-white"
        style={{ background: 'linear-gradient(135deg, #c74a15, #e8a33a)' }}>
        <div className="font-heading text-lg font-extrabold leading-tight">« Dust yourself off and try again »</div>
        <div className="text-xs font-semibold text-white/90 mt-0.5">
          Notre devise de l’année. Une erreur, ce n’est pas un échec — c’est un bloc qu’on
          vient de trouver et qu’on va solidifier. 💪
        </div>
      </div>

      <div className="bg-white border-2 border-s1 rounded-2xl p-4 mb-4">
        <p className="text-xs font-semibold text-s5 leading-relaxed">
          Une maison solide commence par sa fondation. Chaque bloc est quelque chose que tu as
          appris en 2<sup>e</sup> année. Quand un bloc est <b>solide</b>, tout ce qui se construit
          par-dessus en 3<sup>e</sup> année devient beaucoup plus facile.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-2.5 rounded-full bg-s1 overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${(solides / BLOCS.length) * 100}%`, background: '#1b7f4b' }} />
          </div>
          <div className="text-xs font-extrabold text-stone whitespace-nowrap">
            {solides} / {BLOCS.length} solides
          </div>
        </div>
      </div>

      {/* Matière */}
      <div className="flex gap-2 mb-3">
        {[
          { id: 'francais', label: 'Français', hint: '60 % de l’examen' },
          { id: 'maths', label: 'Maths', hint: '40 %' },
        ].map((m) => (
          <button key={m.id} onClick={() => { setMatiere(m.id); setOuvert(null); }}
            className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
              matiere === m.id ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6 hover:border-lava'
            }`}>
            {m.label}
            <span className={`block text-[10px] font-semibold ${matiere === m.id ? 'text-white/70' : 'text-s4'}`}>
              {m.hint}
            </span>
          </button>
        ))}
      </div>

      {/* Le mur */}
      <div className="bg-white border-2 border-s1 rounded-2xl p-3 mb-4">
        <div className="text-center text-[10px] font-extrabold uppercase tracking-wide text-s4 mb-2">
          ↑ la 3<sup>e</sup> année se construit ici ↑
        </div>
        {chargement ? (
          <div className="text-center text-sm font-semibold text-s4 py-8">Chargement…</div>
        ) : (
          rangees.map((r) => {
            const dansRangee = liste.filter((b) => b.rangee === r);
            if (dansRangee.length === 0) return null;
            return (
              <div key={r} className="flex gap-1.5 mb-1.5">
                {dansRangee.map((b) => (
                  <Bloc key={b.id} bloc={b} etat={etatDe(b.id)} active={ouvert === b.id}
                    onClick={() => setOuvert(ouvert === b.id ? null : b.id)} />
                ))}
              </div>
            );
          })
        )}
        <div className="mt-2 rounded-lg bg-s1 py-1.5 text-center text-[10px] font-extrabold uppercase tracking-wide text-s5">
          Fondation — 2<sup>e</sup> année
        </div>
      </div>

      {/* Détail du bloc choisi */}
      {blocOuvert && (
        <div className="bg-white border-2 rounded-2xl p-4 mb-4"
          style={{ borderColor: ETATS[etatDe(blocOuvert.id)].color }}>
          <div className="font-heading text-xl font-extrabold text-stone leading-tight">{blocOuvert.nom}</div>
          <div className="text-xs font-semibold text-s5 mt-1">{blocOuvert.aide}</div>

          <div className="mt-3 rounded-xl p-3" style={{ background: '#f5f7f9' }}>
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-s4 mb-1">
              Ce que ça débloque en 3<sup>e</sup> année
            </div>
            <div className="text-xs font-bold text-stone leading-snug">{blocOuvert.debloque}</div>
          </div>

          {infoOuvert && (
            <div className="text-xs font-semibold text-s5 mt-3">
              Dernier test&nbsp;: <b style={{ color: ETATS[infoOuvert.etat].color }}>
                {infoOuvert.correct}/{infoOuvert.total} — {ETATS[infoOuvert.etat].label}
              </b>
              {infoOuvert.date ? ` · ${infoOuvert.date}` : ''}
            </div>
          )}

          <button onClick={() => onTestBloc(blocOuvert)}
            className="w-full mt-3 py-3 rounded-xl font-extrabold text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            {infoOuvert ? <RotateCcw size={16} /> : <Play size={16} />}
            {infoOuvert ? 'Retester ce bloc' : 'Tester ce bloc'} · {BLOC_TEST_LENGTH} questions
          </button>
          <div className="text-[10px] font-semibold text-s4 text-center mt-1.5">
            Sans aide, pour voir où tu en es vraiment. Ce n’est pas une note — c’est une carte.
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="flex flex-wrap gap-3 justify-center">
        {['solide', 'fragile', 'refaire', 'neuf'].map((k) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded" style={{ background: ETATS[k].bg, border: `2px solid ${ETATS[k].color}` }} />
            <span className="text-[11px] font-bold text-s5">{ETATS[k].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
