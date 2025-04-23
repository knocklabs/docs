import React, { useEffect, useState } from "react";
import useClipboard from "react-use-clipboard";
import { highlightResource } from "./Page/helpers";
import { Heading } from "@telegraph/typography";
import { TgphComponentProps } from "@telegraph/helpers";

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
      const url =
        window.location.origin +
        "/" +
        window.location.pathname.split("/")[1] +
        path;
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

  const size =
    tag === "h1"
      ? "6"
      : tag === "h2"
      ? "6"
      : tag === "h3"
      ? "5"
      : tag === "h4"
      ? "4"
      : tag === "h5"
      ? "4"
      : "4";

  return (
    // @ts-expect-error shut it
    <Heading as={tag} size={size} mb="4" {...rest} id={id}>
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
    </Heading>
  );
};

export default SectionHeading;
