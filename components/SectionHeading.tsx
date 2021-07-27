import React from "react";
import { useRouter } from "next/router";
import cn from "classnames";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = React.HTMLProps<HTMLHeadingElement> & {
  tag: HeadingTag;
};

const SectionHeading: React.FC<Props> = ({ id, tag, children, ...rest }) => {
  const Tag = `${tag}` as keyof Pick<JSX.IntrinsicElements, HeadingTag>;

  const [isAnchorVisible, setIsAnchorVisible] = React.useState(false);
  const { pathname } = useRouter();
  const href = id ? `${pathname}#${id}` : pathname;

  return (
    <Tag
      {...rest}
      onMouseEnter={() => setIsAnchorVisible(true)}
      onMouseLeave={() => setIsAnchorVisible(false)}
    >
      {children}

      <a
        id={id}
        href={href}
        style={{ fontSize: "80%" }}
        className={cn(
          isAnchorVisible ? "opacity-30" : "opacity-0",
          "hover:opacity-60",
          "absolute -left-6 pr-2 cursor-pointer transition-opacity"
        )}
      >
        #
      </a>
    </Tag>
  );
};

export default SectionHeading;
