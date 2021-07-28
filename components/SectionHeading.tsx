import React from "react";
import { useRouter } from "next/router";
import { useClipboard } from "@chakra-ui/react";
import cn from "classnames";

const CLASS_SELECTOR = "section-heading";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = React.HTMLProps<HTMLHeadingElement> & {
  tag: HeadingTag;
};

const SectionHeading: React.FC<Props> = ({
  id,
  tag,
  children,
  className,
  ...rest
}) => {
  const { pathname } = useRouter();
  const targetPath = id ? `${pathname}#${id}` : pathname;

  const targetUrl = global.window ? window.location.origin + targetPath : "";
  const { onCopy } = useClipboard(targetUrl);

  const Tag = `${tag}` as keyof Pick<JSX.IntrinsicElements, HeadingTag>;

  return (
    <Tag {...rest} id={id} className={cn(CLASS_SELECTOR, className)}>
      {children}

      <a
        id={id}
        href={targetPath}
        style={{ color: "inherit", textDecoration: "none" }}
        className="absolute -left-6 pr-3 cursor-pointer"
        onClick={onCopy}
      >
        <span />
      </a>
    </Tag>
  );
};

export default SectionHeading;
