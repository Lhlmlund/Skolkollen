<template>
  <main class="quiz" style="padding:1.5rem; display:flex; justify-content:center;">
    <section class="card" style="background:#fff; padding:20px; border-radius:16px; max-width:980px; width:100%; box-shadow:0 10px 30px rgba(0,0,0,.08);">
      <h2 style="font-size:2rem; font-weight:800; margin-bottom:8px;">Program-quiz</h2>

      <!-- API-läge -->
      <div v-if="mode === 'api'">
        <p v-if="loading">Laddar frågor…</p>
        <p v-if="errorMsg" style="color:#b91c1c; margin-bottom:12px;">{{ errorMsg }}</p>

        <form v-if="!loading && questions.length" @submit.prevent="submitApi">
          <section
            v-for="(q, idx) in questions"
            :key="q.id ?? idx"
            style="margin:22px 0;"
          >
            <h3 style="font-size:1.5rem; font-weight:800; margin-bottom:8px;">
              {{ idx + 1 }}. {{ q.prompt }}
            </h3>
            <label v-for="opt in q.options" :key="opt.id" style="display:block; margin:6px 0;">
              <input type="radio" :name="'q'+(q.id ?? idx)" :value="opt.id" v-model="answers[q.id ?? idx]" />
              <span style="margin-left:6px;">{{ opt.label }}</span>
            </label>
          </section>

          <div style="margin-top:16px; display:flex; gap:12px; align-items:center;">
            <button type="submit" :disabled="submitting" style="padding:8px 14px; border-radius:10px; border:none; cursor:pointer;">
              {{ submitting ? 'Skickar…' : 'Få rekommendation' }}
            </button>
            <router-link to="/" style="text-decoration:none;">Avbryt</router-link>
          </div>
        </form>
      </div>

      <!-- Fallback-läge: DINA 6 FRÅGOR -->
      <div v-else>
        <form @submit.prevent="submitFallback">
          <div class="grid" style="display:grid; grid-template-columns:1fr; gap:24px;">
            <section v-for="(q, qi) in fallbackQuestions" :key="qi">
              <h3 style="font-size:1.6rem; font-weight:800; margin:8px 0;">
                {{ qi+1 }}. {{ q.title }}
              </h3>
              <label v-for="(opt, oi) in q.options" :key="oi" style="display:block; margin:6px 0;">
                <input type="radio" :name="'fq'+qi" :value="opt.key" v-model="fallbackAnswers[qi]" />
                <span style="margin-left:6px;">{{ opt.label }}</span>
              </label>
            </section>
          </div>

          <div style="color:#b91c1c; margin:12px 0;" v-if="errorMsg">{{ errorMsg }}</div>

          <div style="margin-top:16px; display:flex; gap:12px; align-items:center;">
            <button type="submit" style="padding:10px 18px; border-radius:10px; border:none; cursor:pointer;">
              Få rekommendation
            </button>
            <router-link to="/" style="text-decoration:none;">Avbryt</router-link>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { saveLatestQuiz } from '../utils/quizStore'

const router = useRouter()
const apiBase = import.meta.env.VITE_API_URL || '/api'

const mode = ref('api') // 'api' eller 'fallback'
const loading = ref(true)
const submitting = ref(false)
const errorMsg = ref('')

// ---- API-läge ----
const questions = ref([])
const answers = ref({})
const apiResult = ref(null)

async function fetchQuestions() {
  try {
    const res = await fetch(`${apiBase}/quiz/questions`, { credentials: 'include' })
    if (!res.ok) throw new Error()
    const data = await res.json()
    if (Array.isArray(data) && data.length) {
      questions.value = data
      mode.value = 'api'
    } else {
      mode.value = 'fallback'
    }
  } catch {
    mode.value = 'fallback'
  } finally {
    loading.value = false
  }
}

