import { Request, Response } from "express";
import deploymentService from "../services/deploymentService";
import { IUserDocument } from "../types";

export class DeploymentController {
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const { gitUrl, title } = req.body as { gitUrl?: string; title?: string };
      const userId = (req.user as IUserDocument)._id;

      if (!gitUrl) {
        res.status(400).json({ success: false, error: "Git URL is required" });
        return;
      }
      const deploymentTitle = title?.trim() || `Deployment-${Date.now()}`;
      
      const result = await deploymentService.createDeployment(
        gitUrl,
        deploymentTitle,
        userId,
      );
      res.json(result);
    } catch (error) {
      console.error("DEPLOY ERROR:");
      console.error(error);

      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;

      res.status(500).json({
        success: false,
        error: message,
        stack,
      });
    }
  }

  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const userId = (req.user as IUserDocument)._id;
      const result = await deploymentService.getDeployments(userId);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }
}

export default new DeploymentController();
