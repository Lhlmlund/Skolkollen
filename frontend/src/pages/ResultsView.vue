<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const last = ref(null)

onMounted(() => {
  try {
    last.value = JSON.parse(localStorage.getItem('skolkollen_last_suggested'))
  } catch {
    last.value = null
  }
})
</script>

<template>
  <main style="max-width:720px;margin:0 auto;padding:16px 16px 120px;">
    <h1 style="margin:4px 0 12px;font-size:1.6rem;font-weight:700;">Ditt senaste resultat</h1>

    <div v-if="!last" style="border:1px solid #e5e7eb;border-radius:12px;padding:12px 14px;background:#fff;">
      <p style="margin:0 0 8px;">Inget sparat resultat hittades.</p>
      <router-link to="/quiz" style="text-decoration:underline;">Gå till quiz</router-link>
    </div>

    <div v-else style="border:1px solid #e5e7eb;border-radius:12px;padding:12px 14px;background:#f9fafb;">
      <p style="margin:0;font-weight:700;">{{ last.suggestedProgram.name }}</p>
      <p style="margin:4px 0 0;color:#64748b;">{{ last.suggestedProgram.category }}</p>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:.9rem;">Submission ID: {{ last.submissionId }}</p>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:.9rem;">Sparad: {{ new Date(last.savedAt).toLocaleString() }}</p>

      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
        <router-link to="/quiz" style="padding:8px 12px;border-radius:10px;background:#111;color:#fff;">Gör quizzet igen</router-link>
        <button
          @click="localStorage.removeItem('skolkollen_last_suggested'); last=null"
          style="padding:8px 12px;border-radius:10px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;">
          Rensa resultat
        </button>
      </div>
    </div>
  </main>
</template>
