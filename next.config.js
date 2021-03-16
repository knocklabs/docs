const withPlugins = require("next-compose-plugins");
const withMdxEnhanced = require("next-mdx-enhanced");

const autoLinkSettings = {
  behavior: "prepend",
  content: { type: "element", tagName: "span" },
};

module.exports = withPlugins([
  withMdxEnhanced({
    layoutPath: "layouts/mdxLayout",
    defaultLayout: true,
    fileExtensions: ["mdx", "md"],
    remarkPlugins: [
      require("remark-slug"),
      [require("remark-autolink-headings"), autoLinkSettings],
    ],
    rehypePlugins: [],
    extendFrontMatter: {
      process: (mdxContent, frontMatter) => {
        return {
          id: makeIdFromPath(frontMatter.__resourcePath),
          wordCount: mdxContent.split(/\s+/g).length,
        };
      },
    },
  })(),
]);

function makeIdFromPath(resourcePath) {
  return resourcePath.replace(".mdx", "").replace("/index", "");
}
