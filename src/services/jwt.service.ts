import { jwtVerify, SignJWT, JWTPayload } from "jose";
import moment from "moment";

type DefaultTokens = {
  accessToken: string;
  refreshToken: string;
};

export class JwtService {
  private accessPayload: JWTPayload;
  private refreshPayload: JWTPayload;
  private accessOriginal: string;
  private refreshOriginal: string;

  private readonly secret: Uint8Array;

  constructor(secret: string) {
    if (typeof secret !== "string" || secret.length < 32) {
      throw new Error(
        "JWT_SECRET must be defined and at least 32 characters long"
      );
    }
    this.secret = new TextEncoder().encode(secret);
  }

  public async sign(
    payload: Record<string, unknown>,
    expiresIn: string
  ): Promise<string> {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(this.secret);

    return token;
  }

  async verify<T = JWTPayload>(token: string): Promise<T> {
    const { payload } = await jwtVerify(token, this.secret, {
      algorithms: ["HS256"],
    });
    return payload as T;
  }

  public async initializeTokens(tokens: DefaultTokens): Promise<void> {
    await this.updateTokens(tokens);
  }

  private async updateTokens({ accessToken, refreshToken }: DefaultTokens) {
    this.accessOriginal = accessToken;
    this.refreshOriginal = refreshToken;

    const { payload: accessPayload } = await jwtVerify(
      accessToken,
      this.secret
    );
    const { payload: refreshPayload } = await jwtVerify(
      refreshToken,
      this.secret
    );

    this.accessPayload = accessPayload;
    this.refreshPayload = refreshPayload;
  }

  public getAccessPayload() {
    return this.accessPayload;
  }

  public getRefreshPayload() {
    return this.refreshPayload;
  }

  public getAccessToken() {
    return this.accessOriginal;
  }

  public getRefreshToken() {
    return this.refreshOriginal;
  }

  public isAccessExpired(): boolean {
    const accessExpDate = moment.unix(this.accessPayload.exp as number);
    return accessExpDate.isBefore(moment());
  }

  public isRefreshExpired(): boolean {
    const refreshExpDate = moment.unix(this.refreshPayload.exp as number);
    return refreshExpDate.isBefore(moment());
  }

  public async attemptRefresh(): Promise<boolean> {
    try {
      const newAccessToken = await new SignJWT(this.accessPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(this.secret);

      const newRefreshToken = await new SignJWT(this.refreshPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(this.secret);

      // Atualiza os tokens
      await this.updateTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      return true;
    } catch (error) {
      console.log(`Unable to refresh user session because ${error}`);
      return false;
    }
  }
}
