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

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const publicBaseUrl =
    process.env.PUBLIC_BACKEND_URL || `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${publicBaseUrl}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
