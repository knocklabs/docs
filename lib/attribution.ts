import Cookies from "js-cookie";

const FIRST_TOUCH_COOKIE = "knock_ft";
const LAST_TOUCH_COOKIE = "knock_lt";
const SESSION_COOKIE = "knock_session";
const ATTRIBUTION_EXPIRY_DAYS = 90;
const SESSION_EXPIRY_MINUTES = 30;
const COOKIE_DOMAIN = ".knock.app";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer: string | null;
  landing_page: string;
  timestamp: string;
}

function getUtmParams(): Partial<Record<(typeof UTM_PARAMS)[number], string>> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utmData: Partial<Record<(typeof UTM_PARAMS)[number], string>> = {};
  UTM_PARAMS.forEach((param) => {
    const value = params.get(param);
    if (value) utmData[param] = value;
  });
  return utmData;
}

function getReferrer(): string | null {
  if (typeof window === "undefined" || !document.referrer) return null;
  try {
    const referrerUrl = new URL(document.referrer);
    // Exclude internal knock.app referrers
    if (
      referrerUrl.hostname.endsWith(".knock.app") ||
      referrerUrl.hostname === "knock.app"
    ) {
      return null;
    }
    return referrerUrl.hostname;
  } catch {
    return null;
  }
}

function getCookieDomain(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const hostname = window.location.hostname;
  // Don't set domain for localhost (development)
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return undefined;
  }
  if (hostname.endsWith(".knock.app") || hostname === "knock.app") {
    return COOKIE_DOMAIN;
  }
  return undefined;
}

function createAttributionData(): AttributionData | null {
  const utmParams = getUtmParams();
  const referrer = getReferrer();
  const hasAttribution = Object.keys(utmParams).length > 0 || referrer;
  if (!hasAttribution) return null;

  return {
    ...utmParams,
    referrer,
    landing_page: window.location.pathname,
    timestamp: new Date().toISOString(),
  };
}

export function initAttribution(): void {
  if (typeof window === "undefined") return;

  const cookieOptions: Cookies.CookieAttributes = {
    expires: ATTRIBUTION_EXPIRY_DAYS,
    sameSite: "lax",
    secure: window.location.protocol === "https:",
  };
  const domain = getCookieDomain();
  if (domain) cookieOptions.domain = domain;

  const attributionData = createAttributionData();
  const isNewSession = !Cookies.get(SESSION_COOKIE);

  // Refresh session cookie
  const sessionOptions: Cookies.CookieAttributes = { ...cookieOptions };
  const sessionExpiry = new Date();
  sessionExpiry.setMinutes(sessionExpiry.getMinutes() + SESSION_EXPIRY_MINUTES);
  sessionOptions.expires = sessionExpiry;
  Cookies.set(SESSION_COOKIE, "1", sessionOptions);

  // Set first touch only if it doesn't exist and we have attribution data
  if (!Cookies.get(FIRST_TOUCH_COOKIE) && attributionData) {
    Cookies.set(
      FIRST_TOUCH_COOKIE,
      JSON.stringify(attributionData),
      cookieOptions,
    );
  }

  // Update last touch on new sessions if we have attribution data
  if (isNewSession && attributionData) {
    Cookies.set(
      LAST_TOUCH_COOKIE,
      JSON.stringify(attributionData),
      cookieOptions,
    );
  }
}
