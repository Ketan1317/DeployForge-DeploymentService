import express, { Router } from 'express';
import deploymentController from '../controllers/deploymentController';
import authMiddleware from '../middleware/auth';

const router: Router = express.Router();

// Create new deployment
router.post('/', authMiddleware, (req, res) => {
  void deploymentController.createProject(req, res);
});

// Get user deployments
router.get('/', authMiddleware, (req, res) => {
  void deploymentController.getProjects(req, res);
});

export default router;
