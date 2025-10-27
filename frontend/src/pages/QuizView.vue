<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const submitting = ref(false)
const questions = ref([])
const answers = ref({}) // { [questionId]: optionId }
const result = ref(null)
const errorMsg = ref('')

async function loadQuestions() {
  try {
    const res = await fetch('http://localhost:3000/api/quiz/questions')
    if (!res.ok) throw new Error('Kunde inte hämta frågor')
    questions.value = await res.json()
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

async function submitQuiz() {
  errorMsg.value = ''
  result.value = null
  const payload = Object.entries(answers.value).map(([qId, optId]) => ({
    questionId: Number(qId),
    optionId: Number(optId)
  }))
  if (payload.length === 0) {
    errorMsg.value = 'Välj minst ett alternativ.'
    return
  }
  submitting.value = true
  try {
    const res = await fetch('http://localhost:3000/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: payload })
    })
    if (!res.ok) throw new Error('Kunde inte skicka quiz-svar')
    result.value = await res.json()
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    submitting.value = false
  }
}

onMounted(loadQuestions)
</script>

<template>
  <main class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Program-quiz</h1>

    <p v-if="loading">Laddar frågor…</p>
    <p v-if="errorMsg" class="text-red-600 mb-4">{{ errorMsg }}</p>

    <div v-if="!loading && questions.length">
      <div
        v-for="q in questions"
        :key="q.id"
        class="mb-6 p-4 border rounded-lg"
      >
        <h2 class="font-semibold mb-3">{{ q.order_index }}. {{ q.prompt }}</h2>
        <div class="space-y-2">
          <label
            v-for="opt in q.options"
            :key="opt.id"
            class="flex items-center gap-2"
          >
            <input
              type="radio"
              :name="'q' + q.id"
              :value="opt.id"
              v-model="answers[q.id]"
            />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </div>

      <button
        class="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        :disabled="submitting"
        @click="submitQuiz"
      >
        {{ submitting ? 'Skickar…' : 'Få rekommendation' }}
      </button>
    </div>

    <div v-if="result" class="mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 class="font-semibold mb-2">Din rekommendation:</h3>
      <div v-if="result.suggestedProgram">
        <p>
          <strong>{{ result.suggestedProgram.name }}</strong>
          <span class="text-gray-600">({{ result.suggestedProgram.category }})</span>
        </p>
        <p class="text-sm text-gray-600 mt-2">Submission ID: {{ result.submissionId }}</p>
      </div>
      <div v-else>
        <p>Ingen tydlig rekommendation den här gången.</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* enkel styling; Tailwind finns ev. redan via Vite-plugin om du använder det */
</style>
