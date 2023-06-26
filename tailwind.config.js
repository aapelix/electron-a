/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#151515",
        secondary: "#35373a",
      },
    },
  },
  plugins: [],
}

