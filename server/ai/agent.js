import { queryKnowledge } from "./rag.js";

// ================= MAIN AGENT =================

export async function agentResponse(userMessage) {
  const intent = detectIntent(userMessage);
  const searchQuery = `${intent} : ${userMessage}`;

  const knowledge = await queryKnowledge(searchQuery, intent);

  let response = `🧠 UniMate AI\n\n`;
  response += `❓ ${userMessage}\n\n`;

  response += `🏠 Answer:\n${cleanAnswer(knowledge)}\n\n`;

  response += `💡 Advice:\n${generateAdvice(intent)}\n\n`;
  response += `➡️ Next:\n${suggestNext(intent)}`;

  return response;
}

// ================= INTELLIGENCE =================

function detectIntent(message) {
  const m = message.toLowerCase();

  if (m.includes("bodima") || m.includes("boarding") || m.includes("rent") || m.includes("stay"))
    return "housing";

  if (m.includes("expense") || m.includes("wiyadam") || m.includes("cost") || m.includes("gasta"))
    return "finance";

  if (m.includes("income") || m.includes("job") || m.includes("salli") || m.includes("earning"))
    return "income";

  if (m.includes("study") || m.includes("exam") || m.includes("learn"))
    return "study";

  return "general";
}

// ================= RESPONSE ENHANCERS =================

function cleanAnswer(text) {
  // Keep only the most relevant content (remove mixed info)
  return text.split("\n")[0];
}

function generateAdvice(intent) {
  const tips = {
    housing:
      "Bodima hoyagaddi pahasu gaman karanna puluwan thana, suraksha sahitha da kiyala balanna. Rent, current bill, water, internet monawada cover wenne kiyala hariyata check karanna.",

    finance:
      "Masika expense list ekak hadala unnecessary wiyadam adu karanna. Monthly salli walin tikak hari save karanna.",

    income:
      "Part-time jobs, online freelancing, tutoring wage dewal walin aluth income ekak hadaganna puluwan.",

    study:
      "Daily study plan ekak hadala time table ekakata wada karanna. Pomodoro method wage techniques use karanna.",

    general:
      "Oya situation eka tikak explain karanna. Ehema unoth mama hondama solution ekak hadala dennam."
  };

  return tips[intent];
}

function suggestNext(intent) {
  return `Oyata one nam simple ${intent} plan ekak mama hadala denna puluwan.`;
}
