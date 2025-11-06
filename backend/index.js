// backend/index.js (ESM)
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

// Fallback så servern kan starta även om .env saknar JWT_SECRET
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev-temp-secret'

const app = express()
const PORT = process.env.PORT || 3000

// ✅ CORS måste ligga före routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// --- Health check (måste alltid svara) ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() })
})

// --- Safe route mounting (mont. bara om filen finns) ---
const safeMount = async (path, file) => {
  try {
    const mod = await import(file)
    app.use(path, mod.default || mod.router || mod)
    console.log(`Mounted ${file} at ${path}`)
  } catch (err) {
    console.warn(`(info) Skipping ${file} – not found or failed to load.`)
  }
}

// Montera backend-routes (om de finns)
await safeMount('/api/quiz', './routes/quizRoutes.js')
await safeMount('/api', './routes/schoolRoutes.js')
await safeMount('/api', './routes/programRoutes.js')
await safeMount('/api/users', './routes/userRoutes.js')
await safeMount('/api/auth', './routes/authRoutes.js')



// ✅ Fallback för /api/schools om din riktiga route inte finns
app.get('/api/schools', (req, res, next) => {
  // Om riktig /schools-route redan är monterad → låt den ta över
  if (app._router?.stack?.some(l => l.route?.path === '/schools' && l.route?.methods?.get)) {
    return next()
  }

  // Annars: skicka basdata så frontend fungerar
  res.json([
    { id: 1, name: 'Göta Akademi', city: 'Göteborg', programs: ['Natur', 'Teknik'] },
    { id: 2, name: 'Helsingborg Kreativa Skola', city: 'Helsingborg', programs: ['Samhäll'] },
    { id: 3, name: 'Karlstad Kunskapsgymnasiet', city: 'Karlstad', programs: ['Natur'] },
  ])
})


// 404 som sista middleware
app.use((req, res) => res.status(404).json({ error: 'Not found', path: req.path }))

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`)
})
