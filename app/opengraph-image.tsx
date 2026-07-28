import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/constants";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded OpenGraph / Twitter card — Editorial Ivory, generated at build. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F7F4EC",
        color: "#1D1B16",
        padding: "72px 80px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 8,
            fontWeight: 700,
          }}
        >
          <div>{siteConfig.wordmark}</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: 4,
            color: "#5B5549",
          }}
        >
          ISSUE 01
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: 120,
            height: 4,
            background: "#1D1B16",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 62,
            lineHeight: 1.06,
            fontWeight: 500,
            maxWidth: 940,
          }}
        >
          Every market has already formed an opinion of you.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontStyle: "italic",
            color: "#5B5549",
            marginTop: 22,
          }}
        >
          You just haven’t seen it yet.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 19,
          letterSpacing: 3,
          color: "#5B5549",
        }}
      >
        <div style={{ display: "flex" }}>THE PERCEPTION COMPANY</div>
        <div style={{ display: "flex" }}>{siteConfig.domain}</div>
      </div>
    </div>,
    { ...size },
  );
}
