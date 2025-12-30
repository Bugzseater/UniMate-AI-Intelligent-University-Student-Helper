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
  console.log("INTENT:", intent);

  const filtered = vectors.filter(v => v.file.includes("study"));
  console.log("FILES USED:", filtered.map(v => v.file));

  return filtered[0];
}



