import express from "express";
import dotenv from "dotenv";
import { summarizePR } from "./openai.js";
import { commentOnPR, getPRDiff } from "./github.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const { action, pull_request, repository } = req.body;
  if (action === "opened" || action === "synchronize") {
    const { owner, name } = repository;
    const prNumber = pull_request.number;
    console.log("owner, name: ",owner, name)

    const diff = await getPRDiff(owner.login, name, prNumber);
    const summary = await summarizePR(diff);

    await commentOnPR(owner.login, name, prNumber, summary);
  }
  res.sendStatus(200);
});

app.listen(PORT, console.log(`Webhook server running on port ${PORT}`));
