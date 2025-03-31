import { createContext, useContext, ReactNode } from "react";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { StainlessConfig } from "../../lib/openApiSpec";

interface ApiReferenceContextType {
  openApiSpec: OpenAPIV3.Document;
  stainlessConfig: StainlessConfig;
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
  return (
    <ApiReferenceContext.Provider value={{ openApiSpec, stainlessConfig }}>
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
