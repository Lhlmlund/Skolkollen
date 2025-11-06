export const BASE = import.meta.env.VITE_API_BASE_URL || '';
export async function getJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}
