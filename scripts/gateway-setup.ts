import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS SDK for LocalStack
const apiGateway = new AWS.APIGateway({
  endpoint: process.env.LOCALSTACK_URL || 'http://localhost:4566',
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test',
});

const setupAPIGateway = async () => {
  try {    
    // Create the API Gateway
    const api = await apiGateway
      .createRestApi({ name: 'Realm-of-Strategos-Gateway' })
      .promise();
    console.log('API Created:', api);

    // Get the root resource ID
    const resources = await apiGateway
      .getResources({ restApiId: api.id! })
      .promise();
    const rootId = resources.items?.[0].id;
    if (!rootId) {
      throw new Error('Root resource ID not found.');
    }

    // Helper function to add resources and methods
    const addServiceRoute = async (path: string, serviceUri: string) => {
      // Create a resource under the root for the specified path
      const resource = await apiGateway
        .createResource({
          restApiId: api.id!,
          parentId: rootId,
          pathPart: path,
        })
        .promise();
      console.log(`${path} Resource Created:`, resource);

      // Add an HTTP ANY method to the resource
      await apiGateway
        .putMethod({
          restApiId: api.id!,
          resourceId: resource.id!,
          httpMethod: 'ANY',
          authorizationType: 'NONE',
        })
        .promise();

      // Integrate the resource with the specified service URI
      await apiGateway
        .putIntegration({
          restApiId: api.id!,
          resourceId: resource.id!,
          httpMethod: 'ANY',
          type: 'HTTP',
          integrationHttpMethod: 'ANY',
          uri: serviceUri,
        })
        .promise();

      console.log(`${path} route integrated with ${serviceUri}`);
    };

    // Add routes for each service
    await addServiceRoute('auth', 'http://auth-service:3000');
    await addServiceRoute('matchmaking', 'http://matchmaking-service:3002');
    await addServiceRoute('game-session', 'http://game-session-service:3001');
    // await addServiceRoute('api-docs/auth', 'http://auth-service:3000/api-docs');
    // await addServiceRoute('api-docs/game-session', 'http://game-session-service:3001/api-docs');
    // await addServiceRoute('api-docs/game-session', 'http://game-session-service:3002/api-docs');

    console.log('API Gateway setup complete!');
  } catch (error) {
    console.error('Error setting up API Gateway:', error);
  }
};

setupAPIGateway();