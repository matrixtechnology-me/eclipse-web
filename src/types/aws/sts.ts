export type AssumeRolePayload = {};

export type AssumeRoleResult = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: Date;
};
