import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0b0b0f 0%, #12121a 50%, #0b0b0f 100%)",
          color: "#ffffff",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ fontSize: 22, opacity: 0.85, marginBottom: 16 }}>qr.jpeckham.com</div>
        <div style={{ fontSize: 74, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
          No Bullshit
          <br />
          QR Code Generator
        </div>
        <div style={{ marginTop: 28, fontSize: 30, opacity: 0.9, maxWidth: 980, lineHeight: 1.25 }}>
          Generate a QR code from any URL in seconds. Optional URL shortening. Download SVG or PNG.
        </div>
        <div style={{ marginTop: 48, display: "flex", gap: 12, opacity: 0.9, fontSize: 22 }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            SVG
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            PNG
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            Short URLs (optional)
          </div>
        </div>
      </div>
    ),
    size
  );
}


