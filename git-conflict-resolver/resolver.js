import simpleGit from "simple-git";
import fs from "fs/promises";
import OpenAI from "openai";

const git = simpleGit();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function findConflictsAndResolve() {
  const status = await git.status();
  const conflictedFiles = status.conflicted;
  console.log("status: ",status)
  console.log("conflictedFiles: ",conflictedFiles)
  for (const file of conflictedFiles) {
    const content = await fs.readFile(file, "utf8");

    if (content.includes("<<<<<<<")) {
      const prompt = `Resolve the Git merge conflict below and provide a clean merged version:\n\n${content}`;
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      const resolved = completion.choices[0].message.content;
      await fs.writeFile(file, resolved, "utf8");
      console.log(`✅ Conflict resolved for ${file}`);
    }
  }
}
