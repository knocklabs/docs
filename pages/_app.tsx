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
import { initAttribution } from "../lib/attribution";
import { useRemoteRefresh } from "next-remote-refresh/hook";
import { AskAiProvider } from "../components/AskAiContext";
import AskAiSidebar from "../components/AskAiSidebar";
import AiChatButton from "../components/AiChatButton";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import "../styles/index.css";
import "../styles/global.css";
import "../styles/responsive.css";

function App({ Component, pageProps }) {
  const router = useRouter();
  const eventEmitter = useEventEmitterInstance();

  // Refresh when content pages change
  useRemoteRefresh();

  // Initialize attribution tracking on mount
  useEffect(() => {
    initAttribution();
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
      setClearbitPath(url);
      analytics.page();
      initAttribution();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <AskAiProvider>
      <main className={inter.className}>
        <EventEmitterContext.Provider value={eventEmitter}>
          <Component {...pageProps} />
        </EventEmitterContext.Provider>
        {analytics.SEGMENT_WRITE_KEY && <analytics.Snippet />}
      </main>
      <AskAiSidebar />
      <div className="md-visible">
        <AiChatButton />
      </div>
    </AskAiProvider>
  );
}

export default App;
