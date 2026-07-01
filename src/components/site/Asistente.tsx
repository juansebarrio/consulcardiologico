"use client";

/**
 * Asistente virtual del consultorio — sección de chat embebida en la home.
 *
 * Conversa con el modelo (vía `/api/asistente`, streaming) para orientar sobre
 * turnos, días y ubicación, y arma el turno: cuando junta los datos, el modelo
 * llama a la herramienta `prepararTurno` y acá renderizamos una tarjeta con un
 * botón de WhatsApp pre-cargado.
 *
 * Diseño: centrado y «sin caja», con el isotipo de marca como avatar y un aura
 * de arcilla que respira detrás (juega con la «pausa» del punto medio). Sobre los
 * tokens «Carta».
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { Button } from "@/components/ui";
import { Isotipo } from "@/components/site/Isotipo";
import { RichText } from "@/components/site/RichText";

/**
 * El agente de voz arrastra el SDK de ElevenLabs/LiveKit (~240KB gzip): se
 * carga recién cuando alguien elige «Hablar», no en el first-load de la home.
 * El minHeight del fallback evita el salto de layout mientras baja el chunk.
 */
const VoiceAgent = dynamic(() => import("@/components/site/VoiceAgent").then((m) => m.VoiceAgent), {
  ssr: false,
  loading: () => <div style={{ minHeight: "280px" }} />,
});
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { buildTurnoWhatsApp, SUGERENCIAS, TURNO_CAMPOS, type TurnoInput } from "@/lib/asistente";
import { ELEVENLABS_AGENT_ID, whatsappLink } from "@/lib/site";
import type { AsistenteMessage } from "@/app/api/asistente/route";

/** Tarjeta con el turno listo para enviar por WhatsApp. */
function TurnoCard({ data }: { data: TurnoInput }) {
  const mensaje = buildTurnoWhatsApp(data);
  const campos = TURNO_CAMPOS.filter(({ key }) => data[key]?.trim());

  return (
    <div
      style={{
        textAlign: "left",
        background: "var(--paper)",
        border: "1px solid var(--accent)",
        borderRadius: "var(--radius-md)",
        padding: "18px 20px",
        boxShadow: "0 14px 40px -18px color-mix(in oklch, var(--clay) 55%, transparent)",
      }}
    >
      <div className="u-eyebrow" style={{ color: "var(--accent)", marginBottom: "14px" }}>
        Tu turno, listo para enviar
      </div>
      <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", margin: 0 }}>
        {campos.map(({ key, label }) => (
          <div key={key} style={{ display: "contents" }}>
            <dt style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-muted)" }}>
              {label}
            </dt>
            <dd
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--text-strong)",
                fontWeight: 500,
              }}
            >
              {data[key]}
            </dd>
          </div>
        ))}
      </dl>
      <div style={{ marginTop: "18px" }}>
        <Button
          variant="primary"
          href={whatsappLink(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          iconLeft={<WhatsAppIcon />}
        >
          Enviar por WhatsApp
        </Button>
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.5 }}>
        Revisá los datos antes de enviar. Te respondemos por WhatsApp para confirmar día y hora.
      </p>
    </div>
  );
}

