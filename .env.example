// api/guide.js — OpenRouter free models with auto-switching
// Get your free key at: https://openrouter.ai/keys

const FREE_MODELS = [
  'stepfun/step-3.5-flash:free',
  'arcee-ai/trinity-large-preview:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'arcee-ai/trinity-mini:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'z-ai/glm-4.5-air:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'openrouter/free',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { situation, country, state, userApiKey } = req.body
  if (!situation || !country || !state) return res.status(400).json({ error: 'Missing required fields' })

  const apiKey = userApiKey?.trim() || process.env.OPENROUTER_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'NO_API_KEY' })

  const isHindi = /[\u0900-\u097F]/.test(situation)

  const prompt = `You are Bureaucracy GPS, a world-class expert in government processes for every country.

Situation: ${situation}
Country: ${country}
State/Region: ${state}
Response language: ${isHindi ? 'Hindi (Devanagari script)' : 'Simple English — explain like talking to a neighbour, not a lawyer.'}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "title": "Short descriptive title",
  "summary": "2-3 sentence overview",
  "estimated_total_time": "e.g. 2-4 weeks",
  "estimated_total_cost": "e.g. Rs.500-2000 or Free",
  "steps": [{
    "step": 1,
    "title": "Step title",
    "description": "What to do",
    "where_to_go": "Exact office or website",
    "official_link": "URL or empty string",
    "documents_needed": ["doc1"],
    "time_estimate": "1-3 days",
    "cost_estimate": "Rs.100 or Free",
    "tip": "tip or empty string",
    "warning": "warning or empty string"
  }],
  "important_notes": "Key notes",
  "online_resources": ["name - URL"]
}
Include 4-8 steps. Be specific and practical.`

  const errors = []
  for (const model of FREE_MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://bureaucracy-gps.vercel.app',
          'X-Title': 'Bureaucracy GPS',
        },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.4, max_tokens: 2000 }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || `HTTP ${response.status}`)
      const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning
      if (!text) throw new Error('Empty response')
      const clean = text.replace(/```json|```/g, '').trim()
      const match = clean.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('No JSON')
      return res.status(200).json(JSON.parse(match[0]))
    } catch (err) {
      errors.push({ model, error: err.message })
    }
  }

  return res.status(503).json({ error: userApiKey ? 'USER_KEY_FAILED' : 'ALL_MODELS_FAILED' })
}
