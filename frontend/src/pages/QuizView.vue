<template>
  <main class="quiz-wrap">
    <h1>Program-quiz</h1>

    <!-- FRÅGOR (2 kolumner) -->
    <div v-if="!result">
      <div class="grid-2">
        <!-- Kolumn 1: frågor 1-3 -->
        <div class="col">
          <div
            v-for="q in leftQuestions"
            :key="q.id"
            class="q-block"
          >
            <h2>{{ q.order_index }}. {{ q.prompt }}</h2>
            <div class="opts">
              <label
                v-for="opt in q.options"
                :key="opt.id"
                class="opt"
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
        </div>

        <!-- Kolumn 2: frågor 4-6 -->
        <div class="col">
          <div
            v-for="q in rightQuestions"
            :key="q.id"
            class="q-block"
          >
            <h2>{{ q.order_index }}. {{ q.prompt }}</h2>
            <div class="opts">
              <label
                v-for="opt in q.options"
                :key="opt.id"
                class="opt"
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
        </div>
      </div>

      <div class="actions">
        <button class="recommend-btn" :disabled="submitting" @click="submitQuiz">
          {{ submitting ? 'Skickar…' : 'Få rekommendation' }}
        </button>
      </div>
    </div>

    <!-- RESULTAT -->
    <div v-else class="result">
      <h3>Din rekommendation:</h3>
      <p v-if="result?.suggestedProgram" class="program">
        <strong>{{ result.suggestedProgram.name }}</strong>
        <span class="cat">({{ result.suggestedProgram.category }})</span>
      </p>
      <p v-else>Ingen tydlig rekommendation den här gången.</p>

      <button class="reset-btn" @click="resetQuiz">Gör om quiz</button>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

/* ----- Hårdkodade frågor (samma struktur som tidigare) ----- */
const QUESTIONS = [
  {
    id: 1,
    order_index: 1,
    prompt: 'Vad inspirerar dig mest?',
    options: [
      { id: 101, label: 'Ny teknik och innovation',        program_hint: 'Teknik',          weight: 2 },
      { id: 102, label: 'Naturen och vetenskapliga upptäckter', program_hint: 'Naturvetenskap', weight: 2 },
      { id: 103, label: 'Företagande och ekonomi',          program_hint: 'Ekonomi',         weight: 2 },
      { id: 104, label: 'Kreativt skapande (musik, bild, scen)', program_hint: 'Estetik',     weight: 2 },
      { id: 105, label: 'Att hjälpa människor i vardagen',  program_hint: 'Vård',            weight: 2 },
    ],
  },
  {
    id: 2,
    order_index: 2,
    prompt: 'Vilken studiemiljö trivs du bäst i?',
    options: [
      { id: 201, label: 'Praktiska labbar/verkstad',        program_hint: 'Teknik',          weight: 1 },
      { id: 202, label: 'Laboratorium & teori',             program_hint: 'Naturvetenskap',  weight: 1 },
      { id: 203, label: 'Klassrum, case och affärsfall',    program_hint: 'Ekonomi',         weight: 1 },
      { id: 204, label: 'Ateljé, studio eller scen',        program_hint: 'Estetik',         weight: 1 },
      { id: 205, label: 'Patientnära miljöer',              program_hint: 'Vård',            weight: 1 },
    ],
  },
  {
    id: 3,
    order_index: 3,
    prompt: 'Vad ser du som viktigast i ditt framtida jobb?',
    options: [
      { id: 301, label: 'Utveckla eller designa teknik',    program_hint: 'Teknik',          weight: 2 },
      { id: 302, label: 'Utforska/analys av natur & data',  program_hint: 'Naturvetenskap',  weight: 2 },
      { id: 303, label: 'Bygga företag och påverka marknaden', program_hint: 'Ekonomi',      weight: 2 },
      { id: 304, label: 'Uttrycka mig konstnärligt',        program_hint: 'Estetik',         weight: 2 },
      { id: 305, label: 'Göra konkret skillnad för andra',  program_hint: 'Vård',            weight: 2 },
    ],
  },
  {
    id: 4,
    order_index: 4,
    prompt: 'Vilket område lockar dig mest?',
    options: [
      { id: 401, label: 'Teknik, IT & ingenjörskap',        program_hint: 'Teknik',          weight: 1 },
      { id: 402, label: 'Biologi, kemi, fysik, labb',       program_hint: 'Naturvetenskap',  weight: 1 },
      { id: 403, label: 'Ekonomi, juridik, entreprenörskap', program_hint: 'Ekonomi',        weight: 1 },
      { id: 404, label: 'Musik, bild, dans, teater',        program_hint: 'Estetik',         weight: 1 },
      { id: 405, label: 'Hälsa, vård, omsorg',              program_hint: 'Vård',            weight: 1 },
    ],
  },
  {
    id: 5,
    order_index: 5,
    prompt: 'Vilka styrkor beskriver dig bäst?',
    options: [
      { id: 501, label: 'Logik & problemlösning',           program_hint: 'Teknik',          weight: 1 },
      { id: 502, label: 'Analys & noggrannhet',             program_hint: 'Naturvetenskap',  weight: 1 },
      { id: 503, label: 'Initiativ & affärstänk',           program_hint: 'Ekonomi',         weight: 1 },
      { id: 504, label: 'Kreativitet & uttryck',            program_hint: 'Estetik',         weight: 1 },
      { id: 505, label: 'Empati & samarbete',               program_hint: 'Vård',            weight: 1 },
    ],
  },
  {
    id: 6,
    order_index: 6,
    prompt: 'Hur vill du helst studera?',
    options: [
      { id: 601, label: 'Praktiskt (bygga/göra)',           program_hint: 'Teknik',          weight: 1 },
      { id: 602, label: 'Teoretiskt (förstå på djupet)',    program_hint: 'Naturvetenskap',  weight: 1 },
      { id: 603, label: 'Case & projekt (affär/case)',      program_hint: 'Ekonomi',         weight: 1 },
      { id: 604, label: 'Genom skapande (konst/projekt)',   program_hint: 'Estetik',         weight: 1 },
      { id: 605, label: 'Med människor (praktiknära)',      program_hint: 'Vård',            weight: 1 },
    ],
  },
];

