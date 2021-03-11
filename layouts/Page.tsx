import Head from "next/head";
import Link from "next/link";
import React from "react";
import Meta from "../components/Meta";
import Sidebar from "../components/Sidebar";

export const Page = ({ children }) => {
  return (
    <>
      <Meta />
      <Head>
        <title>Knock Docs</title>
      </Head>
      <div className="h-screen flex flex-col antialiased">
        <header className="border-b px-5 py-3 bg-gray-50 flex items-center">
          <div>
            <Link href="/">
              <a className="flex justify-center items-center">
                <img
                  src="/icons/knock-wordmark.svg"
                  alt="Knock"
                  className="w-16 lg:w-20"
                />
                <span className="text-gray-500 ml-1 lg:text-lg mt-1 lg:mt-2">
                  Docs
                </span>
              </a>
            </Link>
          </div>

          <a
            href="mailto:founders@knock.app?subject=Docs feedback"
            className="ml-auto text-sm text-brand font-medium"
          >
            Send feedback →
          </a>
        </header>
        <div className="flex overflow-y-hidden h-full">
          <Sidebar />
          <main className="p-5 lg:p-8 w-full h-full overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};
