/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1565C0',
          50: '#E8F1FB',
          100: '#C6DEF5',
          200: '#9BC6ED',
          300: '#6FADE5',
          400: '#4695DE',
          500: '#1565C0',
          600: '#125499',
          700: '#0E4278',
          800: '#0A2F57',
          900: '#071F3B',
          950: '#0B1F3A',
        },
        secondary: {
          DEFAULT: '#00897B',
          50: '#E0F5F2',
          100: '#B3E5DE',
          200: '#80D3C7',
          300: '#4DC1B0',
          400: '#26B29C',
          500: '#00897B',
          600: '#00786C',
          700: '#00655A',
          800: '#005248',
          900: '#003A33',
        },
        appbg: '#F5F7FA',
        status: {
          normal: '#2E7D32',
          warning: '#F57C00',
          critical: '#D32F2F',
          offline: '#616161',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(11, 31, 58, 0.06), 0 1px 3px 0 rgba(11, 31, 58, 0.08)',
        panel: '0 4px 16px -4px rgba(11, 31, 58, 0.12)',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
