import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { generateSlug } from 'random-word-slugs';
import { Types } from 'mongoose';
import Deployment from '../models/Deployment';
import { CreateDeploymentResult, GetDeploymentsResult, DeploymentSummary } from '../types';

const ecsClient = new ECSClient({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const ECS_CONFIG = {
  CLUSTER: process.env.AWS_CLUSTER,
  TASK: process.env.AWS_TASK,
};

export class DeploymentService {
  async createDeployment(
    gitUrl: string,
    title?: string,
    userId?: Types.ObjectId | string
  ): Promise<CreateDeploymentResult> {
    try {
      if (!gitUrl) {
        throw new Error('Git URL is required');
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      const baseSlug = (title || generateSlug())
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-');

      const slug = `${baseSlug}-${Date.now()}`;

      const deployment = await Deployment.create({
        userId,
        title: title || slug,
        gitUrl,
        slug,
        status: 'queued',
        url: `http://${slug}.localhost:8000`,
      });

      const command = new RunTaskCommand({
        cluster: ECS_CONFIG.CLUSTER,
        taskDefinition: ECS_CONFIG.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [
              'subnet-0c8a514b9d546464c',
              'subnet-0e7c08550f5cb7b23',
              'subnet-036e36fb1ba412e4f',
            ],
            securityGroups: ['sg-00c79dfaae14f57ce'],
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
                {
                  name: 'AZURE_STORAGE_CONNECTION_STRING',
                  value: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
                },
              ],
            },
          ],
        },
      });

      await ecsClient.send(command);

      return {
        success: true,
        status: 'success',
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
      throw new Error(`Deployment creation failed: ${message}`);
    }
  }

  async getDeployments(userId: Types.ObjectId | string): Promise<GetDeploymentsResult> {
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
}

export default new DeploymentService();
