import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Types } from 'mongoose';
import { UploadResult, DeleteImageResult } from '../types';

export class UploadService {
  async uploadSingleImage(
    fileBuffer: Buffer,
    userId: Types.ObjectId | string
  ): Promise<UploadResult> {
    try {
      return await new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: `deployments/${userId}`,
          },
          (error, result?: UploadApiResponse) => {
            if (error || !result) {
              reject(error || new Error('Upload failed with no result'));
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                size: result.bytes,
              });
            }
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Single image upload failed: ${message}`);
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    userId: Types.ObjectId | string
  ): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadSingleImage(file.buffer, userId)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Multiple images upload failed: ${message}`);
    }
  }

  async deleteImage(publicId: string): Promise<DeleteImageResult> {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Image deletion failed: ${message}`);
    }
  }
}

export default new UploadService();
