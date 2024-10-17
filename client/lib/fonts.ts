import {
  Dancing_Script,
  Playfair_Display,
  Poppins,
  Bree_Serif,
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

const poppins_init = Poppins({
  subsets: ["latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const bree_init = Bree_Serif({
  subsets: ["latin-ext"],
  weight: ["400"],
  variable: "--font-breeSerif",
});

const voces_init = Voces({
  subsets: ["latin-ext"],
  weight: ["400"],
  variable: "--font-voces",
});

export const breeSerif = bree_init.variable;
export const playfairDisplay = playfair_init.variable;
export const poppins = poppins_init.variable;
export const dancingScript = dancing_init.variable;
