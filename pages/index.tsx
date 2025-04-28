import sidebarContent from "../data/sidebar";
import AiChatButton from "../components/AiChatButton";
import { Page } from "@/components/ui/Page";
import Meta from "@/components/Meta";
import MinimalHeader from "@/components/Header/MinimalHeader";
import Link from "next/link";
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
    <Page.Container>
      <Meta
        title={`Documentation | Knock Docs`}
        description="Explore our guides and examples to integrate Knock."
      />
      <Page.Masthead title="Documentation" />
      <Page.Wrapper>
        <Page.Sidebar content={sidebarContent} />
        <Page.Content>
          <Page.ContentHeader
            title="Documentation"
            description="Explore our guides and examples to integrate Knock."
          />
          <div className="flex items-center space-x-2">
            <Link
              href="/getting-started/what-is-knock"
              className="bg-brand hover:bg-brand-dark text-white py-2 px-4 rounded-md font-semibold"
            >
              Get started →
            </Link>

            <Link
              href="/api-reference"
              className="text-gray-600 dark:text-gray-300 py-2 px-3 rounded-md font-medium"
            >
              API reference
            </Link>
          </div>
          <section className="bg-gray-50 dark:bg-gray-800 my-8 p-5 lg:-ml-5 lg:-mr-5 rounded">
            <h2 className="text-xl font-semibold mb-2">What is Knock?</h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
              Knock is notifications infrastructure for developers. Use our APIs
              and dashboard to deliver great notification experiences to your
              end users, driving customer satisfaction and retention.
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
              {contentForDiscovery.map((s) => (
                <div
                  className="flex flex-col lg:flex-row border-t dark:border-t-gray-700 pt-6"
                  key={s.slug}
                >
                  <div className="lg:w-80">
                    <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                      {s.desc}
                    </p>
                  </div>

                  <ul className="mt-5 lg:mt-0 lg:ml-auto lg:w-40 space-y-2">
                    {s.pages.map((p) => (
                      <li
                        className="text-sm text-gray-500 dark:text-gray-300"
                        key={p.slug}
                      >
                        <Link
                          href={s.slug + p.slug}
                          className="hover:text-gray-800 dark:hover:text-gray-100"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </Page.Content>
      </Page.Wrapper>
      <AiChatButton />
    </Page.Container>
  );
}
