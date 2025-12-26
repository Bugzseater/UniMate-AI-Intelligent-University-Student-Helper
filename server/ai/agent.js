import { queryKnowledge } from "./rag.js";

export async function agentResponse(userMessage) {
  // 🧠 Step 1: Understand intent
  const intent = detectIntent(userMessage);

  // 🧭 Step 2: Plan what knowledge is needed
  const plan = createPlan(intent);

  // 📚 Step 3: Retrieve knowledge
  const knowledge = await queryKnowledge(userMessage);

  // 🧩 Step 4: Compose final response
  const finalAnswer = `
🧠 **UniMate AI Assistant**

**Your Question:** ${userMessage}

**What I Found:**
${knowledge}

**My Advice:**
${generateAdvice(intent)}

**Next Step:**
${suggestNext(intent)}
`;

  return finalAnswer;
}

function detectIntent(msg) {
  if (msg.includes("expense")) return "finance";
  if (msg.includes("income")) return "income";
  if (msg.includes("boarding") || msg.includes("bodima")) return "housing";
  if (msg.includes("study")) return "study";
  return "general";
}

function createPlan(intent) {
  return `Collect ${intent} knowledge → Analyze → Provide steps`;
}

function generateAdvice(intent) {
  const tips = {
    finance: "Track expenses, reduce unnecessary spending, and plan monthly budgets.",
    income: "Look for part-time work, freelancing, tutoring, or online jobs.",
    housing: "Check campus boards, social groups, and verify safety before renting.",
    study: "Create a study timetable and use active learning techniques.",
    general: "Let’s explore your situation step by step."
  };
  return tips[intent];
}

function suggestNext(intent) {
  return `Would you like me to create a personal plan for your ${intent}?`;
}
