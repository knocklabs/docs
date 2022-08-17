import cn from "classnames";

const Endpoints = ({ children }) => (
  <div className="endpoints text-base lg:text-sm border dark:border-gray-800 rounded">
    <div className="bg-gray-100 dark:bg-[#2E2F34] border-b dark:border-b-gray-800 p-2 flex">
      <span className="mt-0 text-xs font-medium dark:text-gray-300">
        Endpoints
      </span>
    </div>
    <div className="m-0 py-2 px-4 dark:bg-gray-900">{children}</div>
  </div>
);

const Endpoint = ({ method, path }) => (
  <div className="my-3">
    <span
      className={cn({
        "text-xs font-medium text-gray-600 dark:text-gray-300 border border-transparent font-mono rounded p-1 center mr-3":
          true,
        "bg-blue-100 dark:bg-transparent dark:border-blue-600":
          method === "GET",
        "bg-green-100 dark:bg-transparent dark:border-green-600":
          method === "POST",
        "bg-yellow-100 dark:bg-transparent dark:border-yellow-500":
          method === "PUT",
        "bg-red-100 dark:bg-transparent dark:border-red-500":
          method === "DELETE",
      })}
    >
      {method}
    </span>
    <span className="font-mono text-xs text-gray-700 dark:text-gray-200">
      {path}
    </span>
  </div>
);

export { Endpoints, Endpoint };
