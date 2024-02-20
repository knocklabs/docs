import { ReactElement } from "react";
import { IoCode } from "react-icons/io5";

type Props = {
  title: string;
  linkUrl: string;
  footer: ReactElement;
};

const CardGroup = ({ children }) => (
  <div className="grid grid-cols-3 gap-2">{children}</div>
);

const Card: React.FC<Props> = ({ title, footer, linkUrl }) => (
  <div className="rounded-md border border-gray-200 dark:border-gray-600 p-3">
    <a href={linkUrl} title={title} className="!no-underline !text-inherit">
      <span>
        <div className="mb-3">
          <span>{title}</span>
        </div>
        <div className="flex items-center">{footer}</div>
      </span>
    </a>
  </div>
);

export { Card, CardGroup };
