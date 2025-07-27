import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

const sts = new STSClient({ region: process.env.AWS_REGION });

export class STSService {
  async assumeRole(
    roleArn: string,
    sessionName: string = "",
    durationSeconds = 3600
  ) {
    const { Credentials: c } = await sts.send(
      new AssumeRoleCommand({
        RoleArn: roleArn,
        RoleSessionName: sessionName,
        DurationSeconds: durationSeconds,
      })
    );
    if (
      !c?.AccessKeyId ||
      !c.SecretAccessKey ||
      !c.SessionToken ||
      !c.Expiration
    ) {
      throw new Error("Failed to assume role: incomplete credentials");
    }

    return {
      accessKeyId: c.AccessKeyId,
      secretAccessKey: c.SecretAccessKey,
      sessionToken: c.SessionToken,
      expiration: c.Expiration,
    };
  }
}
