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
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/site";

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
