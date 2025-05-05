import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@telegraph/layout";
import { TgphComponentProps } from "@telegraph/helpers";
import { debounce } from "@/lib/debounce";

export function useOnRefReady<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: (node: T) => void,
) {
  const lastNodeRef = useRef<T | null>(null);

  useEffect(() => {
    const checkAndCall = () => {
      const node = ref.current;
      if (node && node !== lastNodeRef.current) {
        lastNodeRef.current = node;
        callback(node);
      }
    };

    checkAndCall();

    // If node isn't ready yet, set up a MutationObserver
    const observer = new MutationObserver(() => {
      checkAndCall();
    });

    const parent = document.body; // Safe default for top-level elements
    observer.observe(parent, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [ref, callback]);
}

// Observe mutations to update gradient when content changes
export function useMutationObserver<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: (node: T) => void,
) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let lastScrollHeight = node.scrollHeight;

    const handleChange = () => {
      if (node.scrollHeight !== lastScrollHeight) {
        lastScrollHeight = node.scrollHeight;
        callback(node);
      }
    };

    // MutationObserver for content changes
    const mutationObserver = new MutationObserver(handleChange);
    mutationObserver.observe(node, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Initial check
    handleChange();

    return () => {
      mutationObserver.disconnect();
    };
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
  const gradientRef = useRef<HTMLDivElement>(null);

  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [gradient, setGradient] = useState<HTMLDivElement | null>(null);

  useOnRefReady(scrollerRef, (node) => setScroller(node));
  useOnRefReady(gradientRef, (node) => setGradient(node));

  const setGradientOpacity = useCallback(
    debounce(() => {
      if (!scroller || !gradient) return;

      const position = scroller.getBoundingClientRect();
      gradient.style.top = `${position.height}px`;
      gradient.style.width = `${position.width}px`;

      console.log(gradient.style.top, gradient.style.width);

      // If content height is less than or equal to scroller height, hide gradient
      if (scroller.scrollHeight <= scroller.clientHeight) {
        gradient.style.opacity = "0";
        if (managePadding) {
          // Pull it off the bottom of the scroller
          scroller.style.paddingBottom = "var(--tgph-spacing-4)";
        }
        return; // Add return here to avoid further logic
      }

      const scrollableHeight = scroller.scrollHeight - scroller.clientHeight;
      const scrolledAmount = scroller.scrollTop;
      const scrollPercentage = scrolledAmount / scrollableHeight;

      // Only start fading in the bottom 10%
      const fadeStart = 0.9; // 90%
      if (scrollPercentage < fadeStart) {
        gradient.style.opacity = "1";
      } else {
        // Fade out from 1 to 0 as we scroll from 90% to 100%
        const fadeProgress = (scrollPercentage - fadeStart) / (1 - fadeStart);
        gradient.style.opacity = String(1 - Math.min(fadeProgress, 1));
      }
    }, 50),
    [scroller, gradient, managePadding],
  );

  // Watch for scroller height changes
  useMutationObserver(scrollerRef, setGradientOpacity);

  // A nice way to show that there is more content below the scroller
  useEffect(() => {
    if (!scroller || !gradient) return;

    scroller.addEventListener("scroll", setGradientOpacity);
    setGradientOpacity(); // Initial check
    scroller.addEventListener("transitionend", setGradientOpacity);

    gradient.style.transition = "opacity 0.25s ease-in-out";

    return () => {
      scroller.removeEventListener("scroll", setGradientOpacity);
      scroller.removeEventListener("transitionend", setGradientOpacity);
    };
  }, [scroller, gradient, setGradientOpacity]);

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
