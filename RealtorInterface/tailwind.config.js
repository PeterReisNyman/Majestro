/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        green: {
          primary: {
            dark: '#00ff88',
            light: '#00b860',
          },
          secondary: '#00cc6a',
        },
        orange: {
          primary: {
            dark: '#ff6b35',
            light: '#e85a2a',
          },
          secondary: '#ff8c5a',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-dot': 'bounce-dot 1.4s infinite ease-in-out both',
      },
      keyframes: {
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
