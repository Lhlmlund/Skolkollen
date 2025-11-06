<template>
  <div class="qt-box">
    <template v-if="latest">
      <p class="qt-program"><strong>{{ latest.recommendation }}</strong></p>
      <p class="qt-time">{{ formatDate(latest.createdAt) }}</p>
      <RouterLink to="/results" class="qt-link">Visa mer</RouterLink>
      <RouterLink to="/quiz" class="qt-link" style="margin-left:8px;">Gör om quiz</RouterLink>
    </template>
    <template v-else>
      <p class="qt-program"><strong>Inget quizresultat än</strong></p>
      <RouterLink to="/quiz" class="qt-link">Gör quizet nu</RouterLink>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getLatestQuiz } from '@/utils/quizStore'

const latest = ref(null)

function formatDate(iso) {
  try { return new Date(iso).toLocaleString('sv-SE', { dateStyle:'medium', timeStyle:'short' }) }
  catch { return iso ?? '' }
}

onMounted(() => {
  latest.value = getLatestQuiz()
})
</script>

<style scoped>
.qt-box {
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
  max-width: 720px;
  margin: 0 auto 12px auto;
}
.qt-program { margin: 0; font-size: 1rem; color: #2b2b2b; }
.qt-time { margin: 6px 0 0; font-size: .9rem; opacity: .75; }
.qt-link { display:inline-block; margin-top:10px; text-decoration:none; border:1px solid #e0e0e0; padding:6px 10px; border-radius:10px; }
</style>
