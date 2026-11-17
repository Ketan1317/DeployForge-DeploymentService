import { Worker } from 'bullmq';
import { ECSClient, RunTaskCommand,} from '@aws-sdk/client-ecs';

import redisConnection from '../config/redis';
import { DeploymentJob } from '../queues/deploymentQueue';
import Deployment from '../models/Deployment';

const ecsClient = new ECSClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
});

const deploymentWorker = new Worker<DeploymentJob>(
  'deployment-queue',
  async (job) => {
    const {
      deploymentId,
      gitUrl,
      slug,
      userId,
    } = job.data;

    console.log(`Starting deployment: ${slug}`);

    const subnets = process.env.AWS_SUBNETS!
      .split(',')
      .map((subnet) => subnet.trim());

    const response = await ecsClient.send(
      new RunTaskCommand({
        cluster: process.env.AWS_CLUSTER,
        taskDefinition: process.env.AWS_TASK,
        launchType: 'FARGATE',

        networkConfiguration: {
          awsvpcConfiguration: {
            subnets,
            securityGroups: [process.env.AWS_SECURITY_GROUP!],
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
                { name: 'USER_ID', value: userId },
                {
                  name: 'AWS_REGION',
                  value: process.env.AWS_REGION || 'ap-southeast-2',
                },
                {
                  name: 'S3_BUCKET_NAME',
                  value: process.env.S3_BUCKET_NAME,
                },
              ],
            },
          ],
        },
      })
    );

    if (response.failures?.length || !response.tasks?.[0]?.taskArn) {
      throw new Error(
        response.failures?.map((failure) => failure.reason).join(', ') ||
        'ECS failed to start the task'
      );
    }

    const taskArn = response.tasks[0].taskArn;

    await Deployment.findByIdAndUpdate(deploymentId, {
      status: 'deploying',
      taskArn,
      updatedAt: new Date(),
    });

    console.log(`ECS task started for ${slug}: ${taskArn}`);

    return { taskArn };
  },
  {
    connection: redisConnection,
    concurrency: 3,
  }
);

deploymentWorker.on('completed', (job) => {
  console.log(`Deployment job completed: ${job.id}`);
});

deploymentWorker.on('failed', (job, error) => {
  console.error(`Deployment job failed: ${job?.id}`, error);
});

console.log('Deployment worker started');

export default deploymentWorker;
