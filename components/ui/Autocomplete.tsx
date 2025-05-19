import {
  createAutocomplete,
  BaseItem,
  AutocompleteState,
} from "@algolia/autocomplete-core";
import {
  getAlgoliaResults,
  parseAlgoliaHitHighlight,
} from "@algolia/autocomplete-preset-algolia";
import algoliasearch from "algoliasearch/lite";
import { ScrollerBottomGradient } from "./Page/ScrollerBottomGradient";

import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useHotkeys } from "react-hotkeys-hook";

import "@algolia/autocomplete-theme-classic";

import { AIChatFunctions } from "@inkeep/widgets";
import { Box, Stack } from "@telegraph/layout";
import { Input } from "@telegraph/input";
import { Tag } from "@telegraph/tag";

const InKeepTrigger = dynamic(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepCustomTrigger),
  {
    ssr: false,
  },
) as any;

import useInkeepSettings from "../../hooks/useInKeepSettings";
import dynamic from "next/dynamic";
import { Icon, Lucide } from "@telegraph/icon";
import { Text, Code } from "@telegraph/typography";
import { MenuItem } from "@telegraph/menu";
import { usePageContext } from "./Page";
import { DocsSearchItem, EndpointSearchItem } from "@/types";
import { Button } from "@telegraph/button";

// This Autocomplete component was created following:
// https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-core/createAutocomplete/
//
// It has a few customizations when compared with algolia's autocomplete, but it already
// support customizations in case we want to implement future enhancements.
//

// This component is inspired heavily on https://github.com/algolia/autocomplete/blob/next/packages/autocomplete-js/src/components/Highlight.ts#L5.
// It's not exposed publicly for import, that's why we keep our version here.

const highlightingStyles = {
  color: "#485CC7",
  fontWeight: 600,
  background: "transparent",
};

// These are the number of hits we want to show for each section
const NUM_DOCS_HITS = 12;
const NUM_ENDPOINT_HITS = 5;

type ResultItem = (DocsSearchItem & BaseItem) | (EndpointSearchItem & BaseItem);

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const algoliaSearchApiKey =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "";
const algoliaIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "";
const algoliaEndpointIndex =
  process.env.NEXT_PUBLIC_ALGOLIA_ENDPOINT_INDEX_NAME || "";

