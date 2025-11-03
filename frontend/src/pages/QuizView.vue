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
  <main class="quiz-container">
    <h1 class="quiz-title">Program-quiz</h1>

    <p v-if="loading">Laddar frågor…</p>
    <p v-if="errorMsg" class="q-error">{{ errorMsg }}</p>

    <!-- 2-kolumns grid på desktop, 1 kolumn på mobil -->
    <div v-if="!loading && questions.length" class="q-grid">
      <!-- Frågekort -->
      <div v-for="q in questions" :key="q.id" class="q-card">
        <h2 class="q-question">
          {{ q.order_index }}. {{ q.prompt }}
        </h2>

        <div class="q-options">
          <label v-for="opt in q.options" :key="opt.id" class="q-option">
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

      <!-- Skicka-knapp: ligger under båda kolumnerna, centrerad -->
      <div class="q-actions">
        <button class="q-submit" :disabled="submitting" @click="submitQuiz">
          {{ submitting ? 'Skickar…' : 'Få rekommendation' }}
        </button>
      </div>
    </div>

    <!-- Resultatbox under grid -->
    <div v-if="result" class="q-result">
      <h3>Din rekommendation:</h3>
      <div v-if="result.suggestedProgram">
        <p class="q-result-main">
          <strong>{{ result.suggestedProgram.name }}</strong>
          <span class="q-result-sub">({{ result.suggestedProgram.category }})</span>
        </p>
        <p class="q-result-id">Submission ID: {{ result.submissionId }}</p>
      </div>
      <div v-else>
        <p class="m-0">Ingen tydlig rekommendation den här gången.</p>
      </div>
    </div>
  </main>
</template>


<style scoped>
/* Container */
.quiz-container {
  max-width: 1120px;            /* lite bredare eftersom vi har 2 kolumner */
  margin: 0 auto;
  padding: 16px 16px 120px;     /* extra nedtill pga sticky footer */
}
.quiz-title {
  margin: 4px 0 12px;
  font-size: 1.6rem;
  font-weight: 700;
}

/* Felmeddelande */
.q-error {
  color: #dc2626;
  margin-bottom: 12px;
}

/* Grid: 1 kolumn på mobil, 2 på ≥768px */
.q-grid {
  display: grid;
  gap: 12px;
}
@media (min-width: 768px) {
  .q-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Frågekort – kompakt */
.q-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,.03);
}
.q-question {
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 600;
}

/* Alternativ – tätt men klickvänligt */
.q-options {
  display: grid;
  gap: 6px;
}
.q-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
}
.q-option:hover { background: #f8fafc; cursor: pointer; }

/* Actions: spänner över hela grid och centrerar knappen */
.q-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 4px;
}
.q-submit {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.q-submit:disabled { opacity: .6; cursor: not-allowed; }

/* Resultat – kompakt box */
.q-result {
  margin-top: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #f9fafb;
}
.q-result h3 {
  margin: 0 0 8px;
  font-size: 1.05rem;
  font-weight: 700;
}
.q-result-main { margin: 0; }
.q-result-sub {
  color: #64748b;
  font-weight: 500;
  margin-left: 6px;
}
.q-result-id {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: .85rem;
}

/* Responsivt: fullbredd knapp på små skärmar */
@media (max-width: 640px) {
  .q-submit { width: 100%; }
}
</style>
