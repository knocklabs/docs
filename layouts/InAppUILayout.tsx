import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Page } from "@/components/ui/Page";
import { Sidebar, SidebarContext } from "@/components/ui/Page/Sidebar";
import {
  IN_APP_UI_SIDEBAR,
  REACT_SIDEBAR,
  JAVASCRIPT_SIDEBAR,
  ANGULAR_SIDEBAR,
  REACT_NATIVE_SIDEBAR,
  SWIFT_SIDEBAR,
  ANDROID_SIDEBAR,
  FLUTTER_SIDEBAR,
  EXPO_SIDEBAR,
  type Language,
  type SdkSpecificContent,
} from "../data/sidebars/inAppSidebar";
import Meta from "../components/Meta";
import { getInAppSidebar, slugToPaths } from "../lib/content";
import { Box } from "@telegraph/layout";
import { Stack } from "@telegraph/layout";
import { Select } from "@telegraph/select";
import { Text } from "@telegraph/typography";
import { icons } from "@/components/ui/SdkCard";
import {
  MobileSidebar,
  useMobileSidebar,
} from "@/components/ui/Page/MobileSidebar";

const languageMap = {
  react: {
    title: "React",
    value: "react",
    icon: icons.react,
    items: REACT_SIDEBAR,
  },
  javascript: {
    title: "JavaScript",
    value: "javascript",
    icon: icons.javascript,
    items: JAVASCRIPT_SIDEBAR,
  },
  angular: {
    title: "Angular",
    value: "angular",
    icon: icons.angular,
    items: ANGULAR_SIDEBAR,
  },
  "react-native": {
    title: "React Native",
    value: "react-native",
    icon: icons.reactnative,
    items: REACT_NATIVE_SIDEBAR,
  },
  ios: {
    title: "Swift",
    value: "ios",
    icon: icons.swift,
    items: SWIFT_SIDEBAR,
  },
  android: {
    title: "Android (Kotlin)",
    value: "android",
    icon: icons.kotlin,
    items: ANDROID_SIDEBAR,
  },
  flutter: {
    title: "Flutter",
    value: "flutter",
    icon: icons.flutter,
    items: FLUTTER_SIDEBAR,
  },
  expo: {
    title: "Expo",
    value: "expo",
    icon: icons.expo,
    items: EXPO_SIDEBAR,
  },
};

const InAppSidebar = ({
  selectedSdk,
  selectedSdkContent,
  handleSdkChange,
}: {
  selectedSdk: Language;
  selectedSdkContent: SdkSpecificContent;
  handleSdkChange: (value: Language) => void;
}) => {
  const { isOpen: isMobileSidebarOpen, closeSidebar: closeMobileSidebar } =
    useMobileSidebar();

  const onSdkChange = (value) => {
    handleSdkChange(value as Language);
    if (isMobileSidebarOpen) {
      closeMobileSidebar();
    }
  };

  return (
    <>
      {IN_APP_UI_SIDEBAR.map((section) => (
        <Sidebar.Section key={section.slug} section={section} />
      ))}
      <Text
        as="span"
        weight="medium"
        color="default"
        style={{ fontSize: "13px" }}
        ml="2"
      >
        Select your SDK
      </Text>
      <Box>
        <Select.Root
          placeholder="Select an option"
          value={selectedSdk}
          onValueChange={onSdkChange}
          size="2"
        >
          {Object.keys(languageMap).map((language) => {
            const sdk: SdkSpecificContent = languageMap[language];
            return (
              <Select.Option key={sdk.value} value={sdk.value}>
                <Stack direction="row" gap="2" alignItems="center">
                  {sdk.icon}
                  {sdk.title}
                </Stack>
              </Select.Option>
            );
          })}
        </Select.Root>
      </Box>
      {selectedSdkContent.items.map((section) => (
        <Sidebar.Section key={section.slug} section={section} />
      ))}
    </>
  );
};

const InAppUILayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  const paths = slugToPaths(router.query.slug);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [selectedSdk, setSelectedSdk] = useState<Language>(() => {
    const sdk = paths[1];
    if (sdk && languageMap[sdk as Language]) {
      return sdk as Language;
    }
    return Object.keys(languageMap)[0] as Language;
  });

  const selectedSdkContent = languageMap[selectedSdk];
  const allSidebarContent = [...IN_APP_UI_SIDEBAR, ...selectedSdkContent.items];

  useEffect(() => {
    const content = document.querySelector(".main-content");

    // Right now we need this hack to ensure that we scroll the main content to
    // the top of the view when navigating.
    if (content) {
      content.scrollTop = 0;
    }
  }, [paths]);

  const { breadcrumbs } = useMemo(
    () => getInAppSidebar(paths, allSidebarContent, selectedSdkContent),
    [paths, allSidebarContent, selectedSdkContent],
  );

  // Update URL state when the SDK changes
  const handleSdkChange = (value: Language) => {
    setSelectedSdk(value);
    const newContent = languageMap[value].items[0];
    router.push(`${newContent.slug}${newContent.pages[0].slug}`);
    return value;
  };

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
      />
      <Page.Masthead
        title={frontMatter.title}
        mobileSidebar={
          <MobileSidebar>
            <InAppSidebar
              selectedSdk={selectedSdk}
              selectedSdkContent={selectedSdkContent}
              handleSdkChange={handleSdkChange}
            />
          </MobileSidebar>
        }
      />
      <Page.Wrapper>
        <SidebarContext.Provider value={{ samePageRouting: false }}>
          <Sidebar.FullLayout scrollerRef={scrollerRef}>
            <Sidebar.ScrollContainer scrollerRef={scrollerRef}>
              <Stack direction="column" gap="2">
                <InAppSidebar
                  selectedSdk={selectedSdk}
                  selectedSdkContent={selectedSdkContent}
                  handleSdkChange={handleSdkChange}
                />
              </Stack>
            </Sidebar.ScrollContainer>
          </Sidebar.FullLayout>
        </SidebarContext.Provider>
        <Page.Content>
          <Page.TopContainer>
            {breadcrumbs && <Page.Breadcrumbs pages={breadcrumbs} />}
            <Page.ContentActions pages={allSidebarContent} />
          </Page.TopContainer>
          <Page.ContentHeader
            title={frontMatter.title}
            description={frontMatter.description}
          />
          <Page.ContentBody>{children}</Page.ContentBody>
        </Page.Content>
        {frontMatter.showNav !== false && (
          <Page.OnThisPage title={frontMatter.title} sourcePath={sourcePath} />
        )}
      </Page.Wrapper>
    </Page.Container>
  );
};

export default InAppUILayout;
