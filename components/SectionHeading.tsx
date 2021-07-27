import React from "react";
import { useRouter } from "next/router";
import cn from "classnames";

const CLASS_SELECTOR = "section-heading";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = React.HTMLProps<HTMLHeadingElement> & {
  tag: HeadingTag;
};

const SectionHeading: React.FC<Props> = ({ id, tag, children, className, ...rest }) => {
  const Tag = `${tag}` as keyof Pick<JSX.IntrinsicElements, HeadingTag>;
  const { pathname } = useRouter();
  const href = id ? `#${id}` : pathname;

  return (
    <Tag
      {...rest}
      id={id}
      className={cn(CLASS_SELECTOR, className)}
    >
      {children}

      <a
        id={id}
        href={href}
        style={{ color: "inherit", textDecoration: "none" }}
        className="absolute -left-6 pr-3 cursor-pointer"
      />
    </Tag>
  );
};

export default SectionHeading;
