import React, { useRef, useState } from "react";
import { Popover } from "@telegraph/popover";
import { SegmentedControl } from "@telegraph/segmented-control";
import { Button } from "@telegraph/button";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { TextArea } from "@telegraph/textarea";
import { Input } from "@telegraph/input";
import { MessageCircleMore, X } from "lucide-react";

interface Account {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
}

const FEEDBACK_CATEGORIES = new Map([
  ["😄", "Happy"],
  ["🙁", "Sad"],
  ["🐛", "Bug"],
  ["💡", "Idea"],
]);

type Props = {
  currentUser?: User | undefined;
  currentAccount?: Account | undefined;
};

export const Feedback = ({ currentUser, currentAccount }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackBody, setFeedbackBody] = useState<string>("");
  const [feedbackEmoji, setFeedbackEmoji] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const hasFeedback = !!feedbackBody.trim();

  const reset = () => {
    setFeedbackBody("");
    setUserEmail("");
    setFeedbackEmoji("");
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (e) e.stopPropagation();
    if (!hasFeedback) return;

    // Transform to one of expected multiple choice options by Airtable field.
    const feedbackCategory = feedbackEmoji
      ? `${feedbackEmoji} ${FEEDBACK_CATEGORIES.get(feedbackEmoji)}`
      : null;

    setIsLoading(true);

    await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedback_body: feedbackBody,
        feedback_category: feedbackCategory,
        source_url: window.location.href,
        user_id: currentUser?.id,
        user_email: userEmail,
        account_id: currentAccount?.id,
        account_name: currentAccount?.name,
      }),
    });

    setIsLoading(false);
    setIsOpen(false);
    setTimeout(reset, 2000);
  };

  return (
    <Box>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="ghost"
            color="gray"
            icon={{
              icon: MessageCircleMore,
              "aria-hidden": true,
            }}
            size="1"
          >
            Send feedback
          </Button>
        </Popover.Trigger>
        <Popover.Content style={{ padding: "0" }} initialFocus={textAreaRef}>
          <Box style={{ width: "500px", maxWidth: "95vw" }}>
            <Box p="4" position="relative">
              <Button
                position="absolute"
                top="0"
                right="0"
                variant="ghost"
                icon={{
                  icon: X,
                  "aria-hidden": false,
                  alt: "Close feedback menu",
                }}
                onClick={() => setIsOpen(false)}
              />
              <Heading as="h2" size="3">
                Contact support
              </Heading>
            </Box>
            <Box>
              <Box px="4" pb="2">
                <SegmentedControl.Root
                  name="feedback-category"
                  value={feedbackEmoji}
                  onValueChange={setFeedbackEmoji}
                  w="full"
                >
                  {Array.from(FEEDBACK_CATEGORIES.keys()).map((emoji) => (
                    <SegmentedControl.Option key={emoji} value={emoji} size="2">
                      {emoji}
                    </SegmentedControl.Option>
                  ))}
                </SegmentedControl.Root>
              </Box>
              <Box as="form" onSubmit={(e) => handleSubmit(e)} p="4">
                <Stack w="full" gap="4" flexDirection="column">
                  <Box>
                    <Text as="label" size="1" mb="2">
                      Email (if you'd like to hear back from the team)
                    </Text>
                    <Input
                      placeholder="youremail@example.com"
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </Box>
                  <Box>
                    <Text as="p" size="1" style={{ maxWidth: "80%" }} mb="2">
                      What issue are you seeing? If you're reporting a bug, what
                      are the steps you took so we can reproduce the behavior?
                    </Text>
                    <TextArea
                      as="textarea"
                      value={feedbackBody}
                      onChange={(e) => setFeedbackBody(e.target.value)}
                      ref={textAreaRef}
                      placeholder="Help us improve this page."
                      style={{ resize: "vertical" }}
                      w="full"
                    />
                  </Box>
                  <Stack alignItems="center" justifyContent="space-between">
                    <Text as="p" color="gray" size="1">
                      {" "}
                      You can also email us at{" "}
                      <Text
                        as="a"
                        href="mailto:support@knock.app"
                        target="_blank"
                        onClick={() => setIsOpen(false)}
                        rel="noreferrer"
                        color="accent"
                        size="1"
                      >
                        support@knock.app.
                      </Text>
                    </Text>
                    <Button
                      type="submit"
                      disabled={!hasFeedback || isLoading}
                      color="accent"
                    >
                      {isLoading ? "Sending..." : "Send"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Popover.Content>
      </Popover.Root>
    </Box>
  );
};
