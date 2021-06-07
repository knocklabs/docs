export const Section = ({ title, slug, children }) => (
  <section className="api-docs-section border-b border-gray-200 py-16">
    <h2 id={slug || title.toLowerCase()} className="mb-6">
      {title}
    </h2>
    <div className="flex flex-col md:flex-row">{children}</div>
  </section>
);

export const ContentColumn = ({ children }) => (
  <div className="api-docs-section__col md:pr-5 flex-grow-0 flex-shrink-0 w-full md:w-1/2">
    <div className="prose-sm lg:prose">{children}</div>
  </div>
);

export const ExampleColumn = ({ children }) => (
  <div className="api-docs-section__col api-docs-example mt-5 md:pl-5 md:mt-0 flex-grow-0 flex-shrink-0 w-full md:w-1/2">
    {children}
  </div>
);
