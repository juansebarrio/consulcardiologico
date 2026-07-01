import type { MetadataRoute } from "next";

import { ROUTES, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths: string[] = [ROUTES.home, ROUTES.cardiologos, ROUTES.como, ROUTES.turnos];
  // Timestamp de build: el sitio es 100% estático, cada deploy lo renueva.
  const lastModified = new Date();
  return paths.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: path === ROUTES.home ? 1 : 0.8,
  }));
}
