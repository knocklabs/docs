/**
 * Static endpoint list - Server Component
 *
 * Renders a list of API endpoints without client-side interactivity.
 */

import { Box, Stack } from "@telegraph/layout";
import { Text, Code } from "@telegraph/typography";

interface Endpoint {
  methodName: string;
  methodType: string;
  endpoint: string;
}

interface Props {
  endpoints: Endpoint[];
}

const METHOD_COLORS: Record<string, string> = {
  get: "text-green-600 bg-green-50",
  post: "text-blue-600 bg-blue-50",
  put: "text-orange-600 bg-orange-50",
  delete: "text-red-600 bg-red-50",
  patch: "text-purple-600 bg-purple-50",
};

export function StaticEndpointList({ endpoints }: Props) {
  return (
    <Box
      bg="gray-1"
      borderRadius="2"
      border="px"
      borderColor="gray-3"
      overflow="hidden"
    >
      {endpoints.map(({ methodName, methodType, endpoint }, index) => (
        <div
          key={`${methodName}-${endpoint}`}
          className={`flex items-center gap-3 px-4 py-2 ${
            index > 0 ? "border-t border-gray-200" : ""
          }`}
        >
          <span
            className={`px-2 py-0.5 text-xs font-mono font-semibold uppercase rounded ${
              METHOD_COLORS[methodType.toLowerCase()] || "text-gray-600 bg-gray-100"
            }`}
          >
            {methodType.toUpperCase()}
          </span>
          <code className="text-sm font-mono text-gray-700 truncate">
            {endpoint}
          </code>
        </div>
      ))}
    </Box>
  );
}
