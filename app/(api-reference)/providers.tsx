"use client";

/**
 * Client-side providers for App Router API reference pages.
 *
 * These wrap all API reference pages with necessary context providers
 * that require client-side state (event emitter, AI chat, etc.)
 */

import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { InkeepModalProvider } from "../../components/AiChatButton";
import { AskAiProvider } from "../../components/AskAiContext";
import AskAiSidebar from "../../components/AskAiSidebar";
import * as analytics from "../../lib/analytics";
import { initAttribution } from "../../lib/attribution";
import { setClearbitPath } from "../../lib/clearbit";
import * as gtag from "../../lib/gtag";

export function Providers({ children }: { children: React.ReactNode }) {
  const eventEmitter = useEventEmitterInstance();
  const pathname = usePathname();

  // Initialize attribution tracking on mount
  useEffect(() => {
    initAttribution();
  }, []);

  // Track page views on route change
  useEffect(() => {
    gtag.pageview(pathname as unknown as URL);
    setClearbitPath(pathname as unknown as URL);
    analytics.page();
    initAttribution();
  }, [pathname]);

  return (
    <AskAiProvider>
      <InkeepModalProvider>
        <main>
          <EventEmitterContext.Provider value={eventEmitter}>
            {children}
          </EventEmitterContext.Provider>
          {analytics.SEGMENT_WRITE_KEY && <analytics.Snippet />}
        </main>
        <AskAiSidebar />
      </InkeepModalProvider>
    </AskAiProvider>
  );
}
