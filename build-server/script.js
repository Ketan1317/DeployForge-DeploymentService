const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { BlobServiceClient } = require("@azure/storage-blob");
const mime = require("mime-types");
require("dotenv").config();

// Project id from env
const PROJECT_ID = process.env.PROJECT_ID;

if (!PROJECT_ID) {
  throw new Error("PROJECT_ID missing");
}

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error("AZURE_STORAGE_CONNECTION_STRING missing");
}

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Static website container
const containerName = "$web";

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

const containerClient = blobServiceClient.getContainerClient(containerName);

const init = async () => {
  console.log("Executing script.js");

  const outDirPath = path.join(__dirname, "output");

  console.log("Output directory:", outDirPath);

  console.log("Installing dependencies and building project...");

  const p = exec(
    `cd ${outDirPath} && npm install --legacy-peer-deps && npm run build`,
  );

  p.stdout.on("data", function (data) {
    console.log(data.toString());
  });

  p.stderr.on("data", function (data) {
    console.log("Error: " + data.toString());
  });

  p.on("close", async function (code) {
    if (code !== 0) {
      console.error("Build failed");
      process.exit(1);
    }

    console.log("Build Complete");

    // dist folder
    const distFolderPath = path.join(__dirname, "output", "dist");

    if (!fs.existsSync(distFolderPath)) {
      console.error("dist folder not found");
      process.exit(1);
    }

    const readDistFolder = fs.readdirSync(distFolderPath, {
      recursive: true,
    });

    console.log(`Found ${readDistFolder.length} files`);

    for (const file of readDistFolder) {
      const filePath = path.join(distFolderPath, file);

      // skip directories
      if (fs.lstatSync(filePath).isDirectory()) continue;

      console.log("⬆ Uploading:", file);

      const blobName = `__outputs/${PROJECT_ID}/${file}`.replace(/\\/g, "/");

      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadFile(filePath, {
        blobHTTPHeaders: {
          blobContentType: mime.lookup(filePath) || "application/octet-stream",
        },
      });

      console.log("Uploaded:", blobName);
    }

    console.log("Deployment completed!");

    // Static website URL
    console.log(`
🚀 Website URL: https://ketanblob1317.z29.web.core.windows.net/__outputs/${PROJECT_ID}/`);

    process.exit(0);
  });
};

init();
