import express, { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/authController';
import authMiddleware from '../middleware/auth';

const router: Router = express.Router();

// GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email', 'repo'] })
);

// GitHub OAuth Callback
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    void authController.githubCallback(req, res);
  }
);

// Get Current User
router.get('/me', authMiddleware, (req, res) => {
  void authController.getCurrentUser(req, res);
});

// Get User's GitHub Repositories
router.get('/repos', authMiddleware, (req, res) => {
  void authController.getUserRepos(req, res);
});

export default router;
