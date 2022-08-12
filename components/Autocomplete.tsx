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

import React, { useMemo, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useHotkeys } from "react-hotkeys-hook";

import "@algolia/autocomplete-theme-classic";

import { Box } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import Icon from "@chakra-ui/icon";

import { IoIosSearch } from "react-icons/io";

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
  const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const algoliaSearchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
  const algoliaIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
  const [autocompleteState, setAutocompleteState] =
    useState<AutocompleteState<BaseItem> | null>(null);

  if (!algoliaAppId || !algoliaSearchApiKey || !algoliaIndex) {
    return null;
  }
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
            router.push(`/${itemUrl}`);
          },
        },
      }),
    [],
  );

  useHotkeys("/", (e) => {
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
      display={{ base: "none", sm: "none", md: "block" }}
      ml="20px"
      h="38px"
      w="500px"
      className="aa-Autocomplete"
      {...autocomplete.getRootProps({})}
    >
      <form
        className="h-10 aa-Form"
        style={{ boxShadow: "none", borderColor: "#E4E8EE" }}
        {...(formProps as FormProps)}
      >
        <Box w="38px" className="aa-InputWrapperPrefix">
          <Icon h="28px" fontSize="20px" ml="12px" as={IoIosSearch} />
        </Box>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            placeholder="Search the docs..."
            {...(inputProps as React.DetailedHTMLProps<
              React.InputHTMLAttributes<HTMLInputElement>,
              HTMLInputElement
            >)}
          />
        </div>
        <Box
          borderWidth="1px"
          borderColor="gray.100"
          borderRadius={4}
          bg="#F7F7F8"
          mr="8px"
          w="25px"
          h="22px"
          className="aa-InputWrapperSuffix"
        >
          <Text w="100%" textAlign="center">
            /
          </Text>
        </Box>
      </form>

      {autocompleteState?.isOpen && (
        <Box w="500px" bg="white" zIndex="100" className="aa-Panel">
          {autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection;

            return (
              <div key={`source-${index}`} className="aa-Source">
                {items.length > 0 ? (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item) => (
                      <li
                        style={{ padding: "16px" }}
                        key={(item as ResultItem).objectID}
                        className="aa-Item hover:text-blue-600 cursor-pointer"
                        {...(autocomplete.getItemProps({
                          item,
                          source,
                        }) as unknown as React.LiHTMLAttributes<HTMLLIElement>)}
                      >
                        <Link href={`/${item.path}`} passHref>
                          <a href="replace">
                            <Highlight hit={item} attribute="title" />
                            <Text
                              mt={2}
                              color="gray.400"
                              fontWeight="500"
                              fontSize="12px"
                            >
                              {(item as ResultItem).section}
                            </Text>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text p={4} color="gray.400" fontWeight="500" fontSize="14px">
                    No results
                  </Text>
                )}
              </div>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Autocomplete;
