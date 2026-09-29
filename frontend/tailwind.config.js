/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef4fb',
          100: '#d5e4f4',
          700: '#1e4b8a',
          800: '#163a6b',
          900: '#0c274c',
        },
      },
      fontFamily: {
        sans: [
          'Source Sans 3',
          'Noto Sans Devanagari',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(12, 39, 76, 0.18)',
      },
    },
  },
  plugins: [],
}
