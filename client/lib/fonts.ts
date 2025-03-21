import {
  Dancing_Script,
  Playfair_Display,
  Voces,
  Ubuntu,
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

const ubuntu_init = Ubuntu({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-poppins",
});

const voces_init = Voces({
  subsets: ["latin-ext"],
  weight: ["400"],
  variable: "--font-voces",
});

export const voces = voces_init.variable;
export const playfairDisplay = playfair_init.variable;
export const ubuntu = ubuntu_init.variable;
export const dancingScript = dancing_init.variable;
