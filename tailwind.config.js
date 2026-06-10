/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // App surfaces (deep, premium dark)
        ink: {
          950: '#06070d',
          900: '#0a0c16',
          850: '#0e1120',
          800: '#13172a',
          750: '#181d36',
          700: '#1f2542',
        },
        // Brand — electric indigo/violet
        brand: {
          50: '#eef0ff',
          100: '#e0e3ff',
          200: '#c5caff',
          300: '#a3a8ff',
          400: '#8587fb',
          500: '#6c63f5',
          600: '#5b46e8',
          700: '#4c37c9',
          800: '#3f30a2',
          900: '#372d80',
        },
        // Accent — vivid cyan for energy/streaks
        accent: {
          400: '#3dd7e6',
          500: '#16c5d8',
          600: '#0ea5b8',
        },
        // Semantic
        win: '#34d399',
        loss: '#fb7185',
        gold: '#f5c451',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(108,99,245,0.25), 0 12px 40px -12px rgba(108,99,245,0.55)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 18px 40px -24px rgba(0,0,0,0.8)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.1)', opacity: '0' },
          '100%': { transform: 'scale(1.1)', opacity: '0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.22,1,0.36,1) infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
