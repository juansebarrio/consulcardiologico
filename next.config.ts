import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace a este proyecto. Hay un package-lock.json suelto
  // en el home del usuario que confundía a Turbopack al inferir la raíz.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
