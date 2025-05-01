import React, { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import * as analytics from "../lib/analytics";
import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";

import * as gtag from "../lib/gtag";
import { setClearbitPath } from "../lib/clearbit";
import { useRemoteRefresh } from "next-remote-refresh/hook";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import "../styles/index.css";

function App({ Component, pageProps }) {
  const router = useRouter();
  const eventEmitter = useEventEmitterInstance();

  // Refresh when content pages change
  useRemoteRefresh();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
      setClearbitPath(url);
      analytics.page();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <main className={inter.className}>
      <EventEmitterContext.Provider value={eventEmitter}>
        <Component {...pageProps} />
      </EventEmitterContext.Provider>
      {analytics.SEGMENT_WRITE_KEY && <analytics.Snippet />}
    </main>
  );
}

export default App;
