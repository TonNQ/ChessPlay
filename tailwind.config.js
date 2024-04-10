/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkLayout: '#3D182A',
        lightLayout: '#A82523',
        darkGray: '#605F63',
        lightBrown: '#a85251',
        darkYellow: '#857a18',
        lightYellow: '#a69a2d'
      }
    }
  }
}
