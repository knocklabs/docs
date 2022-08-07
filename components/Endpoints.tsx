import cn from "classnames";

const Endpoints = ({ children }) => (
  <div className="endpoints text-base lg:text-sm border dark:border-gray-700 rounded">
    <div className="bg-gray-100 dark:bg-gray-600 border-b dark:border-b-gray-700 p-2 flex">
      <span className="mt-0 font-medium">Endpoints</span>
    </div>
    <div className="m-0 py-2 px-4 dark:bg-gray-900">{children}</div>
  </div>
);

const Endpoint = ({ method, path }) => (
  <div className="my-3">
    <span
      className={cn({
        "text-xs font-medium text-gray-500 rounded p-1 center mr-3": true,
        "bg-blue-100": method === "GET",
        "bg-green-100": method === "POST",
        "bg-yellow-100": method === "PUT",
        "bg-red-100": method === "DELETE",
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
