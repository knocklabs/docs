import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { Button } from "@telegraph/button";

import Link from "next/link";
import { MenuItem } from "@telegraph/menu";
import { Icon, Lucide } from "@telegraph/icon";
import { Tabs } from "@telegraph/tabs";

import "../styles/global.css";
import { PageHeader } from "../components/ui/PageHeader";
import { Breadcrumbs } from "../components/ui/Breadcrumbs";

const NewDesign = () => {
  return (
    <Box>
      <PageHeader title="What is Knock?" />
      <Stack>
        <Box width="60" py="2" px="4">
          <Stack direction="column">
            <Box px="3" py="1">
              <Text as="span" weight="medium" size="2">
                Getting started
              </Text>
            </Box>
            <MenuItem color="gray" size="2">
              What is Knock?
            </MenuItem>
            <MenuItem color="gray" size="2">
              Quick start
            </MenuItem>
            <MenuItem color="gray" size="2">
              Example apps
            </MenuItem>
          </Stack>
        </Box>
        <Stack direction="row" py="6" width="full">
          <Box style={{ maxWidth: "600px" }} ml="16">
            <Heading as="h1" size="7" mb="2">
              What is Knock?
            </Heading>
            <Text as="p" size="4" color="gray">
              Learn more about what Knock does and how it helps power your
              product notifications.
            </Text>
            <Box mt="4">
              <Text as="p" mb="4">
                Knock is notifications infrastructure that helps you implement
                notifications your users will love, without the effort of
                building and maintaining your own in-house notifications system.
              </Text>
              <Text as="p">
                In this overview, we’ll cover some of the foundational concepts
                of Knock. Knock is designed with both developers and product
                teams in mind: it’s easy for developers to implement quickly,
                and simple for less-technical users to maintain with our
                intuitive dashboard.
              </Text>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NewDesign;
