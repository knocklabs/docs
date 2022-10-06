const Attributes = ({ children }) => (
  <div className="m-0 p-0 attributes border-t dark:border-t-gray-800">
    {children}
  </div>
);

const Attribute = ({ name, type, defaultValue, description }) => (
  <div className="attribute border-b dark:border-b-gray-800 py-2">
    <span>
      <span className="font-mono text-xs">{name}</span>
      <span className="font-semibold text-gray-500 dark:text-gray-300 text-xs ml-2 py-0.5 px-1 border border-gray-100 bg-gray-50 dark:bg-transparent dark:border-transparent">
        {type}
      </span>
      {defaultValue && (
        <span className="font-semibold text-gray-500 dark:text-gray-300 text-xs ml-2 py-0.5 px-1 border border-gray-100 bg-gray-50 dark:bg-transparent dark:border-transparent">
          default: {defaultValue}
        </span>
      )}
    </span>
    <span className="block text-sm mt-0 text-gray-600 dark:text-gray-300">
      {description}
    </span>
  </div>
);

export { Attributes, Attribute };
