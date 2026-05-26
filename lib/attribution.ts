const FIRST_TOUCH_COOKIE = "knock_ft";
const LAST_TOUCH_COOKIE = "knock_lt";
const SESSION_COOKIE = "knock_session";
const ATTRIBUTION_EXPIRY_DAYS = 90;
const SESSION_EXPIRY_MINUTES = 30;
const COOKIE_DOMAIN_PROD = ".knock.app";
const COOKIE_DOMAIN_DEV = ".knock-dev.app";

interface CookieOptions {
  expires?: number | Date;
  domain?: string;
  sameSite?: string;
  secure?: boolean;
}

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`,
    ),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string, options: CookieOptions): void {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  if (options.expires != null) {
    const date =
      options.expires instanceof Date
        ? options.expires
        : new Date(Date.now() + options.expires * 864e5);
    cookie += `; expires=${date.toUTCString()}`;
  }
  if (options.domain) cookie += `; domain=${options.domain}`;
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.secure) cookie += `; Secure`;
  cookie += "; path=/";
  document.cookie = cookie;
}

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
    // Exclude internal knock.app and knock-dev.app referrers
    if (
      referrerUrl.hostname.endsWith(".knock.app") ||
      referrerUrl.hostname === "knock.app" ||
      referrerUrl.hostname.endsWith(".knock-dev.app") ||
      referrerUrl.hostname === "knock-dev.app"
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
    return COOKIE_DOMAIN_PROD;
  }
  if (hostname.endsWith(".knock-dev.app") || hostname === "knock-dev.app") {
    return COOKIE_DOMAIN_DEV;
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

  const cookieOptions: CookieOptions = {
    expires: ATTRIBUTION_EXPIRY_DAYS,
    sameSite: "lax",
    secure: window.location.protocol === "https:",
  };
  const domain = getCookieDomain();
  if (domain) cookieOptions.domain = domain;

  const attributionData = createAttributionData();
  const isNewSession = !getCookie(SESSION_COOKIE);

  // Refresh session cookie
  const sessionExpiry = new Date();
  sessionExpiry.setMinutes(sessionExpiry.getMinutes() + SESSION_EXPIRY_MINUTES);
  setCookie(SESSION_COOKIE, "1", { ...cookieOptions, expires: sessionExpiry });

  // Set first touch only if it doesn't exist and we have attribution data
  if (!getCookie(FIRST_TOUCH_COOKIE) && attributionData) {
    setCookie(
      FIRST_TOUCH_COOKIE,
      JSON.stringify(attributionData),
      cookieOptions,
    );
  }

  // Update last touch on new sessions if we have attribution data
  if (isNewSession && attributionData) {
    setCookie(
      LAST_TOUCH_COOKIE,
      JSON.stringify(attributionData),
      cookieOptions,
    );
  }
}