async function submitApi() {
  errorMsg.value = ''
  apiResult.value = null
  const payload = Object.entries(answers.value).map(([qId, optId]) => ({
    questionId: Number(qId),
    optionId: Number(optId)
  }))
  if (!payload.length) {
    errorMsg.value = 'Välj minst ett alternativ.'
    return
  }
  submitting.value = true
  try {
    const res = await fetch(`${apiBase}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ answers: payload })
    })
    if (!res.ok) throw new Error()
    const result = await res.json()
    const name = result?.suggestedProgram?.name ?? 'Ingen tydlig rekommendation'
    const category = result?.suggestedProgram?.category ?? ''
    saveLatestQuiz({ name, category, at: new Date().toISOString() })
    router.push({ name: 'quiz-result' })
  } catch {
    errorMsg.value = 'Kunde inte skicka quiz-svar'
  } finally {
    submitting.value = false
  }
}

// ---- Fallback-läge: dina 6 frågor + enkel scoring -> program ----
const fallbackQuestions = ref([
  {
    title: 'Vad inspirerar dig mest?',
    options: [
      { label: 'Ny teknik och innovation', key: 'TE' },
      { label: 'Naturen och vetenskapliga upptäckter', key: 'NA' },
      { label: 'Företagande och ekonomi', key: 'EK' },
      { label: 'Kreativt skapande (musik, bild, scen)', key: 'ES' },
      { label: 'Att hjälpa människor i vardagen', key: 'VO' },
    ],
  },
  {
    title: 'Vilken studiemiljö trivs du bäst i?',
    options: [
      { label: 'Praktiska labbar/verkstad', key: 'TE' },
      { label: 'Laboratorium & teori', key: 'NA' },
      { label: 'Klassrum, case och affärsfall', key: 'EK' },
      { label: 'Ateljé, studio eller scen', key: 'ES' },
      { label: 'Patientnära miljöer', key: 'VO' },
    ],
  },
  {
    title: 'Vad ser du som viktigast i ditt framtida jobb?',
    options: [
      { label: 'Utveckla eller designa teknik', key: 'TE' },
      { label: 'Utforska/analys av natur & data', key: 'NA' },
      { label: 'Bygga företag och påverka marknaden', key: 'EK' },
      { label: 'Uttrycka mig konstnärligt', key: 'ES' },
      { label: 'Göra konkret skillnad för andra', key: 'VO' },
    ],
  },
  {
    title: 'Vilket område lockar dig mest?',
    options: [
      { label: 'Teknik, IT & ingenjörskap', key: 'TE' },
      { label: 'Biologi, kemi, fysik, labb', key: 'NA' },
      { label: 'Ekonomi, juridik, entreprenörskap', key: 'EK' },
      { label: 'Musik, bild, dans, teater', key: 'ES' },
      { label: 'Hälsa, vård, omsorg', key: 'VO' },
    ],
  },
  {
    title: 'Vilka styrkor beskriver dig bäst?',
    options: [
      { label: 'Logik & problemlösning', key: 'TE' },
      { label: 'Analys & noggrannhet', key: 'NA' },
      { label: 'Initiativ & affärstänk', key: 'EK' },
      { label: 'Kreativitet & uttryck', key: 'ES' },
      { label: 'Empati & samarbete', key: 'VO' },
    ],
  },
  {
    title: 'Hur vill du helst studera?',
    options: [
      { label: 'Praktiskt (bygga/göra)', key: 'TE' },
      { label: 'Teoretiskt (förstå på djupet)', key: 'NA' },
      { label: 'Case & projekt (affär/case)', key: 'EK' },
      { label: 'Genom skapande (konst/projekt)', key: 'ES' },
      { label: 'Med människor (praktiknära)', key: 'VO' },
    ],
  },
])

const fallbackAnswers = ref({}) // { [qIndex]: 'TE'|'NA'|'EK'|'ES'|'VO' }

function pickProgramFromFallback() {
  const score = { TE: 0, NA: 0, EK: 0, ES: 0, VO: 0 }
  for (const key of Object.values(fallbackAnswers.value)) {
    if (key && score[key] !== undefined) score[key]++
  }
  // välj max (vid lika – ta första i prioritet)
  const order = ['TE','NA','EK','ES','VO']
  let best = 'TE', bestScore = -1
  for (const k of order) {
    if (score[k] > bestScore) { best = k; bestScore = score[k] }
  }
  const map = {
    TE: { name: 'Teknikprogrammet', category: 'Teknik' },
    NA: { name: 'Naturvetenskapsprogrammet', category: 'Natur' },
    EK: { name: 'Ekonomiprogrammet', category: 'Ekonomi' },
    ES: { name: 'Estetiska programmet', category: 'Estet' },
    VO: { name: 'Vård- och omsorgsprogrammet', category: 'Vård' },
  }
  return map[best]
}

function submitFallback() {
  errorMsg.value = ''
  const totalAnswered = Object.values(fallbackAnswers.value).filter(Boolean).length
  if (totalAnswered < fallbackQuestions.value.length) {
    errorMsg.value = 'Besvara alla frågor.'
    return
  }
  const { name, category } = pickProgramFromFallback()
  saveLatestQuiz({ name, category, at: new Date().toISOString() })
  router.push({ name: 'quiz-result' })
}

onMounted(fetchQuestions)
</script>
