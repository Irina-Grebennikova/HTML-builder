const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

const stylesFolder = path.join(path.join(__dirname, "styles"));
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(bundleFile);

(async () => {
  const files = await readdir(stylesFolder);
  const stylesFiles = files.filter((el) => el.match(/.+\.css/g));

  for (const file of stylesFiles) {
    const pathToFile = path.join(stylesFolder, file);
    const input = fs.createReadStream(pathToFile, "utf-8");

    input.pipe(output);
  }
})();
