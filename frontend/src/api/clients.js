const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export async function getSchools() {
  const res = await fetch(`${BASE}/api/schools`)
  if (!res.ok) throw new Error('Failed to fetch schools')
  return res.json()
}
// NEW: Fetch open house events
export async function getOpenHouses() {
  const res = await fetch(`${BASE}/api/openhouses`)
  if (!res.ok) throw new Error('Failed to fetch open houses')
  return res.json()
}
