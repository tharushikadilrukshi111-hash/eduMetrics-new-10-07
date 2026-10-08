/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- Mekathiyenna one
  theme: {
    extend: {
      colors: {
        softBlue: '#F2F7FC',
        calmBlue: '#5B8DEF',
        teal: '#48B8A6',
        navy: '#173B63',
        softLavender: '#AFA8E8',
        warmAccent: '#F5B860',
      },
    },
  },
  plugins: [],
}