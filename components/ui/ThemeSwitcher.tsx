import { Button } from "@telegraph/button";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme/ThemeProvider";

export const ThemeSwitcher = () => {
  const { appearance, toggleAppearance } = useTheme();

  const isDark = appearance === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      variant="ghost"
      size="1"
      color="gray"
      iconOnly
      onClick={toggleAppearance}
      icon={{
        icon: isDark ? Sun : Moon,
        alt: label,
        "aria-hidden": false,
      }}
      aria-label={label}
      title={label}
    />
  );
};
