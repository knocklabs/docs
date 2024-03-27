import clsx from "classnames";
import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";

const AccordionGroup = ({ children }) => (
  <div
    className="[&>div]:border-0 [&>div]:rounded-none [&>div>button]:rounded-none [&>div]:mb-0 overflow-hidden mt-0 mb-3 rounded-xl divide-y divide-inherit border dark:border-zinc-800"
    role="list"
  >
    {children}
  </div>
);

type AccordionProps = {
  title: string;
  description?: string;
  defaultOpen?: boolean;
};

const Accordion = ({ children, title, description, defaultOpen = false }) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <div role="listitem">
      <button
        onClick={() => setOpen(!open)}
        aria-controls={title + "Children"}
        aria-expanded={open}
        className="py-4 px-5 space-x-2 hover:bg-gray-100 hover:dark:bg-gray-800 rounded-t-xl w-full flex items-center transition-colors"
      >
        <IoChevronForward
          className={clsx(
            "mr-2 flex-shrink-0 transition-all",
            !open && "rotate-0",
            open && "rotate-90",
          )}
        />
        <div className="leading-tight text-left">
          <span className="block m-0 font-medium text-gray-900 dark:text-gray-200">
            {title}
          </span>
          {description ? (
            <p className="!m-0 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          ) : null}
        </div>
      </button>
      <div className={clsx("mt-2 mb-4 mx-6", !open && "hidden")}>
        {children}
      </div>
    </div>
  );
};

export { AccordionGroup, Accordion };
