/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
    "./src/utils/**/*.{js,jsx,ts,tsx}",
    "./src/constants/**/*.{js,jsx,ts,tsx}",
    "./src/services/**/*.{js,jsx,ts,tsx}",
    "./src/App.jsx",
    "./src/main.jsx",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#FFFFFF',
          card: '#FFF8ED',
          title: '#5E3B00',
          text: '#3A2400',
          accent: '#D3B178',
          primary: '#815100',
          success: '#088714',
        },
      },
      fontFamily: {
        gabarito: ["Gabarito", 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ["Inter", 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 