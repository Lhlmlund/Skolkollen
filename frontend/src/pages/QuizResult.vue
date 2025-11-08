<template>
  <main style="padding:1.5rem; max-width:980px; margin:0 auto;">
    <h1 class="text-2xl font-bold mb-4">Din rekommendation</h1>

    <section style="background:#fff; padding:20px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.08);">
      <div v-if="latest">
        <p style="font-size:1.1rem; margin-bottom:6px;">
          <strong>{{ latest.name }}</strong>
          <span style="color:#6b7280"> ({{ latest.category }})</span>
        </p>
        <p style="font-size:0.9rem; color:#6b7280;">
          {{ new Date(latest.at).toLocaleString() }}
        </p>

        <div style="margin-top:16px; display:flex; gap:10px;">
          <router-link to="/quiz" style="text-decoration:none;">Gör om quiz</router-link>
          <router-link to="/" style="text-decoration:none;">Till startsidan</router-link>
        </div>
      </div>

      <div v-else>
        <p>Inget resultat hittades. <router-link to="/quiz">Gör quizet</router-link>.</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { getLatestQuiz } from '../utils/quizStore'
const latest = getLatestQuiz()
</script>
