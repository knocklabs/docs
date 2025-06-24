import { Code } from "@telegraph/typography";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  description: string;
};

const PreTextDiagram = ({ children, description }: Props) => {
  return (
    <Code
      as="pre"
      role="img"
      aria-label={description}
      mx="4"
      mb="4"
      leading="1"
    >
      {children}
    </Code>
  );
};

export { PreTextDiagram };
