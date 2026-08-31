/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        aldrich: ['Aldrich', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-yellow': '#e1ff00',
        'brand-dark': '#1a1a1a',
        'brand-card': '#141414',
        'brand-border': '#2d2d2d',
        'mcoc-cosmic': '#00d2ff',
        'mcoc-tech': '#0080ff',
        'mcoc-mutant': '#ffcc00',
        'mcoc-skill': '#ff3344',
        'mcoc-science': '#00cc66',
        'mcoc-mystic': '#a855f7',
      }
    },
  },
  plugins: [],
}
