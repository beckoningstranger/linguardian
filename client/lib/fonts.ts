import {
  Dancing_Script,
  Inter,
  Playfair_Display,
  Voces,
} from "next/font/google";

const dancing_init = Dancing_Script({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancingScript",
});

const playfair_init = Playfair_Display({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["italic", "normal"],
  variable: "--font-playfairDisplay",
});

const inter_init = Inter({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
});

const voces_init = Voces({
  subsets: ["latin-ext"],
  weight: ["400"],
  variable: "--font-voces",
});

export const voces = voces_init.variable;
export const playfairDisplay = playfair_init.variable;
export const inter = inter_init.variable;
export const dancingScript = dancing_init.variable;
