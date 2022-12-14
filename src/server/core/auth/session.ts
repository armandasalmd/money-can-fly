import type { IronSessionOptions } from "iron-session/edge";
import type { CookieUser } from "@server/core";
import constants from "@server/utils/Constants";

export const sessionOptions: IronSessionOptions = {
  password: process.env.IRON_SESSION_SECRET as string,
  cookieName: "iron-sid",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: true,
    maxAge: constants.sessionMaxAge
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: CookieUser;
  }
}