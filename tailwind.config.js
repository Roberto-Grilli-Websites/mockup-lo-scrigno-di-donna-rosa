/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#E8C97A',
          400: '#D4B062',
          500: '#C4A35A',
          600: '#A8863D',
          700: '#8B6E2A',
        },
        cream: {
          50:  '#FDFCF8',
          100: '#F8F4EC',
          200: '#F2EAD3',
          300: '#E8DCBE',
        },
        dark: {
          900: '#0D0A07',
          800: '#151009',
          700: '#1C160E',
          600: '#251D13',
          500: '#2E2418',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
      },
    },
  },
  plugins: [],
}
