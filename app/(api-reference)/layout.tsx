/**
 * Shared layout for API reference pages.
 *
 * This layout wraps both /api-reference and /mapi-reference pages.
 * It provides the common page structure while allowing each route
 * to load its own spec data.
 */

import { Inter } from "next/font/google";

// Import global styles - these are shared with the Pages Router
import "@algolia/autocomplete-theme-classic";
import "../../styles/index.css";
import "../../styles/global.css";
import "../../styles/responsive.css";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function ApiReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
