const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();
const localUploadDir = path.join(__dirname, "..", "uploads");

const getUploadsBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const bucket = getUploadsBucket();
    const safeOriginalName = req.file.originalname.replace(/\s+/g, "-");
    const filename = `${Date.now()}-${safeOriginalName}`;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: { contentType: req.file.mimetype },
    });

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
      uploadStream.end(req.file.buffer);
    });

    const publicBaseUrl =
      process.env.PUBLIC_BACKEND_URL || `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${publicBaseUrl}/api/auth/file/${uploadStream.id.toString()}`;
    return res.status(200).json({ imageUrl: fileUrl, fileId: uploadStream.id.toString() });
  } catch (error) {
    if (!process.env.VERCEL) {
      // Local fallback keeps development working if GridFS is unavailable.
      if (!fs.existsSync(localUploadDir)) {
        fs.mkdirSync(localUploadDir, { recursive: true });
      }

      const safeOriginalName = req.file.originalname.replace(/\s+/g, "-");
      const filename = `${Date.now()}-${safeOriginalName}`;
      const filePath = path.join(localUploadDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);

      const publicBaseUrl =
        process.env.PUBLIC_BACKEND_URL || `${req.protocol}://${req.get("host")}`;
      return res.status(200).json({ imageUrl: `${publicBaseUrl}/uploads/${filename}` });
    }

    res.status(500).json({ message: error.message || "Failed to upload file" });
  }
});

router.get("/file/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!isValidObjectId(fileId)) {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const objectId = new mongoose.Types.ObjectId(fileId);
    const db = mongoose.connection.db;
    const fileDoc = await db.collection("uploads.files").findOne({ _id: objectId });

    if (!fileDoc) {
      return res.status(404).json({ message: "File not found" });
    }

    const contentType =
      fileDoc.contentType || fileDoc.metadata?.contentType || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const bucket = getUploadsBucket();
    const downloadStream = bucket.openDownloadStream(objectId);
    downloadStream.on("error", () => {
      if (!res.headersSent) {
        res.status(404).json({ message: "File not found" });
      }
    });
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch file" });
  }
});

module.exports = router;
