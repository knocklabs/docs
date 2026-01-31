import { Box, Stack } from "@telegraph/layout";

export default function Loading() {
  return (
    <Box p="6">
      <Stack direction="column" gap="6">
        <Box
          h="12"
          w="64"
          bg="gray-3"
          borderRadius="2"
          className="animate-pulse"
        />
        <Box
          h="6"
          w="96"
          bg="gray-2"
          borderRadius="2"
          className="animate-pulse"
        />
        <Stack direction="column" gap="4" mt="8">
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              h="48"
              w="full"
              bg="gray-2"
              borderRadius="2"
              className="animate-pulse"
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
