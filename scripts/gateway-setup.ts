import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables
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

    // Create the "auth" resource
    const authResource = await apiGateway
      .createResource({
        restApiId: api.id!,
        parentId: rootId,
        pathPart: 'auth',
      })
      .promise();
    console.log('Auth Resource Created:', authResource);

    // Add GET method to the "auth" resource
    await apiGateway
      .putMethod({
        restApiId: api.id!,
        resourceId: authResource.id!,
        httpMethod: 'GET',
        authorizationType: 'NONE',
      })
      .promise();

    // Integrate the "auth" resource with auth-service
    await apiGateway
      .putIntegration({
        restApiId: api.id!,
        resourceId: authResource.id!,
        httpMethod: 'GET',
        type: 'HTTP',
        integrationHttpMethod: 'GET',
        uri: 'http://auth-service:3000',
      })
      .promise();

    console.log('API Gateway setup complete!');
  } catch (error) {
    console.error('Error setting up API Gateway:', error);
  }
};

setupAPIGateway();