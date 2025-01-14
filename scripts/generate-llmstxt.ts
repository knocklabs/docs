const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://docs.knock.app';
const CONTENT_DIR = path.join(process.cwd(), 'content');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'llms.txt');

interface PageMetadata {
  title: string;
  description: string;
  url: string;
}

function findMdxFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (entry.isFile() && /\.(mdx?|md)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getPageMetadata(filePath: string): PageMetadata | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter } = matter(fileContent);

    if (!frontmatter.title || !frontmatter.description) {
      console.warn(`Missing title or description in ${filePath}`);
      return null;
    }

    // Convert file path to URL path
    const relativePath = path.relative(CONTENT_DIR, filePath);
    const urlPath = relativePath
      .replace(/\.(mdx?|md)$/, '') // Remove extension
      .replace(/\/index$/, '') // Remove trailing index
      .replace(/\\/g, '/'); // Convert Windows paths to URL paths

    return {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${SITE_URL}/${urlPath}`,
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

function generateLlmsTxt(): void {
  // Create public directory if it doesn't exist
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Find all MDX files
  const mdxFiles = findMdxFiles(CONTENT_DIR);
  
  // Process all files and collect metadata
  const pages = mdxFiles
    .map(getPageMetadata)
    .filter((page): page is PageMetadata => page !== null)
    .sort((a, b) => a.title.localeCompare(b.title));

  // Generate llms.txt content
  const content = [
    '# Knock Documentation',
    '> Complete documentation for Knock - the notifications infrastructure for developers.',
    '',
    '## Pages',
    ...pages.map(page => `- [${page.title}](${page.url}): ${page.description}`),
    ''
  ].join('\n');

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`Generated ${OUTPUT_FILE}`);
}

// Run the generator
generateLlmsTxt();
