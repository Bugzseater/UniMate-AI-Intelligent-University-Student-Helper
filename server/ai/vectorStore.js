import fs from "fs";
import cosine from "cosine-similarity";
import { getEmbedding } from "./embedder.js";

const DB_FILE = "./ai/vectors.json";

console.log("🔥 NEW vectorStore.js LOADED");

export async function ingestDocs() {
  console.log("📥 Starting ingestion...");

  let vectors = [];
  const files = fs.readdirSync("./ai/knowledge").filter(f => f.endsWith(".txt"));

  for (const file of files) {
    const raw = fs.readFileSync(`./ai/knowledge/${file}`, "utf8");

    const content = raw.split("LINK:")[0].replace("CONTENT:", "").trim();
    const link = raw.split("LINK:")[1]?.trim() || "N/A";

    const embedding = await getEmbedding(content);

    vectors.push({
      file,
      text: content,
      link,
      embedding
    });

    console.log("Processed:", file);
  }

  fs.writeFileSync("./ai/vectors.json", JSON.stringify(vectors, null, 2));
  console.log("✅ Knowledge base updated");
}


export async function searchDocs(query, intent) {
  const vectors = JSON.parse(fs.readFileSync("./ai/vectors.json"));
  const qEmbedding = await getEmbedding(query);

  // Strict domain lock
  let domain = [];

  if (intent === "study")
    domain = vectors.filter(v => v.file.includes("study"));

  else if (intent === "finance")
    domain = vectors.filter(v => v.file.includes("expense") || v.file.includes("budget"));

  else if (intent === "income")
    domain = vectors.filter(v => v.file.includes("income") || v.file.includes("parttime") || v.file.includes("online"));

  else if (intent === "housing")
    domain = vectors.filter(v => v.file.includes("boarding"));

  else if (intent === "life")
    domain = vectors.filter(v => v.file.includes("mental") || v.file.includes("campus"));

  else
    domain = vectors;

  // No fallback. Must obey domain.
  if (domain.length === 0) return null;

  const ranked = domain
    .map(v => ({ ...v, score: cosine(qEmbedding, v.embedding) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0];
}




