type Debounced<T extends (...args: any[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  /** Drop a pending call — use it when the caller unmounts. */
  cancel: () => void;
};

export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): Debounced<T> => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
};
