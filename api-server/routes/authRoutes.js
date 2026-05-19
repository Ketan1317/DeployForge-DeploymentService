const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub OAuth Callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  authController.githubCallback
);

// Get Current User
router.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = router;
