import React from "react";

const Steps = ({ children }) => (
  <div role="list" className="ml-3.5 mt-10 mb-6">
    {React.Children.map(children, (child, i) =>
      React.cloneElement(child, { stepNumber: i + 1 }),
    )}
  </div>
);

const Step = ({ title, children, stepNumber }) => (
  <div role="listitem" className="relative flex items-start pb-2">
    <div className="absolute w-px h-[calc(100%-2.75rem)] top-[2.75rem] bg-gray-200/70 dark:bg-white/10" />
    <div className="absolute ml-[-14px] py-2">
      <div className="w-7 h-7 shrink-0 rounded-lg bg-gray-100 dark:text-white dark:bg-[#26292E] text-sm text-gray-800 font-semibold flex items-center justify-center">
        {stepNumber}
      </div>
    </div>
    <div className="w-full overflow-hidden pl-12 pr-px">
      <p className="!m-0 !mt-2 font-semibold prose dark:prose-invert text-gray-900 dark:text-gray-200">
        {title}
      </p>
      <div>{children}</div>
    </div>
  </div>
);

export { Steps, Step };
