/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: 'rgb(27, 110, 150)', 
        // customBlue: 'rgb(37, 150, 190)',
      },
    },
  },
  plugins: [],
}