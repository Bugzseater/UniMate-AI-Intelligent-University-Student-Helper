import { queryKnowledge } from "./rag.js";

// ================= MAIN AGENT =================

export async function agentResponse(userMessage) {
  const intent = detectIntent(userMessage);
  const searchQuery = `${intent} : ${userMessage}`;

  const knowledge = await queryKnowledge(searchQuery, intent);

  let response = `🧠 UniMate AI\n\n`;
  response += `❓ ${userMessage}\n\n`;

  if (knowledge) {
    response += `📚 Answer:\n${cleanAnswer(knowledge.text)}\n\n`;

    if (knowledge.link && knowledge.link !== "N/A") {
      response += `🔗 Learn more: ${knowledge.link}\n\n`;
    }
  } else {
    response += `📚 Answer:\nMe prashneta sambandha honda knowledge danata database eke nathi widihak pennala. Ehema nam mata kiyanna oya one widihata.\n\n`;
  }

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

  if (m.includes("study") || m.includes("exam") || m.includes("learn") || m.includes("notes"))
    return "study";

  if (m.includes("stress") || m.includes("mental") || m.includes("life"))
    return "life";

  return "general";
}

// ================= RESPONSE ENHANCERS =================

function cleanAnswer(text) {
  return text
    .replace(/\n+/g, " ")
    .split(". ")
    .slice(0, 3)
    .join(". ") + ".";
}

function generateAdvice(intent) {
  const tips = {
    housing:
      "Bodima hoyagaddi suraksha sahitha da kiyala balanna, campus langada kiyala check karanna, water, electricity, internet monawada cover wenne kiyala confirm karanna.",

    finance:
      "Masika expense list ekak hadala unnecessary wiyadam adu karanna. Monthly income walin tikak hari save karanna.",

    income:
      "Part-time job, online freelancing, tutoring wage dewal walin aluth income ekak hadaganna puluwan.",

    study:
      "Daily study plan ekak hadala time table ekakata wada karanna. Pomodoro method wage techniques use karanna.",

    life:
      "Stress adu karaganna sleep, exercise, saha friends samaga kalaya hariyata balance karanna.",

    general:
      "Oya prashnaya tikak vistara karanna. Ehema unoth mama hondama solution ekak hadala dennam."
  };

  return tips[intent];
}

function suggestNext(intent) {
  return `Oyata one nam simple ${intent} plan ekak mama hadala denna puluwan.`;
}
