import React from "react";

const Callout = ({ emoji, text }) => (
  <div className="flex w-full rounded-md border-sm border-1 border-solid border-transparent bg-gray-100 p-4 pr-3 mb-6">
    <div>
      <div className="flex items-center justify-center h-6 w-6 rounded-sm shrink-0">
        <div>
          <div className="w-full h-full">{emoji}</div>
        </div>
      </div>
    </div>
    <div className="flex-col min-w-0 ml-2 w-full">{text}</div>
  </div>
);

export default Callout;
