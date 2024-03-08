import { IoCubeOutline } from "react-icons/io5";
import { Card } from "./Card";

type Props = {
  title: string;
  linkUrl: string;
  languages: string[];
};

const SdkCardGroup = ({ children }) => (
  <div className="grid grid-cols-3 gap-2">{children}</div>
);

const SdkCard: React.FC<Props> = ({ title, linkUrl, languages }) => (
  <Card
    title={title}
    linkUrl={linkUrl}
    footer={
      <div className="flex items-center text-gray-500 dark:text-gray-200">
        <IoCubeOutline />
        <span className="ml-2 text-[14px] font-medium">
          {languages.map((lang) => lang).join(" · ")}
        </span>
      </div>
    }
  />
);

export { SdkCardGroup, SdkCard };
