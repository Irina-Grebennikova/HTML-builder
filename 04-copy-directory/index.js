const fs = require("fs");
const path = require("path");
const { mkdir, readdir, copyFile } = require("fs/promises");

let folder, folderCopy, files;

try {
  (async () => {
    folderCopy = path.join(__dirname, "files-copy");
    const createDir = await mkdir(folderCopy, { recursive: true });
  })();
} catch (err) {
  console.error(err.message);
}

try {
  (async () => {
    folder = path.join(__dirname, "files");
    files = await readdir(folder);

    for (const file of files) {
      const pathToFile = path.join(__dirname, "files", file);
      const fileCopy = path.join(folderCopy, file);
      copyFile(pathToFile, fileCopy);
    }
  })();
  // await copyFile('source.txt', 'destination.txt');
} catch {
  console.error("The file could not be copied");
}

try {
  (async () => {
    const copiedFiles = await readdir(folderCopy);
    const files = await readdir(folder);

    for (const file of copiedFiles) {
      if (!files.includes(file)) {
        const pathToFile = path.join(folderCopy, file);
        fs.unlink(pathToFile, (err) => {
          if (err) throw err;
        });
      }
    }
  })();
} catch (err) {
  console.error(err.message);
}
