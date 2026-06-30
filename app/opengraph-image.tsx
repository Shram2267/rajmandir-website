import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, BRAND_COLOR, BACKGROUND_COLOR } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
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
          justifyContent: "center",
          padding: "80px",
          background: BACKGROUND_COLOR,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: BRAND_COLOR,
            fontSize: 34,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          Is hafte ki mega bachat
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            color: "#211b17",
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            maxWidth: 960,
          }}
        >
          <span>Mahine ka saara saaman,&nbsp;</span>
          <span style={{ color: BRAND_COLOR }}>ek chhat</span>
          <span>&nbsp;ke neeche.</span>
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            fontSize: 36,
            fontWeight: 700,
            color: "#211b17",
          }}
        >
          <div
            style={{
              background: BRAND_COLOR,
              color: "#fff",
              padding: "10px 26px",
              borderRadius: 40,
              fontSize: 30,
              marginRight: 24,
            }}
          >
            {SITE_NAME}
          </div>
          <div style={{ color: "#6e6258", fontSize: 30 }}>{SITE_TAGLINE}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
