import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { useEffect, useMemo } from "react";
import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";

import * as gtag from "../lib/gtag";

import "../styles/index.css";
import { DocsLayout } from "../layouts/DocsLayout";
import { IntegrationsLayout } from "../layouts/IntegrationsLayout";

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

  const getLayout = useMemo(() => {
    if (router.asPath.startsWith("/integrations")) {
      return IntegrationsLayout.getLayout;
    }

    if (
      !router.asPath.startsWith("/reference") &&
      !router.asPath.startsWith("/cli")
    ) {
      return DocsLayout.getLayout;
    }

    return (page) => page;
  }, [router.asPath]);

  return (
    <ThemeProvider
      defaultTheme="light"
      enableSystem={false}
      forcedTheme={Component.forcedTheme}
      attribute="class"
      disableTransitionOnChange
    >
      <EventEmitterContext.Provider value={eventEmitter}>
        {getLayout(<Component {...pageProps} />)}
      </EventEmitterContext.Provider>
    </ThemeProvider>
  );
}

export default App;
