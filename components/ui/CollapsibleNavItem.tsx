import { Lucide } from "@telegraph/icon";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@telegraph/menu";
import { Box } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { type TgphComponentProps } from "@telegraph/helpers"

export type CollapsibleNavItemProps = TgphComponentProps<typeof MenuItem> & {
  label: string;
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  className?: string;
  color?: "default" | "gray";
}

export const CollapsibleNavItem = ({
  label,
  children,
  isOpen = false,
  setIsOpen = () => { },
  color = "default",
  className = "",
  ...props
}: CollapsibleNavItemProps) => {
  return (
    <Box className={`w-full ${className}`}>
      {/* @ts-expect-error shut it */}
      <MenuItem
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`content-${label}`}
        variant="ghost"
        trailingIcon={{
          icon: Lucide.ChevronRight,
          "aria-hidden": true,
          size: "3",
          color: "disabled",
          className: `transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`,
        }}
        {...props}
      >
        <Text as="span" weight="medium" color={color} style={{ fontSize: "13px" }}>
          {label}
        </Text>
      </MenuItem>

      <AnimatePresence initial={false}>
        <motion.div
          id={`content-${label}`}
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden"
          }}
          transition={{ duration: 0.2 }}
          className={`overflow-hidden ${!isOpen ? "pointer-events-none" : ""}`}
        >
          <Box borderLeft="px" ml="3" pl="2" my="2" borderColor="gray-3">
            {children}
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};
