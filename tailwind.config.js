/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'hash-primary': '#3B82F6',
        'hash-secondary': '#10B981',
        'hash-accent': '#F59E0B',
        'hash-danger': '#EF4444',
        'hash-background': '#F8FAFC',
        'hash-surface': '#FFFFFF',
        'hash-text': '#1F2937',
        'hash-muted': '#6B7280',
      },
      fontFamily: {
        'mono': ['Monaco', 'Menlo', 'monospace'],
      },
      animation: {
        'probe': 'probe 0.8s ease-in-out',
        'insert': 'insert 0.6s ease-out',
        'highlight': 'highlight 1s ease-in-out infinite',
      },
      keyframes: {
        probe: {
          '0%': { transform: 'scale(1)', backgroundColor: '#3B82F6' },
          '50%': { transform: 'scale(1.2)', backgroundColor: '#1D4ED8' },
          '100%': { transform: 'scale(1)', backgroundColor: '#3B82F6' },
        },
        insert: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        highlight: {
          '0%, 100%': { backgroundColor: '#FEF3C7' },
          '50%': { backgroundColor: '#F59E0B' },
        },
      },
    },
  },
  plugins: [],
} 