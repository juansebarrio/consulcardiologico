import type { ReactNode } from "react";

/**
 * Markdown «inline» mínimo y seguro para los mensajes del asistente.
 *
 * El modelo a veces responde con Markdown (**negrita**, *cursiva*, `código`,
 * [enlaces](url)); como las burbujas mostraban el texto crudo, se veían los
 * asteriscos. Esto lo convierte en nodos de React —nunca usa
 * dangerouslySetInnerHTML, así el texto se escapa solo y no hay riesgo de XSS—.
 * Los saltos de línea los resuelve el contenedor con `white-space: pre-wrap`.
 */

/** Solo dejamos pasar esquemas de enlace seguros. */
function safeHref(href: string): string | null {
  return /^(https?:|mailto:|tel:)/i.test(href.trim()) ? href.trim() : null;
}

export function RichText({ text }: { text: string }) {
  // Regex local (objeto nuevo por render): su `lastIndex` lo muta `exec` sin
  // tocar estado compartido. Orden de la alternancia = prioridad: la negrita
  // (**) va antes que la cursiva (*) para que "**texto**" no se lea como
  // cursiva vacía.
  const TOKEN =
    /(\*\*([^*]+?)\*\*)|(\*([^*\n]+?)\*)|(`([^`]+?)`)|(\[([^\]]+?)\]\(([^)\s]+?)\))/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;

  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `md-${i++}`;

    if (m[1]) {
      nodes.push(<strong key={key}>{m[2]}</strong>);
    } else if (m[3]) {
      nodes.push(<em key={key}>{m[4]}</em>);
    } else if (m[5]) {
      nodes.push(
        <code
          key={key}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.92em",
            background: "var(--surface-panel)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "1px 5px",
          }}
        >
          {m[6]}
        </code>,
      );
    } else if (m[7]) {
      const href = safeHref(m[9]);
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textUnderlineOffset: "2px" }}
          >
            {m[8]}
          </a>
        ) : (
          m[0]
        ),
      );
    }

    last = m.index + m[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));

  return <>{nodes}</>;
}
