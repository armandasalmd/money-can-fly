import { verifyToken, withUser } from "@server/core";

export default withUser("POST", async (request, response) => {
  if (request.body && request.body.userIdToken) {
    try {
      const payload: any = verifyToken(request.body.userIdToken);
  
      if (payload && payload.email && payload.user_id) {
        request.session.user = {
          email: payload.email,
          userUID: payload.user_id
        };
        
        await request.session.save();
  
        return response.status(200).json({ success: true, user: request.session.user });
      } else {
        return response.status(401).json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      return response.status(401).json({ success: false, message: error.message });
    }
  }

  return response.status(400).json({ success: false, message: "Bad Request" });
});
