const path = require("path");

const getUrl = async (req) => {
  const file = req.file;
  return `https://api.hakiki.co/files/${file.originalname}`;
};

const getHtmlLink = async (req) => {
  const file = req.file;
  const fileNameWithoutExt = path.parse(file.originalname).name; // Get the file name without extension
  return `https://api.hakiki.co/extracted/${fileNameWithoutExt}/index.html`;
};

module.exports = { getUrl, getHtmlLink };
