"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Button, Checkbox, Select, Textarea, TextField } from "@/components/ui";
import { SITE, whatsappLink } from "@/lib/site";

export function TurnosForm() {
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [dia, setDia] = useState("");
  const [motivo, setMotivo] = useState("");

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const partes = [
      `Hola! Soy ${nombre || "..."}.`,
      `Quería sacar un turno${dia ? ` (${dia})` : ""}.`,
      motivo ? motivo : "",
      tel ? `Mi teléfono: ${tel}.` : "",
    ].filter(Boolean);
    window.open(whatsappLink(partes.join(" ")), "_blank", "noopener,noreferrer");
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
      <TextField label="Tu nombre" placeholder="Cómo te llamás" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <TextField label="Teléfono" type="tel" placeholder="Para coordinar el turno" value={tel} onChange={(e) => setTel(e.target.value)} />
      <Select
        label="¿Qué día preferís?"
        placeholder="Elegí un día"
        value={dia}
        onChange={(e) => setDia(e.target.value)}
        options={[
          ...SITE.schedule.map((s) => {
            const v = `${s.dias} — ${s.quien}`;
            return { value: v, label: v };
          }),
          { value: "Me da igual", label: "Me da igual" },
        ]}
      />
      <Textarea
        label="Contanos"
        placeholder="¿Cómo te venís sintiendo? Con lo que tengas alcanza."
        rows={3}
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />
      <Checkbox label="Quiero recordatorio por WhatsApp" defaultChecked />
      <div style={{ marginTop: "6px" }}>
        <Button type="submit" variant="primary" size="lg" full>
          Enviar por WhatsApp
        </Button>
      </div>
    </form>
  );
}
