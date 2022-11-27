import { apiRoute } from "@server/core";

export default apiRoute("GET", async (_, response, user) => {
  return response.status(200).json({
    success: true,
    authorised: !!user
  });
});