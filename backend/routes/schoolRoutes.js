// backend/routes/schoolRoutes.js
import { Router } from 'express'
const router = Router()

const SCHOOLS = [
  {
    id: 3,
    name: 'Göta Akademi',
    city: 'Göteborg',
    website: 'https://gotaakademi.se',
    programs: ['Naturvetenskapsprogrammet', 'Teknikprogrammet']
  },
  {
    id: 8,
    name: 'Helsingborg Kreativa Skola',
    city: 'Helsingborg',
    website: 'https://helsingkreativ.se',
    programs: ['Samhällsvetenskapsprogrammet', 'Estetiska programmet']
  },
  {
    id: 6,
    name: 'Karlstad Kunskapsgymnasiet',
    city: 'Karlstad',
    website: 'https://kunskapkarlstad.se',
    programs: ['Samhällsvetenskapsprogrammet', 'Ekonomiprogrammet']
  },
  {
    id: 2,
    name: 'Norrby Tekniska',
    city: 'Uppsala',
    website: 'https://norrbytekniska.se',
    programs: ['Teknikprogrammet', 'Industritekniska programmet']
  },
  {
    id: 5,
    name: 'Skåne Framtidsgymnasium',
    city: 'Malmö',
    website: 'https://framtidsgymnasium.se',
    programs: ['Vård- och omsorgsprogrammet', 'Barn- och fritidsprogrammet']
  },
  {
    id: 1,
    name: 'Södra Gymnasiet',
    city: 'Stockholm',
    website: 'https://sodragymnasiet.se',
    programs: ['Naturvetenskapsprogrammet', 'Samhällsvetenskapsprogrammet']
  },
  {
    id: 7,
    name: 'Västerås Gymnasium',
    city: 'Västerås',
    website: 'https://vgym.se',
    programs: ['El- och energiprogrammet', 'Fordons- och transportprogrammet']
  },
  {
    id: 4,
    name: 'Östra Real',
    city: 'Stockholm',
    website: 'https://ostereal.se',
    programs: ['Humanistiska programmet', 'Ekonomiprogrammet']
  }
]

// Normalisera så fronten alltid får både program + programs
const normalized = SCHOOLS.map((s, i) => ({
  id: s.id ?? i + 1,
  name: s.name,
  city: s.city ?? '',
  website: s.website ?? '',
  program: Array.isArray(s.programs) && s.programs.length ? s.programs[0] : '',
  programs: Array.isArray(s.programs) ? s.programs : []
}))

// GET /api/schools
router.get('/schools', (_req, res) => {
  res.json(normalized)
})

// GET /api/schools/:id
router.get('/schools/:id', (req, res) => {
  const id = Number(req.params.id)
  const school = normalized.find(s => s.id === id)
  if (!school) return res.status(404).json({ error: 'Skolan hittades inte' })
  res.json(school)
})

export default router
