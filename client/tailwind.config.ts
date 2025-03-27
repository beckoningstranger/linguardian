import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./app/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["14px", { lineHeight: "135%", letterSpacing: "1%" }],
      },
      screens: { phone: "420px", tablet: "744px", desktop: "1140px" },
      colors: {
        grey: {
          900: "hsl(227,13%,22%)",
          800: "hsl(227,12%,29%)",
          700: "hsl(226, 6%, 47%)",
          600: "hsl(225,9%,55%)",
          500: "hsl(225, 25%, 75%)",
          400: "hsl(225, 26%, 81%)",
          300: "hsl(224, 26%, 88%)",
          200: "hsl(224, 25%, 93%)",
          100: "hsl(220, 25%, 97%)",
          50: "hsl(220, 24%, 98%)",
        },
        blue: {
          900: "hsl(226, 100%, 14%)",
          800: "hsl(226, 100%, 22%)",
          700: "hsl(226, 71%, 40%)",
          600: "hsl(206, 99%, 37%)",
          500: "hsl(206, 100%, 49%)",
          400: "hsl(206, 100%, 63%)",
          300: "hsl(205, 100%, 78%)",
          200: "hsl(205, 100%, 86%)",
          100: "hsl(205, 100%, 94%)",
          50: "hsl(205, 100%, 97%)",
        },
        green: {
          600: "hsl(144, 81%, 27%)",
          500: "hsl(143, 82%, 34%)",
          400: "hsl(143, 82%, 42%)",
        },
        brown: {
          600: "hsl(7, 38%, 34%)",
          500: "hsl(6, 35%, 45%)",
        },
        orange: {
          600: "hsl(30, 100%, 46%)",
          500: "hsl(30, 100%, 51%)",
          400: "hsl(38, 100%, 59%)",
          300: "hsl(46, 100%, 63%)",
        },
        magenta: {
          600: "hsl(351, 100%, 49%)",
          500: "hsl(351, 100%, 64%)",
        },
        pink: {
          600: "hsl(295, 100%, 48%)",
          500: "hsl(295, 100%, 64%)",
        },
        red: {
          600: "hsl(295, 100%, 48%)",
          500: "hsl(359, 100%, 52%)",
        },
        primarygreen: "#16a34a", // green-600
        darkred: "#B63347",
        autumnorange: "#CA843E",
        harvestyellow: "#F7CD54",
        lightblue: "#BEE2EE",
        darkgrey: "#2D4C4D",
      },
      fontFamily: {
        dancing: ["var(--font-dancingScript)"],
        playfair: ["var(--font-playfairDisplay)"],
        inter: ["var(--font-inter)"],
        voces: ["var(--font-voces)"],
      },
      animation: {
        "from-top": "from-top .2s forwards",
        "from-left": "from-left .3s forwards",
        "from-here": "from-here .1s forwards",
        "from-right": "from-right .3s forwards",
        "from-bottom": "from-bottom .3s forwards",
      },
      keyframes: {
        "from-top": {
          "0%": { transform: "translate(0%, -100%)" },
          "100%": { transform: "translate(0%, 0%)" },
        },
        "from-left": {
          "0%": { transform: "translate(-100%)" },
          "100%": { transform: "translate(0%)" },
        },
        "from-here": {
          "0%": { transform: "translate(0%, -70%)" },
          "100%": { transform: "translate(0%, 0%)" },
        },
        "from-right": {
          "0%": { transform: "translate(100%)" },
          "100%": { transform: "translate(0%)" },
        },
        "from-bottom": {
          "0%": { transform: "translate(0%, 100%)" },
          "100%": { transform: "translate(0%, 0%)" },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-orange-500",
    "hover:bg-orange-600",
    "bg-green-500",
    "hover:bg-green-600",
    "bg-brown-500",
    "hover:bg-brown-600",
    "bg-blue-500",
    "hover:bg-blue-600",
    "bg-magenta-500",
    "hover:bg-magenta-600",
    "bg-pink-500",
    "hover:bg-pink-600",
  ],
};

export default config;
