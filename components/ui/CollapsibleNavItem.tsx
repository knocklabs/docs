import { useState } from "react";
import { Lucide } from "@telegraph/icon";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@telegraph/menu";
import { Box } from "@telegraph/layout";

interface CollapsibleNavItemProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const CollapsibleNavItem = ({
  label,
  children,
  defaultOpen = false,
  className = "",
}: CollapsibleNavItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`w-full ${className}`}>
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
          className: `transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`,
        }}
        style={{
          // Aligns with the Tab text above
          marginLeft: "-4px",
        }}
      >
        <span className="font-medium">{label}</span>
      </MenuItem>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`content-${label}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Box pt="1" pl="1">
              {children}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
