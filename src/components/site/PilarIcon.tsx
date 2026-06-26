import type { ReactNode } from "react";

/**
 * Íconos de «Los cuatro pilares» (Tiempo · Escucha · Oficio · Vínculo).
 *
 * Line-style sobre los tokens de la marca: trazo fino con `currentColor`, así
 * el color lo decide el contenedor (se usa en acento). Server-safe (sin estado
 * ni «use client»). Mapeados por índice, en el mismo orden que PILARES en site.ts:
 *   0 Tiempo → reloj · 1 Escucha → oreja · 2 Oficio → estetoscopio · 3 Vínculo → unión
 */

const ICONS: ReactNode[] = [
  // Tiempo — reloj
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3.5 2" />
  </>,
  // Escucha — oreja
  <>
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0" />
    <path d="M9.5 9a2.5 2.5 0 0 1 4.8 1c0 1.6-1.3 2.2-1.8 3.4" />
  </>,
  // Oficio — estetoscopio (el oficio médico)
  <>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 12 0v-4" />
    <circle cx="20" cy="10" r="2" />
  </>,
  // Vínculo — dos círculos entrelazados (unión)
  <>
    <circle cx="9" cy="12" r="5" />
    <circle cx="15" cy="12" r="5" />
  </>,
];

export function PilarIcon({ index, size = 30 }: { index: number; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[index] ?? ICONS[0]}
    </svg>
  );
}
