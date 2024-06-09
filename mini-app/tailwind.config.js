/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        regular: ['sf-regular', 'sans-serif'],
        bold: ['sf-bold', 'sans-serif'],
      },
      colors: {
        black: {
          theme: "#18181c",
        },
        gray: {
          main: "#6b6b6b",
        },
        white: {
          main: '#EBEBED'
        },
        coral: {
          main: '#df8473',
        },
        yellow: {
          main: '#fcdd8d',
        }
      }
    },
  },
  corePlugins: {
    fontFamily: false,
    colors: false,
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

