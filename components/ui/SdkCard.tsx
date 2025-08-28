import { Icon } from "@telegraph/icon";
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
  FaRegFileCode,
} from "react-icons/fa";
import { DiRuby, DiDotnet } from "react-icons/di";
import { FaGolang } from "react-icons/fa6";
import { SiElixir, SiFlutter, SiExpo } from "react-icons/si";
import {
  TbBrandKotlin,
  TbBrandReactNative,
  TbBrandNextjs,
} from "react-icons/tb";
import { Card } from "./Card";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Square } from "lucide-react";

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
  | "expo"
  | "nextjs"
  | "code";

export const icons: Record<SupportedIcon, React.ReactNode> = {
  default: <Icon icon={Square} aria-hidden={true} />,
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
  nextjs: <TbBrandNextjs />,
  code: <FaRegFileCode />,
};

type Props = {
  title: string;
  linkUrl: string;
  icon: SupportedIcon;
  languages: string[];
  isExternal?: boolean;
};

const SdkCardGroup = ({ children }) => (
  <Stack
    className="md-one-column"
    style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
    gap="2"
  >
    {children}
  </Stack>
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
      <Stack alignItems="center">
        {icons[icon]}
        <Text as="span" ml="2" size="1" weight="medium" color="gray">
          {languages.map((lang) => lang).join(" · ")}
        </Text>
      </Stack>
    }
    isExternal={isExternal}
  />
);

export { SdkCardGroup, SdkCard };
