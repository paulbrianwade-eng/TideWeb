/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#087F5B',
        'brand-dark': '#056647',
        lime: '#B8FF72',
        'lime-soft': '#E9FFD7',
        canvas: '#F4F5F2',
        surface: '#FFFFFF',
        ink: '#161816',
        muted: '#6E746F',
        line: '#DDE2DC',
        danger: '#D64545',
        warn: '#E99C2B',
      },
      fontFamily: {
        display: ['"Archivo Narrow"', 'Oswald', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.02em' },
      keyframes: {
        'rise-in': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'pulse-ring': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
      },
      animation: {
        'rise-in': 'rise-in 280ms cubic-bezier(0.2,0.7,0.3,1) both',
        'fade-in': 'fade-in 200ms ease-out both',
        pulseRing: 'pulse-ring 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
