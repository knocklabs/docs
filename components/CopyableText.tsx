import React from "react";
import { IoCheckmark, IoCopy } from "react-icons/io5";
import useClipboard from "react-use-clipboard";

const CopyableText = ({ content, label }) => {
  const [isCopied, setCopied] = useClipboard(content, {
    successDuration: 2000,
  });

  return (
    <span>
      <button
        type="button"
        onClick={setCopied}
        className="flex inline h-full items-center font-medium text-[14px] leading-[21px] px-3 py-1 border text-brand hover:text-brand-dark border-brand rounded-md font-semibold md:inline"
      >
        {label}&nbsp;{isCopied ? <IoCheckmark /> : <IoCopy />}
      </button>
    </span>
  );
};

export default CopyableText;
