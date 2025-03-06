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

import { IoIosSearch } from "react-icons/io";
import { IoSparkles } from "react-icons/io5";
import { InkeepCustomTriggerProps, AIChatFunctions } from "@inkeep/widgets";

const InKeepTrigger = dynamic(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepCustomTrigger),
  {
    ssr: false,
  },
) as any;

import useInkeepSettings from "../hooks/useInKeepSettings";
import dynamic from "next/dynamic";

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

const Autocomplete = () => {
  const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
  const algoliaSearchApiKey =
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "";
  const algoliaIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "";
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
    return null;
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
    <div
      {...autocomplete.getRootProps({})}
      ref={rootRef}
      id="docs-search"
      className="aa-Autocomplete hidden md:block"
    >
      <form
        className="aa-Form shadow-none !border-[#E4E8EE] dark:!border-gray-700 !bg-white dark:!bg-gray-800"
        {...(formProps as FormProps)}
      >
        <div className="aa-InputWrapperPrefix px-2 !h-auto flex items-center justify-center">
          <IoIosSearch className="w-5 h-5 dark:text-gray-300" />
        </div>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input !h-9 !w-[260px] !text-[14px] dark:!text-white"
            ref={inputRef}
            placeholder="Search the docs..."
            {...(inputProps as React.DetailedHTMLProps<
              React.InputHTMLAttributes<HTMLInputElement>,
              HTMLInputElement
            >)}
          />
        </div>
        <div className="aa-InputWrapperSuffix !bg-[#F7F7F8] dark:!bg-gray-600 text-gray-600 dark:text-white mr-2 !w-6 !h-6 rounded border border-gray-200 dark:border-gray-600">
          <span className="w-full text-center">/</span>
        </div>
      </form>

      {autocompleteState?.isOpen && (
        <div
          className="!w-[500px] !bg-white dark:!bg-gray-800 !p-2 !rounded z-50 aa-Panel"
          style={{ overscrollBehavior: "none" }}
        >
          {autocompleteState?.collections.map((collection, index) => {
            const { source, items } = collection;

            return (
              <div key={`source-${index}`} className="aa-Source">
                {items.length > 0 ? (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item) => {
                      // Check if this is our custom "Ask AI" item
                      if ((item as any).__isAskAiItem) {
                        return (
                          <li
                            style={{ padding: "16px" }}
                            key={(item as ResultItem).objectID}
                            className="aa-Item !text-gray-800 dark:!text-gray-200 hover:text-blue-600 cursor-pointer"
                            {...(autocomplete.getItemProps({
                              item,
                              source,
                            }) as unknown as React.LiHTMLAttributes<HTMLLIElement>)}
                          >
                            <div
                              onClick={() => {
                                const searchTerm = (inputProps as any).value;
                                handleOpenAiChat(searchTerm);
                              }}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <p>{(item as ResultItem).title}</p>
                                <span className="mt-2 text-gray-400 dark:text-gray-600 font-medium text-[12px]">
                                  {(item as ResultItem).section}
                                </span>
                              </div>
                              <IoSparkles className="text-lg text-brand-light dark:text-brand" />
                            </div>
                          </li>
                        );
                      }

                      // Regular search result item
                      return (
                        <li
                          style={{ padding: "16px" }}
                          key={(item as ResultItem).objectID}
                          className="aa-Item !text-gray-800 dark:!text-gray-200 hover:text-blue-600 cursor-pointer"
                          {...(autocomplete.getItemProps({
                            item,
                            source,
                          }) as unknown as React.LiHTMLAttributes<HTMLLIElement>)}
                        >
                          <Link href={`/${item.path}`} passHref>
                            <Highlight hit={item} attribute="title" />
                            <span className="mt-2 text-gray-400 dark:text-gray-600 font-medium text-[12px]">
                              {(item as ResultItem).section}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-4 text-[14px] text-gray-400 dark:text-gray-200 font-medium ">
                    <span className="inline-block">No matching results.</span>{" "}
                    <Link
                      href="javascript:void(0)"
                      className="text-brand"
                      onClick={() =>
                        handleOpenAiChat((inputProps as any).value)
                      }
                    >
                      Ask AI ✨
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
    </div>
  );
};

export default Autocomplete;
