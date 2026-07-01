import type { Metadata, Viewport } from "next";
import { Spectral, Hanken_Grotesk, Bricolage_Grotesque } from "next/font/google";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TurnoModal } from "@/components/site/TurnoModal";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { DOCTORS, PHONE_TEL, SITE, siteUrl } from "@/lib/site";
import "./globals.css";

/* Spectral — la voz (serif). No es variable en Google Fonts: pedimos pesos
   explícitos. Solo 300/400: los pesos 500/600 no se usan en ningún lado (los
   600 del sitio van todos en Hanken, que es variable) — menos preloads. */
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400"],
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

/* Bricolage Grotesque — voz del titular del hero (grotesque con carácter).
   Solo 600: es el único peso que consume el h1 del hero. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    // La query local que importa es «cardiólogo Bahía Blanca»: la ciudad va
    // en el título. (El tagline queda como og:title del home, en page.tsx.)
    default: `${SITE.name} — Cardiólogos en Bahía Blanca`,
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
  // Sin canonical acá: cada página declara el suyo (el del layout haría que
  // toda página sin metadata canonicalice silenciosamente al home).
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: siteUrl(),
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

/**
 * Datos estructurados del consultorio (JSON-LD): MedicalClinic + los dos
 * Physician. Solo datos que existen en site.ts — sin horas (pendientes),
 * sin precios, sin email.
 */
function clinicJsonLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        "@id": `${base}/#clinic`,
        name: SITE.name,
        description: SITE.description,
        url: base,
        telephone: PHONE_TEL,
        image: `${base}/opengraph-image`,
        hasMap: SITE.address.mapsLink,
        medicalSpecialty: "https://schema.org/Cardiovascular",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.line1,
          addressLocality: SITE.address.city,
          postalCode: "B8000",
          addressCountry: "AR",
        },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday", "Friday"] },
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Thursday"] },
        ],
      },
      ...DOCTORS.map((d) => ({
        "@type": "Physician",
        name: d.name,
        image: `${base}${d.image}`,
        jobTitle: d.creds[0],
        medicalSpecialty: "https://schema.org/Cardiovascular",
        worksFor: { "@id": `${base}/#clinic` },
        ...(d.slug === "scarano" ? { alumniOf: "Universidad Nacional de Córdoba" } : {}),
      })),
    ],
  };
}

export const viewport: Viewport = {
  themeColor: "#F6F3ED",
  colorScheme: "light",
  // Necesario para que env(safe-area-inset-*) resuelva en iPhones con notch
  // (lo usa el FAB de WhatsApp y el bottom-sheet del pop-up de turnos).
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spectral.variable} ${hanken.variable} ${bricolage.variable}`}>
      <body style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd()).replace(/</g, "\\u003c") }}
        />
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <Header />
        <main id="main" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <TurnoModal />
        <WhatsAppFab />
      </body>
    </html>
  );
}
