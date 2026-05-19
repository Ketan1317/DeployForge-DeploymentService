const authService = require("../services/authService");

class AuthController {
  async githubCallback(req, res) {
    try {
      const response = await authService.handleGitHubLogin(req.user);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
      const redirectUrl = `${frontendUrl}?token=${response.token}`;

    res.redirect(redirectUrl);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const response = await authService.getUserProfile(req.user);
      res.json(response);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AuthController();
