const Attributes = ({ children }) => (
  <div className="m-0 p-0 attributes border-t">{children}</div>
);

const Attribute = ({ name, type, description }) => (
  <div className="attribute border-b py-2">
    <span>
      <span className="font-mono text-black text-xs">{name}</span>
      <span className="font-semibold text-gray-500 text-xs ml-2 py-0.5 px-1 border border-gray-100  bg-gray-50">
        {type}
      </span>
    </span>
    <span className="block text-sm mt-0 text-gray-600">{description}</span>
  </div>
);

export { Attributes, Attribute };
