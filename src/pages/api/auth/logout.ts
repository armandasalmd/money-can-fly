import { apiRoute } from "@server/core";

export default apiRoute("GET", (request, response) => {
  request.session.destroy();
  response.status(200).json({ success: true });
});