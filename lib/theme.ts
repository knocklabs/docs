export type ThemeAppearance = "light" | "dark";

export const THEME_STORAGE_KEY = "knock-docs-appearance";
export const THEME_ATTRIBUTE = "data-tgph-appearance";

const DARK_THEME_CLASS = "dark";

export const isThemeAppearance = (
  value: string | null | undefined,
): value is ThemeAppearance => value === "light" || value === "dark";

export const getSystemThemeAppearance = (): ThemeAppearance => {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const getStoredThemeAppearance = (): ThemeAppearance | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedAppearance = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (!isThemeAppearance(storedAppearance)) {
    return null;
  }

  return storedAppearance;
};

export const getInitialThemeAppearance = (): ThemeAppearance =>
  getStoredThemeAppearance() ?? getSystemThemeAppearance();

export const persistThemeAppearance = (appearance: ThemeAppearance): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, appearance);
};

/**
 * Suppresses CSS transitions while the theme flips. Without this, any element
 * that transitions a color (such as content card borders) animates from the old
 * theme's value to the new one and briefly flashes a contrasting color. Call
 * before changing the theme, then call the returned function once the new
 * theme is applied.
 */
export const disableTransitionsTemporarily = (): (() => void) => {
  if (typeof document === "undefined") {
    return () => {};
  }

  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*,*::before,*::after{transition:none!important}"),
  );
  document.head.appendChild(style);

  return () => {
    // Force a style recalculation so the new theme lands with transitions off,
    // then re-enable them on the next tick.
    window.getComputedStyle(document.body).opacity;
    setTimeout(() => style.remove(), 1);
  };
};

export const applyThemeAppearance = (
  appearance: ThemeAppearance,
  element: HTMLElement | null = typeof document !== "undefined"
    ? document.documentElement
    : null,
) => {
  if (!element) {
    return;
  }

  element.setAttribute(THEME_ATTRIBUTE, appearance);
  element.classList.toggle(DARK_THEME_CLASS, appearance === "dark");
  element.style.colorScheme = appearance;
};

export const THEME_INITIALIZER_SCRIPT = `(function(){try{var storageKey=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var attribute=${JSON.stringify(
  THEME_ATTRIBUTE,
)};var stored=window.localStorage.getItem(storageKey);var isValid=stored==="light"||stored==="dark";var prefersDark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;var appearance=isValid?stored:(prefersDark?"dark":"light");var root=document.documentElement;root.setAttribute(attribute,appearance);root.classList.toggle("dark",appearance==="dark");root.style.colorScheme=appearance;}catch(_e){}})();`;
