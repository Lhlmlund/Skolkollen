// Simple localStorage-based quiz "store"
const KEY = 'latestQuiz';
export function saveLatestQuiz(recommendation) {
  const payload = { recommendation, createdAt: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(payload)); } catch {}
  return payload;
}
export function getLatestQuiz() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
