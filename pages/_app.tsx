import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";

import "../styles/index.css";
import theme from "../theme";
import * as gtag from "../lib/gtag";

function MyApp({ Component, pageProps }) {
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
    <ChakraProvider theme={theme}>
      <EventEmitterContext.Provider value={eventEmitter}>
        <Component {...pageProps} />
      </EventEmitterContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
