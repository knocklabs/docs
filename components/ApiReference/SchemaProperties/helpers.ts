import { OpenAPIV3 } from "@scalar/openapi-types";

function getTypeForDisplay(schema: OpenAPIV3.SchemaObject): string {
  if (schema.type === "array" && schema.items) {
    // Get the inner type of the array
    const innerType = getTypeForDisplay(schema.items);
    return `${innerType}[]`;
  }

  if (schema.title) return schema.title;
  if (schema.type === "object" && schema.additionalProperties)
    return "object(any)";

  if (schema.type === "string" && schema.format) {
    return `string(${schema.format})`;
  }

  if (schema.type === "string" && schema.enum) {
    return "string(enum)";
  }

  if (schema.type) return schema.type;
  if (schema.nullable) return "null";

  return "unknown";
}

function getTypesForDisplay(schema: OpenAPIV3.SchemaObject): string[] {
  const union = schema.anyOf || schema.oneOf || schema.allOf;

  if (union) {
    return union.map((item) => getTypeForDisplay(item));
  }

  return [getTypeForDisplay(schema)];
}

function innerUnionSchema(
  schema: OpenAPIV3.SchemaObject,
): OpenAPIV3.SchemaObject[] | undefined {
  if (schema.type === "array") {
    return innerUnionSchema(schema.items as OpenAPIV3.SchemaObject);
  }

  if (schema.anyOf) return schema.anyOf;
  if (schema.oneOf) return schema.oneOf;
  if (schema.allOf) return schema.allOf;

  return undefined;
}

function maybeFlattenUnionSchema(
  schemas: OpenAPIV3.SchemaObject[],
): OpenAPIV3.SchemaObject[] {
  const nonNullableSchemas = schemas.filter(
    (schema) => schema.nullable !== true,
  );

  const nonNullableInnerSchemas = nonNullableSchemas
    .map((schema) => innerUnionSchema(schema))
    .flat()
    .filter((schema) => schema !== undefined);

  if (nonNullableInnerSchemas.length > 0) return nonNullableInnerSchemas;

  return nonNullableSchemas;
}

function resolveChildProperties(
  schema: OpenAPIV3.SchemaObject,
): Record<string, OpenAPIV3.SchemaObject> | undefined {
  if (schema.type === "array") {
    return resolveChildProperties(schema.items as OpenAPIV3.SchemaObject);
  }

  if (schema.type === "object" && schema.properties) {
    return schema.properties;
  }

  if (
    schema.type === "object" &&
    schema.additionalProperties &&
    typeof schema.additionalProperties === "object"
  ) {
    return {
      string: schema.additionalProperties,
    };
  }

  return undefined;
}

export {
  getTypeForDisplay,
  getTypesForDisplay,
  innerUnionSchema,
  maybeFlattenUnionSchema,
  resolveChildProperties,
};
