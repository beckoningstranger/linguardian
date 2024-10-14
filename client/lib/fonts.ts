import {
  Dancing_Script,
  Playfair_Display,
  Poppins,
  Bree_Serif,
} from "next/font/google";

const dancing_init = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancingScript",
});

const playfair_init = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["italic", "normal"],
  variable: "--font-playfairDisplay",
});

const poppins_init = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const bree_init = Bree_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-breeSerif",
});

export const breeSerif = bree_init.variable;
export const playfairDisplay = playfair_init.variable;
export const poppins = poppins_init.variable;
export const dancingScript = dancing_init.variable;
