import { ImageResponse } from "next/og";

/**
 * Ícono para iOS (pantalla de inicio) — redibuja el isotipo de icon.svg a
 * 180×180: papel de fondo, anillo tinta, punto arcilla. iOS aplica su propia
 * máscara de esquinas, por eso el fondo va a sangre completa.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F6F3ED",
        }}
      >
        <div
          style={{
            width: 106,
            height: 106,
            borderRadius: "50%",
            border: "8px solid #2B2722",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#B0492F" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
