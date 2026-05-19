const { generateToken } = require("../utils/jwt");

class AuthService {
  async handleGitHubLogin(user) {
    try {
      const token = generateToken(user._id);
      return {
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          avatar: user.avatar,
          email: user.email,
        },
      };
    } catch (error) {
      throw new Error(`GitHub login failed: ${error.message}`);
    }
  }

  async getUserProfile(user) {
    try {
      return {
        success: true,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
