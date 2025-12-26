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

export async function searchDocs(query) {
  console.log("🔍 Query:", query);

  const vectors = JSON.parse(fs.readFileSync(DB_FILE));
  const qEmbedding = await getEmbedding(query);

  const ranked = vectors
    .map(v => ({ ...v, score: cosine(qEmbedding, v.embedding) }))
    .sort((a, b) => b.score - a.score);

  console.log("🏆 Best match:", ranked[0].file);

  return ranked.slice(0, 2).map(v => v.text).join("\n");
}
