import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export class CognitoService {
  constructor(private clientId: string, private userPoolId: string) {}

  async signUp(username: string, password: string, email: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    });

    await cognito.send(command);
  }

  async confirmSignUp(username: string, confirmationCode: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    });

    await cognito.send(command);
  }

  async signIn(username: string, password: string) {
    const command = new AdminInitiateAuthCommand({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const response = await cognito.send(command);

    if (response.ChallengeName) {
      return {
        challengeName: response.ChallengeName,
        session: response.Session,
        parameters: response.ChallengeParameters,
      };
    }

    return {
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn,
      tokenType: response.AuthenticationResult?.TokenType,
    };
  }

  async respondToChallenge(
    challengeName: ChallengeNameType,
    session: string,
    challengeResponses: Record<string, string>
  ) {
    const command = new AdminRespondToAuthChallengeCommand({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      ChallengeName: challengeName,
      Session: session,
      ChallengeResponses: challengeResponses,
    });

    const response = await cognito.send(command);

    if (response.ChallengeName) {
      return {
        challengeName: response.ChallengeName,
        session: response.Session,
        parameters: response.ChallengeParameters,
      };
    }

    return {
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn,
      tokenType: response.AuthenticationResult?.TokenType,
    };
  }
}
