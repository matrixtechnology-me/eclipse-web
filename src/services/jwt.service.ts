import {
  importPKCS8,
  importSPKI,
  JWTPayload,
  jwtVerify,
  SignJWT,
  decodeJwt,
} from "jose";

type DefaultTokens = {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
};

export class JwtService {
  public async sign(
    payload: Record<string, unknown>,
    expiresIn: string
  ): Promise<string> {
    const privateKeyPEM = Buffer.from(
      process.env.JWT_PRIVATE_KEY!,
      "base64"
    ).toString("utf-8");

    if (!privateKeyPEM) {
      throw new Error("Private key (JWT_PRIVATE_KEY) is not defined in env");
    }

    const privateKey = await importPKCS8(privateKeyPEM, "RS256");

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "RS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(privateKey);

    return token;
  }

  async verify<T = JWTPayload>(token: string): Promise<T> {
    const publicKeyPEM = Buffer.from(
      process.env.JWT_PUBLIC_KEY!,
      "base64"
    ).toString("utf-8");

    if (!publicKeyPEM) {
      throw new Error("Public key (JWT_PUBLIC_KEY) is not defined in env");
    }

    const publicKey = await importSPKI(publicKeyPEM, "RS256");

    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: ["RS256"],
    });

    return payload as T;
  }

  decode<T = JWTPayload>(token: string): T {
    return decodeJwt(token) as T;
  }
}