// We do some delayed rendering below to avoid hydration errors
// Instead of returning null when the component isn't ready, we return a static version
// This makes sure the server renders the same element and client will do a hot-swap with the real thing
// Prevents loading jank
const StaticSearch = () => {
  return (
    <Box as="form" border="px" borderColor="gray-4" borderRadius="2">
      <Stack style={{ flexShrink: 0 }} alignItems="center" p="1">
        <Icon icon={Lucide.Search} alt="Search" color="gray" mr="2" />
        <Input
          placeholder="Search the docs..."
          size="1"
          color="gray-10"
          className="aa-Input"
          style={{ outline: "none" }}
        />
        <Stack
          bg="gray-1"
          borderRadius="1"
          border="px"
          borderColor="gray-3"
          justifyContent="center"
          alignItems="center"
          width="5"
          height="5"
        >
          <Text
            as="span"
            size="1"
            color="black"
            weight="medium"
            style={{ lineHeight: "1", transform: "translateY(-1px)" }}
          >
            /
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

const DocsSearchResult = ({ item }: { item: ResultItem }) => {
  return (
    <Link href={`/${item.path}`} passHref>
      <Box w="full" h="full" px="2" py="2">
        <Text as="p" size="2" color="black" weight="regular">
          {/* @ts-expect-error not sure about these algolia types */}
          {parseAlgoliaHitHighlight({ hit: item, attribute: "title" }).map(
            (x, index) => {
              if (x.isHighlighted) {
                return (
                  <mark key={index} style={highlightingStyles}>
                    {x.value}
                  </mark>
                );
              }
              return x.value;
            },
          )}
        </Text>
        <Text as="span" size="1" color="gray" weight="regular">
          {item.section}
        </Text>
      </Box>
    </Link>
  );
};

const EndpointSearchResult = ({ item }: { item: EndpointSearchItem }) => {
  const colors = {
    get: "blue",
    post: "green",
    put: "yellow",
    delete: "red",
    patch: "purple",
  } as const;
  return (
    <Link href={`/${item.path}`} passHref>
      <Stack w="full" h="full" px="1" py="2" gap="2" alignItems="center">
        <Tag size="0" color={colors[item.method as keyof typeof colors]}>
          {item.method?.toUpperCase()}
        </Tag>
        <Code as="p" size="1" color="black" weight="regular">
          {/* @ts-expect-error not sure about these algolia types */}
          {parseAlgoliaHitHighlight({ hit: item, attribute: "endpoint" }).map(
            (x, index) => {
              if (x.isHighlighted) {
                return (
                  <mark key={index} style={highlightingStyles}>
                    {x.value}
                  </mark>
                );
              }
              return x.value;
            },
          )}
        </Code>
        <Text
          as="span"
          size="1"
          color="gray"
          weight="regular"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {item.title}
        </Text>
      </Stack>
    </Link>
  );
};

const Autocomplete = () => {
  const { setIsSearchOpen } = usePageContext();
  const [autocompleteState, setAutocompleteState] =
    useState<AutocompleteState<BaseItem> | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Add state for the AI chat
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiSearchTerm, setAiSearchTerm] = useState("");
  const chatFunctionsRef = useRef<AIChatFunctions | null>(null);

  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const inputRef = useRef(null);
  const router = useRouter();
  const searchClient = useMemo(
    () => algoliasearch(algoliaAppId, algoliaSearchApiKey),
    [],
  );

  // Function to handle opening the AI chat
  const handleOpenAiChat = useCallback((searchTerm: string) => {
    setAiSearchTerm(searchTerm);
    setIsAiChatOpen(true);
  }, []);

  // Function to handle closing the AI chat
  const handleCloseAiChat = useCallback(() => {
    setIsAiChatOpen(false);
  }, []);

  // Add this effect to update the chat input when aiSearchTerm changes
  useEffect(() => {
    if (isAiChatOpen && chatFunctionsRef.current && aiSearchTerm) {
      // Update the input message with the search term
      chatFunctionsRef.current.updateInputMessage(aiSearchTerm);

      // Use a small timeout to ensure the chat is fully loaded before submitting
      setTimeout(() => {
        if (chatFunctionsRef.current) {
          chatFunctionsRef.current.submitCurrentInputMessage();
        }
      }, 500);
    }
  }, [isAiChatOpen, aiSearchTerm]);

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          setIsSearchOpen(state.isOpen);
          setAutocompleteState(state);
        },
        getSources() {
          return [
            {
              sourceId: "docSearchResults",
              getItemInputValue({
                item,
                state,
              }: {
                item: BaseItem;
                state: AutocompleteState<BaseItem>;
              }): string {
                return state.query;
              },
              getItems({ query }) {
                if (!query) {
                  return [];
                }

                // Create our custom "Ask AI" item
                const askAiItem = {
                  objectID: "ask-ai",
                  path: "#",
                  title: `Can you tell me about ${query}`,
                  section: "Use AI to answer your question",
                  __isAskAiItem: true,
                };

                // Get the Algolia results and add the "Ask AI" item at the top
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: algoliaIndex,
                      query,
                      params: {
                        hitsPerPage: NUM_DOCS_HITS,
                      },
                    },
                    {
                      indexName: algoliaEndpointIndex,
                      query,
                      params: {
                        hitsPerPage: NUM_ENDPOINT_HITS,
                      },
                    },
                  ],
                  transformResponse({ hits: hitsArray }) {
                    const hits = hitsArray as (
                      | DocsSearchItem[]
                      | EndpointSearchItem[]
                    )[];
                    // Add the "Ask AI" item at the top of the results
                    // Filter out any items that don't have required properties or have invalid paths
                    const filteredHits = hits.map((hitsArr) =>
                      hitsArr.filter((hit) => {
                        if (!hit?.objectID || !hit?.path) return false;

                        // Ensure the path is not empty and doesn't contain any malformed segments
                        const path = hit.path as string;
                        return (
                          path.length > 0 &&
                          !path.includes("//") &&
                          !path.startsWith("/") &&
                          !path.endsWith("/")
                        );
                      }),
                    );

                    const endpointHits =
                      filteredHits.length > 1 ? filteredHits[1] : [];
                    const docsHits =
                      filteredHits.length > 0 ? filteredHits[0] : [];

                    // Sort docs hits to put endpoints at the back of the results
                    const sortedDocsHits = docsHits.sort((a, b) => {
                      if (
                        a.contentType === "api-reference" &&
                        b.contentType !== "api-reference"
                      )
                        return 1;
                      if (
                        a.contentType !== "api-reference" &&
                        b.contentType === "api-reference"
                      )
                        return -1;
                      return 0;
                    });

                    // Quick hack to lift items in the "Concepts" section to the top of results
                    docsHits.sort((a, b) => {
                      const aIsConcepts =
                        a.section && a.section.toLowerCase() === "concepts";
                      const bIsConcepts =
                        b.section && b.section.toLowerCase() === "concepts";

                      if (aIsConcepts && !bIsConcepts) return -1;
                      if (!aIsConcepts && bIsConcepts) return 1;

                      return 0;
                    });

                    return [askAiItem, ...endpointHits, ...sortedDocsHits];
                  },
                });
              },
              getItemUrl({ item }: { item: BaseItem }): string {
                return (item as ResultItem).path;
              },
            },
          ];
        },
        shouldPanelOpen({ state }) {
          return !!state.query;
        },
        navigator: {
          navigate({ itemUrl, item, state }) {
            // Check if this is our Ask AI item
            if ((item as any).__isAskAiItem) {
              handleOpenAiChat(state.query);
              return;
            }
            // Handle regular navigation
            router.push(`/${itemUrl}`);
          },
        },
      }),
    [router, searchClient, handleOpenAiChat, setIsSearchOpen],
  );

  useHotkeys("/, cmd+k", (e) => {
    // adding small timeout so event doesn't get to the focused input resulting
    // in "/" being displayed on the input
    e.preventDefault();
    setTimeout(() => {
      const ref = inputRef.current;

      if (ref) {
        (ref as HTMLElement).focus();
      }
    }, 20);
  });

  // Fix hydration error by hiding autocomplete during ssr
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Add a ref for the root element
  const rootRef = useRef<HTMLDivElement>(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node) &&
        autocompleteState?.isOpen
      ) {
        // Reset the autocomplete state
        autocomplete.setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [autocomplete, autocompleteState?.isOpen]);

  if (!mounted) {
    return <StaticSearch />;
  }

  type FormProps = {
    action: string;
    noValidate: boolean;
    role: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onReset: (e: React.FormEvent<HTMLFormElement>) => void;
  };

  const formProps: unknown = autocomplete.getFormProps({
    inputElement: inputRef.current,
  });

  const inputProps: unknown = autocomplete.getInputProps({
    inputElement: inputRef.current,
    placeholder: "Search the docs...",
  });

  return (
    <Box
      {...autocomplete.getRootProps()}
      w="full"
      tgphRef={rootRef}
      id="docs-search"
    >
      <Box
        as="form"
        border="px"
        borderColor="gray-4"
        borderRadius="2"
        className="aa-Form"
        {...(formProps as FormProps)}
      >
        <Stack alignItems="center" p="1">
          <Icon
            icon={Lucide.Search}
            alt="Search"
            color="gray"
            mr="2"
            style={{ flexShrink: 0 }}
          />
          <Input
            tgphRef={inputRef}
            placeholder="Search the docs..."
            className="aa-Input"
            {...(inputProps as React.DetailedHTMLProps<
              React.InputHTMLAttributes<HTMLInputElement>,
              HTMLInputElement
            >)}
            size="1"
            style={{
              outline: "none",
            }}
            w="full"
          />
          {autocompleteState?.query ? (
            <Button
              variant="ghost"
              size="1"
              weight="regular"
              bg="gray-1"
              color="gray"
              icon={{
                icon: Lucide.X,
                "aria-hidden": true,
                color: "black",
              }}
              onClick={() => {
                autocomplete.setQuery("");
                if (inputRef.current) {
                  (inputRef.current as HTMLInputElement).focus();
                }
              }}
              border="px"
              borderColor="gray-3"
              py="2"
              px="1"
              ml="2"
              style={{
                height: "20px",
              }}
            >
              Clear
            </Button>
          ) : (
            <>
              <Stack
                bg="gray-1"
                borderRadius="1"
                border="px"
                borderColor="gray-3"
                justifyContent="center"
                alignItems="center"
                width="5"
                height="5"
                className="md-hidden"
              >
                <Text
                  as="span"
                  size="1"
                  color="black"
                  weight="medium"
                  style={{ lineHeight: "1", transform: "translateY(-1px)" }}
                >
                  /
                </Text>
              </Stack>
              <Box
                borderRadius="1"
                width="5"
                height="5"
                className="md-visible"
              ></Box>
            </>
          )}
        </Stack>
      </Box>

      {autocompleteState?.isOpen && (
        <Box
          data-search-results-container
          position="absolute"
          bg="white"
          w="96"
          border="px"
          borderColor="gray-6"
          mt="2"
          shadow="1"
          borderRadius="2"
          p="2"
          style={{
            overscrollBehavior: "none",
            zIndex: 50,
            overflow: "hidden",
            transition: "opacity 0.15s ease-in-out",
            width: "clamp(200px, 500px, 90vw)",
            left: "clamp(5%, auto, 5%)",
          }}
        >
          {/* Adds a white shadow to the bottom of the autocomplete when items below scroll */}
          <ScrollerBottomGradient
            scrollerRef={scrollerRef}
            gradientProps={{
              height: "20",
            }}
            managePadding={false}
          />
          <Box
            w="full"
            h="full"
            style={{
              overflowY: "auto",
              maxHeight: "80dvh",
              paddingBottom: "0",
            }}
            tgphRef={scrollerRef}
          >
            {autocompleteState?.collections.map((collection, index) => {
              const { source, items } = collection;

              return (
                <Box key={`source-${index}`}>
                  {items.length > 0 ? (
                    <Box>
                      <Box
                        as="ul"
                        className="aa-List"
                        pb={items.length > 1 ? "2" : "0"}
                        {...autocomplete.getListProps()}
                      >
                        <MenuItem
                          as="li"
                          className="aa-Item"
                          w="full"
                          h="full"
                          key={(items[0] as ResultItem).objectID}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.15s ease-in-out",
                            gridTemplateColumns: "1fr",
                          }}
                          {...(autocomplete.getItemProps({
                            item: items[0],
                            source,
                          }) as unknown as React.LiHTMLAttributes<HTMLLIElement>)}
                          color="default"
                          onClick={() =>
                            handleOpenAiChat((inputProps as any).value)
                          }
                        >
                          <Stack
                            py="3"
                            px="2"
                            justifyContent="space-between"
                            alignItems="center"
                            w="full"
                          >
                            <Box>
                              <Text
                                as="p"
                                size="2"
                                color="black"
                                weight="regular"
                              >
                                {(items[0] as ResultItem).title}
                              </Text>
                              <Text
                                as="span"
                                size="1"
                                color="gray"
                                weight="regular"
                              >
                                {(items[0] as ResultItem).section}
                              </Text>
                            </Box>
                            <Icon
                              icon={Lucide.Sparkles}
                              alt="Sparkles"
                              color="black"
                              size="4"
                            />
                          </Stack>
                        </MenuItem>
                        {items.map((item, index) => {
                          // Skip the first item, it's rendered above
                          if (index === 0) return null;
                          const isEndpoint =
                            (item as ResultItem).index === "endpoints";
                          const previousItem = items[index - 1] as ResultItem;
                          const prevIsEndpoint =
                            previousItem?.index === "endpoints";
                          // Show divider after the first AskAI item and between endpoints and docs sections
                          const showDivider =
                            index === 1 || (!isEndpoint && prevIsEndpoint);
                          const key = (item as ResultItem).objectID;
                          return (
                            <React.Fragment key={key}>
                              {showDivider && (
                                <Box
                                  borderTop="px"
                                  borderColor="gray-4"
                                  marginY="2"
                                  w="full"
                                />
                              )}
                              <MenuItem
                                as="li"
                                w="full"
                                h="full"
                                className="aa-Item"
                                style={{
                                  cursor: "pointer",
                                  transition: "all 0.15s ease-in-out",
                                  gridTemplateColumns: "1fr",
                                }}
                                {...(autocomplete.getItemProps({
                                  item,
                                  source,
                                }) as unknown as React.LiHTMLAttributes<HTMLLIElement>)}
                                color="default"
                              >
                                {isEndpoint ? (
                                  <EndpointSearchResult
                                    item={item as EndpointSearchItem}
                                  />
                                ) : (
                                  <DocsSearchResult
                                    item={item as DocsSearchItem}
                                  />
                                )}
                              </MenuItem>
                            </React.Fragment>
                          );
                        })}
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      p="4"
                      className="p-4 text-[14px] text-gray-400 dark:text-gray-200 font-medium "
                    >
                      <Text as="span" size="1" color="gray" weight="regular">
                        No matching results.
                      </Text>{" "}
                      <Link
                        href="javascript:void(0)"
                        className="text-brand"
                        onClick={() =>
                          handleOpenAiChat((inputProps as any).value)
                        }
                      >
                        Ask AI ✨
                      </Link>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Add the InKeep trigger component directly in the Autocomplete component */}
      <InKeepTrigger
        isOpen={isAiChatOpen}
        onClose={handleCloseAiChat}
        baseSettings={baseSettings}
        aiChatSettings={{
          ...aiChatSettings,
          chatFunctionsRef,
          placeholder: "Ask a question...",
        }}
        modalSettings={modalSettings}
        searchSettings={{
          ...searchSettings,
          prefilledQuery: aiSearchTerm,
        }}
      />
    </Box>
  );
};

export default Autocomplete;
