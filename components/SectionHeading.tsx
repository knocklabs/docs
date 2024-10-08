import React from "react";
import useClipboard from "react-use-clipboard";
import cn from "classnames";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname() ?? "/";
  const targetPath = id ? `${pathname}#${id}` : pathname;

  const targetUrl = global.window ? window.location.origin + targetPath : "";
  const [, onCopy] = useClipboard(targetUrl, { successDuration: 2000 });

  const Tag = `${tag}` as keyof Pick<JSX.IntrinsicElements, HeadingTag>;

  return (
    <Tag {...rest} id={id} className={cn(CLASS_SELECTOR, className)}>
      {children}

      {id && (
        <a
          href={targetPath}
          style={{ color: "inherit", textDecoration: "none" }}
          className="absolute -left-4 lg:-left-6 pr-1 lg:pr-3 cursor-pointer"
          onClick={onCopy}
        >
          <span
            className="invisible"
            aria-label={`Jump link to ${children} section`}
          />
        </a>
      )}
    </Tag>
  );
};

export default SectionHeading;
