import type { OpenAPIV3 } from "@scalar/openapi-types";

export type SpecName = "api" | "mapi";

export type StainlessMethodConfig =
  | string
  | { type: "http"; endpoint: string; positional_params?: string[] };

export interface StainlessResource {
  name?: string;
  description?: string;
  models?: Record<string, string>;
  methods?: Record<string, StainlessMethodConfig>;
  subresources?: Record<string, StainlessResource>;
}

export interface StainlessConfig {
  resources: Record<string, StainlessResource>;
  environments: Record<string, string>;
}

export interface MethodData {
  methodName: string;
  methodType: "get" | "post" | "put" | "delete" | "patch";
  endpoint: string;
  operation: OpenAPIV3.OperationObject;
}

export interface SchemaData {
  modelName: string;
  schema: OpenAPIV3.SchemaObject;
}

export interface ResourceData {
  resourceName: string;
  resource: StainlessResource;
  methods: MethodData[];
  schemas: SchemaData[];
  subresources: ResourceData[];
}

export interface SidebarItem {
  title: string;
  slug: string;
  pages?: SidebarItem[];
}
