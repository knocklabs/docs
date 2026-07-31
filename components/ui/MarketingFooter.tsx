import React from "react";
import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Heading } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { KnockWordmark } from "@/components/ui/KnockWordmark";

const SOCIAL_LINKS = [
  {
    href: "https://x.com/knocklabs",
    label: "X",
    Icon: FaXTwitter,
  },
  {
    href: "https://github.com/knocklabs",
    label: "GitHub",
    Icon: FaGithub,
  },
  {
    href: "https://www.linkedin.com/company/knocklabs/",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
  {
    href: "https://www.youtube.com/@knocklabs",
    label: "YouTube",
    Icon: FaYoutube,
  },
] as const;

export const MarketingFooter = () => (
  <Box
    as="footer"
    w="full"
    borderTop="px"
    borderColor="gray-4"
    mt="12"
    pt="10"
    pb="10"
  >
    <Box mx="auto" px="6" w="full" style={{ maxWidth: "1080px" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        gap="8"
        className="md-flex-column"
      >
        <Stack direction="column" gap="4" style={{ maxWidth: "36rem" }}>
          <Link
            href="https://knock.app"
            aria-label="Knock"
            style={{ display: "inline-block" }}
          >
            <KnockWordmark width={84} />
          </Link>
          <Heading as="h2" size="4" weight="semi-bold" style={{ margin: 0 }}>
            Customer engagement infrastructure for growth.
          </Heading>
        </Stack>

        <Stack direction="row" gap="4" alignItems="center">
          <Button.Root
            as="a"
            href="https://dashboard.knock.app/signup"
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            color="default"
            size="2"
          >
            <Button.Text>Get started</Button.Text>
            <Button.Icon icon={ArrowUpRight} aria-hidden />
          </Button.Root>
          <Button.Root
            as="a"
            href="https://knock.app/contact-sales"
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            color="accent"
            size="2"
          >
            <Button.Text>Book a demo</Button.Text>
            <Button.Icon icon={ArrowUpRight} aria-hidden />
          </Button.Root>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" gap="5" mt="10">
        {SOCIAL_LINKS.map(({ href, label, Icon }) => (
          <Box
            key={href}
            as="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            color="gray"
            style={{ display: "inline-flex", lineHeight: 0 }}
          >
            <Icon size={18} aria-hidden />
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
);
