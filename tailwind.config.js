/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    screens: {
      'sm': '540px',
      'md': '768px',
      'lg': '1024px',
    },
    extend: {},
  },
  plugins: [],
}

