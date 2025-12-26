import { ingestDocs, searchDocs } from "./vectorStore.js";

await ingestDocs();

export async function queryKnowledge(question, intent) {
  return await searchDocs(question, intent);
}
