import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import {
  AwsCredentialIdentityProvider,
  AwsCredentialIdentity,
} from "@aws-sdk/types";

type InvokeLambdaProps<P> = {
  functionName: string;
  payload: P;
};

export class LambdaService {
  private client: LambdaClient;

  constructor(
    credentials: AwsCredentialIdentity | AwsCredentialIdentityProvider
  ) {
    this.client = new LambdaClient({
      region: process.env.AWS_REGION,
      credentials,
    });
  }

  async invoke<P, R>({
    functionName,
    payload,
  }: InvokeLambdaProps<P>): Promise<R> {
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const response = await this.client.send(command);

    if (!response.Payload) {
      throw new Error("Empty response payload");
    }

    const decoded = new TextDecoder("utf-8").decode(response.Payload);
    return JSON.parse(decoded) as R;
  }
}
