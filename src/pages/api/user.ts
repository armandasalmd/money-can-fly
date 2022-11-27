import { apiRoute } from "@server/core";

export default apiRoute("GET", (_, response, user) => {
  response.status(200).json({ user });
});
