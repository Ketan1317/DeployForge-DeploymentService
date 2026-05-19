const cloudinary = require("cloudinary").v2;

class UploadService {
  async uploadSingleImage(fileBuffer, userId) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: `deployments/${userId}`,
          },
          (error, result) => {
            if (error) reject(error);
            else
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                size: result.bytes,
              });
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      throw new Error(`Single image upload failed: ${error.message}`);
    }
  }

  async uploadMultipleImages(files, userId) {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadSingleImage(file.buffer, userId)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(`Multiple images upload failed: ${error.message}`);
    }
  }

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { success: true, message: "Image deleted successfully" };
    } catch (error) {
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }
}

module.exports = new UploadService();
