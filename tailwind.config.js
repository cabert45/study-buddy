/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: '#1a1a3e',
        nebula: '#4a2c8a',
        rocket: '#e84393',
        star: '#fdcb6e',
        cosmic: '#6c5ce7',
        moon: '#dfe6e9',
        deepspace: '#0c0c24',
      },
      fontFamily: {
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
