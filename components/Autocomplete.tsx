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
    // in "/" being diplayed on the input
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
    <div
      className="aa-Autocomplete hidden md:block"
      {...autocomplete.getRootProps({})}
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
            className="aa-Input !h-9 !w-[300px] !text-[14px] dark:!text-white"
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
        <div className="!w-[500px] !bg-white z-50 aa-Panel">
          {autocompleteState?.collections.map((collection, index) => {
            const { source, items } = collection;

            return (
              <div key={`source-${index}`} className="aa-Source">
                {items.length > 0 && (
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
                            <span className="mt-2 text-gray-400 font-medium text-[12px]">
                              {(item as ResultItem).section}
                            </span>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
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
