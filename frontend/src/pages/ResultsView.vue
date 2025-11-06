<!-- src/pages/ResultsView.vue -->
<template>
  <main class="results">
    <h2>Resultat</h2>

    <section class="box">
      <template v-if="latest">
        <p class="big">
          <span>Rekommendation:</span> {{ latest.recommendation }}
        </p>
        <p class="time">{{ formatDate(latest.createdAt) }}</p>
        <RouterLink to="/quiz" class="btn">Gör om quiz</RouterLink>
      </template>

      <template v-else>
        <p>Inga resultat ännu.</p>
        <RouterLink to="/quiz" class="btn">Gör quizet</RouterLink>
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  // Sätt till false när API är redo
  demo: { type: Boolean, default: true },
  apiUrl: { type: String, default: '/api/quiz/latest' },
  hardcoded: {
    type: Object,
    default: () => ({
      recommendation: 'Teknikprogrammet – Informations- och medieteknik',
      createdAt: new Date().toISOString()
    })
  }
})

const latest = ref(null)

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('sv-SE', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso ?? ''
  }
}

async function load() {
  if (props.demo) {
    latest.value = props.hardcoded
    return
  }
  try {
    const res = await fetch(props.apiUrl, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const item = data?.latest ?? data
    if (item) {
      latest.value = {
        recommendation: item.recommendation ?? item.program ?? 'Rekommendation saknas',
        createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString()
      }
    }
  } catch {
    // fallback så sidan alltid visar något
    latest.value = props.hardcoded
  }
}

onMounted(load)
</script>

<style scoped>
.results { padding: 1.5rem; }
.box {
  background: #fff; padding: 16px; border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,.06); max-width: 720px;
}
.big { font-size: 1.1rem; margin: 0 0 6px; color: #2b2b2b; }
.big span { font-weight: 700; margin-right: 6px; }
.time { opacity: .75; margin: 0 0 10px; }
.btn {
  display: inline-block; padding: 6px 12px; border-radius: 10px;
  border: 1px solid #e0e0e0; text-decoration: none;
}
</style>
