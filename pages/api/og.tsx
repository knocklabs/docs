/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  // Get dynamic data from search params, e.g. api/og?title="Docs%20Page"&description="..."
  const { searchParams } = new URL(request.url);
  const title = searchParams.has("title")
    ? searchParams.get("title")
    : "Documentation";
  const description = searchParams.has("description")
    ? searchParams.get("description")
    : "Explore our guides and examples to integrate Knock.";

  // Load static assets (font && bg image)
  const backgroundImageData = await fetch(
    new URL("../../assets/og_background.jpg", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const fontData = await fetch(
    new URL("../../assets/OpenSauceOne-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontFamily: "OpenSauceOne",
        }}
      >
        {/* @ts-ignore */}
        <img width="1200" height="630" src={backgroundImageData} alt="" />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            color: "white",
            width: "100%",
            height: "100%",
            padding: "40px 60px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              marginTop: 136,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: "-.0125em",
                lineHeight: "1",
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.0125em",
                lineHeight: "1.25",
              }}
            >
              {description}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "OpenSauceOne",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}
