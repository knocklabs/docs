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
};

const Attribute = ({
  name,
  type,
  description,
  typeSlug,
  isRequired,
}: Props) => {
  return (
    <PropertyRow.Container>
      <PropertyRow.Header>
        <PropertyRow.Name>{name}</PropertyRow.Name>
        {/* Pass an optional `typeSlug` to link the `type` to its definition in the docs*/}
        {type && <PropertyRow.Type href={typeSlug}>{type}</PropertyRow.Type>}
        {isRequired && <PropertyRow.Required />}
      </PropertyRow.Header>
      {description && (
        <PropertyRow.Description>{description}</PropertyRow.Description>
      )}
    </PropertyRow.Container>
  );
};

export { Attributes, Attribute };
