/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/html/utils/withMT");
const defaultTheme = require('tailwindcss/defaultTheme');

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    screens: {
      'xs': '200px',
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    backgroundImage: {
      'backgroundlogin': "url('/src/assets/logo_PSM.png')",
      'headerAboutUs':"url('/src/assets/Header-Image-Aboutus.jpeg')",
      'headerProgram':"url('/src/assets/Header-Image-Program.jpg')",
      'headerNews':"url('/src/assets/Header-Image-News.jpg')",
      'headerOrganization':"url('/src/assets/Header-Image-Organization.jpg')",
    },
    extend: {
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(4deg)' },
          '20%': { transform: 'rotate(-1deg)' },
          '30%': { transform: 'rotate(4deg)' },
          '40%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(4deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
        bigger1: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.1)" },
        },
        bigger2: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.2)" },
        },
        clearly: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        bounceright: {
          "0%": {transform: 'translateX(0px)'},
          "50%": {transform: 'translateX(-4px)'},
          "100%": {transform: 'translateX(0px)'},
        }
      },
      animation: {
        'fast-waving': 'wave 1s linear forwards',
        'bigger': 'bigger2 0.1s linear forwards',
        'bigger-slowly': 'bigger1 0.5s linear forwards',
        'clearly': 'clearly 0.2s linear forwards',
        'bounce-right': 'bounceright 0.5s linear infinite'
      },
    }
  },
  plugins: [
    require('flowbite/plugin'),
  ],
})

