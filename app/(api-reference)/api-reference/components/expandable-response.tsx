"use client";

import { useState } from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Text, Code } from "@telegraph/typography";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ExpandableResponseProps {
  responseSchema: OpenAPIV3.SchemaObject;
  schemaReferences: Record<string, string>;
}

export function ExpandableResponse({
  responseSchema,
  schemaReferences,
}: ExpandableResponseProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const schemaRef = schemaReferences[responseSchema.title ?? ""];

  return (
    <Box py="3" borderBottom="px" borderColor="gray-3">
      <Stack direction="column" gap="1">
        <Stack direction="row" alignItems="center" gap="2">
          {schemaRef ? (
            <Link
              href={schemaRef}
              className="text-blue-600 hover:text-blue-700 font-mono text-sm"
            >
              {responseSchema.title}
            </Link>
          ) : (
            <Code as="span" size="1">
              {responseSchema.title}
            </Code>
          )}
        </Stack>
        {responseSchema.description && (
          <Text as="p" size="2" color="gray">
            {responseSchema.description}
          </Text>
        )}

        {responseSchema.properties && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {isExpanded ? "Hide properties" : "Show properties"}
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Box mt="3" pl="4" borderLeft="2" borderColor="gray-3">
                    <SchemaPropertiesClient
                      schema={responseSchema}
                      schemaReferences={schemaReferences}
                      hideRequired
                    />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </Stack>
    </Box>
  );
}

// Inline client version of schema properties for nested rendering
function SchemaPropertiesClient({
  schema,
  schemaReferences,
  hideRequired = false,
}: {
  schema: OpenAPIV3.SchemaObject;
  schemaReferences: Record<string, string>;
  hideRequired?: boolean;
}) {
  return (
    <Box>
      {Object.entries(schema.properties || {}).map(
        ([propertyName, property]) => {
          const prop = property as OpenAPIV3.SchemaObject;
          const isRequired =
            !hideRequired && schema.required?.includes(propertyName);
          const typeString = getTypeString(prop);
          const typeRef = schemaReferences[typeString];

          return (
            <Box
              key={propertyName}
              py="3"
              borderBottom="px"
              borderColor="gray-3"
            >
              <Stack direction="row" alignItems="center" gap="2" mb="1">
                <Code as="span" size="1" weight="semi-bold">
                  {propertyName}
                </Code>
                {typeRef ? (
                  <Link
                    href={typeRef}
                    className="text-blue-600 hover:text-blue-700 font-mono text-xs"
                  >
                    {typeString}
                  </Link>
                ) : (
                  <Code as="span" size="0" color="gray">
                    {typeString}
                  </Code>
                )}
                {isRequired && (
                  <Text as="span" size="0" color="red">
                    required
                  </Text>
                )}
              </Stack>
              {prop.description && (
                <Text as="p" size="2" color="gray">
                  {prop.description}
                </Text>
              )}
              {prop.enum && (
                <Text as="p" size="1" color="gray" mt="1">
                  One of: {prop.enum.map((e) => `"${e}"`).join(", ")}
                </Text>
              )}
            </Box>
          );
        },
      )}
    </Box>
  );
}

function getTypeString(schema: OpenAPIV3.SchemaObject): string {
  if (schema.title) return schema.title;
  if (schema.type === "array" && schema.items) {
    const items = schema.items as OpenAPIV3.SchemaObject;
    return `${items.title || items.type || "unknown"}[]`;
  }
  return schema.type || "unknown";
}
