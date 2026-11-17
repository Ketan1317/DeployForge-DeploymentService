import { Request, Response } from 'express';
import uploadService from '../services/uploadService';
import { IUserDocument } from '../types';

export class UploadController {
  async uploadSingle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file provided' });
        return;
      }

      const result = await uploadService.uploadSingleImage(
        req.file.buffer,
        (req.user as IUserDocument)._id
      );
      res.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }

  async uploadMultiple(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        res.status(400).json({ success: false, error: 'No files provided' });
        return;
      }

      const results = await uploadService.uploadMultipleImages(
        files,
        (req.user as IUserDocument)._id
      );
      res.json({ success: true, data: results });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.params;
      const id = Array.isArray(publicId) ? publicId[0] : publicId;
      if (!id) {
        res.status(400).json({ success: false, error: 'publicId is required' });
        return;
      }
      const result = await uploadService.deleteImage(id);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }
}

export default new UploadController();
