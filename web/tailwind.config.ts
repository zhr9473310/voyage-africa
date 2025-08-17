/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f1115',
        card: '#151823',
        text: '#e6e6e6',
        muted: '#a0a3ad',
        accent: '#6ea8fe',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,.35)',
        inset1: 'inset 0 0 0 1px rgba(255,255,255,.03)',
      },
      borderRadius: {
        xl2: '1rem'
      }
    }
  },
  plugins: []
}
