import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";

import * as gtag from "../lib/gtag";

import "../styles/index.css";

function App({ Component, pageProps }) {
  const router = useRouter();
  const eventEmitter = useEventEmitterInstance();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider
      defaultTheme="light"
      enableSystem={false}
      forcedTheme={Component.forcedTheme}
      attribute="class"
      disableTransitionOnChange
    >
      <EventEmitterContext.Provider value={eventEmitter}>
        <Component {...pageProps} />
      </EventEmitterContext.Provider>
    </ThemeProvider>
  );
}

export default App;
