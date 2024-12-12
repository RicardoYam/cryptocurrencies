import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.CMC_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "API key is missing" });
    return;
  }

  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        params: {
          start: 1,
          limit: 5000,
          convert: "USD",
        },
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          Accept: "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      res
        .status(error.response?.status || 500)
        .json({ error: error.message || "An error occurred" });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
