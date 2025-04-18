const Attributes = ({ children }) => (
  <div className="m-0 p-0 attributes border-t dark:border-t-gray-800">
    {children}
  </div>
);

type Props = {
  name: string;
  type: string;
  description: string;
  typeSlug?: string;
  nameSlug?: string;
  isRequired?: boolean;
};

const Attribute = ({
  name,
  type,
  description,
  typeSlug,
  nameSlug,
  isRequired,
}: Props) => (
  <div className="attribute border-b dark:border-b-gray-800 py-2">
    <span>
      <span className="font-mono text-xs">
        {!!nameSlug ? (
          <a
            href={nameSlug}
            className="not-prose transition-colors hover:text-gray-900 dark:hover:text-gray-100 text-brand hover:!text-brand-dark"
          >
            {name}
          </a>
        ) : (
          name
        )}
      </span>
      <span className="font-semibold text-gray-500 dark:text-gray-300 text-xs ml-2 py-0.5 px-1 border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        {/* Pass an optional `typeSlug` to link the `type` to its definition in the docs*/}
        {!!typeSlug ? (
          <a
            href={typeSlug}
            className="not-prose transition-colors hover:text-gray-900 dark:hover:text-gray-100 text-brand hover:!text-brand-dark"
          >
            {type}
          </a>
        ) : (
          type
        )}
      </span>
      {isRequired && (
        <span className="font-semibold text-brand-dark bg-brand-light/10 dark:text-brand-light dark:bg-zinc-800/30 dark:border dark:border-zinc-700/50 text-xs ml-2 py-0.5 px-1">
          required
        </span>
      )}
    </span>
    <span className="block text-sm mt-0 text-gray-600 dark:text-gray-300">
      {description}
    </span>
  </div>
);

export { Attributes, Attribute };
