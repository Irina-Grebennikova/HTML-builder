const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

try {
  (async () => {
    const contents = await readdir(pathToFolder, { withFileTypes: true });

    for (const content of contents) {
      if (!content.isFile()) continue;

      const pathToFile = path.join(__dirname, "secret-folder", content.name);
      const nameWithoutExt = content.name.replace(/\..+/g, "");
      const ext = path.extname(content.name).slice(1);
      const stats = await stat(pathToFile);
      const size = stats.size / 1000;

      console.log(`${nameWithoutExt} - ${ext} - ${size}kb`);
    }
  })();
} catch (err) {
  console.error(err);
}

