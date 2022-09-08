import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  title: string;
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
    res.status(200).json({ title: "テスト - " + req.query.id });
  });
}
