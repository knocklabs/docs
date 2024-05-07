import Link from "next/link";
import sidebarContent from "../data/sidebar";
import { Page } from "../layouts/Page";
import DocsSidebar from "../components/DocsSidebar";
import MinimalHeader from "../components/Header/MinimalHeader";
import AiChatButton from "../components/AiChatButton";
import { Card, CardGroup } from "../components/Card";

const contentForDiscovery = sidebarContent.filter((s) => s.desc);

// Add our integrations content in the 3rd position
contentForDiscovery.splice(2, 0, {
  title: "Integrations",
  desc: "Learn more about the incoming and outgoing integrations for Knock, including supported providers.",
  slug: "/integrations",
  pages: [
    { title: "Overview", slug: "/overview" },
    { title: "Email", slug: "/email/overview" },
    { title: "Push", slug: "/push/overview" },
    { title: "SMS", slug: "/sms/overview" },
    { title: "Chat", slug: "/chat/overview" },
    { title: "In-app", slug: "/in-app/overview" },
    { title: "Webhook", slug: "/webhook/overview" },
    { title: "Sources", slug: "/sources/overview" },
    { title: "Extensions", slug: "/extensions/overview" },
  ],
});

export default function Home() {
  return (
    <Page header={<MinimalHeader pageType="Docs" />} sidebar={<DocsSidebar />}>
      <div className="space-y-12 max-w-3xl mx-auto">
        <header className="py-5">
          <h1 className="text-4xl font-bold mb-2">Documentation</h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 mb-8">
            Explore our guides and examples to integrate Knock.
          </p>

          <div className="flex items-center space-x-2">
            <Link
              href="/getting-started/what-is-knock"
              className="bg-brand hover:bg-brand-dark text-white py-2 px-4 rounded-md font-semibold"
            >
              Get started
            </Link>

            <Link
              href="/reference"
              className="text-gray-600 dark:text-gray-300 py-2 px-3 rounded-md font-medium"
            >
              API reference
            </Link>
          </div>
        </header>

        <section className="bg-gray-50 dark:bg-gray-800 p-5 lg:-ml-5 lg:-mr-5 rounded">
          <h2 className="text-xl font-semibold mb-2">What is Knock?</h2>
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
            Knock is notifications infrastructure for developers. Use our APIs
            and dashboard to deliver great notification experiences to your end
            users, driving customer satisfaction and retention.
          </p>

          <Link
            href="/getting-started/what-is-knock"
            className="text-brand hover:text-brand-dark font-medium text-sm"
          >
            Learn more →
          </Link>
        </section>

        <section className="">
          <h2 className="text-2xl font-bold mb-3">Discover Knock</h2>

          <div className="space-y-6 pt-3">
            <CardGroup>
              {contentForDiscovery.map((s) => (
                <div key={s.slug}>
                  <Card
                    title={String(s.title)}
                    linkUrl={s.slug + s.pages[0].slug}
                    footer={
                      <div className="flex items-center text-[14px] text-gray-500 dark:text-gray-200">
                        {s.desc}
                      </div>
                    }
                  />
                </div>
              ))}
            </CardGroup>
          </div>
        </section>
      </div>
      <AiChatButton />
    </Page>
  );
}
