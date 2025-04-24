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
    return "enum(string)";
  }

  if (schema.type) return schema.type;
  if (schema.nullable) return "null";

  return "unknown";
}

function getTypesForDisplay(schema: OpenAPIV3.SchemaObject): string[] {
  const union = schema.anyOf || schema.oneOf || schema.allOf;

  if (union) {
    return union
      .map((item) => getTypeForDisplay(item))
      .filter((t) => t !== "null");
  }

  return [getTypeForDisplay(schema)];
}

function innerEnumSchema(schema: OpenAPIV3.SchemaObject): string[] | undefined {
  if (!schema) return undefined;

  if (schema.type === "array") {
    return innerEnumSchema(schema.items as OpenAPIV3.SchemaObject);
  }

  if (schema.type === "string" && schema.enum) {
    return schema.enum;
  }

  return undefined;
}

function innerUnionSchema(
  schema: OpenAPIV3.SchemaObject,
): OpenAPIV3.SchemaObject[] | undefined {
  if (!schema) return undefined;

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

  if (nonNullableInnerSchemas && nonNullableInnerSchemas.length > 0) {
    return nonNullableInnerSchemas as OpenAPIV3.SchemaObject[];
  }

  return nonNullableSchemas;
}

function resolveChildProperties(
  schema: OpenAPIV3.SchemaObject,
): Record<string, OpenAPIV3.SchemaObject> | undefined {
  if (!schema) return undefined;

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

const hydrateRequiredChildProperties = (
  parentSchema: OpenAPIV3.SchemaObject,
) => {
  // If this is an array schema, get properties from the items
  if (parentSchema.type === "array" && parentSchema.items) {
    const itemsSchema = parentSchema.items as OpenAPIV3.SchemaObject;
    return hydrateRequiredChildProperties(itemsSchema);
  }

  // For regular schemas, use properties directly from the schema
  const childProperties = parentSchema.properties;
  if (!childProperties) return null;

  // Extract required properties from the parent schema
  const requiredProperties = Array.isArray(parentSchema.required)
    ? parentSchema.required
    : [];

  // Process a single schema to handle required properties and recursively process nested schemas
  const processSchema = (
    schema: OpenAPIV3.SchemaObject,
    isRequired = false,
  ): OpenAPIV3.SchemaObject => {
    // Create a copy of the schema with isPropertyRequired flag
    const hydratedSchema = {
      ...schema,
      isPropertyRequired: isRequired,
    } as OpenAPIV3.SchemaObject;

    // Process nested properties if they exist
    if (schema.properties) {
      const nestedRequired = Array.isArray(schema.required)
        ? schema.required
        : [];
      const processedProperties = Object.fromEntries(
        Object.entries(schema.properties).map(([propName, propSchema]) => [
          propName,
          processSchema(
            propSchema as OpenAPIV3.SchemaObject,
            nestedRequired.includes(propName),
          ),
        ]),
      );
      hydratedSchema.properties = processedProperties;
    }

    // Process array items
    if (schema.type === "array" && schema.items) {
      const itemsSchema = schema.items as OpenAPIV3.SchemaObject;
      hydratedSchema.items = processSchema(itemsSchema);
    }

    // Process oneOf schemas
    if (schema.oneOf) {
      hydratedSchema.oneOf = schema.oneOf.map((subSchema) =>
        processSchema(subSchema as OpenAPIV3.SchemaObject),
      );
    }

    // Process anyOf schemas
    if (schema.anyOf) {
      hydratedSchema.anyOf = schema.anyOf.map((subSchema) =>
        processSchema(subSchema as OpenAPIV3.SchemaObject),
      );
    }

    // Process allOf schemas
    if (schema.allOf) {
      hydratedSchema.allOf = schema.allOf.map((subSchema) =>
        processSchema(subSchema as OpenAPIV3.SchemaObject),
      );
    }

    // Process additional properties if it's a schema
    if (
      schema.additionalProperties &&
      typeof schema.additionalProperties === "object" &&
      !(
        "type" in (schema.additionalProperties as any) ||
        "properties" in (schema.additionalProperties as any)
      )
    ) {
      hydratedSchema.additionalProperties = processSchema(
        schema.additionalProperties as OpenAPIV3.SchemaObject,
      );
    }

    return hydratedSchema;
  };

  // Process each top-level property
  return Object.fromEntries(
    Object.entries(childProperties).map(([name, property]) => [
      name,
      processSchema(property, requiredProperties.includes(name)),
    ]),
  );
};

export {
  getTypeForDisplay,
  getTypesForDisplay,
  innerUnionSchema,
  innerEnumSchema,
  maybeFlattenUnionSchema,
  resolveChildProperties,
  hydrateRequiredChildProperties,
};
