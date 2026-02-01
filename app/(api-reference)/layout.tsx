import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { GA_TRACKING_ID } from "../../lib/gtag";

import "@algolia/autocomplete-theme-classic";
import "../../styles/index.css";
import "../../styles/global.css";
import "../../styles/responsive.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function ApiReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        {process.env.NEXT_PUBLIC_CLEARBIT_KEY && (
          <script
            async
            src={`https://tag.clearbitscripts.com/v1/${process.env.NEXT_PUBLIC_CLEARBIT_KEY}/tags.js`}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
