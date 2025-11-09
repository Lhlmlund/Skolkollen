// frontend/src/utils/quizStore.js
const KEY = 'skolkollen_latest_quiz'

export function saveLatestQuiz(obj) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)) } catch {}
}

export function getLatestQuiz() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearLatestQuiz() {
  try { localStorage.removeItem(KEY) } catch {}
}
