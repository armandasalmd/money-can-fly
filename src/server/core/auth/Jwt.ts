import jwt, { JwtPayload } from "jsonwebtoken";
import { FirebasePublicKey } from "./FirebaseCertificate";

export async function verifyToken(token: string): Promise<null | string | JwtPayload> {
  if (!token) {
    return null;
  }

  const decoded = jwt.decode(token, { complete: true });

  if (typeof decoded?.header?.kid !== "string") {
    return null;
  }

  const publicKey = await FirebasePublicKey.getInstance().getPublicKey(decoded.header.kid);

  return jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
}