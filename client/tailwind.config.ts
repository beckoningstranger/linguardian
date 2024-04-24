import { transcode } from "buffer";
import { transform } from "next/dist/build/swc";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
