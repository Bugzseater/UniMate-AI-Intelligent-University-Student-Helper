import fs from "fs";
import cosine from "cosine-similarity";
import { getEmbedding } from "./embedder.js";

const DB_FILE = "./ai/vectors.json";

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

  // 1️⃣ First: filter by domain strictly
  let domainVectors = vectors.filter(v => {
    if (intent === "study") return v.file.includes("study");
    if (intent === "finance") return v.file.includes("expense") || v.file.includes("budget");
    if (intent === "income") return v.file.includes("income") || v.file.includes("parttime") || v.file.includes("online");
    if (intent === "housing") return v.file.includes("boarding");
    if (intent === "life") return v.file.includes("mental") || v.file.includes("campus");
    return true;
  });

  // If nothing matched, fall back to full knowledge base
  if (domainVectors.length === 0) domainVectors = vectors;

  // 2️⃣ Rank only inside that domain
  const ranked = domainVectors
    .map(v => ({ ...v, score: cosine(qEmbedding, v.embedding) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0];
}


