import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useRemoteRefresh } from "next-remote-refresh/hook";
import { useEffect, Component as ReactComponent, ErrorInfo } from "react";

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

const inter = Inter({ subsets: ["latin"], display: "swap" });

/**
 * Error boundary to gracefully catch and display React errors
 * instead of crashing the entire page.
 */
class ErrorBoundary extends ReactComponent<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "red" }}>
          Error: {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}

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
      <InkeepModalProvider>
        <main className={inter.className}>
          <EventEmitterContext.Provider value={eventEmitter}>
            <ErrorBoundary>
              <Component {...pageProps} />
            </ErrorBoundary>
          </EventEmitterContext.Provider>
          {analytics.SEGMENT_WRITE_KEY && <analytics.Snippet />}
        </main>
        <AskAiSidebar />
      </InkeepModalProvider>
    </AskAiProvider>
  );
}

export default App;
