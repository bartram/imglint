const exifr = require("exifr");

module.exports = async function (file) {
  const metadata = await exifr.parse(file, { xmp: true });
  if (!metadata?.AltTextAccessibility?.value) {
    throw new Error(`Alt text is missing for ${file}`);
  }
};
