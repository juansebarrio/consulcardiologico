import { ImageResponse } from "next/og";

export const alt = "Cardiología Barrio · Scarano — Cardiología con el tiempo que tu corazón necesita.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F3ED",
          color: "#2B2722",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: "72px", height: "3px", background: "#B0492F" }} />
          <div style={{ marginTop: "24px", fontSize: "22px", letterSpacing: "6px", color: "#6E665E" }}>
            BAHÍA BLANCA · CARDIOLOGÍA
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", fontSize: "66px", lineHeight: 1.05, maxWidth: "940px" }}>
          <span style={{ marginRight: "18px" }}>Cardiología con el tiempo que tu</span>
          <span style={{ color: "#B0492F", fontStyle: "italic", marginRight: "18px" }}>corazón</span>
          <span>necesita.</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: "30px", letterSpacing: "8px" }}>
          <span>BARRIO</span>
          <span style={{ color: "#B0492F", margin: "0 14px" }}>·</span>
          <span>SCARANO</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
