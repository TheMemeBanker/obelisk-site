export const dynamic = "force-static";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Obelisk — Monument Designs & Crypto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a08",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glyph strip top */}
        <div
          style={{
            position: "absolute",
            top: 40,
            display: "flex",
            gap: 32,
            opacity: 0.15,
            fontSize: 24,
            color: "#c8ff00",
          }}
        >
          {["[◇]", "◎", "⊕", "⟐", "✕", "◉", "⌘", "⊛", "◈", "⟡", "⊞", "⌬"].map(
            (g) => (
              <span key={g}>{g}</span>
            ),
          )}
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <h1
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#c8ff00",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              textShadow: "0 0 60px rgba(200,255,0,0.3), 0 0 120px rgba(200,255,0,0.1)",
              margin: 0,
              lineHeight: 1,
            }}
          >
            OBELISK
          </h1>
          <p
            style={{
              fontSize: 18,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8a8a7a",
              margin: 0,
            }}
          >
            Monument Designs & Crypto
          </p>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 20,
            color: "#8a8a7a",
            marginTop: 40,
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Encoded in stone. Secured by math.
        </p>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 14,
            color: "#4a4a40",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          <span>obelisk.fund</span>
          <span style={{ color: "#c8ff00" }}>$PRELODE</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
