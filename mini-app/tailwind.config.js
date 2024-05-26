/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        black: {
          theme: "#1B1B1B",
        },
        gray: {
          main: "#71798D",
        },
        white: {
          main: '#EBEBED'
        },
        green: {
          main: '#3DFB87',
          light: '#41FD8D'
        }
      }
    },
  },
  plugins: [],
}

