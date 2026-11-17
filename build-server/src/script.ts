import { spawn } from "node:child_process";
import path from "node:path";
import { createReadStream, promises as fs } from "node:fs";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import mime from "mime-types";
import dotenv from "dotenv";

dotenv.config();

const PROJECT_ID = process.env.PROJECT_ID;
const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!PROJECT_ID) {
  throw new Error("PROJECT_ID missing");
}

if (!AWS_REGION) {
  throw new Error("AWS_REGION missing");
}

if (!S3_BUCKET_NAME) {
  throw new Error("S3_BUCKET_NAME missing");
}

const s3Client = new S3Client({
  region: AWS_REGION,
});

const outputDir = path.resolve(__dirname, "..", "output");
const distDir = path.join(outputDir, "dist");

const runCommand = (
  command: string,
  args: string[],
  cwd: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log(`\n$ ${command} ${args.join(" ")}`);

    const isWindows = process.platform === "win32";

    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      shell: isWindows
    });

    child.stdout?.on("data", (data: Buffer) => {
      process.stdout.write(data.toString());
    });

    child.stderr?.on("data", (data: Buffer) => {
      process.stderr.write(data.toString());
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `${command} failed with exit code ${code}`
          )
        );
      }
    });
  });
};

const getFiles = async (directory: string): Promise<string[]> => {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
};

const uploadFile = async (filePath: string): Promise<void> => {
  const relativePath = path.relative(distDir, filePath);
  const s3Key = `deployments/${PROJECT_ID}/${relativePath}`.replace(/\\/g, "/");
  const contentType = mime.lookup(filePath) || "application/octet-stream";

  console.log(`⬆ Uploading: ${s3Key}`);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: createReadStream(filePath),
      ContentType: contentType,
    }),
  );

  console.log(`Uploaded: ${s3Key}`);
};

const init = async (): Promise<void> => {
  console.log("\n================================");
  console.log("Starting deployment...");
  console.log("================================\n");

  console.log("Project ID:", PROJECT_ID);
  console.log("AWS Region:", AWS_REGION);
  console.log("S3 Bucket:", S3_BUCKET_NAME);

  await fs.access(outputDir);
  console.log("\nRepository found:", outputDir);

  console.log("\nInstalling dependencies...");
  await runCommand("npm", ["install", "--legacy-peer-deps"], outputDir);

  console.log("\nBuilding project...");
  await runCommand("npm", ["run", "build"], outputDir);

  console.log("\nBuild completed successfully!");

  await fs.access(distDir);

  const files = await getFiles(distDir);

  if (files.length === 0) {
    throw new Error("Build directory is empty");
  }

  console.log(`\nFound ${files.length} files`);

  console.log("\nUploading files to S3...");
  for (const filePath of files) {
    await uploadFile(filePath);
  }

  const websiteUrl =
    `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/` +
    `deployments/${PROJECT_ID}/index.html`;

  console.log("\n================================");
  console.log("Deployment completed!");
  console.log("================================");

  console.log("\n🚀 Website URL:", websiteUrl);
};

void init().catch((error: unknown) => {
  console.error("\nDeployment failed!");

  console.error(error instanceof Error ? error.message : error);

  process.exitCode = 1;
});
