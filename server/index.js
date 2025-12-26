import express from "express";
import cors from "cors";
import "./ai/rag.js";
import { agentResponse } from "./ai/agent.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("UniMate AI Server Running");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await agentResponse(message);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => console.log("Server started on 5000"));
