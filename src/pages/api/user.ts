import { withUser } from "@server/core";

export default withUser("GET", (_, response, user) => {
  response.status(200).json({ user });
});
