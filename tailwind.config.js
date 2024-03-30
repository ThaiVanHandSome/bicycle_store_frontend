const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  fontFamily: {
    sans: ["Graphik", "sans-serif"],
    serif: ["Merriweather", "serif"],
  },
  theme: {
    extend: {},
    colors: {
      pri: "#0ab0a6",
      black: "#000",
      white: "#fff",
    },
  },
  darkMode: ["class"],
  plugins: [nextui()],
};
