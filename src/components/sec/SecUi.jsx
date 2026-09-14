import React from 'react';
import { ArrowLeft } from 'lucide-react';

// Petits composants de l'interface « secondaire » (skin data-skin="secondaire").
// Un seul endroit pour l'en-tête de module, les onglets, la barre de maîtrise et
// les encadrés — pour que les 3 modules aient exactement la même allure.

export const TONES = {
  indigo: { fg: '#4338ca', bg: '#eef2ff', ring: '#c7d2fe' },
  amber: { fg: '#b45309', bg: '#fef3c7', ring: '#fde68a' },
  teal: { fg: '#0f766e', bg: '#ccfbf1', ring: '#99f6e4' },
  rose: { fg: '#be123c', bg: '#ffe4e6', ring: '#fecdd3' },
  emerald: { fg: '#047857', bg: '#d1fae5', ring: '#a7f3d0' },
};

export function IconTile({ icon: Icon, tone = 'indigo', size = 44 }) {
  const t = TONES[tone] || TONES.indigo;
  return (
    <div className="flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, borderRadius: size * 0.3, background: t.bg, color: t.fg, boxShadow: `inset 0 0 0 1px ${t.ring}` }}>
      <Icon size={Math.round(size * 0.5)} strokeWidth={2} />
    </div>
  );
}

export function SecHeader({ onBack, backLabel = 'Accueil', eyebrow, title, subtitle, icon, tone = 'indigo', right }) {
  return (
    <header className="mb-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-s4 hover:text-stone transition-colors">
          <ArrowLeft size={16} /> {backLabel}
        </button>
        {right}
      </div>
      <div className="flex items-start gap-4">
        {icon && <IconTile icon={icon} tone={tone} size={52} />}
        <div className="min-w-0">
          {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-s4 mb-1">{eyebrow}</p>}
          <h1 className="font-heading text-2xl sm:text-[28px] font-bold text-stone leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-s4 mt-1">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}

export function Segmented({ items, value, onChange }) {
  return (
    <div className="flex p-1 mb-5 rounded-xl bg-white border border-s1" style={{ boxShadow: '0 1px 2px rgba(15,23,42,.04)' }}>
      {items.map(({ id, label, icon: Icon }) => {
        const on = value === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              on ? 'bg-stone text-white shadow-sm' : 'text-s4 hover:text-stone'}`}>
            {Icon && <Icon size={15} />} {label}
          </button>
        );
      })}
    </div>
  );
}

export function MasteryBar({ label = 'Maîtrise', summary }) {
  const total = Math.max(1, summary.total);
  const pct = Math.round((summary.mastered / total) * 100);
  return (
    <div className="bg-white rounded-2xl border border-s1 p-4 mb-3" style={{ boxShadow: '0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.05)' }}>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm font-semibold text-stone">{label}</p>
        <p className="text-sm text-s4"><span className="font-semibold text-stone">{summary.mastered}</span> / {summary.total} · {pct}%</p>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden flex" style={{ background: '#eef2f7' }}>
        <div style={{ width: `${(summary.mastered / total) * 100}%`, background: '#059669' }} />
        <div style={{ width: `${(summary.practicing / total) * 100}%`, background: '#818cf8' }} />
        <div style={{ width: `${(summary.learning / total) * 100}%`, background: '#fb7185' }} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-s4">
        <Legend color="#059669" label={`Maîtrisées ${summary.mastered}`} />
        <Legend color="#818cf8" label={`En progrès ${summary.practicing}`} />
        <Legend color="#fb7185" label={`À revoir ${summary.learning}`} />
        <Legend color="#cbd5e1" label={`Nouvelles ${summary.new}`} />
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: color }} />{label}</span>;
}

export function StartCard({ icon, tone = 'indigo', title, children, action, onAction }) {
  return (
    <div className="bg-white rounded-2xl border border-s1 p-6 text-center" style={{ boxShadow: '0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.05)' }}>
      <div className="flex justify-center mb-4">{icon && <IconTile icon={icon} tone={tone} size={56} />}</div>
      <h3 className="font-heading text-xl font-bold text-stone mb-2">{title}</h3>
      <div className="text-sm text-s4 leading-relaxed max-w-md mx-auto mb-5">{children}</div>
      {action && (
        <button onClick={onAction} className="sb-btn-primary w-full py-3 rounded-xl font-semibold text-base">{action}</button>
      )}
    </div>
  );
}

export function Callout({ tone = 'indigo', icon: Icon, title, children }) {
  const t = TONES[tone] || TONES.indigo;
  return (
    <div className="rounded-2xl p-4 mb-3 text-sm" style={{ background: t.bg, boxShadow: `inset 0 0 0 1px ${t.ring}` }}>
      {title && (
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] mb-1.5" style={{ color: t.fg }}>
          {Icon && <Icon size={14} />} {title}
        </p>
      )}
      <div className="text-s6 leading-relaxed">{children}</div>
    </div>
  );
}
