const deploymentService = require("../services/deploymentService");

class DeploymentController {
  async createProject(req, res) {
    try {
      const { gitUrl, title,connectionString,userId } = req.body;
      const result = await deploymentService.createDeployment(
        gitUrl,
        title,
        connectionString,
        userId
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new DeploymentController();
