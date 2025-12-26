import fs from "fs";
import cosine from "cosine-similarity";
import { getEmbedding } from "./embedder.js";

const DB_FILE = "./ai/vectors.json";

export async function ingestDocs() {
  console.log("📥 Starting ingestion...");

  const files = fs.readdirSync("./ai/knowledge");
  let vectors = [];

  for (const file of files) {
    console.log("Processing:", file);
    const text = fs.readFileSync(`./ai/knowledge/${file}`, "utf8");
    const embedding = await getEmbedding(text);
    vectors.push({ file, text, embedding });
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(vectors, null, 2));
  console.log("✅ vectors.json created");
}

export async function searchDocs(query, intent) {
  const vectors = JSON.parse(fs.readFileSync(DB_FILE));
  const qEmbedding = await getEmbedding(query);

  const ranked = vectors
    .map(v => {
      const intentBoost =
        intent === "housing" && v.file.includes("boarding") ? 0.3 :
        intent === "finance" && (v.file.includes("expense") || v.file.includes("budget")) ? 0.3 :
        intent === "income" && v.file.includes("parttime") ? 0.3 :
        intent === "study" && v.file.includes("study") ? 0.3 :
        0;

      return {
        ...v,
        score: cosine(qEmbedding, v.embedding) + intentBoost
      };
    })
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, 2).map(v => v.text).join("\n");
}
