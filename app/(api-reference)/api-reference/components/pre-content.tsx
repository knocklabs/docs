import type { SpecName } from "../../../../lib/openapi/types";

interface PreContentProps {
  specName: SpecName;
}

// Simplified pre-content - MDX content will be rendered elsewhere
export async function PreContent({ specName }: PreContentProps) {
  return (
    <section className="py-16 border-b border-gray-200" data-resource-path="/overview">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-600 mb-4">
            {specName === "api"
              ? "The Knock API enables you to add a complete notification engine to your product. This API provides programmatic access to integrating Knock via a REST-ful API."
              : "The Knock Management API enables you to manage your Knock resources programmatically. Use this API to automate configuration changes and integrate with your CI/CD pipelines."}
          </p>
        </div>
        <div>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Base URL</p>
            <code className="text-sm">
              {specName === "api"
                ? "https://api.knock.app/v1"
                : "https://control.knock.app/v1"}
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}
