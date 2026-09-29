/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        sky: {
          light: '#BAE6FD',
          DEFAULT: '#88D1F1',
          dark: '#4A90E2',
        },
        slate: {
          parent: '#1E3A5F',
          soft: '#2D4B73',
          muted: '#64748B',
        },
        biscuit: {
          gold: '#F6C877',
          warm: '#F59E0B',
        },
        honey: {
          cream: '#FFF6E5',
          soft: '#FEF3C7',
        },
        eucalyptus: {
          green: '#48BB78',
          pastel: '#8ED6B1',
          bg: '#E6F4EA',
        },
        coral: {
          red: '#EF4444',
          pastel: '#FCA5A5',
          bg: '#FEE2E2',
        },
        cloud: {
          cream: '#FDFBF7',
          card: '#FFFFFF',
        }
      },
      borderRadius: {
        'squircle-sm': '14px',
        'squircle-md': '20px',
        'squircle-lg': '28px',
        'squircle-xl': '36px',
      },
      boxShadow: {
        'chunky-sky': '0 4px 0 #3b82f6',
        'chunky-gold': '0 4px 0 #d97706',
        'chunky-green': '0 4px 0 #2f855a',
        'chunky-coral': '0 4px 0 #dc2626',
        'chunky-slate': '0 4px 0 #0f172a',
        'chunky-gray': '0 4px 0 #9ca3af',
        'floating': '0 12px 32px rgba(0, 0, 0, 0.06)',
        'floating-hover': '0 16px 40px rgba(0, 0, 0, 0.10)',
      }
    },
  },
  plugins: [],
}
