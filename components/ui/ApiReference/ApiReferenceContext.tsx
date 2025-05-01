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

export function useApiReference() {
  const context = useContext(ApiReferenceContext);
  if (context === undefined) {
    throw new Error(
      "useApiReference must be used within an ApiReferenceProvider",
    );
  }
  return context;
}

export default ApiReferenceContext;
