/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#09090B",
        secondary: "#18181B",
        tertiary: "#212123",
        fourth: "#00ff001a",
        fifth: "#121212",
        light_primary: "#F5F4EB",
        light_fourth: "#227d54",
      },
      fontFamily: {
        handwriting: ['"Dancing Script"', "cursive"],
      },
    },
  },
  plugins: [],
};

