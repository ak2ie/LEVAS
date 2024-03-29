// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 3000);
  }).then(() => {
    res.status(200).json({ name: "John Doe" });
  });
}
