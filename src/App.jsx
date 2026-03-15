import { useState } from 'react'
import styles from './App.module.css'

// ─── Paste your FREE Gemini API key here ─────────────────────────────────────
// Get it free in 1 min: https://aistudio.google.com → "Get API Key" → Create
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

// ─── Data ────────────────────────────────────────────────────────────────────

const STATES = {
  India: ['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan','West Bengal','Uttar Pradesh','Kerala','Andhra Pradesh','Telangana','Punjab','Haryana','Bihar','Madhya Pradesh','Other'],
  USA: ['California','Texas','New York','Florida','Illinois','Pennsylvania','Ohio','Georgia','North Carolina','Michigan','Other'],
  UK: ['England','Scotland','Wales','Northern Ireland'],
  Canada: ['Ontario','Quebec','British Columbia','Alberta','Manitoba','Saskatchewan','Nova Scotia','Other'],
  Australia: ['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania','Other'],
  Germany: ['Bavaria','Berlin','Hamburg','North Rhine-Westphalia','Baden-Württemberg','Other'],
  Other: ['Not applicable'],
}

const EXAMPLES = [
  'Register a plot of land I recently purchased',
  'Lost all my documents in a flood',
  'I need to register my small business',
  'Apply for a passport for the first time',
  'Transfer vehicle ownership after buying a used car',
  'Change my name on government documents after marriage',
  'Apply for a birth certificate for my newborn',
]

const LOADING_MSGS = [
  'Researching the process for your situation…',
  'Identifying the right offices and departments…',
  'Mapping out the document requirements…',
  'Calculating time and cost estimates…',
  'Putting together your personalised guide…',
]

// ─── Compass SVG ─────────────────────────────────────────────────────────────

function Compass({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="16" stroke="#30363d" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2" fill="#f0a500" />
      <polygon points="18,4 20.5,18 18,16 15.5,18" fill="#f0a500" />
      <polygon points="18,32 15.5,18 18,20 20.5,18" fill="#484f58" />
      <polygon points="4,18 18,15.5 16,18 18,20.5" fill="#8b949e" />
      <polygon points="32,18 18,20.5 20,18 18,15.5" fill="#8b949e" />
    </svg>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Compass />
        <div>
          <div className={styles.logoText}>Bureaucracy GPS</div>
          <div className={styles.logoSub}>Navigate government systems</div>
        </div>
      </div>
      <div className={styles.headerTag}>Beta · Free</div>
    </header>
  )
}

// ─── Home Screen ─────────────────────────────────────────────────────────────

