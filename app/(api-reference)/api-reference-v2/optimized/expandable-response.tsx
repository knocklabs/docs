"use client";

/**
 * Client component for expandable response properties.
 *
 * This is a "client island" within the server-rendered content.
 * It receives only the data it needs for its specific functionality.
 */

import { useState } from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  schema: OpenAPIV3.SchemaObject;
  schemaReferences: Record<string, string>;
}

export function ExpandableResponseProperties({
  schema,
  schemaReferences,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const properties = schema.properties || {};
  const required = schema.required || [];

  if (Object.keys(properties).length === 0) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
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
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <div className="divide-y divide-gray-100">
                {Object.entries(properties).map(([name, prop]) => {
                  const propSchema = prop as OpenAPIV3.SchemaObject;
                  const isRequired = required.includes(name);

                  let typeDisplay = propSchema.type || "any";
                  if (propSchema.type === "array" && propSchema.items) {
                    const itemType =
                      (propSchema.items as OpenAPIV3.SchemaObject).type || "any";
                    typeDisplay = `${itemType}[]`;
                  }

                  return (
                    <div key={name} className="py-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <code className="font-mono text-xs font-medium">
                          {name}
                        </code>
                        <span className="text-xs text-gray-400">
                          {typeDisplay}
                        </span>
                        {isRequired && (
                          <span className="text-xs text-red-500">required</span>
                        )}
                      </div>
                      {propSchema.description && (
                        <p className="text-xs text-gray-500">
                          {propSchema.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
