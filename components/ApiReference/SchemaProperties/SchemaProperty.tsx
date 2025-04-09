import { OpenAPIV3 } from "@scalar/openapi-types";
import { PropertyRow } from "./PropertyRow";
import { useState } from "react";
import Markdown from "react-markdown";
import {
  getTypesForDisplay,
  innerEnumSchema,
  innerUnionSchema,
  maybeFlattenUnionSchema,
  resolveChildProperties,
} from "./helpers";
import { useApiReference } from "../ApiReferenceContext";

type Props = {
  name?: string;
  schema: OpenAPIV3.SchemaObject;
};

const MAX_TYPES_TO_DISPLAY = 2;

const SchemaProperty = ({ name, schema }: Props) => {
  const { schemaReferences } = useApiReference();
  const [isPossibleTypesOpen, setIsPossibleTypesOpen] = useState(false);
  const [isChildPropertiesOpen, setIsChildPropertiesOpen] = useState(false);
  // If the schema is an array, then we want to show the possible types that the array can contain.
  // Otherwise, we want to show the possible types that the schema can be
  const maybeUnion = innerUnionSchema(schema);
  const maybeEnum = innerEnumSchema(schema);
  const maybeChildProperties = resolveChildProperties(schema);

  const typesForDisplay = getTypesForDisplay(schema);
  const hasAdditionalTypes = typesForDisplay.length > MAX_TYPES_TO_DISPLAY;

  return (
    <PropertyRow.Container>
      <PropertyRow.Header>
        {name && <PropertyRow.Name>{name}</PropertyRow.Name>}
        <PropertyRow.Types>
          {typesForDisplay.slice(0, MAX_TYPES_TO_DISPLAY).map((type) => (
            <PropertyRow.Type key={type} href={schemaReferences[type]}>
              {type}
            </PropertyRow.Type>
          ))}
          {hasAdditionalTypes && (
            <span className="text-xs text-gray-500 dark:text-gray-300">
              +{typesForDisplay.length - MAX_TYPES_TO_DISPLAY} more
            </span>
          )}
        </PropertyRow.Types>
        {schema.required && (
          <PropertyRow.Required>Required</PropertyRow.Required>
        )}
      </PropertyRow.Header>

      {schema.description && (
        <PropertyRow.Description>
          <Markdown>{schema.description}</Markdown>
        </PropertyRow.Description>
      )}

      {maybeEnum && (
        <>
          <PropertyRow.ExpandableButton
            isOpen={isChildPropertiesOpen}
            onClick={() => setIsChildPropertiesOpen(!isChildPropertiesOpen)}
          >
            {isChildPropertiesOpen ? "Hide values" : "Show values"}
          </PropertyRow.ExpandableButton>

          {isChildPropertiesOpen && (
            <div className="flex flex-wrap gap-1 mt-2">
              {maybeEnum.map((item) => (
                <PropertyRow.PropertyTag key={item}>
                  {item}
                </PropertyRow.PropertyTag>
              ))}
            </div>
          )}
        </>
      )}

      {maybeChildProperties && (
        <>
          <PropertyRow.ExpandableButton
            isOpen={isChildPropertiesOpen}
            onClick={() => setIsChildPropertiesOpen(!isChildPropertiesOpen)}
          >
            {isChildPropertiesOpen ? "Hide properties" : "Show properties"}
          </PropertyRow.ExpandableButton>

          {isChildPropertiesOpen && (
            <PropertyRow.ChildProperties>
              {Object.entries(maybeChildProperties).map(([name, property]) => (
                <SchemaProperty key={name} name={name} schema={property} />
              ))}
            </PropertyRow.ChildProperties>
          )}
        </>
      )}

      {maybeUnion && (
        <>
          <PropertyRow.ExpandableButton
            isOpen={isPossibleTypesOpen}
            onClick={() => setIsPossibleTypesOpen(!isPossibleTypesOpen)}
          >
            {isPossibleTypesOpen
              ? "Hide possible types"
              : "Show possible types"}
          </PropertyRow.ExpandableButton>
          {isPossibleTypesOpen && (
            <PropertyRow.ChildProperties>
              {maybeFlattenUnionSchema(maybeUnion).map((item) => (
                <SchemaProperty key={item.type} schema={item} />
              ))}
            </PropertyRow.ChildProperties>
          )}
        </>
      )}
    </PropertyRow.Container>
  );
};

export default SchemaProperty;
