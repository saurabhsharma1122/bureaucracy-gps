import { useState, useEffect } from 'react'
import styles from './App.module.css'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const STATES = {
  India: ['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan','West Bengal','Uttar Pradesh','Kerala','Andhra Pradesh','Telangana','Punjab','Haryana','Bihar','Madhya Pradesh','Odisha','Assam','Jharkhand','Chhattisgarh','Other'],
  USA: ['California','Texas','New York','Florida','Illinois','Pennsylvania','Ohio','Georgia','North Carolina','Michigan','Other'],
  UK: ['England','Scotland','Wales','Northern Ireland'],
  Canada: ['Ontario','Quebec','British Columbia','Alberta','Manitoba','Saskatchewan','Nova Scotia','Other'],
  Australia: ['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania','Other'],
  Germany: ['Bavaria','Berlin','Hamburg','North Rhine-Westphalia','Baden-Württemberg','Other'],
  Other: ['Not applicable'],
}

const EXAMPLES = {
  en: [
    'Register a plot of land I recently purchased',
    'Lost all my documents in a flood',
    'I need to register my small business',
    'Apply for a passport for the first time',
    'Transfer vehicle ownership after buying a used car',
    'Change my name on government documents after marriage',
    'Apply for a birth certificate for my newborn',
  ],
  hi: [
    'मैंने हाल ही में जमीन खरीदी है, उसे अपने नाम कैसे करें',
    'बाढ़ में सारे दस्तावेज़ खो गए, अब क्या करें',
    'अपना छोटा व्यवसाय रजिस्टर करना है',
    'पहली बार पासपोर्ट के लिए आवेदन करना है',
    'पुरानी गाड़ी खरीदी है, नाम ट्रांसफर कैसे होगा',
    'शादी के बाद सरकारी दस्तावेज़ में नाम बदलना है',
    'नवजात बच्चे का जन्म प्रमाण पत्र बनवाना है',
  ]
}

const LOADING_MSGS = {
  en: [
    'Researching the process for your situation…',
    'Identifying the right offices and departments…',
    'Finding official websites and links…',
    'Calculating time and cost estimates…',
    'Putting together your personalised guide…',
  ],
  hi: [
    'आपकी स्थिति के लिए जानकारी खोज रहे हैं…',
    'सही दफ्तर और विभाग ढूंढ रहे हैं…',
    'सरकारी वेबसाइट और लिंक खोज रहे हैं…',
    'समय और खर्च का अनुमान लगा रहे हैं…',
    'आपके लिए गाइड तैयार कर रहे हैं…',
  ]
}

const UI = {
  en: {
    eyebrow: 'Your personal government guide',
    title1: 'What do you need to',
    title2: 'navigate today?',
    sub: 'Describe your situation in plain language. Get a clear, step-by-step roadmap — which office, which form, what documents, in what order.',
    label: 'Describe your situation',
    placeholder: 'e.g. I recently bought a plot of land in Pune and need to get the registration done in my name. I have the sale deed but not sure what the next steps are.',
    country: 'Country',
    state: 'State / Region',
    btn: 'Get my roadmap →',
    footer: 'Free to use · No account required · Built by Saurabh Sharma',
    back: '← New search',
    expand: '▼ Expand all',
    copy: '⎘ Copy guide',
    print: '⎙ Print',
    whatsapp: '📲 Share on WhatsApp',
    roadmap: 'Your step-by-step roadmap',
    time: 'Time',
    cost: 'Cost',
    docs: 'Documents needed',
    notes: 'Important notes',
    disclaimer: 'This guide is for informational purposes only. Always verify with official government sources before taking action.',
    steps: 'steps',
    loading: 'Mapping your route…',
    error: 'Unable to generate your guide. Please check your internet and try again.',
    tryAgain: '← Try again',
    official: 'Official website',
  },
  hi: {
    eyebrow: 'आपका सरकारी मार्गदर्शक',
    title1: 'आज आपको क्या',
    title2: 'समझना है?',
    sub: 'अपनी बात सीधे लिखें। हम आपको बताएंगे — कौन सा दफ्तर, कौन सा फॉर्म, कौन से कागज़, और किस क्रम में।',
    label: 'अपनी स्थिति बताएं',
    placeholder: 'जैसे: मैंने पुणे में जमीन खरीदी है और उसे अपने नाम करवाना है। मेरे पास सेल डीड है लेकिन आगे के कदम नहीं पता।',
    country: 'देश',
    state: 'राज्य / क्षेत्र',
    btn: 'मेरा रोडमैप बनाएं →',
    footer: 'बिल्कुल मुफ्त · कोई अकाउंट नहीं · Saurabh Sharma द्वारा निर्मित',
    back: '← नई खोज',
    expand: '▼ सब खोलें',
    copy: '⎘ कॉपी करें',
    print: '⎙ प्रिंट करें',
    whatsapp: '📲 WhatsApp पर शेयर करें',
    roadmap: 'आपका चरण-दर-चरण रोडमैप',
    time: 'समय',
    cost: 'खर्च',
    docs: 'जरूरी दस्तावेज़',
    notes: 'जरूरी बातें',
    disclaimer: 'यह जानकारी सामान्य मार्गदर्शन के लिए है। कोई भी कदम उठाने से पहले आधिकारिक सरकारी स्रोत से जांच करें।',
    steps: 'चरण',
    loading: 'आपका रास्ता बना रहे हैं…',
    error: 'गाइड नहीं बन सकी। इंटरनेट जांचें और फिर कोशिश करें।',
    tryAgain: '← फिर कोशिश करें',
    official: 'सरकारी वेबसाइट',
  }
}

