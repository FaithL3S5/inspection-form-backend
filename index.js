const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 3001;

app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Modified to handle multiple files
app.post("/upload-multiple", (req, res) => {
  upload.array("files")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "One or more files too large" });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const filesInfo = req.files.map((file) => ({
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      url: `/uploads/${file.filename}`,
      lastModified: Date.now(),
    }));

    res.json({ files: filesInfo });
  });
});

// Improved get all images endpoint with better error handling
app.get("/images", (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);

    const images = files
      .filter((filename) => {
        const ext = path.extname(filename).toLowerCase();
        return [".jpg", ".jpeg", ".png"].includes(ext);
      })
      .map((filename) => {
        const stats = fs.statSync(path.join(uploadDir, filename));
        const originalName = filename.substring(
          filename.indexOf("-", filename.indexOf("-") + 1) + 1
        );

        return {
          name: originalName,
          size: stats.size,
          type: path.extname(filename).substring(1),
          url: `/uploads/${filename}`,
          lastModified: stats.mtime.getTime(),
          serverFilename: filename, // Include the server filename for deletion
        };
      });

    res.json({ files: images });
  } catch (error) {
    console.error("Error reading uploads directory:", error);
    res.status(500).json({
      error: "Failed to read uploads directory",
      details: error.message,
    });
  }
});

// Improved delete endpoint with better error handling
app.delete("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadDir, filename);

  try {
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "File not found" });
    }

    fs.unlinkSync(filepath);
    res.json({
      message: "File deleted successfully",
      filename: filename,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      error: "Failed to delete file",
      details: error.message,
    });
  }
});

app.get("/quote", async (req, res) => {
  const response = await fetch("https://zenquotes.io/api/random");

  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins

  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
