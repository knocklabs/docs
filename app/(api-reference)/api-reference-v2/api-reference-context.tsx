"use client";

/**
 * Client-side context for API reference components.
 *
 * This is similar to the existing ApiReferenceContext but designed
 * for the App Router. The key difference is that the data is passed
 * from the server component rather than loaded via getStaticProps.
 */

import { createContext, useContext, ReactNode } from "react";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { StainlessConfig } from "../../../lib/openApiSpec";

interface ApiReferenceContextType {
  openApiSpec: OpenAPIV3.Document;
  stainlessConfig: StainlessConfig;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

const ApiReferenceContext = createContext<ApiReferenceContextType | undefined>(
  undefined
);

interface ApiReferenceProviderProps {
  children: ReactNode;
  openApiSpec: OpenAPIV3.Document;
  stainlessConfig: StainlessConfig;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

export function ApiReferenceProvider({
  children,
  openApiSpec,
  stainlessConfig,
  baseUrl,
  schemaReferences,
}: ApiReferenceProviderProps) {
  return (
    <ApiReferenceContext.Provider
      value={{ openApiSpec, stainlessConfig, baseUrl, schemaReferences }}
    >
      {children}
    </ApiReferenceContext.Provider>
  );
}

export function useApiReference() {
  const context = useContext(ApiReferenceContext);
  if (context === undefined) {
    throw new Error(
      "useApiReference must be used within an ApiReferenceProvider"
    );
  }
  return context;
}

export default ApiReferenceContext;
