import React, { useRef, useState } from "react";
import { useRadio, useRadioGroup, UseRadioProps } from "@chakra-ui/react";
import { Popover, PopoverContent, PopoverTrigger, } from "@chakra-ui/popover";
import { Box, Flex, HStack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Textarea } from "@chakra-ui/textarea";
import { useToast } from "@chakra-ui/toast";
import { Portal } from "@chakra-ui/portal";
import { IoMegaphone } from "react-icons/io5";
import { motion } from "framer-motion";
import isHotkey from 'is-hotkey'

const FEEDBACK_CATEGORIES = new Map([
  ['😄', 'Happy'],
  ['🙁', 'Sad'],
  ['🐛', 'Bug'],
  ['💡', 'Idea'],
]);

const FeedbackPopover: React.FC<{}> = ({ currentUser, currentAccount }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackBody, setFeedbackBody] = useState<string>('');
  const [feedbackEmoji, setFeedbackEmoji] = useState<string>('');

  const toast = useToast();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "feedback-category",
    value: feedbackEmoji,
    onChange: setFeedbackEmoji,
  })

  const isSubmitHotkey = isHotkey('mod+enter')
  const hasFeedback = !!feedbackBody.trim()

  const reset = () => {
    setFeedbackBody('')
    setFeedbackEmoji('')
    setIsOpen(false)
    setIsSubmitted(false)
    setIsLoading(false)
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    if (e) e.stopPropagation()
    if (!hasFeedback) return

    // Transform to one of expected multiple choice options by Airtable field.
    const feedbackCategory = feedbackEmoji
      ? `${feedbackEmoji} ${FEEDBACK_CATEGORIES.get(feedbackEmoji)}`
      : null

    setIsLoading(true);

    const resp = await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedback_body: feedbackBody,
        feedback_category: feedbackCategory,
        source_url: window.location.href,
        user_id: currentUser?.id,
        user_email: currentUser?.email,
        account_id: currentAccount?.id,
        account_name: currentAccount?.name,
      }),
    });

    setIsLoading(false);

    const { error } = await resp.json();
    if (error) {
      return toast({
        title: error,
        status: "error",
        position: "bottom-right"
      });
    }

    setIsOpen(false);
    setIsSubmitted(true);
    setTimeout(reset, 2000);
  }

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={textAreaRef}
      onClose={() => setIsOpen(false)}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <Flex
          height="100%"
          alignItems="center"
          fontWeight="medium"
          fontSize={14}
          lineHeight={1.5}
        >
          {isSubmitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Text px={4} color="#248F54">
                Thanks for the feedback!
              </Text>
            </motion.div>
          ) : (
            <Button
              aria-label="Send feedback"
              variant="ghost"
              color="gray.500"
              size="md"
              fontSize="inherit"
              leftIcon={<Icon as={IoMegaphone} color="#8992A1" />}
              onClick={() => setIsOpen(true)}
              // XXX:
              _hover={{ bg: "none" }}
              _active={{ bg: "none" }}
            >
              Feedback?
            </Button>
          )}
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          p={3}
          flexDirection="column"
          justifyContent="space-between"
          width="372px"
          // XXX:
          // height="152px"
          _focus={{ outline: "none" }}
        >
          <form onSubmit={handleSubmit}>
            <Textarea
              p={0}
              size="sm"
              variant="unstyled"
              // fontWeight="medium"
              color="gray.600"
              value={feedbackBody}
              onChange={e => setFeedbackBody(e.target.value)}
              onKeyDown={e => isSubmitHotkey(e) && handleSubmit()}
              ref={textAreaRef}
              placeholder="Help us improve this page."
              resize="none"
            />
            <Flex mt={3} justifyContent="space-between">
              <HStack {...getRootProps()} spacing={1}>
                {Array.from(FEEDBACK_CATEGORIES.keys()).map(emoji =>
                  <EmojiRadio key={emoji} {...getRadioProps({ value: emoji })} />
                )}
              </HStack>
              <Button
                isLoading={isLoading}
                loadingText="Sending"
                type="submit"
                size="sm"
                colorScheme="brand"
                isDisabled={!hasFeedback}
              >
                Send
              </Button>
            </Flex>
          </form>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

const EmojiRadio = (props: UseRadioProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  return (
    <Box as="label">
      <input {...getInputProps()} />
      <Box
        {...getCheckboxProps()}
        cursor="pointer"
        textAlign="center"
        borderWidth="1px"
        borderRadius="base"
        boxShadow="sm"
        boxSize="28px"
        _checked={{ borderColor: "brand.600" }}
        _focus={{ boxShadow: "outline" }}
      >
        {props.value}
      </Box>
    </Box>
  );
}

export default FeedbackPopover;
