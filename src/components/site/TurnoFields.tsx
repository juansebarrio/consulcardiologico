"use client";

/**
 * Campos compartidos del pedido de turno — los usan el pop-up (TurnoModal) y
 * el formulario de la página /turnos, así las mismas 3 preguntas viven en un
 * solo lugar: nombre, preferencia (mañana/tarde) y obra social o particular.
 */

import type { CSSProperties, ReactNode } from "react";

import { TextField } from "@/components/ui";
import { SITE } from "@/lib/site";

export type Preferencia = "" | "manana" | "tarde";
export type Cobertura = "" | "os" | "particular";

/* Etiqueta + control, al mismo registro que los campos del kit (ui/index.tsx). */
export function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "var(--font-body)" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-strong)" }}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" style={{ color: "var(--accent)" }}> *</span>
            <span className="sr-only"> (obligatorio)</span>
          </>
        ) : null}
      </span>
      {children}
    </div>
  );
}

/* Control segmentado (2–3 opciones) accesible como grupo de radios. */
export function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: "8px" }}
    >
      {options.map((o) => {
        const active = value === o.value;
        const st: CSSProperties = {
          appearance: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          fontWeight: 600,
          padding: "11px 12px",
          borderRadius: "var(--radius-md)",
          border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
          background: active ? "var(--accent)" : "var(--paper)",
          color: active ? "var(--accent-contrast)" : "var(--text-strong)",
          transition:
            "background var(--dur) var(--ease), border-color var(--dur) var(--ease), color var(--dur) var(--ease)",
        };
        return (
          <button key={o.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(o.value)} style={st}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TurnoFieldsProps {
  nombre: string;
  onNombre: (v: string) => void;
  preferencia: Preferencia;
  onPreferencia: (v: Preferencia) => void;
  cobertura: Cobertura;
  onCobertura: (v: Cobertura) => void;
  obra: string;
  onObra: (v: string) => void;
}

/** Las 3 preguntas del turno, controladas por el componente padre. */
export function TurnoFields({
  nombre,
  onNombre,
  preferencia,
  onPreferencia,
  cobertura,
  onCobertura,
  obra,
  onObra,
}: TurnoFieldsProps) {
  return (
    <>
      <TextField
        label="Tu nombre"
        placeholder="Cómo te llamás"
        value={nombre}
        autoComplete="name"
        onChange={(e) => onNombre(e.target.value)}
        required
      />

      <Field label="¿Qué preferís?" required>
        <Segmented
          label="¿Qué preferís?"
          value={preferencia}
          onChange={(v) => onPreferencia(v as Preferencia)}
          options={[
            { value: "manana", label: "Mañana" },
            { value: "tarde", label: "Tarde" },
          ]}
        />
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "6px 0 0", lineHeight: 1.5 }}>
          {SITE.schedule.map((s, i) => (
            <span key={s.quien}>
              {i > 0 ? " — " : ""}
              {s.quien}: {s.dias}
            </span>
          ))}
        </p>
      </Field>

      <Field label="¿Obra social o particular?" required>
        <Segmented
          label="¿Obra social o particular?"
          value={cobertura}
          onChange={(v) => onCobertura(v as Cobertura)}
          options={[
            { value: "os", label: "Obra social" },
            { value: "particular", label: "Particular" },
          ]}
        />
        {cobertura === "os" ? (
          <div style={{ marginTop: "10px" }}>
            <TextField
              label=""
              placeholder="¿Cuál? Ej.: OSDE, IOMA, Swiss Medical…"
              value={obra}
              onChange={(e) => onObra(e.target.value)}
              required
            />
          </div>
        ) : null}
      </Field>
    </>
  );
}

/** Valida las 3 preguntas y arma el valor de obra social para el mensaje. */
export function turnoListo(nombre: string, preferencia: Preferencia, cobertura: Cobertura, obra: string) {
  const obraValor = cobertura === "particular" ? "Particular" : obra.trim();
  const valido =
    nombre.trim() !== "" && preferencia !== "" && (cobertura === "particular" || (cobertura === "os" && obra.trim() !== ""));
  return { valido, obraValor };
}
