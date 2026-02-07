import { Box, Stack } from "@telegraph/layout";
import { MenuItem } from "@telegraph/menu";
import { Icon } from "@telegraph/icon";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
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

type AccordionProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  defaultOpen?: boolean;
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
}: AccordionProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const titleParts = useMemo(() => parseTitleWithCode(title), [title]);

  return (
    <Box role="listitem">
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