const loading = ref(false);
const submitting = ref(false);
const questions = ref([...QUESTIONS]);
const answers = ref({});          // { [questionId]: optionId }
const result = ref(null);
const errorMsg = ref('');

// två kolumner
const leftQuestions  = computed(() => questions.value.slice(0, 3));
const rightQuestions = computed(() => questions.value.slice(3));

function submitQuiz() {
  errorMsg.value = '';
  result.value = null;

  const payload = Object.entries(answers.value).map(([qId, optId]) => ({
    questionId: Number(qId),
    optionId: Number(optId),
  }));
  if (payload.length < questions.value.length) {
    errorMsg.value = 'Svara på alla frågor först.';
    return;
  }

  submitting.value = true;
  try {
    const optionIndex = new Map();
    for (const q of questions.value) {
      for (const opt of q.options) optionIndex.set(opt.id, opt);
    }
    const score = new Map();
    for (const a of payload) {
      const opt = optionIndex.get(a.optionId);
      if (!opt || !opt.program_hint) continue;
      const w = Number.isFinite(opt.weight) ? opt.weight : 1;
      score.set(opt.program_hint, (score.get(opt.program_hint) || 0) + w);
    }

    const nameMap = {
      Teknik: 'Teknikprogrammet – Informations- och medieteknik',
      Naturvetenskap: 'Naturvetenskapsprogrammet – Naturvetenskap',
      Ekonomi: 'Ekonomiprogrammet',
      Estetik: 'Estetiska programmet',
      Vård: 'Vård- och omsorgsprogrammet',
    };

    // best hint
    let best = null, bestSum = -Infinity;
    for (const [hint, sum] of score.entries()) {
      if (sum > bestSum) { bestSum = sum; best = hint; }
    }

    const suggested = best ? { name: nameMap[best] || best, category: best } : null;
    result.value = { suggestedProgram: suggested };

    if (suggested) {
      const payloadLocal = {
        recommendation: suggested.name,
        createdAt: new Date().toISOString(),
      };
      try { localStorage.setItem('latestQuiz', JSON.stringify(payloadLocal)); } catch {}
    }
  } finally {
    submitting.value = false;
  }
}

function resetQuiz() {
  answers.value = {};
  result.value = null;
  errorMsg.value = '';
}
</script>

<style scoped>
.quiz-wrap {
  padding: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.col { min-width: 0; }
.q-block { margin-bottom: 18px; }
.q-block h2 { margin: 0 0 8px; font-weight: 700; }
.opts { margin-top: 4px; }
.opt { display: block; margin: 6px 0; }
.opt input { margin-right: 8px; }

.actions { margin-top: 6px; }
.recommend-btn {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
}
.result {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
}
.program { font-size: 1.1rem; font-weight: 600; }
.cat { opacity: .75; }
.reset-btn {
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

/* Mobil: en kolumn */
@media (max-width: 860px) {
  .grid-2 { grid-template-columns: 1fr; }
}
</style>
