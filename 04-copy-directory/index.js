const path = require("path");
const { mkdir, readdir, copyFile, unlink } = require("fs/promises");

const folder = path.join(__dirname, "files"),
  folderCopy = path.join(__dirname, "files-copy");

(async () => {
  try {
    const files = await readdir(folder);

    await mkdir(folderCopy, { recursive: true });

    for (const file of files) {
      const pathToFile = path.join(__dirname, "files", file);
      const fileCopy = path.join(folderCopy, file);

      copyFile(pathToFile, fileCopy);
    }
    const copiedFiles = await readdir(folderCopy);

    for (const file of copiedFiles) {

      if (!files.includes(file)) {
        const pathToFile = path.join(folderCopy, file);

        await unlink(pathToFile);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
})();

