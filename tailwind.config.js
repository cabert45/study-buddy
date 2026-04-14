/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fefaf6',
        peach: '#fdf0e5',
        sand: '#f5dece',
        lava: '#c74a15',
        'lava-l': '#e8622a',
        fox: '#e2762b',
        'fox-d': '#b85a1a',
        'fox-belly': '#fde8cc',
        stone: '#2c2017',
        's6': '#5c4a3a',
        's4': '#9a8878',
        's3': '#b8a898',
        's2': '#d6ccc0',
        's1': '#ebe4db',
        ok: '#2d7a3a',
        'ok-bg': '#e8f5ea',
        info: '#3a5bc7',
      },
      fontFamily: {
        heading: ['"Baloo 2"', 'cursive'],
        body: ['Quicksand', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
