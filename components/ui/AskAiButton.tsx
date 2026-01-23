import { Button } from "@telegraph/button";
import { Sparkles } from "lucide-react";
import { useAskAi } from "../AskAiContext";
// import { useDarkMode } from "../../hooks/useDarkMode";

function AskAiButton() {
  const { toggleSidebar } = useAskAi();
  //const isDark = useDarkMode();

  return (
    <Button
      // variant={isDark ? "soft" : "solid"}
      variant="solid"
      size="1"
      onClick={toggleSidebar}
      leadingIcon={{
        icon: Sparkles,
        "aria-hidden": true,
      }}
    >
      Ask AI
    </Button>
  );
}

export default AskAiButton;
