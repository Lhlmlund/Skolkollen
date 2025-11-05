const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export async function getSchools() {
  const res = await fetch(`${BASE}/api/schools`)
  if (!res.ok) {
    throw new Error('Failed to fetch schools')
  }
  return res.json()
}

export async function getSchoolsWithPrograms() {
  const res = await fetch(`${BASE}/api/schools-with-programs`)
  if (!res.ok) {
    throw new Error('Failed to fetch schools with programs')
  }
  return res.json()
}

export async function getOpenHouses() {
  const res = await fetch(`${BASE}/api/openhouses`)
  if (!res.ok) {
    throw new Error('Failed to fetch open houses')
  }
  return res.json()
}

export async function login(login, password) {
  console.log('Login with', login, password)
  // build payload
  // post request
  const res = await fetch(`${BASE}/api/login`)
  if (!res.ok) {
    throw new Error('Failed to login')
  }
  return res.json()
}

export async function getSchoolById(id) {
  const response = await fetch(`${BASE}/api/schools/${id}`)
  if (!response.ok) {
    const text = await response.text()
    console.error('❌ API error:', text)
    throw new Error('Kunde inte hämta skolinformation.')
  }
  return await response.json()
}

