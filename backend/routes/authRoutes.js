const express = require("express");
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
