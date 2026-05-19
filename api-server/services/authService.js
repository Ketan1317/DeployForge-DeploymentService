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

  async getUserRepos(user) {
    try {
      const token = user.githubAccessToken;
      if (!token) {
        throw new Error("No GitHub access token found. Please re-authenticate.");
      }

      const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const repos = await response.json();
      const mapped = repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        sshUrl: repo.ssh_url,
        description: repo.description,
        private: repo.private,
        language: repo.language,
        updatedAt: repo.updated_at,
      }));

      return { success: true, data: mapped };
    } catch (error) {
      throw new Error(`Failed to fetch repos: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
