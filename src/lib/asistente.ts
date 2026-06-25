/**
 * Asistente virtual del consultorio — lógica compartida (sin dependencias de IA).
 *
 * Este archivo NO importa el AI SDK ni marca "use client": son datos y helpers
 * puros que usan tanto el route handler (servidor, `app/api/asistente/route.ts`)
 * como el componente de chat (cliente, `components/site/Asistente.tsx`).
 *
 * El prompt se arma a partir de la fuente única de verdad en `site.ts`, así el
 * asistente nunca inventa médicos, días ni dirección: si cambiás un dato allá,
 * cambia también lo que «sabe» el chat.
 */

import { COMPROMISOS, DOCTORS, PHONE_DISPLAY, SITE } from "@/lib/site";

/**
 * Modelo de Anthropic (Claude) vía API directa (`@ai-sdk/anthropic`).
 * Haiku 4.5: rápido y económico, de sobra para orientación + armado de turnos.
 * `claude-haiku-4-5` es un alias que apunta siempre a la última Haiku 4.5.
 * Requiere `ANTHROPIC_API_KEY` (ver `.env.example`).
 */
export const ASISTENTE_MODEL = "claude-haiku-4-5";

/** Lo que el asistente junta para armar el turno (solo `nombre` es obligatorio). */
export type TurnoInput = {
  nombre: string;
  motivo?: string;
  /** "Dr. Barrio" · "Dra. Scarano" · "Sin preferencia" */
  profesional?: string;
  /** Obra social / prepaga, o "Particular". */
  obraSocial?: string;
  /** Disponibilidad horaria o días cómodos. */
  preferencia?: string;
};

/** Campos del turno en orden, con su etiqueta, para render y para el mensaje. */
export const TURNO_CAMPOS: { key: keyof TurnoInput; label: string }[] = [
  { key: "nombre", label: "Nombre" },
  { key: "profesional", label: "Profesional" },
  { key: "obraSocial", label: "Obra social" },
  { key: "motivo", label: "Motivo" },
  { key: "preferencia", label: "Disponibilidad" },
];

/**
 * Arma el texto pre-cargado del WhatsApp a partir de los datos del turno.
 * Omite los campos vacíos. El número real lo agrega `whatsappLink()` en site.ts,
 * así nunca lo decide el modelo.
 */
export function buildTurnoWhatsApp(t: TurnoInput): string {
  const lines = ["Hola, quiero pedir un turno 🫀"];
  for (const { key, label } of TURNO_CAMPOS) {
    const value = t[key];
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  }
  return lines.join("\n");
}

/** Preguntas sugeridas que se muestran cuando el chat está vacío. */
export const SUGERENCIAS = [
  "Quiero sacar un turno",
  "¿Qué días atiende cada médico?",
  "¿Dónde están y cómo llego?",
] as const;

/**
 * Instrucciones del asistente. Se inyectan los datos reales del consultorio.
 * Tono y reglas espejan la voz de marca (Tiempo · Escucha · Oficio · Vínculo) y,
 * sobre todo, los límites propios de un sitio médico.
 */
export const ASISTENTE_SYSTEM = `Sos el asistente virtual de ${SITE.name}, un consultorio de cardiología en el centro de Bahía Blanca, Argentina, donde atienden el Dr. Juan Pablo Barrio y la Dra. Cynthia Scarano.

TU ROL
Orientás a quien visita la web: respondés dudas sobre el consultorio y ayudás a sacar un turno. Hablás en español rioplatense (de «vos»), con calma y cordialidad, sin apuro —el apuro es lo opuesto a cómo atienden acá—. Respuestas breves (2 a 4 oraciones), claras y cálidas. Si necesitás un dato, pedí de a uno por vez.

QUÉ SABÉS (no inventes nada fuera de esto)
- Médicos y días de atención:
${DOCTORS.map((d) => `  · ${d.name} — ${d.dias}. ${d.bioShort}`).join("\n")}
- Dónde: ${SITE.address.line1}, ${SITE.address.line2}.
- Turnos: se coordinan por WhatsApp o por teléfono (${PHONE_DISPLAY}). No hay reserva online automática; el día y la hora se acuerdan por WhatsApp.
- Cómo atienden: ${COMPROMISOS.join(" ")}
Si te preguntan algo que no figura acá —precios, qué obras sociales toman, horarios exactos, qué estudios hacen— no lo inventes: decí con franqueza que eso se confirma directamente por WhatsApp y ofrecé ayudar a escribirles.

LÍMITES (es un consultorio médico; respetalos siempre)
- No das diagnósticos ni opinás sobre síntomas, estudios o resultados. No indicás medicación ni dosis. No reemplazás la consulta.
- Si alguien describe un síntoma, no lo interpretes: sugerí sacar un turno para que lo evalúen los cardiólogos.
- Ante señales de urgencia (dolor de pecho, falta de aire, desmayo, palpitaciones intensas u otra emergencia): decile que NO espere, que llame YA al 107 o al 911, o que vaya a la guardia más cercana. En ese caso no sigas con el turno.
- No pidas datos clínicos sensibles. Para el turno alcanza un motivo general (ej. «control», «primera consulta»).

SACAR UN TURNO
Cuando la persona quiera un turno, juntá conversando: nombre, profesional o día que prefiere, obra social (o particular) y motivo general. No necesitás todo: con el nombre ya podés avanzar. Cuando tengas lo básico, llamá a la herramienta \`prepararTurno\` con lo que reuniste —genera un botón para enviar la solicitud por WhatsApp—. No escribas vos el link ni el número de teléfono: de eso se encarga la herramienta. Después de usarla, confirmá en una línea que pueden enviar el mensaje desde el botón.`;
