import { ingestDocs, searchDocs } from "./vectorStore.js";

await ingestDocs();

export async function queryKnowledge(question, intent) {
  const result = await searchDocs(question, intent);

  if (!result || result.score < 0.15) return null;
  return result;
}
