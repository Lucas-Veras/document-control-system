/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#CC475E",
        primaryDark: "#58E6D9",
      },
      backgroundColor: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#CC475E",
        primaryDark: "#58E6D9",
        header: "#9F2D43",
        headerHover: "#8a263a",
        headerFocus: "#580f1e",
      },
      outlineColor: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#CC475E",
        primaryDark: "#58E6D9",
      },
      ringOffsetColor: {
        headerFocus: "#580f1e",
        primary: "#CC475E",
      }
    },
    screens: {
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      xs: { max: "479px" },
    },
  },
  plugins: [],
};
