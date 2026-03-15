// api/guide.js
// Uses Google Gemini 1.5 Flash — 1,500 requests/day FREE forever
// Get your free API key at: https://aistudio.google.com

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { situation, country, state } = req.body

  if (!situation || !country || !state) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const prompt = `You are Bureaucracy GPS, a world-class expert in government processes, administrative procedures, and bureaucratic systems for every country.

A user needs help navigating a government or administrative process. Give them a clear, accurate, actionable step-by-step roadmap.

Situation: ${situation}
Country: ${country}
State/Region: ${state}

Respond ONLY with valid JSON (no markdown, no backticks, just raw JSON):
{
  "title": "Short descriptive title of the process",
  "summary": "2-3 sentence plain English overview of what needs to happen",
  "estimated_total_time": "e.g. 2-4 weeks",
  "estimated_total_cost": "e.g. Rs.500-2000 or Free",
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "Clear explanation of what to do in this step and why",
      "where_to_go": "Specific office, department, website, or location",
      "documents_needed": ["document 1", "document 2"],
      "time_estimate": "e.g. 1-3 days",
      "cost_estimate": "e.g. Rs.100 or Free",
      "tip": "Practical tip that saves time or money, or empty string",
      "warning": "Important warning or common mistake, or empty string"
    }
  ],
  "important_notes": "Any crucial notes, recent changes, or things that vary by situation",
  "online_resources": ["Official resource name and URL if known"]
}

Be specific, accurate, and practical. Include 4-8 steps.`

  try {
    const apiKey = process.env.GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 2000 },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API error:', data)
      return res.status(500).json({ error: 'AI service error' })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Empty response')

    const clean = text.replace(/```json|```/g, '').trim()
    const guide = JSON.parse(clean)

    return res.status(200).json(guide)
  } catch (err) {
    console.error('Error:', err)
    return res.status(500).json({ error: 'Failed to generate guide' })
  }
}
