// Free models to try in order - updated March 2026
const FREE_MODELS = [
  "stepfun/step-3.5-flash:free",
  "arcee-ai/trinity-large-preview:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "arcee-ai/trinity-mini:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "z-ai/glm-4.5-air:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "openrouter/free",
];

async function callModel(model, messages, apiKey) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://bureaucracy-gps.vercel.app",
      "X-Title": "Bureaucracy GPS",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      max_tokens: 2500,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const content =
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.message?.reasoning ||
    "";

  if (!content) throw new Error("Empty response from model");
  return content;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { situation, country, userApiKey } = req.body;

  if (!situation?.trim()) {
    return res.status(400).json({ error: "Situation is required" });
  }

  const apiKey = userApiKey?.trim() || process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(503).json({ error: "NO_API_KEY" });
  }

  const messages = [
    {
      role: "user",
      content: `You are a bureaucracy expert who helps people navigate government processes clearly and practically.

A user needs help with the following situation${country ? ` in ${country}` : ""}:
"${situation}"

Provide a clear, step-by-step guide. For each step include:
- Which office/department to go to
- What documents to bring
- What forms to fill
- How long it typically takes
- Any fees involved
- Practical tips to avoid common mistakes

Format your response in clean markdown with numbered steps. Be specific and practical, not vague. If you don't know exact details, say so honestly rather than guessing.`,
    },
  ];

  const errors = [];

  // Try each free model in order, fall back to next on failure
  for (const model of FREE_MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const content = await callModel(model, messages, apiKey);
      console.log(`Success with: ${model}`);
      return res.status(200).json({ guide: content, model });
    } catch (err) {
      console.log(`Failed ${model}: ${err.message}`);
      errors.push({ model, error: err.message });
    }
  }

  // All models failed
  if (!userApiKey) {
    return res.status(503).json({ error: "ALL_MODELS_FAILED" });
  }

  return res.status(503).json({
    error: "USER_KEY_FAILED",
    message: "All models failed even with your API key. Please try again later.",
    details: errors,
  });
}
