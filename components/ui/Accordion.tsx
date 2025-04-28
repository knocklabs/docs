import { Box, Stack } from "@telegraph/layout";
import { MenuItem } from "@telegraph/menu";
import { Lucide, Icon } from "@telegraph/icon";
import clsx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { Text } from "@telegraph/typography";
const AccordionGroup = ({ children }) => (
  <div
    className="[&>div]:border-0 [&>div]:rounded-none [&>div>button]:rounded-none [&>div]:mb-0 overflow-hidden mt-0 mb-3 rounded-xl divide-y divide-inherit border dark:border-zinc-800"
    role="list"
  >
    {children}
  </div>
);

type AccordionProps = {
  title: string;
  description?: string;
  defaultOpen?: boolean;
};

const Accordion = ({ children, title, description, defaultOpen = false }) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <Box role="listitem">
      <MenuItem
        as="button"
        onClick={() => setOpen(!open)}
        aria-controls={title + "Children"}
        aria-expanded={open}
        py="8"
        px="8"
        w="full"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Stack alignItems="center">
          <Icon icon={Lucide.ChevronRight} aria-hidden={true} mr="2" style={{ transition: "transform 0.2s ease-in-out", transform: open ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }} />
          <Box>
            {/* @ts-expect-error textWrap is fine? */}
            <Text as="span" size="3" leading="2" weight="medium" style={{ "textWrap": "auto", overflow: "visible" }}>
              {title}
            </Text>
            {description ? (
              <Text as="p" size="2">
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
              opacity: open ? 1 : 0
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut"
            }}
          >
            <Box mx="6" pt="4" pb="3">
              {children}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box >
  );
};

export { AccordionGroup, Accordion };
