/**
 * Asistente virtual — endpoint de chat (streaming) sobre Vercel AI Gateway.
 *
 * Recibe el historial (UIMessages) desde `useChat`, lo transmite al modelo con
 * las instrucciones del consultorio y devuelve la respuesta en streaming.
 *
 * Autenticación (Anthropic / Claude Console):
 *   · Variable `ANTHROPIC_API_KEY` — en `.env.local` (local) y en las Environment
 *     Variables del proyecto en Vercel (ver `.env.example`).
 *
 * La herramienta `prepararTurno` NO tiene `execute`: el tool-call se reenvía al
 * cliente, que renderiza la tarjeta de turno con el botón de WhatsApp.
 */

import {
  convertToModelMessages,
  streamText,
  tool,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

import { ASISTENTE_MODEL, ASISTENTE_SYSTEM } from "@/lib/asistente";

// Permite respuestas en streaming de hasta 30 s.
export const maxDuration = 30;

const tools = {
  prepararTurno: tool({
    description:
      "Usá esta herramienta cuando la persona quiera sacar un turno y ya tengas, como mínimo, su nombre. Genera una tarjeta con un botón para enviar la solicitud por WhatsApp al consultorio. No inventes datos: pasá solo lo que la persona haya dado.",
    inputSchema: z.object({
      nombre: z.string().describe("Nombre y apellido de la persona."),
      motivo: z
        .string()
        .optional()
        .describe(
          "Motivo general de la consulta (ej. «control», «primera consulta»), sin detalles clínicos sensibles.",
        ),
      profesional: z
        .string()
        .optional()
        .describe('Profesional preferido: "Dr. Barrio", "Dra. Scarano" o "Sin preferencia".'),
      obraSocial: z.string().optional().describe('Obra social / prepaga, o "Particular".'),
      preferencia: z
        .string()
        .optional()
        .describe("Disponibilidad horaria o días que le quedan cómodos."),
    }),
    // Sin `execute`: se reenvía al cliente para render (generative UI).
  }),
};

export type AsistenteTools = InferUITools<typeof tools>;
export type AsistenteMessage = UIMessage<never, UIDataTypes, AsistenteTools>;

export async function POST(req: Request) {
  const { messages }: { messages: AsistenteMessage[] } = await req.json();

  const result = streamText({
    model: anthropic(ASISTENTE_MODEL),
    instructions: ASISTENTE_SYSTEM,
    messages: await convertToModelMessages(messages),
    tools,
    maxOutputTokens: 800,
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("[asistente] error en el stream:", error);
      return "Tuvimos un problema con el asistente. Probá de nuevo en un momento, o escribinos por WhatsApp.";
    },
  });
}
