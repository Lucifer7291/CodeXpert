// frontend/tailwind.config.js  
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: '#00FF41',
        'neon-dim': '#00CC33',
        dark: {
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#222222',
        }
      },
      fontFamily: {
        gaming: ['Orbitron', 'monospace'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 10px #00FF41, 0 0 20px #00FF4166',
        'neon-sm': '0 0 5px #00FF41',
      }
    }
  },
  plugins: [],
}