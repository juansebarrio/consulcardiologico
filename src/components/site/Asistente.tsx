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

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { Button } from "@/components/ui";
import { Isotipo } from "@/components/site/Isotipo";
import { RichText } from "@/components/site/RichText";
import { buildTurnoWhatsApp, SUGERENCIAS, TURNO_CAMPOS, type TurnoInput } from "@/lib/asistente";
import { whatsappLink } from "@/lib/site";
import type { AsistenteMessage } from "@/app/api/asistente/route";

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

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
  const scrollRef = useRef<HTMLDivElement>(null);

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
      className="container"
      style={{
        padding: "clamp(64px, 10vw, 104px) clamp(20px, 5vw, 48px)",
        position: "relative",
        overflow: "hidden",
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

        {/* Panel de chat — integrado, con halo */}
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
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      style={{
                        appearance: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        fontSize: "13.5px",
                        color: "var(--text-strong)",
                        background: "var(--surface-panel)",
                        border: "1px solid var(--border-strong)",
                        borderRadius: "var(--radius-pill)",
                        padding: "8px 15px",
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
                  fontSize: "15px",
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
