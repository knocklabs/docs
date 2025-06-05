import { Heading, Text } from "@telegraph/typography";
import { Box } from "@telegraph/layout";
import { Page } from "@/components/ui/Page";
import Meta from "@/components/Meta";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MenuItem } from "@telegraph/menu";
import { PLATFORM_SIDEBAR } from "@/data/sidebars/platformSidebar";

/**
 * Not seeing 404 page in development? Please read!
 * First, this works when you build. This is only a development issue.
 * If you want to tinker, you can change the name of /app to /apps temporarily
 * to serve the 404 page (this one).
 *
 * Why?
 * There's a known issue in Next.js where 404 in /pages doesn't work when
 * both /pages and /app folders are present.
 * https://github.com/vercel/next.js/issues/58945
 *
 * Why not move this to /app/not-found.tsx?
 * Because our components were not designed to be used in the /app folder
 * with React Server Components. We start to get issues like using next/navigation
 * instead of next/router in downstream components. It was annoying.
 *
 * I didn't want to refactor anything so I wrote this comment instead.
 */

// Hit our /api/search endpoint to get related pages from innkeep
// You'll need the server-side API key in .env for this to work.
async function search(query: string) {
  const response = await fetch(`/api/search`, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export default function NotFound() {
  const router = useRouter();
  const path = router.asPath;
  const [results, setResults] = useState<any[] | null>(null);

  useEffect(() => {
    if (!path) return;
    search(path)
      .then((data) => {
        // First five results
        setResults(data.results.slice(0, 5));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [path]);

  return (
    <Page.Container>
      <Meta title="Page not found | Knock Docs" />
      <Page.Masthead
        skipHighlight
        mobileSidebar={<Page.MobileSidebar content={PLATFORM_SIDEBAR} />}
      />
      <Page.Wrapper>
        <Box />
        <Page.Content>
          <Box>
            <Heading as="h1" size="7" mt="8" mb="4">
              404 - Page not found
            </Heading>
            <Text as="p" size="4" color="gray">
              The page you are looking for has moved or does not exist.
            </Text>
            <Box my="8">
              <hr />
            </Box>
            {results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box>
                  <Text as="p" size="2" mb="4" color="gray">
                    Try one of these related pages:
                  </Text>
                  <Box as="ul">
                    {results.map((result, index) => (
                      <motion.li
                        key={result.url}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        style={{ marginLeft: "-10px" }}
                      >
                        <MenuItem py="5" w="full">
                          <Text
                            as={Link}
                            href={result.url}
                            color="accent"
                            size="2"
                          >
                            {result.title}
                          </Text>
                        </MenuItem>
                      </motion.li>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}
          </Box>
        </Page.Content>
      </Page.Wrapper>
    </Page.Container>
  );
}
