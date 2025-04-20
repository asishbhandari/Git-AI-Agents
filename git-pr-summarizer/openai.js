import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function summarizePR(diff) {
  const prompt = `Summarize this GitHub pull request diff:\n\n${diff}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });
  return completion.choices[0].message.content;
}
