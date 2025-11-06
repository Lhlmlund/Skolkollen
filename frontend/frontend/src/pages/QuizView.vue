<template>
  <main class="quiz">
    <section class="card">
      <h2>Quiz</h2>
      <form @submit.prevent="onSubmit">
        <fieldset>
          <legend>Vilket program lockar dig mest?</legend>
          <label><input type="radio" value="Natur" v-model="program" /> Natur</label>
          <label><input type="radio" value="Teknik" v-model="program" /> Teknik</label>
          <label><input type="radio" value="Samhälle" v-model="program" /> Samhälle</label>
        </fieldset>
        <fieldset>
          <legend>Hur vill du studera?</legend>
          <label><input type="radio" value="Praktiskt" v-model="style" /> Mer praktiskt</label>
          <label><input type="radio" value="Teoretiskt" v-model="style" /> Mer teoretiskt</label>
        </fieldset>
        <div class="actions">
          <button type="submit" class="primary" :disabled="!program || !style">Skicka</button>
          <RouterLink to="/" class="link">Avbryt</RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveLatestQuiz } from '@/utils/quizStore'

const router = useRouter()
const program = ref('')
const style = ref('')

function buildRecommendation(p, s) {
  if (p === 'Teknik') {
    return s === 'Praktiskt'
      ? 'Teknikprogrammet – Informations- och medieteknik'
      : 'Teknikprogrammet – Teknikvetenskap'
  }
  if (p === 'Natur') {
    return s === 'Praktiskt'
      ? 'Naturvetenskapsprogrammet – Naturvetenskap och samhälle'
      : 'Naturvetenskapsprogrammet – Naturvetenskap'
  }
  return s === 'Praktiskt'
    ? 'Samhällsvetenskapsprogrammet – Beteendevetenskap'
    : 'Samhällsvetenskapsprogrammet – Samhällsvetenskap'
}

function onSubmit() {
  const recommendation = buildRecommendation(program.value, style.value)
  saveLatestQuiz(recommendation)
  router.push({ path: '/results' })
}
</script>

<style scoped>
.quiz { padding: 1.5rem; display:flex; justify-content:center; }
.card {
  background: #fff; padding: 20px; border-radius: 16px;
  max-width: 760px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,.08);
}
fieldset { border: 0; margin: 18px 0; }
legend { font-weight: 700; margin-bottom: 8px; }
label { display: block; margin: 6px 0; }
.actions { margin-top: 16px; display:flex; gap: 12px; align-items:center; }
.primary { padding: 8px 14px; border-radius: 10px; border: none; cursor: pointer; }
.link { text-decoration: none; }
</style>
