import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Icon } from "@telegraph/icon";
import { Sparkles } from "lucide-react";
import { useAskAi } from "../AskAiContext";

function AskAiButton() {
  const { toggleSidebar } = useAskAi();

  return (
    <Button variant="outline" size="2" borderRadius="2" onClick={toggleSidebar}>
      <Stack direction="row" alignItems="center" gap="2">
        <Icon icon={Sparkles} alt="Sparkles" size="1" />
        <span>Ask AI</span>
      </Stack>
    </Button>
  );
}

export default AskAiButton;
