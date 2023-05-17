import type { NextApiRequest, NextApiResponse } from "next";
import { openaiClient } from "@/lib/axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message, language } = req.body;

  const response = await openaiClient.post("", {
    model: "text-davinci-003",
    prompt: prompt(message, language),
  });

  if (response.status !== 200) {
    res.status(500).json({ message: "error" });
  }

  res.status(200).json({ message: response.data.choices[0]?.text?.trim() });
}

const prompt = (message: string, language: string) => `
Translate this into ${language}:

${message}

Please output in the following format.
# format
\`\`\`
{
  lang: ${language},
  message: result,
}
\`\`\`
`;
