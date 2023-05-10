const fs = require("fs");
const path = require("path");
const { mkdir, readdir, copyFile } = require("fs/promises");

const distFolder = path.join(__dirname, "project-dist");
const template = path.join(__dirname, "template.html");
const componentsDir = path.join(__dirname, "components");
let templateHtml = "";

async function buildHtml() {
  await mkdir(distFolder, { recursive: true });

  const readStream = fs.createReadStream(template, "utf-8");
  readStream.on("data", (chunk) => (templateHtml += chunk));
  readStream.on("end", async () => {
    const components = await readdir(componentsDir);

    for (const component of components) {
      let html = "";
      const compName = component.replace(/\.html/, "");
      const pathToFile = path.join(componentsDir, component);
      const stream = fs.createReadStream(pathToFile, "utf-8");

      stream.on("data", (chunk) => (html += chunk));
      stream.on("end", () => {
        templateHtml = templateHtml.replace(`{{${compName}}}`, html);
        if (components.lastIndexOf(component) === components.length - 1) {
          const htmlFile = path.join(distFolder, "index.html");
          const writeStream = fs.createWriteStream(htmlFile);

          writeStream.write(templateHtml);
        }
      });
    }
  });
}
buildHtml();

async function mergeStyles() {
  const stylesFolder = path.join(path.join(__dirname, "styles"));
  const bundleFile = path.join(distFolder, "style.css");
  const output = fs.createWriteStream(bundleFile);

  const files = await readdir(stylesFolder);
  const stylesFiles = files.filter((el) => el.match(/.+\.css/g));

  for (const file of stylesFiles) {
    const pathToFile = path.join(stylesFolder, file);
    const input = fs.createReadStream(pathToFile, "utf-8");

    input.pipe(output);
  }
}
mergeStyles();

const folder = path.join(__dirname, "assets"),
  folderCopy = path.join(distFolder, "assets");

function copyAssets(dir, copydir) {
  fs.mkdir(
    path.join(copydir),
    {
      recursive: true,
    },
    () => {
      readdir(path.join(dir), {
        withFileTypes: true,
      }).then((contents) =>
        contents.forEach((content) => {
          if (content.isDirectory()) {
            copyAssets(
              path.join(dir, content.name),
              path.join(copydir, content.name)
            );
          }
          if (content.isFile()) {
            copyFile(
              path.join(dir, content.name),
              path.join(copydir, content.name)
            );
          }
        })
      );
    }
  );
}
copyAssets(folder, folderCopy);
