import { createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box } from "@telegraph/layout";
import { Lucide } from "@telegraph/icon";
import { useState } from "react";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import Link from "next/link";
import { Sidebar } from "./Sidebar";

interface MobileSidebarContextType {
  isOpen: boolean;
  closeSidebar: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType>({
  isOpen: false,
  closeSidebar: () => {},
});

export const useMobileSidebar = () => {
  try {
    const context = useContext(MobileSidebarContext);
    if (!context) {
      return {
        isOpen: false,
        closeSidebar: () => {},
      };
    }
    return context;
  } catch (error) {
    console.error("MobileSidebarContext not found");
    return {
      isOpen: false,
      closeSidebar: () => {},
    };
  }
};

export const MobileSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSidebarOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box className="mobile-nav" overflow="hidden" style={{ flexShrink: 0 }}>
      <Button
        onClick={handleSidebarOpen}
        variant="ghost"
        bg="surface-1"
        icon={{
          icon: isOpen ? Lucide.X : Lucide.Menu,
          "aria-hidden": false,
          alt: `${isOpen ? "Close" : "Open"} sidebar`,
        }}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", duration: 0.25 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          zIndex: 49,
          pointerEvents: "none",
        }}
      >
        <Box
          bg="surface-1"
          position="fixed"
          borderLeft="px"
          borderColor="gray-4"
          w="full"
          style={{
            height: "calc(100dvh - var(--header-height))",
            top: "var(--header-height)",
            right: "0",
          }}
        >
          <Sidebar.ScrollContainer
            w="full"
            gap="2"
            data-mobile-sidebar
            pt="4"
            pr="4"
            pl="4"
            pb="32"
            style={{
              pointerEvents: "auto",
              maxHeight: "90%",
            }}
          >
            <MobileSidebarContext.Provider
              value={{ isOpen, closeSidebar: handleSidebarOpen }}
            >
              {children}
            </MobileSidebarContext.Provider>
          </Sidebar.ScrollContainer>
          <Stack
            bg="surface-1"
            position="fixed"
            bottom="0"
            p="4"
            w="full"
            flexDirection="column"
            gap="2"
            pt="0"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              h="20"
              style={{
                background:
                  "linear-gradient(to bottom, var(--tgph-surface-1), transparent)",
                transform: "rotate(180deg)",
                transformOrigin: "top",
              }}
            />
            <Button
              as={Link}
              href="https://dashboard.knock.app/signup"
              size="2"
              variant="solid"
              color="accent"
            >
              Get started
            </Button>
            <Button
              as={Link}
              href="https://dashboard.knock.app/login"
              size="2"
              variant="outline"
            >
              Log in
            </Button>
            <Button
              as={Link}
              href="mailto:support@knock.app?subject=Support%20request"
              size="2"
              variant="ghost"
              color="gray"
            >
              Contact support
            </Button>
          </Stack>
        </Box>
      </motion.div>
    </Box>
  );
};
