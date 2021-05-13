const Attributes = ({ children }) => (
  <div className="m-0 p-0 attributes">{children}</div>
);

const Attribute = ({ name, type, description }) => (
  <div className="attribute border-b py-2">
    <span>
      <span className="font-mono text-black text-sm">{name}</span>
      <span className="font-semibold text-gray-400 text-xs ml-3">{type}</span>
    </span>
    <span className="block text-sm mt-0">{description}</span>
  </div>
);

export { Attributes, Attribute };
