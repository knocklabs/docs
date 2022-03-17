import Head from "next/head";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import * as React from "react";

const DEFAULT_META = {
  title: "Knock Docs",
  description:
    "API documentation and guides for Knock. Notifications infrastructure for developers.",
  ogImage: "/images/og.jpg",
  twitter: {
    handle: "@knocklabs",
    site: "@knocklabs",
  },
};

const IS_DEV = process.env.NODE_ENV === "development";

const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (IS_DEV ? "http://localhost:3001" : "https://knock.app/"),
);

const SITE_ORIGIN = SITE_URL.origin;

export default function Meta(props) {
  const router = useRouter();

  const nextSeoProps = React.useMemo(() => {
    return {
      title: props.title ?? DEFAULT_META.title,
      description: props.description ?? DEFAULT_META.description,
      canonical: `${SITE_ORIGIN}${router.pathname}`,
      openGraph: {
        type: "website",
        images: [
          {
            url: SITE_ORIGIN + (props.ogImage ?? DEFAULT_META.ogImage),
            alt: props.title ?? DEFAULT_META.title,
            width: 1200,
            height: 630,
          },
        ],
        site_name: "Knock",
      },
      twitter: {
        cardType: props.twitterCardType ?? "summary_large_image",
        handle: DEFAULT_META.twitter.handle,
        site: DEFAULT_META.twitter.site,
      },
      noindex: props.noIndex,
    };
  }, [props, router.pathname]);

  return (
    <>
      <NextSeo {...nextSeoProps} />
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </Head>
    </>
  );
}
