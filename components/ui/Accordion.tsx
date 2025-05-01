import { Box, Stack } from "@telegraph/layout";
import { MenuItem } from "@telegraph/menu";
import { Lucide, Icon } from "@telegraph/icon";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Text } from "@telegraph/typography";
import { useAppearance } from "@telegraph/appearance";

const AccordionGroup = ({ children }) => (
  <Box
    borderColor="gray-4"
    role="list"
  >
    {children}
  </Box>
);

type AccordionProps = {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

const Accordion = ({ children, title, description, defaultOpen = false }: AccordionProps) => {
  const { appearance } = useAppearance();
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
        borderColor={appearance === "light" ? "gray-2" : "gray-4"}
        borderBottom="px"
        alignItems="center"
      >
        <Stack alignItems="center">
          <Icon
            icon={Lucide.ChevronRight}
            aria-hidden={true}
            mr="2"
            style={{
              transition: "transform 0.2s ease-in-out",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              flexShrink: 0,
            }}
          />
          <Box ml="2">
            <Text
              as="span"
              size="3"
              leading="2"
              weight="medium"
              // eslint-disable-next-line
              // @ts-expect-error textWrap is fine?
              style={{ textWrap: "auto", overflow: "visible" }}
            >
              {title}
            </Text>
            {description ? (
              <Text
                as="span"
                size="1"
                mt="1"
                color="gray"
                style={{ display: "block" }}
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
