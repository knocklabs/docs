import classNames from "classnames";
import { IoChevronDown } from "react-icons/io5";

const Header = ({ children }) => (
  <div className="flex flex-row items-center">{children}</div>
);

const Wrapper = ({ children }) => (
  <div className="attributes border-b dark:border-b-gray-800 last:border-b-0">
    {children}
  </div>
);

const Container = ({ children }) => {
  return (
    <div className="attribute border-t dark:border-t-gray-800 pt-2 pb-2">
      {children}
    </div>
  );
};

const Name = ({ children }) => (
  <span className="font-mono font-bold text-xs mr-1">{children}</span>
);

const Types = ({ children }) => (
  <div className="flex flex-row items-center gap-1 overflow-x-hidden">
    {children}
  </div>
);

const Type = ({ children }) => (
  <span className="font-mono text-xs px-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md">
    {children}
  </span>
);

const Description = ({ children }) => (
  <div className="text-sm text-gray-500 dark:text-gray-300 schema-property-description">
    {children}
  </div>
);

const Required = () => (
  <span className="font-mono text-xs text-red-500 px-2">Required</span>
);

const ExpandableButton = ({ children, isOpen, onClick }) => (
  <button
    className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-300 mt-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
    onClick={onClick}
  >
    <IoChevronDown
      className={classNames("w-3 h-3", { "rotate-180": isOpen })}
    />
    {children}
  </button>
);

const ChildProperties = ({ children }) => (
  <div className="pl-2 mt-2 -mb-2 property-row-child-properties">
    {children}
  </div>
);

const PropertyTag = ({ children }) => (
  <span className="font-mono text-xs px-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md">
    {children}
  </span>
);

const PropertyRow = Object.assign({
  Wrapper,
  Container,
  Header,
  Name,
  Types,
  Type,
  Required,
  Description,
  ExpandableButton,
  ChildProperties,
  PropertyTag,
});

export { PropertyRow };
