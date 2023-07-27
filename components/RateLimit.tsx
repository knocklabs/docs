import cn from "classnames";

type Props = {
  tier: 1 | 2 | 3 | 4 | 5;
  isBatch?: boolean;
};

const RateLimit: React.FC<Props> = ({ tier, isBatch = false }) => (
  <span
    className={cn({
      "text-xs font-medium text-gray-600 dark:text-gray-300 border border-transparent font-mono rounded p-1 center mr-3":
        true,
      "bg-purple-100 dark:bg-transparent dark:border-purple-600": tier === 5,
      "bg-green-100 dark:bg-transparent dark:border-green-600": tier === 4,
      "bg-blue-100 dark:bg-transparent dark:border-blue-600": tier === 3,
      "bg-yellow-100 dark:bg-transparent dark:border-yellow-500": tier === 2,
      "bg-red-100 dark:bg-transparent dark:border-red-500": tier === 1,
    })}
  >
    {isBatch ? "Batch Tier " : "Tier "}
    {tier}
  </span>
);

export default RateLimit;
