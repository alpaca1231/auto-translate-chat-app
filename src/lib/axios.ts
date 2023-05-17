import axios from "axios";

export const openaiClient = axios.create({
  baseURL: "https://api.openai.com/v1/completions",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});
