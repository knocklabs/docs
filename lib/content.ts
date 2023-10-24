import fs from "fs";
import path from "path";

export const CONTENT_DIR = "content/";

export const getAllFilesInDir = (
  directory: string,
  files: string[] = [],
): string[] => {
  fs.readdirSync(directory).forEach((file) => {
    const subpath = path.join(directory, file);
    if (fs.lstatSync(subpath).isDirectory()) {
      getAllFilesInDir(subpath, files);
    } else {
      files.push(subpath);
    }
  });

  return files;
};

export function makeIdFromPath(resourcePath) {
  return resourcePath.replace(/\.mdx?$/, "").replace("/index", "");
}
