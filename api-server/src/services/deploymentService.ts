
import {
  ECSClient,
  RunTaskCommand,
} from '@aws-sdk/client-ecs';

import { generateSlug } from 'random-word-slugs';
import { Types } from 'mongoose';

import Deployment from '../models/Deployment';

import {
  CreateDeploymentResult,
  GetDeploymentsResult,
  DeploymentSummary,
} from '../types';

const ecsClient = new ECSClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
});

export class DeploymentService {
  async createDeployment(
    gitUrl: string,
    title?: string,
    userId?: Types.ObjectId | string
  ): Promise<CreateDeploymentResult> {
    let deploymentId: Types.ObjectId | undefined;

    try {
      if (!gitUrl) throw new Error('Git URL is required');
      if (!userId) throw new Error('User ID is required');

      // Read configuration when the request arrives.
      const cluster = process.env.AWS_CLUSTER;
      const taskDefinition = process.env.AWS_TASK;
      const region = process.env.AWS_REGION || 'ap-southeast-2';
      const bucket = process.env.S3_BUCKET_NAME;
      const subnets = (process.env.AWS_SUBNETS || '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
      const securityGroup = process.env.AWS_SECURITY_GROUP;

      const missing = [
        !cluster && 'AWS_CLUSTER',
        !taskDefinition && 'AWS_TASK',
        !bucket && 'S3_BUCKET_NAME',
        subnets.length === 0 && 'AWS_SUBNETS',
        !securityGroup && 'AWS_SECURITY_GROUP',
      ].filter(Boolean);

      if (missing.length > 0) {
        throw new Error(`Missing AWS configuration: ${missing.join(', ')}`);
      }

      const baseSlug = (title || generateSlug())
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const slug = `${baseSlug}-${Date.now()}`;

      const deployment = await Deployment.create({
        userId,
        title: title || slug,
        gitUrl,
        slug,
        status: 'queued',
        url: `http://${slug}.localhost:8000`,
      });

      deploymentId = deployment._id;

      console.log('Starting ECS deployment:', {
        cluster,
        taskDefinition,
        projectId: slug,
        region,
      });

      const command = new RunTaskCommand({
        cluster,
        taskDefinition,
        launchType: 'FARGATE',
        count: 1,

        networkConfiguration: {
          awsvpcConfiguration: {
            subnets,
            securityGroups: [securityGroup!],
            assignPublicIp: 'ENABLED',
          },
        },

        overrides: {
          containerOverrides: [
            {
              name: 'builder-image',
              environment: [
                { name: 'GIT_REPO_URL', value: gitUrl },
                { name: 'PROJECT_ID', value: slug },
                { name: 'USER_ID', value: userId.toString() },
                { name: 'AWS_REGION', value: region },
                { name: 'S3_BUCKET_NAME', value: bucket },
              ],
            },
          ],
        },
      });

      const response = await ecsClient.send(command);

      if (response.failures?.length) {
        throw new Error(
          response.failures
            .map(failure => failure.reason || failure.detail || 'Unknown ECS failure')
            .join('; ')
        );
      }

      const taskArn = response.tasks?.[0]?.taskArn;

      if (!taskArn) {
        throw new Error('ECS accepted no task and returned no task ARN');
      }

      await Deployment.findByIdAndUpdate(deployment._id, {
        status: 'deploying',
        taskArn,
        updatedAt: new Date(),
      });

      return {
        success: true,
        status: 'deploying',
        data: {
          id: deployment._id,
          slug,
          title: deployment.title,
          gitUrl: deployment.gitUrl,
          url: deployment.url,
          userId,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (deploymentId) {
        await Deployment.findByIdAndUpdate(deploymentId, {
          status: 'failed',
          updatedAt: new Date(),
        });
      }

      console.error('Deployment creation failed:', error);

      throw new Error(`Deployment creation failed: ${message}`);
    }
  }

  async getDeployments(
    userId: Types.ObjectId | string
  ): Promise<GetDeploymentsResult> {
    try {
      const deployments = await Deployment.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      const mapped: DeploymentSummary[] = deployments.map(d => ({
        ...d,
        id: d._id.toString(),
      }));

      return { success: true, data: mapped };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch deployments: ${message}`);
    }
  }
}

export default new DeploymentService();
