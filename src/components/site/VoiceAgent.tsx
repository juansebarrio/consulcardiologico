"use client";

/**
 * Agente de voz del consultorio (ElevenLabs) — opción «Hablar» del asistente.
 *
 * Conversa por voz (WebRTC) con un agente conversacional de ElevenLabs. Es una
 * alternativa al chat de texto: misma idea (orientar y armar el turno), pero
 * hablando. Cuando el agente junta los datos, llama a la herramienta de cliente
 * `mostrar_whatsapp` y acá mostramos un botón de WhatsApp pre-cargado —el número
 * sale de site.ts (fuente única), nunca lo decide el agente—.
 *
 * Requiere un agente PÚBLICO de ElevenLabs y su id en
 * `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` (ver .env.example). Sin esa variable, el
 * asistente no ofrece el modo voz.
 */

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useState } from "react";

import { Button } from "@/components/ui";
import { whatsappLink } from "@/lib/site";

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function MicIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

/** Arma el link de WhatsApp del turno con lo que junta el agente por voz. */
function linkTurno(p: Record<string, unknown>): string {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const medico = str(p.medico);
  const dia = str(p.dia);
  const preferencia = str(p.preferencia);
  const partes = ["Hola, quiero sacar un turno"];
  if (medico) partes.push(`con ${medico}`);
  if (dia) partes.push(`para un ${dia}`);
  if (preferencia) partes.push(preferencia);
  return whatsappLink(partes.join(" ") + ". ¿Me confirman un horario disponible? ¡Gracias!");
}

function VoiceInner({ agentId }: { agentId: string }) {
  const [waLink, setWaLink] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const conversation = useConversation({
    clientTools: {
      mostrar_whatsapp: async (params: Record<string, unknown>) => {
        setWaLink(linkTurno(params));
        return "Botón mostrado";
      },
    },
    onError: () => setErr("Hubo un problema con la llamada. Probá de nuevo."),
  });

  const connected = conversation.status === "connected";
  const connecting = conversation.status === "connecting";

  async function start() {
    setErr(null);
    setWaLink(null);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId, connectionType: "webrtc" });
    } catch {
      setErr("Necesitamos permiso del micrófono para hablar. Activalo y probá de nuevo.");
    }
  }

  const estado = connecting
    ? "Conectando…"
    : connected
      ? conversation.isSpeaking
        ? "Te está hablando…"
        : "Te escucha, hablá tranquilo…"
      : "Hablá con el asistente del consultorio. Te responde por voz.";

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        background: "var(--paper)",
        border: "1px solid color-mix(in oklch, var(--clay) 22%, var(--border))",
        borderRadius: "var(--radius-card)",
        boxShadow:
          "0 24px 60px -28px color-mix(in oklch, var(--clay) 45%, transparent), 0 2px 10px -6px color-mix(in oklch, var(--ink) 30%, transparent)",
        overflow: "hidden",
        textAlign: "center",
        padding: "clamp(28px, 5vw, 40px) 24px",
      }}
    >
      {/* Indicador de micrófono — late cuando la llamada está activa */}
      <span
        className={connected ? "pulse-heart" : undefined}
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "66px",
          height: "66px",
          borderRadius: "50%",
          background: connected ? "var(--accent)" : "var(--surface-panel)",
          color: connected ? "var(--accent-contrast)" : "var(--accent)",
          border: "1px solid " + (connected ? "var(--accent)" : "var(--border)"),
          transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
        }}
      >
        <MicIcon size={26} />
      </span>

      <p
        aria-live="polite"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          lineHeight: 1.6,
          color: connected ? "var(--text-strong)" : "var(--text-muted)",
          margin: "16px auto 0",
          maxWidth: "40ch",
          minHeight: "1.6em",
        }}
      >
        {estado}
      </p>

      <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        {connected ? (
          <Button variant="secondary" size="lg" pill onClick={() => conversation.endSession()}>
            Terminar
          </Button>
        ) : (
          <Button variant="primary" size="lg" pill onClick={start} disabled={connecting} iconLeft={<MicIcon size={18} />}>
            {connecting ? "Conectando…" : "Hablar con el consultorio"}
          </Button>
        )}

        {waLink ? (
          <Button variant="primary" href={waLink} target="_blank" rel="noopener noreferrer" iconLeft={<WhatsAppIcon />}>
            Enviar turno por WhatsApp
          </Button>
        ) : null}
      </div>

      {err ? (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--danger)", margin: "14px auto 0", maxWidth: "44ch" }}>
          {err}
        </p>
      ) : null}
    </div>
  );
}

export function VoiceAgent({ agentId }: { agentId: string }) {
  return (
    <ConversationProvider>
      <VoiceInner agentId={agentId} />
    </ConversationProvider>
  );
}
