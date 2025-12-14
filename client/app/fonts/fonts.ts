import localFont from "next/font/local";

// Local font files for better performance and privacy
export const inter = localFont({
    src: [
        {
            path: "./Inter-400.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./Inter-500.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./Inter-700.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-inter",
    fallback: ["sans-serif"],
    display: "swap",
});

export const playfair = localFont({
    src: [
        {
            path: "./Playfair-600.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "./Playfair-700.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "./Playfair-700-italic.woff2",
            weight: "700",
            style: "italic",
        },
    ],
    variable: "--font-playfairDisplay",
    fallback: ["serif"],
    display: "swap",
});

export const dancing = localFont({
    src: [
        {
            path: "./DancingScript-700.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-dancingScript",
    fallback: ["serif"],
    display: "swap",
});

export const voces = localFont({
    src: [
        {
            path: "./Voces-400.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-voces",
    fallback: ["sans-serif"],
    display: "swap",
});
