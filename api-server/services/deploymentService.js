const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { generateSlug } = require("random-word-slugs");

const ecsClient = new ECSClient({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY
  },
});

const ECS_CONFIG = {
  CLUSTER:process.env.AWS_CLUSTER,
  TASK: process.env.AWS_TASK,
};

class DeploymentService {
  async createDeployment(gitUrl, title, connectionString,userId) {
    try {
      if (!gitUrl) {
        throw new Error("Git URL is required");
      }

      const slug = title || generateSlug();

      const command = new RunTaskCommand({
        cluster: ECS_CONFIG.CLUSTER,
        taskDefinition: ECS_CONFIG.TASK,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [
              "subnet-0c8a514b9d546464c",
              "subnet-0e7c08550f5cb7b23",
              "subnet-036e36fb1ba412e4f",
            ],
            securityGroups: ["sg-00c79dfaae14f57ce"],
            assignPublicIp: "ENABLED",
          },
        },
        overrides: {
          containerOverrides: [
            {
              name: "builder-image",
              environment: [
                { name: "GIT_REPO_URL", value: gitUrl },
                { name: "PROJECT_ID", value: slug },
                { name: "USER_ID", value: userId.toString() },
                 {
                  name:
                    "AZURE_STORAGE_CONNECTION_STRING",
                  value:
                    connectionString,
                }
              ],
            },
          ],
        },
      });

      await ecsClient.send(command);

      return {
        success: true,
        status: "queued",
        data: {
          slug,
          url: `http://${slug}.localhost:8000`,
          userId,
        },
      };
    } catch (error) {
      throw new Error(`Deployment creation failed: ${error.message}`);
    }
  }
}

module.exports = new DeploymentService();
