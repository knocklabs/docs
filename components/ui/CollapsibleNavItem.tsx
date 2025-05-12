import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@telegraph/menu";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { type TgphComponentProps } from "@telegraph/helpers";
import { Icon, Lucide } from "@telegraph/icon";

export type CollapsibleNavItemProps = TgphComponentProps<typeof MenuItem> & {
  label: string;
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  className?: string;
  color?: "default" | "gray";
};

export const CollapsibleNavItem = ({
  label,
  children,
  isOpen = false,
  setIsOpen = () => {},
  color = "default",
  className = "",
  ...props
}: CollapsibleNavItemProps) => {
  return (
    <Box className={`w-full ${className}`}>
      <MenuItem
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`content-${label}`}
        variant="ghost"
        w="full"
        py="4"
        {...props}
      >
        <Stack direction="row" align="center">
          <Text
            as="span"
            weight="medium"
            color={color}
            style={{ fontSize: "13px" }}
          >
            {label}
          </Text>
          <Icon
            icon={Lucide.ChevronRight}
            size="1"
            ml="4"
            color="disabled"
            aria-hidden
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </Stack>
      </MenuItem>

      <AnimatePresence initial={false}>
        <motion.div
          id={`content-${label}`}
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden",
          }}
          transition={{ duration: 0.2 }}
          className={`overflow-hidden ${!isOpen ? "pointer-events-none" : ""}`}
        >
          <Box borderLeft="px" ml="3" pl="2" borderColor="gray-3">
            {children}
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};
