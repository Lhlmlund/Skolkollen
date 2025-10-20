const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export async function getSchools() {
  const res = await fetch(`${BASE}/api/schools`)
  if (!res.ok) throw new Error('Failed to fetch schools')
  return res.json()
}
