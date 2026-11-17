import 'dotenv/config';
import connectDB from '../config/database';

async function startWorker() {
  try {
    await connectDB();
    await import('./deploymentWorker');

    console.log('Deployment worker process ready');
  } catch (error) {
    console.error('Failed to start deployment worker:', error);
    process.exit(1);
  }
}

void startWorker();