import { Heading, Text } from "@telegraph/typography";
import { Box } from "@telegraph/layout";
import { Page } from "@/components/ui/Page";
import Meta from "@/components/Meta";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { MenuItem } from "@telegraph/menu";
import { PLATFORM_SIDEBAR } from "@/data/sidebars/platformSidebar";
import { DOCUMENTATION_LINKS } from "@/lib/documentationLinks";
import { fetchRelatedPages, type RelatedPage } from "@/lib/relatedPages";

/**
 * Not seeing 404 page in development? Please read!
 * First, the 404 page does load when you build. This is only a local development issue.
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

export default function NotFound() {
  const router = useRouter();
  const path = router.asPath;
  const [results, setResults] = useState<RelatedPage[]>([]);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    setResults([]);

    fetchRelatedPages(path, controller.signal)
      .then((pages) => {
        if (!controller.signal.aborted) setResults(pages);
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [path]);

  return (
    <Box bg="surface-1" style={{ minHeight: "100vh" }}>
      <Page.Container>
        <Meta title="Page not found | Knock Docs" />
        <Head>
          {DOCUMENTATION_LINKS.map((link) => (
            <link key={link.href} rel="help" {...link} />
          ))}
        </Head>
        <Page.Masthead
          skipHighlight
          mobileSidebar={<Page.MobileSidebar content={PLATFORM_SIDEBAR} />}
        />
        <Page.Wrapper>
          {/* This is usually where the sidebar goes. This is the only place we don't have one. This makes sure the CSS grid has an item here. */}
          <Box />
          <Page.Content>
            <Box>
              <Heading as="h1" size="7" mt="8" mb="4">
                404 - Page not found
              </Heading>
              <Text as="p" size="4" color="gray">
                The page you are looking for has moved or does not exist.
              </Text>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box my="8">
                    <hr />
                  </Box>
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
                              as="a"
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
    </Box>
  );
}
