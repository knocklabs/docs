import { useState } from "react";
import { motion } from "framer-motion";
import { PropertyRow } from "./ApiReference/SchemaProperties/PropertyRow";

const Attributes = ({ children }) => {
  return <PropertyRow.Wrapper>{children}</PropertyRow.Wrapper>;
};

type Props = {
  name: string;
  type: string;
  description: string;
  typeSlug?: string;
  nameSlug?: string;
  isRequired?: boolean;
  /** When provided, shows a "Show X" / "Hide X" toggle and renders children in a collapsible section. */
  expandLabel?: string;
  children?: React.ReactNode;
};

const Attribute = ({
  name,
  type,
  description,
  typeSlug,
  isRequired,
  expandLabel,
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasNested = !!expandLabel && !!children;

  return (
    <PropertyRow.Container>
      <PropertyRow.Header>
        <PropertyRow.Name>{name}</PropertyRow.Name>
        {/* Pass an optional `typeSlug` to link the `type` to its definition in the docs */}
        {type && <PropertyRow.Type href={typeSlug}>{type}</PropertyRow.Type>}
        {isRequired && <PropertyRow.Required />}
      </PropertyRow.Header>
      {description && (
        <PropertyRow.Description>{description}</PropertyRow.Description>
      )}
      {hasNested && (
        <>
          <PropertyRow.ExpandableButton
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? `Hide ${expandLabel}` : `Show ${expandLabel}`}
          </PropertyRow.ExpandableButton>
          <motion.div
            initial={false}
            animate={{
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? "visible" : "hidden",
            }}
            transition={{ duration: 0.2 }}
          >
            <PropertyRow.ChildProperties>
              {children}
            </PropertyRow.ChildProperties>
          </motion.div>
        </>
      )}
    </PropertyRow.Container>
  );
};

export { Attributes, Attribute };
