import { Box, Stack } from "@telegraph/layout";

export function ResourceSectionSkeleton() {
  return (
    <Box py="16" borderBottom="px" borderColor="gray-3">
      <Stack direction="column" gap="4">
        <Box
          h="8"
          w="48"
          bg="gray-3"
          borderRadius="2"
          className="animate-pulse"
        />
        <Box
          h="4"
          w="full"
          bg="gray-2"
          borderRadius="2"
          className="animate-pulse"
        />
        <Box
          h="4"
          w="3/4"
          bg="gray-2"
          borderRadius="2"
          className="animate-pulse"
        />
        <Stack direction="row" gap="4" mt="4">
          <Box
            h="32"
            w="1/2"
            bg="gray-2"
            borderRadius="2"
            className="animate-pulse"
          />
          <Box
            h="32"
            w="1/2"
            bg="gray-2"
            borderRadius="2"
            className="animate-pulse"
          />
        </Stack>
      </Stack>
    </Box>
  );
}
