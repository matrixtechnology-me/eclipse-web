import { headers } from "next/headers";
import crypto from "crypto";

export const generateFingerprint = async () => {
  const headersList = await headers();

  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const acceptEncoding = headersList.get("accept-encoding") || "";
  const xForwardedFor = headersList.get("x-forwarded-for") || "";
  const xRealIp = headersList.get("x-real-ip") || "";
  const accept = headersList.get("accept") || "";

  const fingerprintData = [
    userAgent,
    acceptLanguage,
    acceptEncoding,
    xForwardedFor,
    xRealIp,
    accept,
  ].join("|");

  return crypto.createHash("sha256").update(fingerprintData).digest("hex");
};

export const generateServerActionFingerprint = async () => {
  const headersList = await headers();

  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const acceptEncoding = headersList.get("accept-encoding") || "";
  const xForwardedFor = headersList.get("x-forwarded-for") || "";
  const xRealIp = headersList.get("x-real-ip") || "";
  const accept = headersList.get("accept") || "";
  const referer = headersList.get("referer") || "";
  const authorization = headersList.get("authorization") || "";
  const host = headersList.get("host") || "";
  const contentType = headersList.get("content-type") || "";

  const timestamp = Math.floor(Date.now() / 60000);

  const fingerprintData = [
    userAgent,
    acceptLanguage,
    acceptEncoding,
    xForwardedFor,
    xRealIp,
    accept,
    referer,
    authorization ? "auth-present" : "no-auth",
    host,
    contentType,
    timestamp.toString(),
  ].join("|");

  return crypto.createHash("sha256").update(fingerprintData).digest("hex");
};
