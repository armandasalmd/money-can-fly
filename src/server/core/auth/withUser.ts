import { NextApiResponse, NextApiRequest, NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { CookieUser, sessionOptions } from "@server/core";

type NextApiHandlerWithUser<T = any> = (req: NextApiRequest, res: NextApiResponse<T>, user?: CookieUser) => unknown | Promise<unknown>;
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function withUser(method: Method, handler: NextApiHandlerWithUser): NextApiHandler {
  return withIronSessionApiRoute((request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== method) {
      return response.status(405).end();
    }

    return handler(request, response, request.session.user);
  }, sessionOptions);
}