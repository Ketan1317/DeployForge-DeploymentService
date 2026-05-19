const express = require("express");
const deploymentController = require("../controllers/deploymentController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create new deployment
router.post("/", authMiddleware, deploymentController.createProject);

// Get user deployments
router.get("/", authMiddleware, deploymentController.getProjects);

module.exports = router;
