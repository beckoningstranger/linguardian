import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./app/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primarygreen: "#16a34a", // green-600
        darkred: "#B63347",
        autumnorange: "#CA843E",
        harvestyellow: "#F7CD54",
        lightblue: "#BEE2EE",
        darkgrey: "#2D4C4D",
        brown: "#893738",
      },
      fontFamily: {
        dancing: ["var(--font-dancingScript)"],
        poppins: ["var(--font-poppins)"],
        playfair: ["var(--font-playfairDisplay)"],
        breeSerif: ["var(--font-breeSerif)"],
        voces: ["var(--font-voces)"],
      },
      animation: {
        "from-top": "from-top .3s forwards",
        "from-left": "from-left .3s forwards",
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
};

export default config;
