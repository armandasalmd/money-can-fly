import { NextApiResponse } from "next";

export default function handler(_: any, res: NextApiResponse) {
  res.status(401).json({ message: "Unauthorised" });
}
