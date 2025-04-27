import { IoCubeOutline } from "react-icons/io5";
import { RiJavascriptFill } from "react-icons/ri";
import {
  FaNodeJs,
  FaPython,
  FaJava,
  FaPhp,
  FaReact,
  FaSwift,
  FaAngular,
  FaVuejs,
  FaYoutube,
} from "react-icons/fa";
import { DiRuby, DiDotnet } from "react-icons/di";
import { FaGolang } from "react-icons/fa6";
import { SiElixir, SiFlutter, SiExpo } from "react-icons/si";
import { TbBrandKotlin, TbBrandReactNative } from "react-icons/tb";
import { Card } from "./Card";

export type SupportedIcon =
  | "default"
  | "node"
  | "python"
  | "ruby"
  | "go"
  | "java"
  | "dotnet"
  | "elixir"
  | "php"
  | "javascript"
  | "react"
  | "swift"
  | "kotlin"
  | "flutter"
  | "reactnative"
  | "angular"
  | "vue"
  | "youtube"
  | "expo";

export const icons: Record<SupportedIcon, React.ReactNode> = {
  default: <IoCubeOutline />,
  node: <FaNodeJs />,
  python: <FaPython />,
  ruby: <DiRuby />,
  go: <FaGolang />,
  java: <FaJava />,
  dotnet: <DiDotnet />,
  elixir: <SiElixir />,
  php: <FaPhp />,
  javascript: <RiJavascriptFill />,
  react: <FaReact />,
  swift: <FaSwift />,
  kotlin: <TbBrandKotlin />,
  flutter: <SiFlutter />,
  reactnative: <TbBrandReactNative />,
  angular: <FaAngular />,
  vue: <FaVuejs />,
  youtube: <FaYoutube />,
  expo: <SiExpo />,
};

type Props = {
  title: string;
  linkUrl: string;
  icon: SupportedIcon;
  languages: string[];
  isExternal?: boolean;
};

const SdkCardGroup = ({ children }) => (
  <div className="grid grid-cols-3 gap-2">{children}</div>
);

const SdkCard: React.FC<Props> = ({
  title,
  linkUrl,
  icon = "default",
  languages,
  isExternal,
}) => (
  <Card
    title={title}
    linkUrl={linkUrl}
    footer={
      <div className="flex items-center text-gray-500 dark:text-gray-200">
        {icons[icon]}
        <span className="ml-2 text-[14px] font-medium">
          {languages.map((lang) => lang).join(" · ")}
        </span>
      </div>
    }
    isExternal={isExternal}
  />
);

export { SdkCardGroup, SdkCard };
