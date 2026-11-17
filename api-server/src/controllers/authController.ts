import { Request, Response } from 'express';
import authService from '../services/authService';
import { IUserDocument } from '../types';

export class AuthController {
  async githubCallback(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const response = await authService.handleGitHubLogin(req.user as IUserDocument);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

      // Encode user data as URL parameter
      const userParam = encodeURIComponent(JSON.stringify(response.user));
      const redirectUrl = `${frontendUrl}/dashboard?token=${response.token}&user=${userParam}`;

      res.redirect(redirectUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const response = await authService.getUserProfile(req.user as IUserDocument);
      res.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }

  async getUserRepos(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const response = await authService.getUserRepos(req.user as IUserDocument);
      res.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }
}

export default new AuthController();
