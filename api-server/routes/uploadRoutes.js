const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Single image upload
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  uploadController.uploadSingle
);

// Multiple images upload
router.post(
  "/multiple",
  authMiddleware,
  upload.array("images", 10),
  uploadController.uploadMultiple
);

// Delete image
router.delete("/:publicId", authMiddleware, uploadController.deleteImage);

module.exports = router;
