import express, { Router } from 'express';
import multer from 'multer';
import uploadController from '../controllers/uploadController';
import authMiddleware from '../middleware/auth';

const router: Router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Single image upload
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  (req, res) => {
    void uploadController.uploadSingle(req, res);
  }
);

// Multiple images upload
router.post(
  '/multiple',
  authMiddleware,
  upload.array('images', 10),
  (req, res) => {
    void uploadController.uploadMultiple(req, res);
  }
);

// Delete image
router.delete('/:publicId', authMiddleware, (req, res) => {
  void uploadController.deleteImage(req, res);
});

export default router;
