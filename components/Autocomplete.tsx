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
import { createRoot } from "react-dom/client";

import { useHotkeys } from "react-hotkeys-hook";

import "@algolia/autocomplete-theme-classic";

import { IoIosSearch } from "react-icons/io";
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

const AiLauncher = ({ searchTerm }) => {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();
  const [isOpen, setIsOpen] = useState(false);
  const chatFunctionsRef = useRef<AIChatFunctions>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);

  // Function to open the chat and auto-submit the query
  const openChatAndSubmit = useCallback(() => {
    setIsOpen(true);

    // Use a small timeout to ensure the chat is fully loaded before submitting
    setTimeout(() => {
      if (chatFunctionsRef.current) {
        chatFunctionsRef.current.submitCurrentInputMessage();
      }
    }, 500);
  }, []);

  const inkeepCustomTriggerProps: InkeepCustomTriggerProps = {
    isOpen,
    onClose: handleClose,
    baseSettings,
    aiChatSettings: {
      ...aiChatSettings,
      chatFunctionsRef,
    },
    modalSettings,
    searchSettings: { ...searchSettings, prefilledQuery: searchTerm },
  };

  return (
    <>
      <Link
        href="javascript:void(0)"
        className="text-brand"
        onClick={openChatAndSubmit}
      >
        Ask AI ✨
      </Link>
      <InKeepTrigger {...inkeepCustomTriggerProps} />
    </>
  );
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

  const inputRef = useRef(null);
  const router = useRouter();
  const searchClient = useMemo(
    () => algoliasearch(algoliaAppId, algoliaSearchApiKey),
    [],
  );

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
              getItemInputValue({ item }: { item: BaseItem }): string {
                return (item as ResultItem).title;
              },
              getItems({ query }) {
                if (!query) {
                  return [];
                }

                // Create our custom "Ask AI" item
                const askAiItem = {
                  objectID: "ask-ai",
                  path: "javascript:void(0)", // Use javascript:void(0) instead of # to prevent hash in URL
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
                    // Filter out any empty items or items with invalid paths to prevent empty entries in the dropdown

                    // List of valid content directories based on the content structure
                    const validContentDirs = [
                      "concepts",
                      "designing-workflows",
                      "developer-tools",
                      "getting-started",
                      "guides",
                      "in-app-ui",
                      "integrations",
                      "manage-your-account",
                      "managing-recipients",
                      "preferences",
                      "sdks",
                      "send-notifications",
                      "reference",
                    ];

                    // Define a list of valid paths based on the content structure
                    // This is a more comprehensive approach than just checking directory prefixes
                    const validPaths = [
                      // Top-level pages
                      "cli",
                      "mapi",
                      "playground",
                      "reference",
                    ];

                    // Add all valid content directories to the valid paths list
                    validContentDirs.forEach((dir) => {
                      validPaths.push(dir);
                    });

                    // Add specific paths for preferences section (which had the reported issue)
                    validPaths.push(
                      "preferences/overview",
                      "preferences/object-preferences",
                      "preferences/preference-conditions",
                      "preferences/tenant-preferences",
                    );

                    // Add specific paths for designing-workflows section (which contains the correct send-windows page)
                    validPaths.push(
                      "designing-workflows/overview",
                      "designing-workflows/send-windows",
                      "designing-workflows/batch-function",
                      "designing-workflows/branch-function",
                      "designing-workflows/channel-step",
                      "designing-workflows/delay-function",
                      "designing-workflows/fetch-function",
                      "designing-workflows/partials",
                      "designing-workflows/step-conditions",
                      "designing-workflows/throttle-function",
                      "designing-workflows/trigger-workflow-function",
                    );

                    const filteredHits = hits[0].filter((hit) => {
                      if (!hit || !hit.objectID || !hit.path) return false;

                      const path = hit.path as string;

                      // First check if the path exactly matches one of our valid paths
                      if (validPaths.includes(path)) return true;

                      // Then check if the path starts with any of our valid paths followed by a hash (for anchors)
                      for (const validPath of validPaths) {
                        if (path.startsWith(validPath + "#")) return true;
                      }

                      // Finally, check if the path is a subdirectory of a valid content directory
                      // but also ensure it's not just a prefix match but actually exists in our content structure
                      return validContentDirs.some(
                        (dir) =>
                          path.startsWith(dir + "/") &&
                          validPaths.some(
                            (validPath) =>
                              path === validPath ||
                              path.startsWith(validPath + "/") ||
                              path.startsWith(validPath + "#"),
                          ),
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
          navigate({ itemUrl }) {
            // Don't navigate if the URL is javascript:void(0)
            if (itemUrl === "javascript:void(0)") {
              return;
            }
            router.push(`/${itemUrl}`);
          },
        },
      }),
    [algoliaIndex, router, searchClient],
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
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the autocomplete dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        autocompleteState?.isOpen
      ) {
        // Reset the input value to close the dropdown
        if (inputRef.current) {
          const inputElement = inputRef.current as HTMLInputElement;
          inputElement.value = "";
          autocomplete.setQuery("");
          setAutocompleteState((prev) =>
            prev ? { ...prev, isOpen: false } : null,
          );
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [autocomplete, autocompleteState]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      id="docs-search"
      className="aa-Autocomplete hidden md:block"
      ref={autocompleteRef}
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
        <div className="!w-[500px] !bg-white dark:!bg-gray-800 !p-2 !rounded z-50 aa-Panel">
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
                                // Open the inkeep Ask AI with the search term pre-filled and auto-submit
                                const searchTerm = (inputProps as any).value;
                                const aiLauncher =
                                  document.createElement("div");
                                document.body.appendChild(aiLauncher);
                                const root = createRoot(aiLauncher);

                                // Render the AiLauncher component with the search term
                                root.render(
                                  <AiLauncher searchTerm={searchTerm} />,
                                );

                                // Simulate a click to open the inkeep Ask AI and auto-submit
                                setTimeout(() => {
                                  const link = aiLauncher.querySelector("a");
                                  if (link) link.click();
                                }, 0);
                              }}
                            >
                              <p>{(item as ResultItem).title}</p>
                              <span className="mt-2 text-gray-400 dark:text-gray-600 font-medium text-[12px]">
                                {(item as ResultItem).section}
                              </span>
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
                    <AiLauncher searchTerm={(inputProps as any).value} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
