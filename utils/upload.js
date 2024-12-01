const multer = require("multer");
const fs = require("fs");
const unzipper = require("unzipper");
const path = require("path");
// const base_url = "https://api.kwanza.io";
const base_url = "https://api.kwanza.io";

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save uploaded files in './files/' directory relative to the current working directory
    cb(null, path.join(process.cwd(), "files"));
  },
  filename: function (req, file, cb) {
    // Keep the original file name
    cb(null, file.originalname);
  },
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Middleware to handle both normal files and zip files
const handleFileUpload = (req, res, next) => {
  const file = req.file;

  console.log("File received:", file);

  if (!file) {
    console.log("No file uploaded");
    return res.status(400).send({ error: "No file uploaded" });
  }

  if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed"
  ) {
    const fileName = path.parse(file.originalname).name;
    const extractPath = path.join(process.cwd(), "extracted", fileName);

    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    const filePath = path.join(process.cwd(), "files", file.originalname);

    console.log("Extracting file at:", filePath);

    const readStream = fs
      .createReadStream(filePath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("close", () => {
        console.log("Extraction complete:", fileName);
        const indexPath = `/extracted/${fileName}/${fileName}/index.html`;
        req.extractedHtmlLink = `${base_url}${indexPath}`;
        console.log("HTML Link:", req.extractedHtmlLink);
        next(); // Proceed to the next middleware/controller
      })
      .on("error", (err) => {
        console.error("Extraction error:", err);
        req.extractedHtmlLink = null;
        next();
      });

    readStream.on("error", (err) => {
      console.error("Read stream error:", err);
      return res.status(500).send({ error: "Failed to read the zip file." });
    });
  } else {
    req.fileLink = `${base_url}/files/${file.originalname}`;
    console.log("Non-zip file uploaded:", req.fileLink);
    next();
  }
};

module.exports = { upload, handleFileUpload };
