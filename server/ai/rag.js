import { ingestDocs, searchDocs } from "./vectorStore.js";

await ingestDocs();

export async function queryKnowledge(question) {
  return await searchDocs(question);
}
