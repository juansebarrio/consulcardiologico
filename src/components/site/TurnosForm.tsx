"use client";

/**
 * Formulario de la página /turnos — las mismas 3 preguntas del pop-up
 * (TurnoFields) más un «Contanos» opcional. Arma el mensaje con
 * buildTurnoWhatsApp(), el mismo formato que usan el pop-up y el asistente:
 * un solo formato de mensaje, parseable, venga de donde venga.
 *
 * Es también el fallback sin-JS del pop-up y la landing directa de SEO.
 */

import { useState } from "react";
import type { FormEvent } from "react";

import { Button, Textarea } from "@/components/ui";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { TurnoFields, turnoListo, type Cobertura, type Preferencia } from "@/components/site/TurnoFields";
import { buildTurnoWhatsApp, type TurnoInput } from "@/lib/asistente";
import { whatsappLink } from "@/lib/site";

export function TurnosForm() {
  const [nombre, setNombre] = useState("");
  const [preferencia, setPreferencia] = useState<Preferencia>("");
  const [cobertura, setCobertura] = useState<Cobertura>("");
  const [obra, setObra] = useState("");
  const [motivo, setMotivo] = useState("");

  const { valido, obraValor } = turnoListo(nombre, preferencia, cobertura, obra);

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valido) return;
    const data: TurnoInput = {
      nombre: nombre.trim(),
      obraSocial: obraValor,
      preferencia: preferencia === "manana" ? "Por la mañana" : "Por la tarde",
      motivo: motivo.trim() || undefined,
    };
    const url = whatsappLink(buildTurnoWhatsApp(data));
    // In-app browsers (Instagram/Facebook) suelen bloquear window.open.
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = url;
  };

  return (
    <form
      onSubmit={send}
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "clamp(24px, 4vw, 38px)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <TurnoFields
        nombre={nombre}
        onNombre={setNombre}
        preferencia={preferencia}
        onPreferencia={setPreferencia}
        cobertura={cobertura}
        onCobertura={setCobertura}
        obra={obra}
        onObra={setObra}
      />
      <Textarea
        label="Contanos (opcional)"
        placeholder="¿Cómo te venís sintiendo? Con lo que tengas alcanza."
        rows={3}
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />
      <div style={{ marginTop: "6px" }}>
        <Button type="submit" variant="primary" size="lg" full disabled={!valido} iconLeft={<WhatsAppIcon />}>
          Enviar por WhatsApp
        </Button>
      </div>
    </form>
  );
}
