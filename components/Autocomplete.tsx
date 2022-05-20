import { autocomplete } from '@algolia/autocomplete-js';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaResults, parseAlgoliaHitHighlight } from '@algolia/autocomplete-preset-algolia';
import algoliasearch from 'algoliasearch/lite';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import Link from "next/link";
import { useRouter } from "next/router";

import { useHotkeys } from 'react-hotkeys-hook'

import '@algolia/autocomplete-theme-classic';

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

const Highlight = ({
  hit,
  attribute,
}) => {
  return <p>
    {parseAlgoliaHitHighlight({ hit, attribute }).map((x, index) => {
      if (x.isHighlighted) {
        const markStyles = {
          color: "#485CC7",
          fontWeight: 600,
          background: "transparent"
        }
        return (
          <mark key={index} style={markStyles}>
            {x.value}
          </mark>
        )
      } else {
        return x.value;
      }
    })}
  </p>
}

const Autocomplete = () => {
  const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const algoliaSearchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
  const algoliaIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

  if (!algoliaAppId || !algoliaSearchApiKey || !algoliaIndex) {
    return null;
  }
  const [autocompleteState, setAutocompleteState] = useState({});
  const inputRef = useRef(null);
  const router = useRouter();
  const searchClient = useMemo(() => {
    return algoliasearch(
      algoliaAppId,
      algoliaSearchApiKey
    );
  }, [])
  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          setAutocompleteState(state);
        },
        getSources() {
          return [
            {
              sourceId: 'docSearchResults',
              getItemInputValue({ item }) {
                return item.query;
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: algoliaIndex,
                      query,
                      params: {
                        hitsPerPage: 4,
                        highlightPreTag: '<mark>',
                        highlightPostTag: '</mark>',
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return item.path;
              },
            },
          ];
        },
        navigator: {
          navigate({ itemUrl }) {
            router.push(`/${itemUrl}`);
          },
        }
      }),
    []
  );

  console.log(autocompleteState)

  useHotkeys('/', () => {
    // adding small timeout so event doesn't get to the focused input resulting
    // in "/" being diplayed on the input
    setTimeout(() => {
      inputRef.current.focus();
    }, 20)
  })

  return (
    <Box
      ml="20px"
      h="38px"
      w="500px"
      className="aa-Autocomplete"
      {...autocomplete.getRootProps({})}>
      <form
        className="h-10 aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <Box w="38px" className="aa-InputWrapperPrefix">
          <Icon
            h="28px"
            fontSize="20px"
            ml="12px"
            as={IoIosSearch}
          />
        </Box>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({})}
          />
        </div>
        <Box borderWidth="1px" borderColor="gray.100" borderRadius={4} bg="#F7F7F8" mr="8px" w="25px" h="22px" className="aa-InputWrapperSuffix">
          <Text w="100%" textAlign="center">/</Text>
        </Box>
      </form>

      {autocompleteState.isOpen &&
        <Box
          w="500px"
          bg="white"
          zIndex="100"
          className="aa-Panel"
          {...autocomplete.getPanelProps({})}>
          {autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection;

            return (
              <div key={`source-${index}`} className="aa-Source">
                {items.length > 0 && (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item) => (
                      <li
                        style={{padding: "16px"}}
                        key={item.objectID}
                        className="aa-Item hover:text-blue-600 cursor-pointer"
                        {...autocomplete.getItemProps({
                          item,
                          source,
                        })}
                      >
                        <a onClick={() => router.push(`/${item.path}`)}>
                          <Highlight hit={item} attribute="title" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </Box>
      }
    </Box>
  );
}

export default Autocomplete;
