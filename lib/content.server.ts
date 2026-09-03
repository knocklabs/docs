import fs from "fs";
import path from "path";

export const CONTENT_DIR = "content/";
export const DOCS_FILE_EXTENSIONS = [".mdx", ".md"];

export const getAllFilesInDir = (
  directory: string,
  files: string[] = [],
  extensions?: string[],
): string[] => {
  fs.readdirSync(directory).forEach((file) => {
    const subpath = path.join(directory, file);
    if (fs.lstatSync(subpath).isDirectory()) {
      getAllFilesInDir(subpath, files, extensions);
    } else {
      if (!extensions || extensions.includes(path.extname(subpath))) {
        files.push(subpath);
      }
    }
  });

  return files;
};

export function makeIdFromPath(resourcePath) {
  return resourcePath.replace(/\.mdx?$/, "").replace(/\/index$/, "");
}
