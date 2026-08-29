import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Full-Stack Engineer`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "100px",
          background: "#faf9f5",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 64,
            height: 4,
            background: "#4e8a6e",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 120,
            color: "#2b2a26",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: "#8a857c",
            marginTop: 24,
          }}
        >
          Full-Stack Engineer
        </div>
      </div>
    ),
    { ...size },
  );
}
