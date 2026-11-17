import {
  ECSClient,
  DescribeTasksCommand,
} from "@aws-sdk/client-ecs";

import { deploymentQueue } from "../queues/deploymentQueue";
import { Types } from "mongoose";

import Deployment from "../models/Deployment";

import {
  GetDeploymentsResult,
  DeploymentSummary,
} from "../types";


const ecsClient = new ECSClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
});

export class DeploymentService {
  private monitorTimer?: ReturnType<typeof setInterval>;
  private isCheckingTasks = false;

  async createDeployment(
    gitUrl: string,
    title: string,
    userId: Types.ObjectId,
  ) {
    if (!gitUrl || !userId) {
      throw new Error("Git URL and user ID are required");
    }

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slug = `${baseSlug || "deployment"}-${Date.now()}`;

    // Create deployment record first
    const deployment = await Deployment.create({
      userId,
      title,
      gitUrl,
      slug,
      status: "queued",
    });

    try {
      // Add job to Redis queue
      await deploymentQueue.add(
        "build-deployment",
        {
          deploymentId: deployment._id.toString(),
          gitUrl,
          slug,
          userId: userId.toString(),
        },
        {
          jobId: deployment._id.toString(),
        },
      );

      // Return immediately; worker handles ECS
      return {
        success: true,
        status: "queued",
        data: {
          id: deployment._id,
          title: deployment.title,
          slug: deployment.slug,
        },
      };
    } catch (error) {
      // Queue insertion failed, so mark the deployment failed
      await Deployment.findByIdAndUpdate(deployment._id, {
        status: "failed",
        updatedAt: new Date(),
      });

      throw error;
    }
  }

  async getDeployments(
    userId: Types.ObjectId | string,
  ): Promise<GetDeploymentsResult> {
    try {
      const deployments = await Deployment.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      const mapped: DeploymentSummary[] = deployments.map((d) => ({
        ...d,
        id: d._id.toString(),
      }));

      return { success: true, data: mapped };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch deployments: ${message}`);
    }
  }

  // Start the background ECS monitor.
  startTaskMonitor(): void {
    if (this.monitorTimer) return;
    console.log("ECS task monitor started");

    // Check immediately, then every 10 seconds.
    void this.checkDeploymentTasks();

    this.monitorTimer = setInterval(() => {
      void this.checkDeploymentTasks();
    }, 10_000);
  }

  // Find deployments that are still running.
  private async checkDeploymentTasks(): Promise<void> {
    if (this.isCheckingTasks) return;

    this.isCheckingTasks = true;

    try {
      const deployments = await Deployment.find({
        status: "deploying",
        taskArn: { $exists: true, $ne: null },
      }).select("_id slug taskArn");

      for (const deployment of deployments) {
        if (!deployment.taskArn) continue;

        try {
          const response = await ecsClient.send(
            new DescribeTasksCommand({
              cluster: process.env.AWS_CLUSTER,
              tasks: [deployment.taskArn],
            }),
          );

          const task = response.tasks?.[0];

          if (!task) {
            console.warn(
              `ECS task not found for deployment ${deployment.slug}`,
            );
            continue;
          }

          if (task.lastStatus !== "STOPPED") {
            continue;
          }

          const builderContainer = task.containers?.find(
            (container) => container.name === "builder-image",
          );

          const exitCode = builderContainer?.exitCode;

          const successful = exitCode === 0;

          await Deployment.findByIdAndUpdate(deployment._id, {
            status: successful ? "success" : "failed",
            updatedAt: new Date(),
          });

          console.log(
            `Deployment ${deployment.slug}: ${
              successful ? "SUCCESS" : "FAILED"
            }`,
          );

          if (!successful) {
            console.error("ECS task failure:", {
              slug: deployment.slug,
              exitCode,
              stoppedReason: task.stoppedReason,
              containerReason: builderContainer?.reason,
            });
          }
        } catch (error) {
          console.error(
            `Failed to check ECS task for ${deployment.slug}:`,
            error,
          );
        }
      }
    } catch (error) {
      console.error("Deployment monitor error:", error);
    } finally {
      this.isCheckingTasks = false;
    }
  }
}

export default new DeploymentService();
