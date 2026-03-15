# 🧭 Bureaucracy GPS

> Navigate any government process, step by step. Free. No account needed.

---

## What it does

Paste your situation in plain language → get a clear step-by-step roadmap:
which office, which form, what documents, how long it takes, how much it costs.

Works for India, USA, UK, Canada, Australia, Germany, and more.

---

## Tech Stack (everything free)

| Tool | Purpose | Cost |
|------|---------|------|
| React + Vite | Frontend | Free |
| Vercel | Hosting + Serverless functions | Free hobby tier |
| Claude Haiku API | AI brain | ~$0.001 per query |
| Google Fonts | Typography | Free |

---

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
```bash
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

Get a free API key at: https://console.anthropic.com

### 3. Run locally
```bash
npm run dev
```

> ⚠️ The `/api/guide` serverless function only works on Vercel.
> For local testing, you can temporarily call the Anthropic API directly from the frontend
> (replace fetch('/api/guide') with direct fetch in App.jsx — but revert before deploying!).

---

## Deploy to Vercel (free, 5 minutes)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/bureaucracy-gps.git
git push -u origin main
```

### Step 2 — Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Vercel auto-detects Vite — just click **Deploy**

### Step 3 — Add your API key
1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
3. Click **Save** → then **Redeploy**

### Step 4 — Your site is live! 🎉
```
https://bureaucracy-gps.vercel.app
```

---

## Get a free custom domain

Vercel gives you `yourproject.vercel.app` for free.

For a custom domain like `bureaucracygps.com`:
- Buy on [Porkbun](https://porkbun.com) (~$10/year, cheapest registrar)
- Add it in Vercel → Settings → Domains → free SSL included

---

## Cost to run

| Usage | Monthly cost |
|-------|-------------|
| 100 queries/day | ~$3 |
| 1,000 queries/day | ~$30 |
| Hosting | $0 forever |

Claude Haiku is the cheapest model and handles this perfectly.

---

## Project Structure

```
bureaucracy-gps/
├── api/
│   └── guide.js          ← Vercel serverless function (hides API key)
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx           ← Main React app
│   ├── App.module.css    ← All styles
│   ├── main.jsx          ← Entry point
│   └── index.css         ← Global CSS variables
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## Roadmap

- [ ] Save guides with shareable URLs (Supabase)
- [ ] Community corrections + upvotes
- [ ] Multi-language output (Hindi, Tamil, Spanish)
- [ ] Document checklist PDF export
- [ ] WhatsApp share button
- [ ] Offline mode (PWA)

---

Built with ❤️ to help everyone navigate bureaucracy for free.
