/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006AFF', // Zillow Blue
          dark: '#004CBA',
          light: '#E6F0FF'
        },
        secondary: '#FFFFFF',
        accent: '#F9F9FB',
        dark: '#2A2A33', // Zillow Text Dark
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
