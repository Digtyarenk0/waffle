/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    fontFamily: {
      regularsf: ['regularsf'],
      boldsf: ['boldsf'],
    },
    colors: {
      black: {
        theme: "#18181c",
      },
      gray: {
        main: "#6b6b6b",
        light: "#C7C7C7",
      },
      white: {
        main: '#EBEBED'
      },
      purple: {
        main: '#8f81db'
      },
      coral: {
        main: '#df8473',
      },
      yellow: {
        main: '#fcdd8d',
      }
    }
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

