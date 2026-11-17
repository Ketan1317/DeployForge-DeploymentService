import { Queue } from 'bullmq';
import redisConnection from '../config/redis';

export interface DeploymentJob {
  deploymentId: string;
  gitUrl: string;
  slug: string;
  userId: string;
}

export const deploymentQueue = new Queue<DeploymentJob>(
  'deployment-queue',
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  }
);