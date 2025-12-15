import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    outputFileTracingRoot: path.join(__dirname, ".."),
    transpilePackages: ["@linguardian/shared"],
    turbopack: {
        root: path.join(__dirname, ".."), // Match outputFileTracingRoot
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
