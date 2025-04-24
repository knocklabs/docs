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
  hydrateRequiredChildProperties,
} from "./helpers";
import { useApiReference } from "../ApiReferenceContext";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  name?: string;
  schema: OpenAPIV3.SchemaObject;
};

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

  const isRequired =
    (schema as any).isPropertyRequired ||
    (!Array.isArray(schema.required) && schema.required);

  const hydratedChildProperties = !!maybeChildProperties
    ? hydrateRequiredChildProperties(schema)
    : null;

  return (
    <PropertyRow.Container>
      <PropertyRow.Header>
        {name && <PropertyRow.Name>{name}</PropertyRow.Name>}
        <PropertyRow.Types>
          {typesForDisplay.length === 1 && (
            <PropertyRow.Type
              key={typesForDisplay[0]}
              href={schemaReferences[typesForDisplay[0]]}
            >
              {typesForDisplay[0]}
            </PropertyRow.Type>
          )}

          {typesForDisplay.length > 1 && (
            <Text as="span" size="0">
              {typesForDisplay.length} possible types
            </Text>
          )}
        </PropertyRow.Types>
        {isRequired && <PropertyRow.Required>Required</PropertyRow.Required>}
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

          <AnimatePresence initial={false}>
            <motion.div
              key="values"
              initial={false}
              animate={{
                height: isChildPropertiesOpen ? "auto" : 0,
                opacity: isChildPropertiesOpen ? 1 : 0,
                visibility: isChildPropertiesOpen ? "visible" : "hidden",
              }}
              transition={{ duration: 0.2 }}
            >
              <Stack flexWrap="wrap" gap="1" mt="2">
                {maybeEnum.map((item) => (
                  <PropertyRow.PropertyTag key={item}>
                    {item}
                  </PropertyRow.PropertyTag>
                ))}
              </Stack>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {hydratedChildProperties && (
        <>
          <PropertyRow.ExpandableButton
            isOpen={isChildPropertiesOpen}
            onClick={() => setIsChildPropertiesOpen(!isChildPropertiesOpen)}
          >
            {isChildPropertiesOpen ? "Hide properties" : "Show properties"}
          </PropertyRow.ExpandableButton>

          <AnimatePresence initial={false}>
            <motion.div
              key="child-properties"
              initial={false}
              animate={{
                height: isChildPropertiesOpen ? "auto" : 0,
                opacity: isChildPropertiesOpen ? 1 : 0,
                visibility: isChildPropertiesOpen ? "visible" : "hidden",
              }}
              transition={{ duration: 0.2 }}
            >
              {Object.entries(hydratedChildProperties).map(
                ([name, property]) => (
                  <SchemaProperty
                    key={name}
                    name={name}
                    schema={property as OpenAPIV3.SchemaObject}
                  />
                ),
              )}
            </motion.div>
          </AnimatePresence>
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
          <AnimatePresence initial={false}>
            <motion.div
              initial={false}
              animate={{
                height: isPossibleTypesOpen ? "auto" : 0,
                opacity: isPossibleTypesOpen ? 1 : 0,
                visibility: isPossibleTypesOpen ? "visible" : "hidden",
              }}
              transition={{ duration: 0.2 }}
            >
              <PropertyRow.ChildProperties>
                {isPossibleTypesOpen &&
                  maybeFlattenUnionSchema(maybeUnion).map((item) => (
                    <SchemaProperty key={item.type} schema={item} />
                  ))}
              </PropertyRow.ChildProperties>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </PropertyRow.Container>
  );
};

export default SchemaProperty;
