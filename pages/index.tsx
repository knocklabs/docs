import Link from "next/link";
import sidebarContent from "../data/sidebar";
import { Page } from "../layouts/Page";

export default function Home() {
  return (
    <Page>
      <div className="space-y-12 max-w-3xl mx-auto">
        <header className="py-5">
          <h1 className="text-4xl font-bold mb-2">Documentation</h1>
          <p className="text-xl text-gray-700 mb-8">
            Explore our guides and examples to integrate Knock.
          </p>

          <Link href="/getting-started/what-is-knock">
            <a className="bg-brand hover:bg-brand-dark text-white py-2 px-4 rounded-md font-semibold">
              Get started →
            </a>
          </Link>
        </header>

        <section className="bg-gray-50 p-5 lg:-ml-5 lg:-mr-5 rounded">
          <h2 className="text-xl font-semibold mb-2">What is Knock?</h2>
          <p className="text-sm text-gray-700 mb-3">
            Knock is a hosted notifications engine. Knock's
            notifications-as-a-service and APIs help teams deliver great
            notification experiences to their end users, driving satisfaction
            and retention.
          </p>

          <Link href="/getting-started/what-is-knock">
            <a className="text-brand hover:text-brand-dark font-medium text-sm">
              Learn more →
            </a>
          </Link>
        </section>

        <section className="">
          <h2 className="text-2xl font-bold mb-3">Discover Knock</h2>

          <div className="space-y-6 pt-3">
            {sidebarContent
              .filter((s) => s.desc)
              .map((s) => (
                <div className="flex flex-col lg:flex-row border-t pt-6">
                  <div className="lg:w-80">
                    <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>

                  <ul className="mt-5 lg:mt-0 lg:ml-auto lg:w-40 space-y-2">
                    {s.pages.map((p) => (
                      <li className="text-sm text-gray-500">
                        <Link href={s.slug + p.slug}>
                          <a className="hover:text-gray-800">{p.title}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
