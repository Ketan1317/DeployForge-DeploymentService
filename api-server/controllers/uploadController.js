const uploadService = require("../services/uploadService");

class UploadController {
  async uploadSingle(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file provided" });
      }

      const result = await uploadService.uploadSingleImage(
        req.file.buffer,
        req.user._id
      );
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: "No files provided" });
      }

      const results = await uploadService.uploadMultipleImages(
        req.files,
        req.user._id
      );
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteImage(req, res) {
    try {
      const result = await uploadService.deleteImage(req.params.publicId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new UploadController();
