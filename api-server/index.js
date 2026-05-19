require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

const connectDB = require("./config/database");
const configureCloudinary = require("./config/cloudinary");
const configurePassport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const deploymentRoutes = require("./routes/deploymentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
configureCloudinary();
configurePassport();
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/project", deploymentRoutes);

app.get("/health", (req, res) => {
  res.send("okokok");
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`\n✓ API Server running on port ${PORT}`);
  console.log(`✓ GitHub OAuth: ${process.env.GITHUB_CALLBACK_URL}`);
  console.log(`✓ MongoDB: Connected\n`);
});