// ── Splash Screen ─────────────────────────────────────────────────────────────

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(), 6200)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={styles.splash}>
      <div className={styles.splashGlow}></div>
      <div className={styles.splashCw}>
        <svg width="110" height="110" viewBox="0 0 36 36" fill="none">
          <circle className={styles.sDot}  cx="18" cy="18" r="2"  fill="#f0a500"/>
          <circle className={styles.sRing} cx="18" cy="18" r="16" stroke="#2a3140" strokeWidth="1.5" fill="none"/>
          <polygon className={styles.sN}   points="18,5 20.2,17.5 18,16.2 15.8,17.5" fill="#f0a500"/>
          <polygon className={styles.sS}   points="18,31 15.8,18.5 18,19.8 20.2,18.5" fill="#484f58"/>
          <polygon className={styles.sW}   points="5,18 17.5,15.8 16.2,18 17.5,20.2"  fill="#6b7280"/>
          <polygon className={styles.sE}   points="31,18 18.5,20.2 19.8,18 18.5,15.8" fill="#6b7280"/>
        </svg>
      </div>
      <div className={styles.splashTitle}>Bureaucracy <span>GPS</span></div>
      <div className={styles.splashSub}>NAVIGATE · GOVERNMENT · SYSTEMS</div>
      <div className={styles.splashBy}>&#x26A1; BUILT BY SAURABH SHARMA</div>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({ lang, setLang }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="#30363d" strokeWidth="1.5"/>
          <circle cx="18" cy="18" r="2" fill="#f0a500"/>
          <polygon points="18,4 20.5,18 18,16 15.5,18" fill="#f0a500"/>
          <polygon points="18,32 15.5,18 18,20 20.5,18" fill="#484f58"/>
          <polygon points="4,18 18,15.5 16,18 18,20.5" fill="#8b949e"/>
          <polygon points="32,18 18,20.5 20,18 18,15.5" fill="#8b949e"/>
        </svg>
        <div>
          <div className={styles.logoText}>Bureaucracy GPS</div>
          <div className={styles.logoSub}>{lang === 'en' ? 'Navigate government systems' : 'सरकारी प्रक्रिया आसान बनाएं'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        <button className={styles.langToggle} onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
          {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
        </button>
        <div className={styles.headerTag}>Beta · Free</div>
      </div>
    </header>
  )
}

// ── Home Screen ───────────────────────────────────────────────────────────────

