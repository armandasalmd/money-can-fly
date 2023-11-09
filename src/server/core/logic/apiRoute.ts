import { NextApiResponse, NextApiRequest, NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { validateSync, ValidationError } from "class-validator";
import { plainToInstance, ClassConstructor } from "class-transformer";
import { dbConnect } from "@server/core";

import { CookieUser, sessionOptions } from "@server/core";

type NextApiHandlerWithUser<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  user?: CookieUser
) => unknown | Promise<unknown>;
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface IResponseError {
  [field: string]: string;
}

export function apiRoute(method: Method, handler: NextApiHandlerWithUser): NextApiHandler {
  return withIronSessionApiRoute(async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== method) {
      return response.status(405).end();
    }

    await dbConnect();

    return handler(request, response, request.session.user);
  }, sessionOptions);
}

export function validatedApiRoute(
  method: Method,
  requestModelClass: ClassConstructor<any>,
  handler: NextApiHandlerWithUser
): NextApiHandler {
  return withIronSessionApiRoute(async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== method) {
      return response.status(405).end();
    }
    
    if (!requestModelClass) {
      return response.status(500).json({
        success: false,
        message: "Validation failed. API route has no model class assigned to it",
      });
    }

    const data = method === "GET" ? request.query : request.body;

    if (!data) {
      return response.status(400).json({
        success: false,
        message: `Validation failed. Request ${method === "GET" ? "query" : "body"} is required`,
      });
    }

    try {
      const errors = validateSync(plainToInstance(requestModelClass, data));

      if (errors && errors.length > 0) {
        response.status(400).json({
          success: false,
          message: "Validation failed",
          fieldErrors: toFieldErrors(errors),
        });

        return;
      }
    } catch (error) {
      return response.status(500).json({
        success: false,
        data,
        message: error.message,
      });
    }

    await dbConnect();

    return handler(request, response, request.session.user);
  }, sessionOptions);
}

export function toFieldErrors(errors: ValidationError[]): IResponseError {
  const result: IResponseError = {};

  for (const error of errors) {
    const message = Object.values(error.constraints || {}).find(() => true) || "Unknown error";

    result[error.property] = message;
  }

  return result;
}

export function validate(modelClass: ClassConstructor<any>, target: any) {
  return validateSync(plainToInstance(modelClass, target));
}