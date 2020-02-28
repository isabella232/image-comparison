const fs = require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");
const path = require("path");

const sourceImages = path.join(__dirname, "srcImages");
const destImages = path.join(__dirname, "destImages");
const diffImages = "./diff";

fs.readdir(sourceImages, function(err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach(function(file) {
    const img1 = PNG.sync.read(fs.readFileSync(`${sourceImages}/${file}`));
    const img2 = PNG.sync.read(fs.readFileSync(`${destImages}/${file}`));
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const difference = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      {
        threshold: 0
      }
    );

    if (!fs.existsSync(diffImages)) {
      fs.mkdirSync(diffImages);
    }

    if (difference) {
      fs.writeFileSync(`${diffImages}/${file}`, PNG.sync.write(diff));
    }
  });
});
