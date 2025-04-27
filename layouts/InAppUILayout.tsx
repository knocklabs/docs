import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Page } from "@/components/ui/Page";
import { Sidebar } from "@/components/ui/Page/Sidebar";
import {
  mainContent,
  sdkSpecificContent,
  type Language,
  type SdkSpecificContent,
} from "../data/inAppSidebar";
import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";
import { Box } from "@telegraph/layout";
import { Stack } from "@telegraph/layout";
import { Select } from "@telegraph/select";
import { Text } from "@telegraph/typography";

const languages = Object.keys(sdkSpecificContent);

const InAppUILayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  const paths = slugToPaths(router.query.slug);
  const [selectedSdk, setSelectedSdk] = useState<Language>(() => {
    const sdk = paths[1];
    if (sdk && sdkSpecificContent[sdk as Language]) {
      return sdk as Language;
    }
    return Object.keys(sdkSpecificContent)[0] as Language;
  });
  const selectedSdkContent = sdkSpecificContent[selectedSdk];

  useEffect(() => {
    const content = document.querySelector(".main-content");

    // Right now we need this hack to ensure that we scroll the main content to
    // the top of the view when navigating.
    if (content) {
      content.scrollTop = 0;
    }
  }, [paths]);

  const { breadcrumbs } = useMemo(
    () => getSidebarInfo(paths, sdkSpecificContent[selectedSdk].items),
    [paths, sdkSpecificContent, selectedSdk],
  );

  // Update URL state when the SDK changes
  const handleSdkChange = (value: Language) => {
    setSelectedSdk(value);
    const newContent = sdkSpecificContent[value].items[0];
    router.push(`${newContent.slug}${newContent.pages[0].slug}`);
    return value;
  };

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
      />
      <Page.Masthead title={frontMatter.title} />
      <Page.Wrapper>
        <Sidebar.Wrapper>
          <Stack direction="column" gap="2">
            {mainContent.map((section) => (
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
                onValueChange={(value) => {
                  handleSdkChange(value as Language);
                }}
                size="2"
              >
                {languages.map((language) => {
                  const sdk: SdkSpecificContent = sdkSpecificContent[language];
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
          </Stack>
        </Sidebar.Wrapper>
        <Page.Content>
          {breadcrumbs && <Page.Breadcrumbs pages={breadcrumbs} />}
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
