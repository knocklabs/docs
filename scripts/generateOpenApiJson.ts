import fs from "fs";
import path from "path";
import { parse } from "yaml";

type SpecName = "api" | "mapi";

const OUTPUT_FILES: Record<SpecName, string> = {
  api: "openapi.json",
  mapi: "mapi-openapi.json",
};

function generateOpenApiJson(specName: SpecName) {
  const yamlPath = path.join(
    process.cwd(),
    "data/specs",
    specName,
    "openapi.yml",
  );
  const yamlContent = fs.readFileSync(yamlPath, "utf-8");
  const openApiDocument = parse(yamlContent);
  const outputPath = path.join(
    process.cwd(),
    "public",
    OUTPUT_FILES[specName],
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2));
}

function generateAllOpenApiJsonFiles() {
  generateOpenApiJson("api");
  generateOpenApiJson("mapi");
  console.log("✅ OpenAPI JSON files generated successfully");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllOpenApiJsonFiles();
}

export { generateAllOpenApiJsonFiles };
