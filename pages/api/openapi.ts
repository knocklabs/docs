import { readFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import { parse, stringify } from "yaml";

const SPEC_PATHS = {
  api: "./data/specs/api/openapi.yml",
  mapi: "./data/specs/mapi/openapi.yml",
};

async function loadSpec(specName: "api" | "mapi") {
  const specPath = SPEC_PATHS[specName];
  const yamlContent = await readFile(specPath, "utf8");
  return { yamlContent, jsonContent: parse(yamlContent) };
}

function getResponseFormat(req: NextApiRequest): "json" | "yaml" {
  const accept = req.headers.accept || "";
  const formatQuery = req.query.format;

  if (formatQuery === "yaml" || formatQuery === "yml") {
    return "yaml";
  }
  if (formatQuery === "json") {
    return "json";
  }

  if (
    accept.includes("application/x-yaml") ||
    accept.includes("text/yaml") ||
    accept.includes("application/yaml")
  ) {
    return "yaml";
  }

  return "json";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .setHeader("Allow", "GET")
      .json({
        code: "method_not_allowed",
        message: `${req.method} method is not accepted.`,
        status: 405,
        type: "invalid_request_error",
      });
  }

  const specName = (req.query.spec as string) || "api";

  if (specName !== "api" && specName !== "mapi") {
    return res.status(400).json({
      code: "invalid_spec",
      message: 'Invalid spec. Use "api" or "mapi".',
      status: 400,
      type: "invalid_request_error",
    });
  }

  try {
    const { yamlContent, jsonContent } = await loadSpec(specName);
    const format = getResponseFormat(req);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );

    if (format === "yaml") {
      res.setHeader("Content-Type", "application/x-yaml; charset=utf-8");
      return res.status(200).send(yamlContent);
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(jsonContent);
  } catch (error) {
    console.error(`Error loading OpenAPI spec (${specName}):`, error);
    return res.status(500).json({
      code: "openapi_spec_unavailable",
      message: "Failed to load OpenAPI spec.",
      status: 500,
      type: "server_error",
    });
  }
}
