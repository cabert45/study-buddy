/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'cream': 'rgb(var(--c-cream) / <alpha-value>)',
        'peach': 'rgb(var(--c-peach) / <alpha-value>)',
        'sand': 'rgb(var(--c-sand) / <alpha-value>)',
        'lava': 'rgb(var(--c-lava) / <alpha-value>)',
        'lava-l': 'rgb(var(--c-lava-l) / <alpha-value>)',
        'fox': 'rgb(var(--c-fox) / <alpha-value>)',
        'fox-d': 'rgb(var(--c-fox-d) / <alpha-value>)',
        'fox-belly': 'rgb(var(--c-fox-belly) / <alpha-value>)',
        'stone': 'rgb(var(--c-stone) / <alpha-value>)',
        's6': 'rgb(var(--c-s6) / <alpha-value>)',
        's4': 'rgb(var(--c-s4) / <alpha-value>)',
        's3': 'rgb(var(--c-s3) / <alpha-value>)',
        's2': 'rgb(var(--c-s2) / <alpha-value>)',
        's1': 'rgb(var(--c-s1) / <alpha-value>)',
        'ok': 'rgb(var(--c-ok) / <alpha-value>)',
        'ok-bg': 'rgb(var(--c-ok-bg) / <alpha-value>)',
        'info': 'rgb(var(--c-info) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
};
