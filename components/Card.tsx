import { ReactElement } from "react";
import clsx from "classnames";

type Props = {
  emoji?: string;
  title: string;
  linkUrl: string;
  footer?: ReactElement;
  isExternal?: boolean;
};

const CardGroup = ({ children, cols = 2 }) => (
  <div
    className={clsx(`grid gap-2`, {
      "grid-cols-2": cols == 2,
      "grid-cols-3": cols == 3,
    })}
  >
    {children}
  </div>
);

const Card: React.FC<Props> = ({
  emoji,
  title,
  children,
  footer,
  linkUrl,
  isExternal = false,
}) => (
  <div className="rounded-md border border-gray-200 hover:border-gray-400 dark:border-gray-600 hover:dark:border-gray-400 transition-colors flex h-full">
    <a
      target={isExternal ? "_blank" : undefined}
      href={linkUrl}
      title={title}
      className="!no-underline !text-inherit w-full p-3"
    >
      <>
        {emoji && <div className="mb-1">{emoji}</div>}

        <div className="mb-1">
          <span className="text-brand text-[15px] font-semibold">{title}</span>
        </div>

        {children && <div className="not-prose text-[14px]">{children}</div>}

        {footer && <div className="flex items-center">{footer}</div>}
      </>
    </a>
  </div>
);

export { Card, CardGroup };
