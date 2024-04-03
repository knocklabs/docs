import React from "react";

const Steps = ({ titleSize = "p", children }) => (
  <div role="list" className="ml-3.5 mt-10 mb-6">
    {React.Children.map(children, (child, i) =>
      React.cloneElement(child, { titleSize, stepNumber: i + 1 }),
    )}
  </div>
);

function TitleTag({ size, children, title }) {
  const id=title.toLowerCase().replaceAll(" ", "-")
  const classNames =
    "!m-0 !mt-2 font-semibold !text-[16px] prose dark:prose-invert text-gray-900 dark:text-gray-200";

  switch (size) {
    case "p": {
      return <p id={id} className={classNames}>{children}</p>;
    }
    case "h2": {
      return <h2 id={id} className={classNames}>{children}</h2>;
    }
    case "h3": {
      return <h3 id={id} className={classNames}>{children}</h3>;
    }
    default:
      return null;
  }
}

const Step = ({ titleSize = "p", title, children, stepNumber }) => (
  <div role="listitem" className="relative flex items-start pb-4">
    <div className="absolute w-px h-[calc(100%-2.75rem)] top-[2.75rem] bg-gray-200/70 dark:bg-white/10" />
    <div className="absolute ml-[-14px] py-2">
      <div className="w-7 h-7 shrink-0 rounded-lg bg-gray-100 dark:text-white dark:bg-[#26292E] text-sm text-gray-800 font-semibold flex items-center justify-center">
        {stepNumber}
      </div>
    </div>
    <div className="w-full overflow-hidden pl-12 pr-px">
      <TitleTag size={titleSize} title={title}>{title}</TitleTag>
      <div className="!-mt-2">{children}</div>
    </div>
  </div>
);

export { Steps, Step };
