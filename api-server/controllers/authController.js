const authService = require("../services/authService");

class AuthController {
  async githubCallback(req, res) {
    try {
      const response = await authService.handleGitHubLogin(req.user);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      
      // Encode user data as URL parameter
      const userParam = encodeURIComponent(JSON.stringify(response.user));
      const redirectUrl = `${frontendUrl}/dashboard?token=${response.token}&user=${userParam}`;

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

  async getUserRepos(req, res) {
    try {
      const response = await authService.getUserRepos(req.user);
      res.json(response);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AuthController();
