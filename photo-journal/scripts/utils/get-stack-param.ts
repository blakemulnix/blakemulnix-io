import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export async function getStackParam(paramName: string, stage: string = 'test') {
  const ssm = new SSMClient({ region: 'us-east-1' });
  const command = new GetParameterCommand({
    Name: `/sst/photo-journal/${stage}/Parameter/${paramName}/value`,
  });

  try {
    const response = await ssm.send(command);
    return response.Parameter?.Value;
  } catch (error) {
    console.error(`Error fetching parameter ${paramName}:`, error);
    throw error;
  }
}