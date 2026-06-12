import posthog from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

export function init() {
  if (typeof window === "undefined" || initialized || !POSTHOG_KEY) {
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We manually capture page views on route changes
    capture_pageleave: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") {
        posthog.debug();
      }
    },
  });

  initialized = true;
}

export function track(eventName: string, properties: Record<string, any> = {}) {
  if (typeof window !== "undefined" && initialized) {
    posthog.capture(eventName, properties);
  }
}

export function page(pageName?: string, properties: Record<string, any> = {}) {
  if (typeof window !== "undefined" && initialized) {
    posthog.capture("$pageview", {
      ...properties,
      ...(pageName && { page_name: pageName }),
    });
  }
}

export function identify(userId: string, properties: Record<string, any> = {}) {
  if (typeof window !== "undefined" && initialized) {
    posthog.identify(userId, properties);
  }
}

export function reset() {
  if (typeof window !== "undefined" && initialized) {
    posthog.reset();
  }
}

export { posthog };
