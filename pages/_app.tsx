import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useRemoteRefresh } from "next-remote-refresh/hook";
import { useEffect } from "react";

import { InkeepModalProvider } from "../components/AiChatButton";
import { AskAiProvider } from "../components/AskAiContext";
import AskAiSidebar from "../components/AskAiSidebar";
import * as analytics from "../lib/analytics";
import { initAttribution } from "../lib/attribution";
import { setClearbitPath } from "../lib/clearbit";
import * as gtag from "../lib/gtag";

import "@algolia/autocomplete-theme-classic";
import "../styles/index.css";
import "../styles/global.css";
import "../styles/responsive.css";
import App, { AppContext, AppInitialProps, AppProps } from "next/app";

const inter = Inter({ subsets: ["latin"], display: "swap" });

function MyApp({ Component, pageProps }) {
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
    <AskAiProvider key={router.asPath}>
      <InkeepModalProvider key={router.asPath}>
        <main className={inter.className}>
          <EventEmitterContext.Provider value={eventEmitter}>
            <Component {...pageProps} />
          </EventEmitterContext.Provider>
          {analytics.SEGMENT_WRITE_KEY && <analytics.Snippet />}
        </main>
        <AskAiSidebar />
      </InkeepModalProvider>
    </AskAiProvider>
  );
}

MyApp.getInitialProps = async (
  context: AppContext,
): Promise<AppInitialProps> => {
  const ctx = await App.getInitialProps(context);
  return { ...ctx };
};

export default MyApp;
