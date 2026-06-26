import type { ReactNode } from "react";

/**
 * Íconos de «Los cuatro compromisos clínicos».
 *
 * Line-style sobre los tokens de la marca: trazo fino con `currentColor`, así
 * el color lo decide el contenedor (acento sobre papel, blush sobre arcilla).
 * Server-safe (sin estado ni «use client»). Mapeados por índice, en el mismo
 * orden que COMPROMISOS en site.ts:
 *   0 Estudios necesarios → documento+check
 *   1 Recetar solo si hace falta → pastilla
 *   2 Controlarse / tranquilo → corazón con pulso
 *   3 Después del turno también estamos → globo de chat
 */

const ICONS: ReactNode[] = [
  // Solo los estudios necesarios — documento con check
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 14.5l2 2 4-4" />
  </>,
  // Recetar solo si hace falta — pastilla (cápsula)
  <>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </>,
  // Controlarse para quedarse tranquilo — corazón con pulso
  <>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
  </>,
  // Después del turno también estamos — globo de chat
  <>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </>,
];

export function CompromisoIcon({ index, size = 30 }: { index: number; size?: number }) {
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
