import type { Metadata, Viewport } from "next";
import { Spectral, Hanken_Grotesk } from "next/font/google";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE } from "@/lib/site";
import "./globals.css";

/* Spectral — la voz (serif). No es variable en Google Fonts: pedimos pesos explícitos. */
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

/* Hanken Grotesk — el sistema (texto y UI). Fuente variable. */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "Dr. Juan Pablo Barrio" }, { name: "Dra. Cynthia Scarano" }],
  keywords: [
    "cardiólogo Bahía Blanca",
    "cardiología Bahía Blanca",
    "Dr. Barrio cardiólogo",
    "Dra. Scarano cardióloga",
    "ecocardiograma Bahía Blanca",
    "turnos cardiología",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F6F3ED",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spectral.variable} ${hanken.variable}`}>
      <body style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <Header />
        <main id="main" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
