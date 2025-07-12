import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type UploadParams = {
  path: string;
  fileType: string;
  body: Buffer;
};

export type FileNameParams = {
  path: string;
};

export type UrlResult = {
  url: string;
};

export class R2Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    const {
      CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_R2_ACCESS_KEY_ID,
      CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      CLOUDFLARE_R2_BUCKET_NAME,
    } = process.env;

    if (!CLOUDFLARE_ACCOUNT_ID)
      throw new Error("Missing CLOUDFLARE_ACCOUNT_ID");
    if (!CLOUDFLARE_R2_ACCESS_KEY_ID)
      throw new Error("Missing CLOUDFLARE_R2_ACCESS_KEY_ID");
    if (!CLOUDFLARE_R2_SECRET_ACCESS_KEY)
      throw new Error("Missing CLOUDFLARE_R2_SECRET_ACCESS_KEY");
    if (!CLOUDFLARE_R2_BUCKET_NAME)
      throw new Error("Missing CLOUDFLARE_R2_BUCKET_NAME");

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = CLOUDFLARE_R2_BUCKET_NAME;
  }

  async getPreSignedUrl({ path }: FileNameParams): Promise<UrlResult> {
    const getObjectParams: GetObjectCommandInput = {
      Bucket: this.bucketName,
      Key: path,
    };

    const getObjectCommand = new GetObjectCommand(getObjectParams);

    const url = await getSignedUrl(this.s3Client, getObjectCommand);

    return { url };
  }

  async upload({ path, fileType, body }: UploadParams): Promise<UrlResult> {
    try {
      const uploadParams: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: path,
        ContentType: fileType,
        Body: body,
      };

      const putObjectCommand = new PutObjectCommand(uploadParams);

      await this.s3Client.send(putObjectCommand);

      const getObjectParams: GetObjectCommandInput = {
        Bucket: this.bucketName,
        Key: path,
      };

      const getObjectCommand = new GetObjectCommand(getObjectParams);

      const url = await getSignedUrl(this.s3Client, getObjectCommand, {
        expiresIn: 60 * 60 * 24 * 7,
      });

      return { url };
    } catch (err) {
      console.error(`error uploading attachment: ${err}`);
      throw new Error("Error uploading attachment");
    }
  }

  async delete({ path }: FileNameParams) {
    try {
      const deleteParams: DeleteObjectCommandInput = {
        Bucket: this.bucketName,
        Key: path,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (err) {
      console.error(err);
    }
  }
}
