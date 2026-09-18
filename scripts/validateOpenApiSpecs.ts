import { readFile } from "fs/promises";
import { parse } from "yaml";

const SPEC_PATHS = {
  api: "./data/specs/api/openapi.yml",
  mapi: "./data/specs/mapi/openapi.yml",
};

interface OpenAPIDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths?: Record<string, unknown>;
  components?: Record<string, unknown>;
}

async function validateSpec(
  name: string,
  specPath: string,
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    const yamlContent = await readFile(specPath, "utf8");
    const spec = parse(yamlContent) as OpenAPIDocument;

    if (!spec.openapi) {
      errors.push(`Missing 'openapi' field`);
    } else if (!spec.openapi.startsWith("3.")) {
      errors.push(`OpenAPI version must be 3.x, got: ${spec.openapi}`);
    }

    if (!spec.info) {
      errors.push(`Missing 'info' object`);
    } else {
      if (!spec.info.title) {
        errors.push(`Missing 'info.title'`);
      }
      if (!spec.info.version) {
        errors.push(`Missing 'info.version'`);
      }
    }

    if (!spec.paths && !spec.components) {
      errors.push(`Spec must have either 'paths' or 'components'`);
    }

    const jsonContent = JSON.stringify(spec);
    if (!jsonContent) {
      errors.push(`Failed to convert YAML to JSON`);
    }

    console.log(
      `✓ ${name}: OpenAPI ${spec.openapi} - ${spec.info?.title} v${spec.info?.version}`,
    );
  } catch (error) {
    errors.push(`Failed to parse: ${(error as Error).message}`);
  }

  return { valid: errors.length === 0, errors };
}

async function main() {
  console.log("Validating OpenAPI specifications...\n");

  let hasErrors = false;

  for (const [name, specPath] of Object.entries(SPEC_PATHS)) {
    const { valid, errors } = await validateSpec(name, specPath);

    if (!valid) {
      hasErrors = true;
      console.error(`\n✗ ${name} (${specPath}):`);
      errors.forEach((err) => console.error(`  - ${err}`));
    }
  }

  console.log("");

  if (hasErrors) {
    console.error("OpenAPI validation failed.");
    process.exit(1);
  }

  console.log("All OpenAPI specifications are valid.");
}

main().catch((error) => {
  console.error("Validation failed:", error);
  process.exit(1);
});
