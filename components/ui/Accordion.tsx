import { Box, Stack } from "@telegraph/layout";
import { MenuItem } from "@telegraph/menu";
import { Icon } from "@telegraph/icon";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo, useLayoutEffect, useRef } from "react";
import { Text, Code } from "@telegraph/typography";
import { ChevronRight } from "lucide-react";

const AccordionGroup = ({ children }) => (
  <div
    className="[&>div]:border-0 [&>div]:rounded-none [&>div>button]:rounded-none [&>div]:mb-0 overflow-hidden mt-0 mb-6 rounded-xl divide-y divide-inherit border dark:border-zinc-800"
    role="list"
  >
    {children}
  </div>
);

function getHashFragment(): string {
  if (typeof window === "undefined") return "";
  const { hash } = window.location;
  if (!hash || hash === "#") return "";
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
}

type AccordionProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  /** When set, this slug is used as the element `id` and the accordion opens if the URL hash matches (for deep links). Use a URL-safe hyphenated fragment, e.g. `my-section`. */
  anchorSlug?: string;
};

// Helper function to parse title and split into text and code parts
const parseTitleWithCode = (
  title: string,
): Array<{ type: "text" | "code"; content: string }> => {
  const parts: Array<{ type: "text" | "code"; content: string }> = [];
  const regex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(title)) !== null) {
    // Add text before the code
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: title.substring(lastIndex, match.index),
      });
    }
    // Add the code part
    parts.push({
      type: "code",
      content: match[1],
    });
    lastIndex = regex.lastIndex;
  }

  // Add remaining text after the last match
  if (lastIndex < title.length) {
    parts.push({
      type: "text",
      content: title.substring(lastIndex),
    });
  }

  // If no matches found, return the whole title as text
  if (parts.length === 0) {
    parts.push({ type: "text", content: title });
  }

  return parts;
};

const Accordion = ({
  children,
  title,
  description,
  defaultOpen = false,
  anchorSlug,
}: AccordionProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const titleParts = useMemo(() => parseTitleWithCode(title), [title]);
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!anchorSlug) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let stopWatchingTimeoutId: number | null = null;

    const log = (label: string, extra?: Record<string, unknown>) => {
      // eslint-disable-next-line no-console
      console.log(`[Accordion:${anchorSlug}] ${label}`, {
        time: performance.now().toFixed(1),
        scrollY: window.scrollY,
        elementTop: elementRef.current?.getBoundingClientRect().top,
        bodyHeight: document.body.scrollHeight,
        ...extra,
      });
    };

    const performScroll = (source: string) => {
      if (cancelled) return;
      const el = elementRef.current;
      if (!el) return;
      el.scrollIntoView({
        block: "start",
        behavior: "instant" as ScrollBehavior,
      });
      log(`scroll:${source}`);
    };

    const stopWatching = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (stopWatchingTimeoutId !== null) {
        clearTimeout(stopWatchingTimeoutId);
        stopWatchingTimeoutId = null;
      }
    };

    const syncFromHash = (source: string) => {
      log(`syncFromHash:${source}`);
      if (getHashFragment() !== anchorSlug) return;
      setOpen(true);

      // Scroll immediately so the user goes directly from the previous page to
      // the correct position. This runs in useLayoutEffect, before paint.
      performScroll("immediate");

      // Re-scroll whenever layout shifts (images loading, async content, etc.)
      // so the accordion stays anchored to its intended position even as the
      // document height changes.
      stopWatching();
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          performScroll("resize");
        });
        resizeObserver.observe(document.body);
      }
      // Stop correcting after layout has had time to settle so we don't
      // fight subsequent user-initiated scrolls.
      stopWatchingTimeoutId = window.setTimeout(stopWatching, 1500);
    };

    syncFromHash("mount");
    const handler = () => syncFromHash("hashchange");
    window.addEventListener("hashchange", handler);
    return () => {
      cancelled = true;
      stopWatching();
      window.removeEventListener("hashchange", handler);
    };
  }, [anchorSlug]);

  return (
    <Box tgphRef={elementRef} role="listitem" id={anchorSlug}>
      <MenuItem
        as="button"
        onClick={() => setOpen(!open)}
        aria-controls={title + "Children"}
        aria-expanded={open}
        p="6"
        w="full"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Stack alignItems="center">
          <Icon
            icon={ChevronRight}
            aria-hidden={true}
            mr="2"
            style={{
              transition: "transform 0.2s ease-in-out",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              flexShrink: 0,
            }}
          />
          <Box>
            <Text
              as="span"
              size="2"
              leading="2"
              weight="medium"
              // eslint-disable-next-line
              // @ts-expect-error textWrap is fine?
              style={{ textWrap: "auto", overflow: "visible" }}
            >
              {titleParts.map((part, index) => {
                if (part.type === "code") {
                  return (
                    <Code
                      key={index}
                      as="code"
                      backgroundColor="gray-2"
                      data-tgph-code
                      style={{
                        fontSize: "inherit",
                        padding: "2px 3px",
                        margin: "0 2px",
                      }}
                    >
                      {part.content}
                    </Code>
                  );
                }
                return <span key={index}>{part.content}</span>;
              })}
            </Text>
            {description ? (
              <Text
                as="span"
                size="1"
                mt="1"
                color="gray"
                style={{
                  display: "block",
                  overflowWrap: "normal",
                  whiteSpace: "normal",
                }}
              >
                {description}
              </Text>
            ) : null}
          </Box>
        </Stack>
      </MenuItem>
      <Box overflow="hidden">
        <AnimatePresence>
          <motion.div
            initial={false}
            animate={{
              height: open ? "auto" : 0,
              opacity: open ? 1 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <Box mx="6" pt="4" pb="3">
              {children}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export { AccordionGroup, Accordion };
