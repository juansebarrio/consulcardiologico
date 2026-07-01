import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace a este proyecto. Hay un package-lock.json suelto
  // en el home del usuario que confundía a Turbopack al inferir la raíz.
  turbopack: {
    root: __dirname,
  },
  images: {
    // AVIF primero (25–40% más chico que webp para los retratos), webp de fallback.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    minimumCacheTTL: 2678400, // 31 días: los retratos no cambian seguido
  },
  async headers() {
    return [
      {
        // El video del hero no se revalida en visitas repetidas. Si algún día
        // se reemplaza el archivo, renombrarlo (hero-2.mp4).
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
