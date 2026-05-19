const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  avatar: String,
  profile: mongoose.Schema.Types.Mixed,
  githubAccessToken: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
