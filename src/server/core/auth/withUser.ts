import { NextApiResponse, NextApiRequest, NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { CookieUser, sessionOptions } from "@server/core";

type NextApiHandlerWithUser<T = any> = (req: NextApiRequest, res: NextApiResponse<T>, user?: CookieUser) => unknown | Promise<unknown>;

export function withUser(handler: NextApiHandlerWithUser): NextApiHandler {
  return withIronSessionApiRoute((request: NextApiRequest, response: NextApiResponse) => {
    return handler(request, response, request.session.user);
  }, sessionOptions);
}