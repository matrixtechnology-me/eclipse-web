import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  AwsCredentialIdentity,
  AwsCredentialIdentityProvider,
} from "@aws-sdk/types";

type SendEmailProps = {
  from: string;
  to: string | string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
};

export class SESService {
  private ses: SESClient;

  constructor(
    credentials: AwsCredentialIdentity | AwsCredentialIdentityProvider
  ) {
    this.ses = new SESClient({
      region: process.env.AWS_REGION,
      credentials,
    });
  }

  async sendEmail({ from, to, subject, htmlBody, textBody }: SendEmailProps) {
    try {
      const command = new SendEmailCommand({
        Source: from,
        Destination: {
          ToAddresses: Array.isArray(to) ? to : [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: htmlBody,
              Charset: "UTF-8",
            },
            ...(textBody && {
              Text: {
                Data: textBody,
                Charset: "UTF-8",
              },
            }),
          },
        },
      });

      await this.ses.send(command);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