/** Burbuja de mensaje (texto). */
function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "85%",
          padding: "11px 15px",
          borderRadius: "var(--radius-lg)",
          textAlign: "left",
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          background: isUser ? "var(--accent)" : "var(--paper)",
          color: isUser ? "var(--accent-contrast)" : "var(--text-body)",
          border: isUser ? "1px solid var(--accent)" : "1px solid var(--border)",
          borderBottomRightRadius: isUser ? "var(--radius-sm)" : "var(--radius-lg)",
          borderBottomLeftRadius: isUser ? "var(--radius-lg)" : "var(--radius-sm)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Asistente() {
  const { messages, sendMessage, status, error, stop, regenerate } = useChat<AsistenteMessage>({
    transport: new DefaultChatTransport({ api: "/api/asistente" }),
  });
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modo voz (ElevenLabs): solo se ofrece si hay un agente configurado.
  const voiceAgentId = ELEVENLABS_AGENT_ID;

  const busy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  // Autoscroll al pie cuando llega contenido nuevo.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  function submit(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput("");
  }

  return (
    <section
      id="asistente"
      className="container"
      style={{
        padding: "clamp(64px, 10vw, 104px) clamp(20px, 5vw, 48px)",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: "80px",
        background:
          "radial-gradient(ellipse 70% 60% at 50% 8%, color-mix(in oklch, var(--clay) 7%, transparent), transparent 70%)",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", position: "relative" }}>
        {/* Isotipo con aura */}
        <div style={{ position: "relative", display: "inline-flex", justifyContent: "center", marginBottom: "26px" }}>
          <span className="asistente-aura" aria-hidden="true" />
          <span style={{ position: "relative", zIndex: 1 }}>
            <Isotipo size={76} />
          </span>
        </div>

        <div className="u-eyebrow" style={{ marginBottom: "14px" }}>
          Asistente virtual · 24 hs
        </div>
        <h2 style={{ fontSize: "clamp(28px, 4.8vw, 38px)", lineHeight: 1.08 }}>
          ¿En qué te puedo{" "}
          <span style={{ fontStyle: "italic", color: "var(--accent)" }}>ayudar</span>?
        </h2>
        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            margin: "16px auto 0",
            maxWidth: "48ch",
          }}
        >
          Contame qué necesitás y te oriento sobre turnos, días de atención y ubicación. Si querés,
          te dejo el turno casi listo para enviar por WhatsApp.
        </p>

        {/* Toggle Escribir / Hablar — el chat de texto es la opción principal;
            «Hablar» abre el agente de voz (solo si hay agente configurado). */}
        {voiceAgentId ? (
          <div
            role="radiogroup"
            aria-label="Modo de conversación"
            style={{
              display: "inline-flex",
              gap: "4px",
              marginTop: "24px",
              padding: "4px",
              background: "var(--surface-panel)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            {(
              [
                ["text", "Escribir"],
                ["voice", "Hablar"],
              ] as const
            ).map(([m, label]) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(m)}
                  style={{
                    appearance: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "8px 20px",
                    borderRadius: "var(--radius-pill)",
                    border: "none",
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "var(--accent-contrast)" : "var(--text-strong)",
                    transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Panel: agente de voz (si elegiste «Hablar») o chat de texto */}
        {mode === "voice" && voiceAgentId ? (
          <div style={{ position: "relative", marginTop: "36px" }}>
            <span className="asistente-panel-glow" aria-hidden="true" />
            <VoiceAgent agentId={voiceAgentId} />
          </div>
        ) : (
        <div style={{ position: "relative", marginTop: "36px" }}>
          <span className="asistente-panel-glow" aria-hidden="true" />
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
              textAlign: "left",
            }}
          >
            {/* Conversación o estado vacío */}
            {isEmpty ? (
              <div style={{ padding: "26px 22px 8px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
                  Probá con una de estas, o escribime abajo 👇
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      style={{
                        appearance: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: "var(--text-strong)",
                        background: "var(--surface-panel)",
                        border: "1px solid var(--border-strong)",
                        borderRadius: "var(--radius-pill)",
                        padding: "11px 16px",
                        transition: "background var(--dur) var(--ease), border-color var(--dur) var(--ease)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                ref={scrollRef}
                aria-live="polite"
                style={{
                  padding: "22px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxHeight: "min(56vh, 440px)",
                  overflowY: "auto",
                }}
              >
                {messages.map((m) => (
                  <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {m.parts.map((part, i) => {
                      if (part.type === "text") {
                        const isUser = m.role === "user";
                        return (
                          <Bubble key={`${m.id}-${i}`} role={isUser ? "user" : "assistant"}>
                            {isUser ? part.text : <RichText text={part.text} />}
                          </Bubble>
                        );
                      }
                      if (
                        part.type === "tool-prepararTurno" &&
                        (part.state === "input-available" || part.state === "output-available")
                      ) {
                        return <TurnoCard key={`${m.id}-${i}`} data={part.input as TurnoInput} />;
                      }
                      return null;
                    })}
                  </div>
                ))}

                {status === "submitted" ? (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div
                      className="asistente-typing"
                      style={{
                        display: "flex",
                        gap: "4px",
                        padding: "13px 16px",
                        background: "var(--paper)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                      }}
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : null}

                {error ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
                    <Bubble role="assistant">
                      Tuvimos un problema para responder. Probá de nuevo, o escribinos por WhatsApp.
                    </Bubble>
                    <Button variant="link" onClick={() => regenerate()}>
                      Reintentar
                    </Button>
                  </div>
                ) : null}
              </div>
            )}

            {/* Barra de entrada — pastilla con glow al enfocar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                margin: "14px",
                padding: "6px 6px 6px 8px",
                borderRadius: "var(--radius-pill)",
                background: "var(--surface-panel)",
                border: "1px solid " + (focused ? "var(--accent)" : "var(--border)"),
                boxShadow: focused
                  ? "0 0 0 4px color-mix(in oklch, var(--clay) 18%, transparent)"
                  : "none",
                transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Escribí tu pregunta…"
                aria-label="Escribí tu pregunta para el asistente"
                enterKeyHint="send"
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  padding: "9px 12px",
                  font: "inherit",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "var(--text-strong)",
                  outline: "none",
                }}
              />
              {busy ? (
                <Button variant="secondary" pill onClick={() => stop()}>
                  Detener
                </Button>
              ) : (
                <Button type="submit" variant="primary" pill disabled={!input.trim()}>
                  Enviar
                </Button>
              )}
            </form>
          </div>
        </div>
        )}

        {/* Aviso médico — siempre visible */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12.5px",
            color: "var(--text-muted)",
            margin: "16px auto 0",
            lineHeight: 1.6,
            maxWidth: "56ch",
          }}
        >
          El asistente orienta, pero no da diagnósticos ni reemplaza la consulta médica. Ante una
          urgencia, llamá al <strong style={{ color: "var(--text-body)" }}>107</strong> o andá a la
          guardia más cercana.
        </p>
      </div>
    </section>
  );
}