function HomeScreen({ onSubmit, lang }) {
  const [situation, setSituation] = useState('')
  const [country, setCountry] = useState('India')
  const [state, setState] = useState('Maharashtra')
  const [error, setError] = useState(false)
  const t = UI[lang]
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
        <div className={styles.heroEyebrow}>{t.eyebrow}</div>
        <h1 className={styles.heroTitle}>{t.title1}<br /><span>{t.title2}</span></h1>
        <p className={styles.heroSub}>{t.sub}</p>
        <div className={styles.examples}>
          {EXAMPLES[lang].map((ex) => (
            <button key={ex} className={styles.exampleChip} onClick={() => setSituation(ex)}>{ex}</button>
          ))}
        </div>
      </div>
      <div className={styles.formWrap}>
        <div className={styles.formCard}>
          <label className={styles.formLabel}>{t.label}</label>
          <textarea
            className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder={t.placeholder}
            rows={5}
          />
          <div className={styles.selectsRow}>
            <div>
              <label className={styles.formLabel} style={{ marginTop: '.75rem' }}>{t.country}</label>
              <div className={styles.selectWrap}>
                <select className={styles.select} value={country} onChange={handleCountryChange}>
                  {Object.keys(STATES).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={styles.formLabel} style={{ marginTop: '.75rem' }}>{t.state}</label>
              <div className={styles.selectWrap}>
                <select className={styles.select} value={state} onChange={(e) => setState(e.target.value)}>
                  {stateList.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <button className={styles.btnMain} onClick={handleSubmit}>{t.btn}</button>
        </div>
        <div className={styles.formFooter}>{t.footer}</div>
      </div>
    </>
  )
}

// ── Loading Screen ────────────────────────────────────────────────────────────

function LoadingScreen({ msg, lang }) {
  return (
    <div className={styles.loadingWrap}>
      <div className={styles.spinRing} />
      <div className={styles.loadingTitle}>{UI[lang].loading}</div>
      <div className={styles.loadingSub}>{msg}</div>
    </div>
  )
}

// ── Step Card ─────────────────────────────────────────────────────────────────

function StepCard({ step, defaultOpen, t }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`${styles.stepCard} ${open ? styles.stepCardOpen : ''}`}>
      <div className={styles.stepHeader} onClick={() => setOpen(!open)}>
        <div className={styles.stepNum}>{step.step}</div>
        <div className={styles.stepHeadText}>
          <div className={styles.stepTitle}>{step.title}</div>
          {step.where_to_go && <div className={styles.stepWhere}>{step.where_to_go}</div>}
        </div>
        <div className={`${styles.stepChevron} ${open ? styles.chevronOpen : ''}`}>▼</div>
      </div>
      {open && (
        <div className={styles.stepBody}>
          {step.description && <p className={styles.stepDesc}>{step.description}</p>}
          <div className={styles.stepGrid}>
            <div className={styles.stepInfo}>
              <div className={styles.stepInfoLabel}>{t.time}</div>
              <div className={styles.stepInfoVal}>{step.time_estimate || '—'}</div>
            </div>
            <div className={styles.stepInfo}>
              <div className={styles.stepInfoLabel}>{t.cost}</div>
              <div className={styles.stepInfoVal}>{step.cost_estimate || '—'}</div>
            </div>
          </div>
          {step.documents_needed?.length > 0 && (
            <div className={styles.docsSection}>
              <div className={styles.docsTitle}>{t.docs}</div>
              {step.documents_needed.map((doc, i) => (
                <div key={i} className={styles.docItem}><span className={styles.docDot} />{doc}</div>
              ))}
            </div>
          )}
          {step.official_link && (
            <a href={step.official_link} target="_blank" rel="noopener noreferrer" className={styles.officialLink}>
              🔗 {t.official}: {step.official_link}
            </a>
          )}
          {step.tip && <div className={styles.tipBox}><span style={{ fontSize: 12, marginRight: 6 }}>💡</span>{step.tip}</div>}
          {step.warning && <div className={styles.warnBox}><span style={{ fontSize: 12, marginRight: 6 }}>⚠</span>{step.warning}</div>}
        </div>
      )}
    </div>
  )
}

// ── Results Screen ────────────────────────────────────────────────────────────

