import React, { useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as RadioGroup from "@radix-ui/react-radio-group";
import FocusLock from "react-focus-lock";
import { motion } from "framer-motion";
import isHotkey from "is-hotkey";

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

const isSubmitHotkey = isHotkey("mod+enter");

type Props = {
  currentUser?: User | undefined;
  currentAccount?: Account | undefined;
};

const FeedbackPopover: React.FC<Props> = ({ currentUser, currentAccount }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackBody, setFeedbackBody] = useState<string>("");
  const [feedbackEmoji, setFeedbackEmoji] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const hasFeedback = !!feedbackBody.trim();
  const hasUserEmail = !!userEmail.trim();

  const reset = () => {
    setFeedbackBody("");
    setFeedbackEmoji("");
    setUserEmail("");
    setIsOpen(false);
    setIsSubmitted(false);
    setIsLoading(false);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (e) e.stopPropagation();
    if (!hasFeedback) return;
    if (!hasUserEmail) return;

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
    setIsSubmitted(true);
    setTimeout(reset, 2000);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        {isSubmitted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-[#248F54] text-[14px]">
              Thanks for the feedback!
            </span>
          </motion.div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-full items-center font-medium text-[14px] leading-[21px] text-gray-500 dark:text-white"
          >
            Feedback
          </button>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          className="p-3 flex flex-col justify-between w-[330px] h-[172px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
        >
          <FocusLock>
            <form onSubmit={handleSubmit}>
              <textarea
                className="text-gray-600 font-normal p-2 text-[14px] w-full bg-transparent h-[80px] focus:border-none border-none focus-visible:outline-none dark:text-white"
                value={feedbackBody}
                onChange={(e) => setFeedbackBody(e.target.value)}
                onKeyDown={(e) => isSubmitHotkey(e) && handleSubmit()}
                ref={textAreaRef}
                placeholder="Help us improve this page."
                style={{ resize: "none" }}
              />
              <RadioGroup.Root
                name="feedback-category"
                className="flex space-x-1"
              >
                {Array.from(FEEDBACK_CATEGORIES.keys()).map((emoji) => (
                  <RadioGroup.Item
                    key={emoji}
                    value={emoji}
                    className="text-center w-7 h-7 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-blue-400 radix-state-checked:!border-brand"
                  >
                    {emoji}
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>

              <div className="flex mt-1 justify-between">
                <input
                  className="text-gray-600 bg-white border border-gray-200 p-1 h-7 w-[215px] text-[12px] rounded-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="youremail@example.com"
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!hasFeedback || !hasUserEmail}
                  className="bg-brand text-white text-[14px] px-2 py-1 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending" : "Send"}
                </button>
              </div>
            </form>
          </FocusLock>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default FeedbackPopover;
