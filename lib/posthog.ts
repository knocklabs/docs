import posthog from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

export function init(): void {
  if (typeof window === "undefined") return;
  if (initialized) return;
  if (!POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We handle page views manually on route changes
    capture_pageleave: true,
  });

  initialized = true;
}

export function track(
  eventName: string,
  properties: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  if (!initialized) return;

  posthog.capture(eventName, properties);
}

export function page(
  pageName?: string,
  properties: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  if (!initialized) return;

  posthog.capture("$pageview", {
    ...properties,
    ...(pageName && { page_name: pageName }),
  });
}

export function identify(
  userId: string,
  traits: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  if (!initialized) return;

  posthog.identify(userId, traits);
}

export function reset(): void {
  if (typeof window === "undefined") return;
  if (!initialized) return;

  posthog.reset();
}
