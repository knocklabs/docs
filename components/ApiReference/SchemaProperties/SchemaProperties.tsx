import { OpenAPIV3 } from "@scalar/openapi-types";
import SchemaProperty from "./SchemaProperty";
import { PropertyRow } from "./PropertyRow";

type Props = {
  schema: OpenAPIV3.SchemaObject;
  hideRequired?: boolean;
};

const SchemaProperties = ({ schema, hideRequired = false }: Props) => {
  return (
    <PropertyRow.Wrapper>
      {Object.entries(schema.properties || {}).map(
        ([propertyName, property]) => (
          <SchemaProperty
            key={propertyName}
            name={propertyName}
            schema={{
              ...(property as OpenAPIV3.SchemaObject),
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
            description: "Any additional properties are allowed",
            additionalProperties: schema.additionalProperties,
          }}
        />
      )}
    </PropertyRow.Wrapper>
  );
};

export default SchemaProperties;
