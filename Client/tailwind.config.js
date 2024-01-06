/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grey: "#7a7f9a",
        blackCu: "#313338",
        voilet: "#7269ef",
      },
      fontFamily: {
        robot: ["Roboto", "sans-serif"],
        "noto-sans": ["Noto Sans", "sans-serif"],
        "public-sans": ["Public Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
