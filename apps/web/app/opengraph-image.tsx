import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoData = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #050508 0%, #0f0f18 50%, #050508 100%)",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={80} height={80} alt="" />
          <span style={{ fontSize: 56, fontWeight: 700 }}>Verdikt</span>
        </div>
        <p style={{ fontSize: 36, color: "#a1a1aa", maxWidth: 900, lineHeight: 1.3 }}>
          Verify agent deliverables. Verdict on 0G. Human review when it matters. Proof on Hedera.
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
          {["0G", "Hedera", "ENS"].map((s) => (
            <span
              key={s}
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                background: "rgba(99,102,241,0.2)",
                color: "#a5b4fc",
                fontSize: 22,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
