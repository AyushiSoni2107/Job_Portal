const express = require("express");
const fs = require("fs");
const path = require("path");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

const router = express.Router();
const localUploadDir = path.join(__dirname, "..", "uploads");

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

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
    if (!hasCloudinaryConfig()) {
      if (process.env.VERCEL) {
        return res.status(500).json({
          message:
            "Cloudinary env vars missing in Vercel. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
        });
      }

      if (!fs.existsSync(localUploadDir)) {
        fs.mkdirSync(localUploadDir, { recursive: true });
      }

      const safeOriginalName = req.file.originalname.replace(/\s+/g, "-");
      const filename = `${Date.now()}-${safeOriginalName}`;
      const filePath = path.join(localUploadDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);

      const publicBaseUrl =
        process.env.PUBLIC_BACKEND_URL || `${req.protocol}://${req.get("host")}`;
      return res
        .status(200)
        .json({ imageUrl: `${publicBaseUrl}/uploads/${filename}` });
    }

    const uploaded = await uploadToCloudinary({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      folder: "job-portal",
    });

    res.status(200).json({ imageUrl: uploaded.url, publicId: uploaded.publicId });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to upload file" });
  }
});

module.exports = router;
