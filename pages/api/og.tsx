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
    : "Explore our walkthroughs and examples to integrate Knock.";

  // Load static assets (font && bg image)
  const backgroundImageData = await fetch(
    new URL("../../assets/og_background.png", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const fontDataMedium = await fetch(
    new URL("../../assets/Inter_28pt-Medium.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const fontDataSemiBold = await fetch(
    new URL("../../assets/Inter_28pt-SemiBold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontFamily: "Inter",
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
              marginTop: 200,
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              bottom: 100,
              left: 62,
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: 600,
                letterSpacing: "-0.6px",
                lineHeight: "56px",
                color: "#1C2024",
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "30px",
                fontWeight: 500,
                letterSpacing: "-0.225px",
                lineHeight: "36px",
                color: "#60646C",
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
          name: "Inter",
          data: fontDataMedium,
          style: "normal",
          weight: 500,
        },
        {
          name: "Inter",
          data: fontDataSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
