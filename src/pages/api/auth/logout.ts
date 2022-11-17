import { withUser } from "@server/core";

export default withUser((request, response) => {
  request.session.destroy();
  response.status(200).json({ success: true });
});