function ResultsScreen({ guide, onBack, lang }) {
  const [allOpen, setAllOpen] = useState(false)
  const t = UI[lang]

  const copyGuide = () => {
    let text = guide.title + '\n\n' + guide.summary
    text += '\n\nTime: ' + guide.estimated_total_time
    text += '\nCost: ' + guide.estimated_total_cost + '\n\n'
    guide.steps.forEach((s) => {
      text += `${s.step}. ${s.title}\n${s.description}\n`
      if (s.documents_needed?.length) text += t.docs + ': ' + s.documents_needed.join(', ') + '\n'
      if (s.official_link) text += '🔗 ' + s.official_link + '\n'
      if (s.tip) text += '💡 ' + s.tip + '\n'
      text += '\n'
    })
    navigator.clipboard.writeText(text)
  }

  const shareWhatsApp = () => {
    const text = `*${guide.title}*\n\n${guide.summary}\n\n⏱ ${guide.estimated_total_time} | 💰 ${guide.estimated_total_cost}\n\n${guide.steps.map(s => `*${s.step}. ${s.title}*\n${s.description}`).join('\n\n')}\n\n_Bureaucracy GPS — bureaucracy-gps.vercel.app_`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className={styles.results}>
      <button className={styles.btnBack} onClick={onBack}>{t.back}</button>
      <div className={styles.resultHeader}>
        <div className={styles.resultTitle}>{guide.title}</div>
        <div className={styles.resultSummary}>{guide.summary}</div>
        <div className={styles.metaPills}>
          <span className={`${styles.metaPill} ${styles.pillTime}`}>⏱ {guide.estimated_total_time}</span>
          <span className={`${styles.metaPill} ${styles.pillCost}`}>{guide.estimated_total_cost}</span>
          <span className={`${styles.metaPill} ${styles.pillSteps}`}>{guide.steps.length} {t.steps}</span>
        </div>
      </div>
      <div className={styles.actionRow}>
        <button className={styles.btnSm} onClick={() => setAllOpen(true)}>{t.expand}</button>
        <button className={styles.btnSm} onClick={copyGuide}>{t.copy}</button>
        <button className={styles.btnSm} onClick={() => window.print()}>{t.print}</button>
        <button className={`${styles.btnSm} ${styles.btnWhatsapp}`} onClick={shareWhatsApp}>{t.whatsapp}</button>
      </div>
      <div className={styles.stepsLabel}>{t.roadmap}</div>
      {guide.steps.map((step, i) => (
        <StepCard key={i} step={step} defaultOpen={i === 0 || allOpen} t={t} />
      ))}
      {guide.important_notes && (
        <div className={styles.notesCard}>
          <div className={styles.notesLabel}>{t.notes}</div>
          <div className={styles.notesText}>{guide.important_notes}</div>
        </div>
      )}
      <div className={styles.disclaimer}>{t.disclaimer}</div>
    </div>
  )
}

// ── Error Screen ──────────────────────────────────────────────────────────────

function ErrorScreen({ onBack, lang }) {
  return (
    <div className={styles.errorWrap}>
      <div className={styles.errorBox}>{UI[lang].error}</div>
      <button className={styles.btnBack} onClick={onBack}>{UI[lang].tryAgain}</button>
    </div>
  )
}

// ── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [splash, setSplash] = useState(true)
  const [screen, setScreen] = useState('home')
  const [guide, setGuide] = useState(null)
  const [lang, setLang] = useState('en')
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS.en[0])

  const handleSubmit = async ({ situation, country, state }) => {
    setScreen('loading')
    let mi = 0
    const iv = setInterval(() => {
      mi = (mi + 1) % LOADING_MSGS[lang].length
      setLoadingMsg(LOADING_MSGS[lang][mi])
    }, 2200)

    const isHindi = lang === 'hi'
    const prompt = `You are Bureaucracy GPS, an expert in government processes for every country.

Situation: ${situation}
Country: ${country}
State/Region: ${state}
Response language: ${isHindi ? 'Hindi (Devanagari script)' : 'Simple English — explain like talking to a neighbour, not a lawyer.'}

Rules:
- Use simple, easy to understand language
- Be very specific about office names, form numbers, websites
- Include official government website URLs wherever possible

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "title": "Short title",
  "summary": "2-3 simple sentences explaining what needs to happen",
  "estimated_total_time": "e.g. 2-4 weeks",
  "estimated_total_cost": "e.g. Rs.500-2000 or Free",
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "Simple explanation of what to do",
      "where_to_go": "Exact office name or website",
      "official_link": "Official government URL or empty string",
      "documents_needed": ["doc1", "doc2"],
      "time_estimate": "e.g. 1-3 days",
      "cost_estimate": "e.g. Rs.100 or Free",
      "tip": "Practical tip or empty string",
      "warning": "Important warning or empty string"
    }
  ],
  "important_notes": "Any important things to know",
  "online_resources": ["name - URL"]
}`

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'openrouter/hunter-alpha',
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

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />

  return (
    <>
      <Header lang={lang} setLang={setLang} />
      {screen === 'home'    && <HomeScreen onSubmit={handleSubmit} lang={lang} />}
      {screen === 'loading' && <LoadingScreen msg={loadingMsg} lang={lang} />}
      {screen === 'results' && <ResultsScreen guide={guide} onBack={() => setScreen('home')} lang={lang} />}
      {screen === 'error'   && <ErrorScreen onBack={() => setScreen('home')} lang={lang} />}
    </>
  )
}
