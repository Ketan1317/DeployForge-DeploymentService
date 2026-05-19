const express = require("express");
const deploymentController = require("../controllers/deploymentController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create new deployment
router.post("/", deploymentController.createProject);

module.exports = router;
