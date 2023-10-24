import React, { useRef, useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import isHotkey from "is-hotkey";
import * as Dialog from "@radix-ui/react-dialog";
import { IoCloseOutline } from "react-icons/io5";

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

const SupportModal: React.FC<Props> = ({ currentUser, currentAccount }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackBody, setFeedbackBody] = useState<string>("");
  const [feedbackEmoji, setFeedbackEmoji] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const hasFeedback = !!feedbackBody.trim();
  const hasUserEmail = !!userEmail.trim();

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
    setTimeout(reset, 2000);
  };

  return (
    <div>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <div className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 w-full">
            <a
              type="button"
              className="text-[14px] text-gray-700 dark:text-white"
            >
              <span>Support</span>
            </a>
          </div>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 " />
          <Dialog.Title />
          <Dialog.Content className="py-4 px-6 text-gray-900 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm">
            <Dialog.Title>
              <div className="flex flex-column items-center justify-between">
                <h2 className="text-gray-600 font-semibold text-[16px] dark:text-white">
                  Contact support
                </h2>
                <button
                  type="button"
                  className="text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <IoCloseOutline style={{ fontSize: "24px" }} />
                </button>
              </div>
            </Dialog.Title>

            <Dialog.Description>
              <p className="font-medium text-[14px] text-gray-600 dark:text-white">
                What issue are you seeing? If you're reporting a bug, what are
                the steps you took so we can reproduce the behavior?
              </p>
            </Dialog.Description>

            <div className="mt-5">
              <form onSubmit={() => null}>
                <div className="h-[200px]">
                  <textarea
                    className="text-gray-600 font-normal p-2 text-[14px] dark:text-white w-full h-full dark:border-gray-700 border border-gray-200 dark:bg-gray-800 focus-visible:outline-none rounded-sm"
                    value={feedbackBody}
                    onChange={(e) => setFeedbackBody(e.target.value)}
                    onKeyDown={(e) => isSubmitHotkey(e) && handleSubmit()}
                    ref={textAreaRef}
                    placeholder="Help us improve this page."
                    style={{ resize: "vertical" }}
                  />
                </div>
                <div className="flex mt-5 items-center justify-between">
                  <div className="flex items-center mr-5">
                    <input
                      className="text-gray-600 bg-white border border-gray-200 p-1 h-7 w-[215px] text-[12px] rounded-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus-visible:outline-none"
                      placeholder="youremail@example.com"
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <RadioGroup.Root
                      name="feedback-category"
                      className="flex space-x-1 ml-2"
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
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-600 font-normal text-[12px] dark:text-white">
                      {" "}
                      You can also email us at{" "}
                      <a
                        href="mailto:support@knock.app"
                        target="_blank"
                        onClick={() => setIsOpen(false)}
                        className="text-[12px] text-gray-700 dark:text-white hover:underline"
                        rel="noreferrer"
                      >
                        support@knock.app.
                      </a>
                    </p>
                    <button
                      type="submit"
                      disabled={!hasFeedback || !hasUserEmail || isLoading}
                      className="bg-brand text-white text-[14px] px-2 py-1 ml-3 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Sending" : "Send"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default SupportModal;
