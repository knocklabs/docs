import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@telegraph/layout";
import { useRouter } from "next/router";
import { TgphComponentProps } from "@telegraph/helpers";

export function useOnRefReady<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: (node: T) => void,
) {
  useEffect(() => {
    const node = ref.current;
    if (node) {
      callback(node);
      return;
    }

    // If node isn't ready yet, set up a MutationObserver
    const observer = new MutationObserver(() => {
      if (ref.current) {
        callback(ref.current);
        observer.disconnect();
      }
    });

    const parent = document.body; // Safe default for top-level elements
    observer.observe(parent, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [ref, callback]);
}

type GradientProps = TgphComponentProps<typeof Box>;

// Component that shows a gradient on the bottom of a scroller to indicate that there is more content below
// Opacity is tied to the scroll position of the scroller
// If the scroller is taller than the content, the gradient will be hidden
export const ScrollerBottomGradient = ({
  gradientProps,
  scrollerRef,
  managePadding = true,
}: {
  gradientProps?: GradientProps;
  scrollerRef: React.RefObject<HTMLDivElement>;
  managePadding?: boolean;
}) => {
  const router = useRouter();
  const gradientRef = useRef<HTMLDivElement>(null);

  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [gradient, setGradient] = useState<HTMLDivElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  useOnRefReady(scrollerRef, (node) => setScroller(node));
  useOnRefReady(gradientRef, (node) => setGradient(node));

  // Reset the state and refs when the route changes
  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setInitialized(false);
      setScroller(null);
    });
  }, [router]);

  const getGradientOpacity = useCallback(() => {
    if (!scroller || !gradient) return;

    // If content height is less than or equal to scroller height, hide gradient
    if (scroller.scrollHeight <= scroller.clientHeight) {
      gradient.style.opacity = "0";
      if (managePadding) {
        // Pull it off the bottom of the scroller
        scroller.style.paddingBottom = "var(--tgph-spacing-4)";
      }
      return;
    }

    const scrollableHeight = scroller.scrollHeight - scroller.clientHeight;
    const scrolledAmount = scroller.scrollTop;
    const scrollPercentage = Math.min(scrolledAmount / scrollableHeight, 1);

    // Invert the percentage so opacity goes from 1 to 0 as we scroll down
    gradient.style.opacity = String(1 - scrollPercentage);
  }, [scroller, gradient, managePadding]);

  const initialize = useCallback(() => {
    // Mostly for TS
    if (!scroller || !gradient) return;
    scroller.addEventListener("scroll", getGradientOpacity);
    getGradientOpacity(); // Initial check

    // Wait for scroller container to finish animating before measuring if it needs opacity
    scroller.addEventListener("transitionend", getGradientOpacity);

    return () => {
      scroller.removeEventListener("scroll", getGradientOpacity);
      scroller.removeEventListener("transitionend", getGradientOpacity);
    };
  }, [scroller, gradient, getGradientOpacity]);

  // A nice way to show that there is more content below the scroller
  useEffect(() => {
    if (!initialized && scroller && gradient) {
      initialize();
      setInitialized(true);
    }
  }, [scroller, gradient, initialized, initialize]);

  return (
    <Box
      position="absolute"
      left="0"
      bottom="0"
      right="0"
      height="32"
      tgphRef={gradientRef}
      {...gradientProps}
      style={{
        background:
          "linear-gradient(to bottom, transparent, var(--tgph-surface-1))",
        pointerEvents: "none",
        ...gradientProps?.style,
      }}
    />
  );
};
