import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
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
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1f2937 100%)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#22c55e",
            }}
          />
          Obsidian Master
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.05 }}>
            30일 옵시디언 학습
          </div>
          <div style={{ fontSize: 34, color: "#cbd5e1" }}>
            커리큘럼 · 진도 트래킹 · 학습 노트
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px" }}>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(34, 197, 94, 0.18)",
              border: "1px solid rgba(34, 197, 94, 0.45)",
              fontSize: 24,
              color: "#86efac",
            }}
          >
            Next.js
          </div>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(56, 189, 248, 0.18)",
              border: "1px solid rgba(56, 189, 248, 0.45)",
              fontSize: 24,
              color: "#7dd3fc",
            }}
          >
            Supabase
          </div>
        </div>
      </div>
    ),
    size,
  );
}
