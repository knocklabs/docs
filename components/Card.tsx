import { ReactElement } from "react";
import clsx from "classnames";

type Props = {
  icon: ReactElement;
  title: string;
  linkUrl: string;
  footer: ReactElement;
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

const Card: React.FC<Props> = ({ emoji, title, children, footer, linkUrl }) => (
  <div className="rounded-md border border-gray-200 hover:border-gray-400 dark:border-gray-600 hover:dark:border-gray-400 transition-colors p-3">
    <a href={linkUrl} title={title} className="!no-underline !text-inherit">
      <>
        {emoji && <div className="mb-1">{emoji}</div>}

        <div className="mb-1">
          <span className="text-brand text-[14px] font-semibold">{title}</span>
        </div>

        <div className="not-prose text-[14px]">{children}</div>

        <div className="flex items-center">{footer}</div>
      </>
    </a>
  </div>
);

export { Card, CardGroup };
