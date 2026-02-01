import { createContext, useContext, ReactNode } from "react";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { StainlessConfig } from "../../../lib/openApiSpec";
import { buildSchemaReferences } from "./helpers";
import { useRouter } from "next/router";

interface ApiReferenceContextType {
  openApiSpec: OpenAPIV3.Document;
  stainlessConfig: StainlessConfig;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

const ApiReferenceContext = createContext<ApiReferenceContextType | undefined>(
  undefined,
);

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

export function useApiReference() {
  const context = useContext(ApiReferenceContext);
  if (context === undefined) {
    throw new Error(
      "useApiReference must be used within an ApiReferenceProvider",
    );
  }
  return context;
}

/**
 * Hook that returns schemaReferences from either the full or lightweight context.
 * Use this in components that only need schemaReferences.
 */
export function useSchemaReferences(): Record<string, string> {
  const fullContext = useContext(ApiReferenceContext);
  const lightweightContext = useContext(LightweightContext);

  if (fullContext) {
    return fullContext.schemaReferences;
  }

  if (lightweightContext) {
    return lightweightContext.schemaReferences;
  }

  throw new Error(
    "useSchemaReferences must be used within an ApiReferenceProvider or LightweightApiReferenceProvider",
  );
}

export default ApiReferenceContext;
