import { Button } from "@telegraph/button";
import { Sparkles } from "lucide-react";
import { useAskAi } from "../AskAiContext";

function AskAiButton() {
  const { toggleSidebar } = useAskAi();

  return (
    <Button
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
