import type { MetadataRoute } from "next";

import { ROUTES, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths: string[] = [ROUTES.home, ROUTES.cardiologos, ROUTES.como, ROUTES.turnos];
  return paths.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: "monthly",
    priority: path === ROUTES.home ? 1 : 0.8,
  }));
}