function HomeScreen({ onSubmit }) {
  const [situation, setSituation] = useState('')
  const [country, setCountry] = useState('India')
  const [state, setState] = useState('Maharashtra')
  const [error, setError] = useState(false)

  const stateList = STATES[country] || ['Other']

  const handleCountryChange = (e) => {
    setCountry(e.target.value)
    setState(STATES[e.target.value][0])
  }

  const handleSubmit = () => {
    if (!situation.trim()) {
      setError(true)
      setTimeout(() => setError(false), 2000)
      return
    }
    onSubmit({ situation: situation.trim(), country, state })
  }

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>Your personal government guide</div>
        <h1 className={styles.heroTitle}>
          What do you need to<br /><span>navigate today?</span>
        </h1>
        <p className={styles.heroSub}>
          Describe your situation in plain language. Get a clear, step-by-step roadmap —
          which office, which form, what documents, in what order.
        </p>
        <div className={styles.examples}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              className={styles.exampleChip}
              onClick={() => setSituation(ex)}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formWrap}>
        <div className={styles.formCard}>
          <label className={styles.formLabel}>Describe your situation</label>
          <textarea
            className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. I recently bought a plot of land in Pune and need to get the registration and mutation done in my name. I have the sale deed but not sure what the next steps are."
            rows={5}
          />

          <div className={styles.selectsRow}>
            <div>
              <label className={styles.formLabel} style={{ marginTop: '.75rem' }}>Country</label>
              <div className={styles.selectWrap}>
                <select className={styles.select} value={country} onChange={handleCountryChange}>
                  {Object.keys(STATES).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={styles.formLabel} style={{ marginTop: '.75rem' }}>State / Region</label>
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {stateList.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button className={styles.btnMain} onClick={handleSubmit}>
            <span>Get my roadmap</span>
            <span>→</span>
          </button>
        </div>
        <div className={styles.formFooter}>
          Free to use · No account required · Powered by Claude AI
        </div>
      </div>
    </>
  )
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ msg }) {
  return (
    <div className={styles.loadingWrap}>
      <div className={styles.spinRing} />
      <div className={styles.loadingTitle}>Mapping your route…</div>
      <div className={styles.loadingSub}>{msg}</div>
    </div>
  )
}

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({ step, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`${styles.stepCard} ${open ? styles.stepCardOpen : ''}`}>
      <div className={styles.stepHeader} onClick={() => setOpen(!open)}>
        <div className={styles.stepNum}>{step.step}</div>
        <div className={styles.stepHeadText}>
          <div className={styles.stepTitle}>{step.title}</div>
          {step.where_to_go && (
            <div className={styles.stepWhere}>{step.where_to_go}</div>
          )}
        </div>
        <div className={`${styles.stepChevron} ${open ? styles.chevronOpen : ''}`}>▼</div>
      </div>

      {open && (
        <div className={styles.stepBody}>
          {step.description && (
            <p className={styles.stepDesc}>{step.description}</p>
          )}

          <div className={styles.stepGrid}>
            <div className={styles.stepInfo}>
              <div className={styles.stepInfoLabel}>Time</div>
              <div className={styles.stepInfoVal}>{step.time_estimate || '—'}</div>
            </div>
            <div className={styles.stepInfo}>
              <div className={styles.stepInfoLabel}>Cost</div>
              <div className={styles.stepInfoVal}>{step.cost_estimate || '—'}</div>
            </div>
          </div>

          {step.documents_needed?.length > 0 && (
            <div className={styles.docsSection}>
              <div className={styles.docsTitle}>Documents needed</div>
              {step.documents_needed.map((doc, i) => (
                <div key={i} className={styles.docItem}>
                  <span className={styles.docDot} />
                  {doc}
                </div>
              ))}
            </div>
          )}

          {step.tip && (
            <div className={styles.tipBox}>
              <span style={{ fontSize: 12, marginRight: 6 }}>💡</span>
              {step.tip}
            </div>
          )}

          {step.warning && (
            <div className={styles.warnBox}>
              <span style={{ fontSize: 12, marginRight: 6 }}>⚠</span>
              {step.warning}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({ guide, onBack }) {
  const [allOpen, setAllOpen] = useState(false)

  const copyGuide = () => {
    let text = guide.title + '\n\n' + guide.summary
    text += '\n\nEstimated time: ' + guide.estimated_total_time
    text += '\nEstimated cost: ' + guide.estimated_total_cost + '\n\n'
    guide.steps.forEach((s) => {
      text += `Step ${s.step}: ${s.title}\nWhere: ${s.where_to_go}\n${s.description}\n`
      if (s.documents_needed?.length) text += 'Documents: ' + s.documents_needed.join(', ') + '\n'
      if (s.tip) text += 'Tip: ' + s.tip + '\n'
      if (s.warning) text += 'Warning: ' + s.warning + '\n'
      text += '\n'
    })
    if (guide.important_notes) text += 'Notes: ' + guide.important_notes
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={styles.results}>
      <button className={styles.btnBack} onClick={onBack}>← New search</button>

      {/* Summary card */}
      <div className={styles.resultHeader}>
        <div className={styles.resultTitle}>{guide.title}</div>
        <div className={styles.resultSummary}>{guide.summary}</div>
        <div className={styles.metaPills}>
          <span className={`${styles.metaPill} ${styles.pillTime}`}>⏱ {guide.estimated_total_time}</span>
          <span className={`${styles.metaPill} ${styles.pillCost}`}>{guide.estimated_total_cost}</span>
          <span className={`${styles.metaPill} ${styles.pillSteps}`}>{guide.steps.length} steps</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionRow}>
        <button className={styles.btnSm} onClick={() => setAllOpen(true)}>▼ Expand all</button>
        <button className={styles.btnSm} onClick={copyGuide}>⎘ Copy guide</button>
        <button className={styles.btnSm} onClick={() => window.print()}>⎙ Print</button>
      </div>

      <div className={styles.stepsLabel}>Your step-by-step roadmap</div>

      {guide.steps.map((step, i) => (
        <StepCard key={i} step={step} defaultOpen={i === 0 || allOpen} />
      ))}

      {guide.important_notes && (
        <div className={styles.notesCard}>
          <div className={styles.notesLabel}>Important notes</div>
          <div className={styles.notesText}>{guide.important_notes}</div>
        </div>
      )}

      <div className={styles.disclaimer}>
        This guide is for informational purposes only. Laws and procedures change —
        always verify with official government sources or a qualified professional before taking action.
      </div>
    </div>
  )
}

// ─── Error Screen ─────────────────────────────────────────────────────────────

function ErrorScreen({ onBack }) {
  return (
    <div className={styles.errorWrap}>
      <div className={styles.errorBox}>
        Unable to generate your guide right now. Please check your internet connection and try again.
      </div>
      <button className={styles.btnBack} onClick={onBack}>← Try again</button>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState('home') // home | loading | results | error
  const [guide, setGuide] = useState(null)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0])

  const handleSubmit = async ({ situation, country, state }) => {
    setScreen('loading')
    let mi = 0
    const iv = setInterval(() => {
      mi = (mi + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[mi])
    }, 2200)

    const prompt = `You are Bureaucracy GPS, a world-class expert in government processes and administrative procedures.

A user needs help navigating a government process. Give a clear, accurate, step-by-step roadmap.

Situation: ${situation}
Country: ${country}
State/Region: ${state}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "title": "Short title of the process",
  "summary": "2-3 sentence plain English overview",
  "estimated_total_time": "e.g. 2-4 weeks",
  "estimated_total_cost": "e.g. Rs.500-2000 or Free",
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "What to do and why",
      "where_to_go": "Specific office, website, or location",
      "documents_needed": ["doc1", "doc2"],
      "time_estimate": "e.g. 1-3 days",
      "cost_estimate": "e.g. Rs.100 or Free",
      "tip": "Practical tip or empty string",
      "warning": "Important warning or empty string"
    }
  ],
  "important_notes": "Crucial notes or variations",
  "online_resources": ["resource name and URL"]
}`

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.4,
        }),
      })
      const data = await res.json()
      clearInterval(iv)
      if (!res.ok) throw new Error('API error')
      const text = data.choices?.[0]?.message?.content
      if (!text) throw new Error('Empty response')
      const clean = text.replace(/```json|```/g, '').trim()
      const guide = JSON.parse(clean)
      setGuide(guide)
      setScreen('results')
    } catch (err) {
      clearInterval(iv)
      console.error(err)
      setScreen('error')
    }
  }

  return (
    <>
      <Header />
      {screen === 'home' && <HomeScreen onSubmit={handleSubmit} />}
      {screen === 'loading' && <LoadingScreen msg={loadingMsg} />}
      {screen === 'results' && <ResultsScreen guide={guide} onBack={() => setScreen('home')} />}
      {screen === 'error' && <ErrorScreen onBack={() => setScreen('home')} />}
    </>
  )
}
