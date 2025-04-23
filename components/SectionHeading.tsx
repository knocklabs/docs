import React, { useEffect, useState } from "react";
import useClipboard from "react-use-clipboard";
import cn from "classnames";
import { highlightResource } from "./ui/Page/helpers";

const CLASS_SELECTOR = "section-heading";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = React.HTMLProps<HTMLHeadingElement> & {
  tag: HeadingTag;
  path?: string;
};

const SectionHeading: React.FC<Props> = ({
  id,
  tag,
  children,
  className,
  path,
  ...rest
}) => {
  const [targetUrl, setTargetUrl] = useState("");
  const [, onCopy] = useClipboard(targetUrl, { successDuration: 2000 });

  // Wait for client to load before setting the target URL
  useEffect(() => {
    if (path) {
      const url = window.location.origin + "/" + window.location.pathname.split('/')[1] + path;
      setTargetUrl(url);
    }
  }, [path]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (path) {
      highlightResource(path, { moveToItem: true, replaceUrl: targetUrl });
    }
    onCopy();
  };

  const Tag = `${tag}` as keyof Pick<JSX.IntrinsicElements, HeadingTag>;

  return (
    <Tag {...rest} id={id} className={cn(CLASS_SELECTOR, className)}>
      {children}

      {targetUrl && (
        <a
          href={targetUrl}
          style={{ color: "inherit", textDecoration: "none" }}
          className="absolute -left-4 lg:-left-6 pr-1 lg:pr-3 cursor-pointer"
          onClick={handleClick}
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
