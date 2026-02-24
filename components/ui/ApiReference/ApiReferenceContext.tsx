import { createContext, useContext, ReactNode, useMemo } from "react";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { StainlessConfig, SplitResourceData } from "../../../lib/openApiSpec";
import { buildSchemaReferences } from "./helpers";
import { useRouter } from "next/router";

interface ApiReferenceContextType {
  openApiSpec: OpenAPIV3.Document;
  stainlessConfig: StainlessConfig;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

/**
 * Context type for split resource data.
 * Uses a minimal OpenAPI document structure with only the paths and schemas needed.
 */
interface SplitApiReferenceContextType {
  openApiSpec: OpenAPIV3.Document;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

const ApiReferenceContext = createContext<ApiReferenceContextType | undefined>(
  undefined,
);

const SplitApiReferenceContext = createContext<
  SplitApiReferenceContextType | undefined
>(undefined);

/**
 * Lightweight context that only provides schemaReferences and baseUrl.
 * Used by multi-page API reference components.
 */
interface LightweightContextType {
  schemaReferences: Record<string, string>;
  baseUrl: string;
}

const LightweightContext = createContext<LightweightContextType | undefined>(
  undefined,
);

interface ApiReferenceProviderProps {
  children: ReactNode;
  openApiSpec: OpenAPIV3.Document;
  stainlessConfig: StainlessConfig;
}

export function ApiReferenceProvider({
  children,
  openApiSpec,
  stainlessConfig,
}: ApiReferenceProviderProps) {
  const router = useRouter();
  const basePath = router.pathname.split("/")[1];

  const baseUrl = stainlessConfig.environments.production;
  const schemaReferences = buildSchemaReferences(
    openApiSpec,
    stainlessConfig,
    Object.keys(stainlessConfig.resources),
    `/${basePath}`,
  );

  return (
    <ApiReferenceContext.Provider
      value={{ openApiSpec, stainlessConfig, baseUrl, schemaReferences }}
    >
      {children}
    </ApiReferenceContext.Provider>
  );
}

/**
 * Provider for split resource data.
 * Converts split data into a minimal OpenAPI document structure that components can use.
 */
interface SplitApiReferenceProviderProps {
  children: ReactNode;
  data: SplitResourceData;
}

export function SplitApiReferenceProvider({
  children,
  data,
}: SplitApiReferenceProviderProps) {
  // Build a minimal OpenAPI document from the split data
  const openApiSpec = useMemo<OpenAPIV3.Document>(() => {
    return {
      openapi: "3.0.0",
      info: { title: "", version: "" },
      paths: data.paths,
      components: {
        schemas: data.schemas,
      },
    };
  }, [data.paths, data.schemas]);

  return (
    <SplitApiReferenceContext.Provider
      value={{
        openApiSpec,
        baseUrl: data.baseUrl,
        schemaReferences: data.schemaReferences,
      }}
    >
      {children}
    </SplitApiReferenceContext.Provider>
  );
}

/**
 * Lightweight provider for multi-page API reference that only needs
 * schemaReferences and baseUrl (without loading full specs).
 */
interface LightweightApiReferenceProviderProps {
  children: ReactNode;
  schemaReferences: Record<string, string>;
  baseUrl: string;
}

export function LightweightApiReferenceProvider({
  children,
  schemaReferences,
  baseUrl,
}: LightweightApiReferenceProviderProps) {
  return (
    <LightweightContext.Provider value={{ baseUrl, schemaReferences }}>
      {children}
    </LightweightContext.Provider>
  );
}

/**
 * Hook that returns the API reference context.
 * Works with both the full ApiReferenceProvider and SplitApiReferenceProvider.
 */
export function useApiReference() {
  const fullContext = useContext(ApiReferenceContext);
  const splitContext = useContext(SplitApiReferenceContext);

  if (fullContext) {
    return fullContext;
  }

  if (splitContext) {
    return splitContext;
  }

  throw new Error(
    "useApiReference must be used within an ApiReferenceProvider or SplitApiReferenceProvider",
  );
}

/**
 * Hook that returns schemaReferences from any of the available contexts.
 * Use this in components that only need schemaReferences.
 */
export function useSchemaReferences(): Record<string, string> {
  const fullContext = useContext(ApiReferenceContext);
  const splitContext = useContext(SplitApiReferenceContext);
  const lightweightContext = useContext(LightweightContext);

  if (fullContext) {
    return fullContext.schemaReferences;
  }

  if (splitContext) {
    return splitContext.schemaReferences;
  }

  if (lightweightContext) {
    return lightweightContext.schemaReferences;
  }

  throw new Error(
    "useSchemaReferences must be used within an ApiReferenceProvider, SplitApiReferenceProvider, or LightweightApiReferenceProvider",
  );
}

export default ApiReferenceContext;
