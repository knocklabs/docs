import Link from "next/link";
import { DOCUMENTATION_LINKS } from "@/lib/documentationLinks";

export default function NotFound() {
  return (
    <html>
      <head>
        <title>Page not found | Knock Docs</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {DOCUMENTATION_LINKS.map((link) => (
          <link key={link.href} rel="help" {...link} />
        ))}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            min-height: 100vh;
            box-sizing: border-box;
            padding: 40px 20px;
            background: #fff;
            color: #1a1a1a;
          }
          @media (prefers-color-scheme: dark) {
            body { background: #0a0a0a; color: #ededed; }
            a { color: #3b82f6; }
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          h1 {
            font-size: 32px;
            margin-bottom: 16px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          @media (prefers-color-scheme: dark) {
            p { color: #999; }
          }
          a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
          }
        `,
          }}
        />
      </head>
      <body>
        <div className="container">
          <h1>404 - Page not found</h1>
          <p>The page you are looking for has moved or does not exist.</p>

          <Link href="/">Back to documentation</Link>
        </div>
      </body>
    </html>
  );
}
