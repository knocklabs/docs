import { Box, Stack } from "@telegraph/layout";
import { MenuItem } from "@telegraph/menu";
import { Icon } from "@telegraph/icon";
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import { Text, Code } from "@telegraph/typography";
import { Check, ChevronRight, Link } from "lucide-react";

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
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Build the URL at click time rather than at render so we never read
  // `window` during SSR, and so client-side navigation can't leave us holding
  // a stale pathname.
  const copyAnchorLink = async () => {
    if (!anchorSlug) return;
    const url = `${window.location.origin}${window.location.pathname}#${anchorSlug}`;

    await navigator.clipboard.writeText(url);
    window.history.pushState({}, "", url);
    setCopied(true);
    if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!anchorSlug) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let stopWatchingTimeoutId: number | null = null;

    const performScroll = () => {
      if (cancelled) return;
      elementRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
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

    const syncFromHash = () => {
      if (getHashFragment() !== anchorSlug) return;
      setOpen(true);
      performScroll();

      // Re-scroll whenever layout shifts (images loading, async content, etc.)
      // so the accordion stays anchored to its intended position even as the
      // document height changes.
      stopWatching();
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          performScroll();
        });
        resizeObserver.observe(document.body);
      }
      // Stop correcting after layout has had time to settle so we don't
      // fight subsequent user-initiated scrolls.
      stopWatchingTimeoutId = window.setTimeout(stopWatching, 1500);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      cancelled = true;
      stopWatching();
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, [anchorSlug]);

  return (
    <Box
      tgphRef={elementRef}
      role="listitem"
      id={anchorSlug}
      position="relative"
      data-accordion-item
    >
      <MenuItem
        as="button"
        onClick={() => setOpen(!open)}
        aria-controls={title + "Children"}
        aria-expanded={open}
        p="6"
        // Keep long titles from running underneath the copy link button.
        pr={anchorSlug ? "12" : "6"}
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
                      borderColor="transparent"
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
      {/*
        Rendered as a sibling of the header button rather than inside it: the
        header is itself a <button>, and nesting interactive elements is invalid
        and breaks keyboard navigation. It's a <span> so that AccordionGroup's
        `[&>div]` / `[&>div>button]` resets don't apply to it.
      */}
      {anchorSlug ? (
        <span
          data-accordion-anchor
          data-open={open}
          style={{
            position: "absolute",
            // MenuItem sets a fixed height with larger vertical padding, so the
            // header's content box collapses and the title sits centered on the
            // row's midline -- which lands at exactly the top padding. Center
            // the button on that line rather than hanging it below.
            top: "var(--tgph-spacing-6)",
            transform: "translateY(-50%)",
            // Matches the header's left padding, so the icon is inset from the
            // right edge by the same amount as the chevron is from the left.
            right: "var(--tgph-spacing-6)",
          }}
        >
          <Tooltip label={copied ? "Copied!" : "Copy link"} side="left">
            <Button
              variant="ghost"
              size="1"
              color="gray"
              onClick={copyAnchorLink}
              aria-label="Copy link"
              icon={{
                icon: copied ? Check : Link,
                "aria-hidden": true,
              }}
            />
          </Tooltip>
        </span>
      ) : null}
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
