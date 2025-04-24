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

import { IoSparkles } from "react-icons/io5";
import { AIChatFunctions } from "@inkeep/widgets";
import { Box, Stack } from "@telegraph/layout";
import { Input } from "@telegraph/input";

const InKeepTrigger = dynamic(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepCustomTrigger),
  {
    ssr: false,
  },
) as any;

import useInkeepSettings from "../../hooks/useInKeepSettings";
import dynamic from "next/dynamic";
import { Icon, Lucide } from "@telegraph/icon";
import { Text } from "@telegraph/typography";
import { MenuItem } from "@telegraph/menu";

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

const Highlight = ({ hit, attribute }) => (
  <p>
    {parseAlgoliaHitHighlight({ hit, attribute }).map((x, index) => {
      if (x.isHighlighted) {
        return (
          <mark key={index} style={highlightingStyles}>
            {x.value}
          </mark>
        );
      }
      return x.value;
    })}
  </p>
);

interface ResultItem extends BaseItem {
  objectID: string;
  path: string;
  title: string;
  section: string;
}

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const algoliaSearchApiKey =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "";
const algoliaIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "";

// We do some delayed rendering below to avoid hydration errors
// Instead of returning null when the component isn't ready, we return a static version
// This makes sure the server renders the same element and client will do a hot-swap with the real thing
// Prevents loading jank
const StaticSearch = () => {
  return (
    <Box
      as="form"
      border="px"
      borderColor="gray-6"
      borderRadius="2"
    >
      <Stack
        style={{ flexShrink: 0 }}
        alignItems="center"
        p="1"
      >
        <Icon icon={Lucide.Search} alt="Search" color="gray" mr="2" />
        <Input
          placeholder="Search the docs..."
          size="1"
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
          <Text as="span" size="1" color="black" weight="medium" style={{ lineHeight: "1", transform: "translateY(-1px)" }}>
            /
          </Text>
        </Stack>
      </Stack>
    </Box>
  )
};

const Autocomplete = () => {
  const [autocompleteState, setAutocompleteState] =
    useState<AutocompleteState<BaseItem> | null>(null);

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
    [algoliaAppId, algoliaSearchApiKey],
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

  // Lock scrolling when autocomplete is open
  useEffect(() => {
    if (autocompleteState?.isOpen) {
      // Add a class that prevents scrolling on html and body
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Remove the scroll lock
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [autocompleteState?.isOpen]);

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
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
                        hitsPerPage: 8,
                      },
                    },
                  ],
                  transformResponse({ hits }) {
                    // Add the "Ask AI" item at the top of the results
                    // Filter out any items that don't have required properties or have invalid paths
                    const filteredHits = hits[0].filter((hit) => {
                      if (!hit?.objectID || !hit?.path) return false;

                      // Ensure the path is not empty and doesn't contain any malformed segments
                      const path = hit.path as string;
                      return (
                        path.length > 0 &&
                        !path.includes("//") &&
                        !path.startsWith("/") &&
                        !path.endsWith("/")
                      );
                    });

                    return [askAiItem, ...filteredHits];
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
    [algoliaIndex, router, searchClient, handleOpenAiChat],
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
      {...autocomplete.getRootProps({})}
      tgphRef={rootRef}
      id="docs-search"
    >
      <Box
        as="form"
        border="px"
        borderColor="gray-6"
        borderRadius="2"
        className="aa-Form"
        {...(formProps as FormProps)}
      >
        <Stack
          style={{ flexShrink: 0 }}
          alignItems="center"
          p="1"
        >
          <Icon icon={Lucide.Search} alt="Search" color="gray" mr="2" />
          <Input
            tgphRef={inputRef}
            placeholder="Search the docs..."
            className="aa-Input"
            {...(inputProps as React.DetailedHTMLProps<
              React.InputHTMLAttributes<HTMLInputElement>,
              HTMLInputElement
            >)}
            size="1"
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
            <Text as="span" size="1" color="black" weight="medium" style={{ lineHeight: "1", transform: "translateY(-1px)" }}>
              /
            </Text>
          </Stack>
        </Stack>
      </Box>

      {autocompleteState?.isOpen && (
        <Box
          borderRadius="2"
          w="96"
          bg="white"
          p="2"
          position="absolute"
          border="px"
          borderColor="gray-6"
          mt="2"
          shadow="1"
          style={{
            overscrollBehavior: "none",
            zIndex: 50,
            overflow: "hidden",
            transition: "opacity 0.15s ease-in-out",
            width: "500px",
          }}
        >
          {autocompleteState?.collections.map((collection, index) => {
            const { source, items } = collection;

            return (
              <Box key={`source-${index}`}>
                {items.length > 0 ? (
                  <Box as="ul" className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item) => {
                      // Check if this is our custom "Ask AI" item
                      if ((item as any).__isAskAiItem) {
                        return (
                          <MenuItem
                            as="li"
                            className="aa-Item"
                            w="full"
                            h="full"
                            key={(item as ResultItem).objectID}
                            style={{
                              cursor: "pointer",
                              transition: "all 0.15s ease-in-out",
                            }}
                            {...(autocomplete.getItemProps({
                              item,
                              source,
                            }) as unknown as React.LiHTMLAttributes<HTMLLIElement>)}
                            color="default"
                            onClick={() => {
                              const searchTerm = (inputProps as any).value;
                              handleOpenAiChat(searchTerm);
                            }}
                          >
                            <Stack
                              py="4"
                              px="2"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Text as="p" size="2" color="black" weight="regular">{(item as ResultItem).title}</Text>
                                <Text as="span" size="1" color="gray" weight="regular">
                                  {(item as ResultItem).section}
                                </Text>
                              </Box>
                              <Icon icon={Lucide.Sparkles} alt="Sparkles" color="black" size="4" />
                            </Stack>
                          </MenuItem>
                        );
                      }

                      // Regular search result item
                      return (
                        <MenuItem
                          as="li"
                          w="full"
                          h="full"
                          className="aa-Item"
                          key={(item as ResultItem).objectID}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.15s ease-in-out",
                          }}
                          {...(autocomplete.getItemProps({
                            item,
                            source,
                          }) as unknown as React.LiHTMLAttributes<HTMLLIElement>)}
                          color="default"
                        >
                          <Link href={`/${item.path}`} passHref>
                            <Box
                              w="full"
                              h="full"
                              px="2"
                              py="4"
                            >
                              <Highlight hit={item} attribute="title" />
                              <Text as="span" size="1" color="gray" weight="regular">
                                {(item as ResultItem).section}
                              </Text>
                            </Box>
                          </Link>
                        </MenuItem>
                      );
                    })}
                  </Box>
                ) : (
                  <Box p="4" className="p-4 text-[14px] text-gray-400 dark:text-gray-200 font-medium ">
                    <Text as="span" size="1" color="gray" weight="regular">No matching results.</Text>{" "}
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
