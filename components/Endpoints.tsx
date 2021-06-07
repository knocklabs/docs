const Endpoints = ({ children }) => (
  <div className="endpoints text-base lg:text-sm border rounded">
    <div className="bg-gray-100 border-b p-2 flex">
      <span className="mt-0 font-medium">Endpoints</span>
    </div>
    <div className="m-0 px-4">{children}</div>
  </div>
);

const Endpoint = ({ method, path, name }) => (
  <div className="my-3">
    <span className="bg-blue-500 text-xs font-semibold text-white rounded p-1 center mr-2">
      {method}
    </span>
    <span className="text-sm">{path}</span>
  </div>
);

export { Endpoints, Endpoint };
