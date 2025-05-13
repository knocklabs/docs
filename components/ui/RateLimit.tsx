import { Tag } from "@telegraph/tag";
import { Tooltip } from "@telegraph/tooltip";
import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
  tier: 1 | 2 | 3 | 4 | 5;
  isBatch?: boolean;
};

const RateLimit: React.FC<Props> = ({ tier, isBatch = false }) => {
  const router = useRouter();
  const paths = router.asPath.split("/");
  const pathname = paths[1];
  const inOverview = paths[2] === "overview";
  const tierConfig = {
    5: {
      color: "purple",
      tooltip: "1,000 requests / second",
    },
    4: {
      color: "green",
      tooltip: "200 requests / second",
    },
    3: {
      color: "blue",
      tooltip: "60 requests / second",
    },
    2: {
      color: "yellow",
      tooltip: "5 requests / second",
    },
    1: {
      color: "red",
      tooltip: "1 request / second",
    },
  } as const;

  const batchConfig = {
    1: {
      tooltip: "1 update / second / entity",
      color: "red",
    },
  };

  const tooltip = isBatch
    ? batchConfig[tier].tooltip
    : tierConfig[tier].tooltip;
  const renderLink = !inOverview && pathname === "api-reference";

  return (
    <Tooltip label={tooltip} side="right">
      <Tag
        as={renderLink ? Link : "div"}
        href={renderLink ? `/${pathname}/overview/rate-limits` : ``}
        color={isBatch ? batchConfig[tier].color : tierConfig[tier].color}
        style={{
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        {isBatch ? "Batch Tier " : "Tier "}
        {tier}
      </Tag>
    </Tooltip>
  );
};

export default RateLimit;
