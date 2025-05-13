import { useRef, useState, useEffect } from "react";

type UseClipboardOptions = {
  successDuration?: number; // in milliseconds
};

export function useClipboard(
  content: string,
  options: UseClipboardOptions = {},
) {
  const { successDuration = 2000 } = options;
  const [isCopied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = () => {
    window.navigator.clipboard.writeText(content);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, successDuration);
  };

  return [isCopied, copy];
}
