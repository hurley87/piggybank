/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#414699',
      },
      fontFamily: {
        nunito: ['var(--font-nunito)'],
        montserrat: ['var(--font-montserrat)'],
      },
    },
  },
  plugins: [require('daisyui')],
};
