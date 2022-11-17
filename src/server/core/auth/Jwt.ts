import jwt, { JwtPayload } from "jsonwebtoken";
import Constants from "@server/utils/Constants";

export function verifyToken(token: string): null | string | JwtPayload {
  if (!token) {
    return null;
  }

  return jwt.verify(token, Constants.firebasePublicCert, {
    algorithms: ["RS256"],
  });
}