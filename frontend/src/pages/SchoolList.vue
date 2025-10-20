<template>
  <main class="school-list-page">
    <h2>Alla skolor</h2>
    <p class="intro">Här ser du alla skolor som finns registrerade i Skolkollen.</p>

    <div v-if="loading" class="loading">Laddar skolor...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <section v-else class="school-list">
      <div
          v-for="school in schools"
          :key="school.id"
          class="school-card"
      >
        <h3>{{ school.name }}</h3>
        <p class="program"><strong>Program:</strong> {{ school.program || 'Ingen information' }}</p>
        <p class="city"><strong>Stad:</strong> {{ school.city || 'Okänd' }}</p>
        <p class="desc">{{ school.description || 'Ingen beskrivning tillgänglig.' }}</p>
      </div>
    </section>

    <router-link to="/" class="back-link">⬅ Till startsidan</router-link>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSchools } from '../api/clients.js'


const schools = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await getSchools()
    schools.value = data
  } catch (err: any) {
    error.value = err.message || 'Kunde inte hämta skolor.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.school-list-page {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.6s ease-in;
}

.school-list-page h2 {
  text-align: center;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.intro {
  text-align: center;
  color: #555;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.school-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.school-card {
  background: linear-gradient(135deg, #fdfbfb 0%, #f1f1f1 100%);
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.school-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.school-card h3 {
  margin-top: 0;
  color: #e52e71;
}

.school-card p {
  margin: 0.4rem 0;
  color: #444;
}

.program, .city {
  font-size: 0.95rem;
}

.desc {
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.5rem;
}

.loading, .error {
  text-align: center;
  padding: 1rem;
  font-weight: 500;
}

.error {
  color: #e52e71;
}


.back-link {
  display: block;
  text-align: center;
  margin-top: 2rem;
  text-decoration: none;
  color: #e52e71;
  font-weight: 500;
  transition: 0.3s;
}

.back-link:hover {
  color: #ff8a00;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
