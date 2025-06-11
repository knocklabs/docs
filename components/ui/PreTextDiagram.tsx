import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  description: string;
};

const PreTextDiagram = ({ children, description }: Props) => {
  return (
    <pre
      role="img"
      aria-label={description}
      style={{
        marginLeft: "16px",
        marginRight: "16px",
        marginBottom: "16px",
        whiteSpace: "pre",
        fontSize: "14px",
        lineHeight: "18px",
      }}
    >
      {children}
    </pre>
  );
};

export { PreTextDiagram };
