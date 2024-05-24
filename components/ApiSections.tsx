import cn from "classnames";
import SectionHeading from "./SectionHeading";

export const Section = ({
  title,
  slug,
  children,
  headingClassName = "",
  isIdempotent = false,
}) => (
  <section className="api-docs-section border-b border-gray-200 dark:border-gray-800 py-8 lg:py-16">
    {title && (
      <SectionHeading
        tag="h2"
        id={slug || title.toLowerCase()}
        className={cn([headingClassName, "mb-6"])}
      >
        {isIdempotent && (
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 border border-transparent font-mono rounded p-1 center mr-3 bg-yellow-100 dark:bg-transparent dark:border-yellow-500">
              <a href="#idempotent-requests">Idempotent</a>
            </span>
          </div>
        )}
        {title}
      </SectionHeading>
    )}
    <div className="flex flex-col md:flex-row">{children}</div>
  </section>
);

export const ContentColumn = ({ children }) => (
  <div className="api-docs-section__col md:pr-5 flex-grow-0 flex-shrink-0 w-full md:w-1/2">
    <div className="prose-sm lg:prose dark:prose-invert">{children}</div>
  </div>
);

export const ExampleColumn = ({ children }) => (
  <div className="api-docs-section__col api-docs-example mt-5 md:pl-5 md:mt-0 flex-grow-0 flex-shrink-0 w-full md:w-1/2">
    {children}
  </div>
);

export const ErrorExample = ({ title, description }) => (
  <div className="flex-col pt-6 mt-6 border-gray-200 border-t dark:border-gray-700">
    <span className="bg-code-background dark:bg-gray-800 text-code rounded text-sm font-normal py-0.75 px-1.5 font-mono inline-block">
      {title}
    </span>
    <span className="block pt-0 mt-1 text-gray-800 dark:text-gray-200 text-sm">
      {description}
    </span>
  </div>
);
