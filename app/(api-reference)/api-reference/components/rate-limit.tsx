"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  tier: 1 | 2 | 3 | 4 | 5;
  isBatch?: boolean;
};

const tierConfig = {
  5: {
    color: "bg-purple-100 text-purple-800",
    tooltip: "1,000 requests / second",
  },
  4: {
    color: "bg-green-100 text-green-800",
    tooltip: "200 requests / second",
  },
  3: {
    color: "bg-blue-100 text-blue-800",
    tooltip: "60 requests / second",
  },
  2: {
    color: "bg-yellow-100 text-yellow-800",
    tooltip: "5 requests / second",
  },
  1: {
    color: "bg-red-100 text-red-800",
    tooltip: "1 request / second",
  },
} as const;

const batchConfig = {
  1: {
    tooltip: "1 update / second / entity",
    color: "bg-red-100 text-red-800",
  },
};

export function RateLimitAppRouter({ tier, isBatch = false }: Props) {
  const pathname = usePathname() ?? "";
  const paths = pathname.split("/");
  const basePath = paths[1] ?? "";
  const inOverview = paths[2] === "overview";

  const tooltip = isBatch
    ? batchConfig[tier].tooltip
    : tierConfig[tier].tooltip;
  const colorClass = isBatch ? batchConfig[tier].color : tierConfig[tier].color;
  const renderLink = !inOverview && basePath === "api-reference";

  const content = (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}
      title={tooltip}
    >
      {isBatch ? "Batch Tier " : "Tier "}
      {tier}
    </span>
  );

  if (renderLink) {
    return (
      <Link
        href={`/${basePath}/overview/rate-limits`}
        className="no-underline"
      >
        {content}
      </Link>
    );
  }

  return content;
}
