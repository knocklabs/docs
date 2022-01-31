import cn from "classnames";

const Endpoints = ({ children }) => (
  <div className="endpoints text-base lg:text-sm border rounded">
    <div className="bg-gray-100 border-b p-2 flex">
      <span className="mt-0 font-medium">Endpoints</span>
    </div>
    <div className="m-0 px-4">{children}</div>
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
    <span className="text-sm text-gray-700">{path}</span>
  </div>
);

export { Endpoints, Endpoint };
