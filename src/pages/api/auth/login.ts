import { IsJWT } from "class-validator";

import { verifyToken, validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";

export class LoginRequest {
  @IsJWT()
  userIdToken: string;
}

export default validatedApiRoute("POST", LoginRequest, async (request, response) => {
  try {
    const payload: any = await verifyToken(request.body.userIdToken);

    if (payload && payload.email && payload.user_id) {
      request.session.user = {
        email: payload.email,
        userUID: payload.user_id,
        exp: new Date(Date.now() + ((constants.sessionMaxAge - 60) * 1000)).toISOString(),
      };
      
      await request.session.save();

      return response.status(200).json({ success: true, user: request.session.user });
    } else {
      return response.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    return response.status(401).json({ success: false, message: error.message });
  }
});
