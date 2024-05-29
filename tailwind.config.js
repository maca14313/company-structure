/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        'screen': '100vw',
      },
      minWidth: {
        'screen': '100vw',
      },
      colors: {
        customColor: {
          100: '#00000034',
          200: '#3b82f6',
          300: '#67c09c',
          400:'#f3bb36',
          500:'#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
        custom: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
