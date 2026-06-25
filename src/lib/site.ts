/**
 * Cardiología Barrio · Scarano — configuración central del sitio.
 *
 * Fuente única de verdad para datos de contacto, dirección, horarios y médicos.
 * Cambiá el número de WhatsApp / teléfono UNA sola vez acá y se actualiza en
 * el header, el footer y el formulario de turnos.
 */

// ───────────────────────────────────────────────────────────────────────────
// ⚠️  TODO: REEMPLAZAR POR LOS DATOS REALES DEL CONSULTORIO
//     Hoy son los placeholders del manual de marca (terminados en 0000).
// ───────────────────────────────────────────────────────────────────────────

/** WhatsApp en formato E.164 sin "+" (Argentina: 549 + área + número). PLACEHOLDER. */
export const WHATSAPP_E164 = "5492910000000"; // TODO: número real

/** Cómo se muestra el teléfono en pantalla. PLACEHOLDER. */
export const PHONE_DISPLAY = "0291 000-0000"; // TODO: número real

// ───────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: "Cardiología Barrio · Scarano",
  shortName: "Barrio · Scarano",
  tagline: "Cardiología con el tiempo que tu corazón necesita.",
  description:
    "Dos cardiólogos en el centro de Bahía Blanca. Atendemos sin apuro, pedimos solo lo necesario y te seguimos de cabecera a largo plazo.",
  // Dominio de producción (ajustar al deployar). Usado para metadata/OpenGraph.
  url: "https://cardiologiabarrioscarano.com.ar",
  locale: "es_AR",
  address: {
    line1: "Martiniano Rodríguez 415",
    line2: "B8000 · Bahía Blanca, Argentina",
    city: "Bahía Blanca",
    // Embed de Google Maps (no requiere API key).
    mapsEmbed:
      "https://www.google.com/maps?q=Martiniano%20Rodr%C3%ADguez%20415%2C%20Bah%C3%ADa%20Blanca%2C%20Argentina&output=embed",
    mapsLink:
      "https://www.google.com/maps/search/?api=1&query=Martiniano%20Rodr%C3%ADguez%20415%2C%20Bah%C3%ADa%20Blanca%2C%20Argentina",
  },
  schedule: [
    { dias: "Lun · Mié · Vie", quien: "Dr. Barrio" },
    { dias: "Mar · Jue", quien: "Dra. Scarano" },
  ],
} as const;

/** Navegación principal (orden = orden en el header). */
export const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/cardiologos", label: "Los cardiólogos" },
  { href: "/como-trabajamos", label: "Cómo trabajamos" },
] as const;

export const ROUTES = {
  home: "/",
  cardiologos: "/cardiologos",
  como: "/como-trabajamos",
  turnos: "/turnos",
} as const;

/**
 * Construye el link de WhatsApp con un mensaje pre-cargado.
 * Si no pasás texto, abre el chat vacío.
 */
export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type Doctor = {
  slug: string;
  name: string;
  dias: string;
  image: string;
  /** object-position para encuadrar la cara en el recorte. */
  pos: string;
  bioShort: string;
  bioLong: string;
  creds: string[];
  /** Cita en primera persona singular («sobre mí»). */
  yo: string;
};

export const DOCTORS: Doctor[] = [
  {
    slug: "barrio",
    name: "Dr. Juan Pablo Barrio",
    dias: "Lun · Mié · Vie",
    image: "/doctores/dr-barrio.jpg",
    pos: "60% 22%",
    bioShort:
      "Jefe del Servicio de Cardiología del Hospital Penna. Ecocardiografista; dirige el curso de Eco Doppler en Bahía Blanca.",
    bioLong:
      "Cardiólogo clínico y ecocardiografista. Atiende con el tiempo que cada consulta necesita y sostiene el seguimiento a largo plazo.",
    creds: [
      "Jefe del Servicio de Cardiología — Hospital Penna",
      "Ecocardiografista",
      "Dirige el curso de Eco Doppler en Bahía Blanca",
    ],
    yo: "Prefiero pedir un estudio de menos y mirarte bien, que llenarte de papeles.",
  },
  {
    slug: "scarano",
    name: "Dra. Cynthia Scarano",
    dias: "Mar · Jue",
    image: "/doctores/dra-scarano.jpg",
    pos: "center 42%",
    bioShort:
      "Jefa de Sala de Unidad Coronaria del Hospital Penna. Ecocardiografista, formada en la Universidad Nacional de Córdoba.",
    bioLong:
      "Cardióloga clínica y ecocardiografista, con años de unidad coronaria y de docencia. Escucha primero y decide después.",
    creds: [
      "Jefa de Sala de Unidad Coronaria — Hospital Penna",
      "Ecocardiografista",
      "Formada en la Universidad Nacional de Córdoba",
      "Ex-Jefa de Residentes de Cardiología — HIGA Penna",
      "Ex-docente de Medicina — UNS",
    ],
    yo: "Me tomo el tiempo de explicarte qué tenés y por qué, hasta que te quedes tranquila.",
  },
];

/** Los cuatro compromisos clínicos (usar literal). */
export const COMPROMISOS = [
  "Solo hacemos los estudios que sean necesarios.",
  "Recetamos solo cuando hace falta estrictamente.",
  "Hay que controlarse para quedarse tranquilo.",
  "Después del turno también estamos.",
] as const;

/** Los cuatro pilares. */
export const PILARES = [
  ["Tiempo", "La consulta dura lo que tiene que durar. El apuro es lo opuesto a lo que hacemos."],
  ["Escucha", "Atendemos a la persona, no al estudio. Primero entender, después decidir."],
  ["Oficio", "Décadas de práctica clínica seria, sin ostentación. Saber hacer, no aparentar."],
  ["Vínculo", "La relación no termina cuando termina el turno. Somos de cabecera, a largo plazo."],
] as const;
