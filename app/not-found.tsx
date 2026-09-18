import Link from "next/link";

const RECOVERY_LINKS = [
  {
    title: "Documentation home",
    url: "/",
    description: "Start from the documentation homepage",
  },
  {
    title: "Sitemap",
    url: "/sitemap.xml",
    description: "Browse all available pages",
  },
  {
    title: "LLM index",
    url: "/llms.txt",
    description: "Machine-readable documentation index",
  },
  {
    title: "Full documentation",
    url: "/llms-full.txt",
    description: "Complete documentation in plain text",
  },
];

export default function NotFound() {
  return (
    <html>
      <head>
        <title>Page not found | Knock Docs</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            padding: 40px 20px;
            background: #fff;
            color: #1a1a1a;
          }
          @media (prefers-color-scheme: dark) {
            body { background: #0a0a0a; color: #ededed; }
            a { color: #3b82f6; }
            hr { border-color: #333; }
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
          hr {
            border: 0;
            border-top: 1px solid #eee;
            margin: 32px 0;
          }
          .recovery-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 16px;
          }
          @media (prefers-color-scheme: dark) {
            .recovery-title { color: #999; }
          }
          .recovery-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .recovery-link {
            margin-bottom: 16px;
          }
          .recovery-link a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
          }
          .recovery-link a:hover {
            text-decoration: underline;
          }
          .recovery-link p {
            margin: 4px 0 0;
            font-size: 14px;
          }
        `,
          }}
        />
      </head>
      <body>
        <div className="container">
          <h1>404 - Page not found</h1>
          <p>The page you are looking for has moved or does not exist.</p>

          <hr />

          <p className="recovery-title">Recovery options:</p>
          <ul className="recovery-links">
            {RECOVERY_LINKS.map((link) => (
              <li key={link.url} className="recovery-link">
                <Link href={link.url}>{link.title}</Link>
                <p>{link.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </body>
    </html>
  );
}
