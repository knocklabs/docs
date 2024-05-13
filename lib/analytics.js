import * as snippet from "@segment/snippet";
import Script from "next/script";

export function track(eventName, attrs = {}) {
  window?.analytics?.track(eventName, attrs);
}

export function page(pageName, properties = {}) {
  window?.analytics?.page(pageName, properties);
}

export const SEGMENT_WRITE_KEY = process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY;

function renderSnippet() {
  const opts = {
    apiKey: SEGMENT_WRITE_KEY,
    // note: the page option only covers SSR tracking.
    // Page.js is used to track other events using `window.analytics.page()`
    page: true,
  };

  if (process.env.NODE_ENV === "development") {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

export const Snippet = () => (
  <Script
    id="segment-script"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{ __html: renderSnippet() }}
  />
);
