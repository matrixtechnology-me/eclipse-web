import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import {
  AwsCredentialIdentity,
  AwsCredentialIdentityProvider,
} from "@aws-sdk/types";

export class S3Service {
  private s3: S3Client;

  constructor(
    credentials: AwsCredentialIdentity | AwsCredentialIdentityProvider
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials,
    });
  }

  async putObject(
    bucket: string,
    key: string,
    body: Buffer | Uint8Array | Blob | string
  ) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
    });
    await this.s3.send(command);
  }

  async getObject(bucket: string, key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await this.s3.send(command);
    return response.Body as Readable;
  }

  async deleteObject(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await this.s3.send(command);
  }
}
