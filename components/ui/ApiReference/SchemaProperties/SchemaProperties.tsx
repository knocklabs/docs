import { OpenAPIV3 } from "@scalar/openapi-types";
import SchemaProperty from "./SchemaProperty";
import { PropertyRow } from "./PropertyRow";

type Props = {
  schema: OpenAPIV3.SchemaObject;
  hideRequired?: boolean;
};

const SchemaProperties = ({ schema, hideRequired = false }: Props) => {
  const unionSchema = schema.oneOf || schema.anyOf || schema.allOf;
  const onlyUnion =
    unionSchema && !schema.properties && !schema.additionalProperties;

  return (
    <PropertyRow.Wrapper>
      {Object.entries(schema.properties || {}).map(
        ([propertyName, property]: [string, OpenAPIV3.SchemaObject]) => (
          <SchemaProperty
            key={propertyName}
            name={propertyName}
            schema={{
              ...property,
              // @ts-ignore
              required: !hideRequired
                ? property.required || schema.required?.includes(propertyName)
                : false,
            }}
          />
        ),
      )}
      {schema.additionalProperties && (
        <SchemaProperty
          name="*"
          schema={{
            type: "object",
            description: "Any additional custom properties.",
            additionalProperties: schema.additionalProperties,
          }}
        />
      )}

      {/* If the schema is a union, we want to show the schema as a whole */}
      {onlyUnion && <SchemaProperty name={schema.title} schema={schema} />}
    </PropertyRow.Wrapper>
  );
};

export default SchemaProperties;
