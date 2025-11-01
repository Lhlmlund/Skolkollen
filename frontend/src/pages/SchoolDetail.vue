<template>
  <main class="school-detail-page" v-if="!loading && school">
    <img
        v-if="school.image_url"
        :src="school.image_url"
        alt="Skolbild"
        class="school-image"
    />

    <h2>{{ school.name }}</h2>

    <p><strong>Stad:</strong> {{ school.city || 'Okänd' }}</p>
    <p><strong>Elever:</strong> {{ school.student_count || 'Ingen data' }}</p>
    <p><strong>Meritvärde:</strong> {{ school.merit_value || 'Ingen data' }}</p>

    <p v-if="school.website">
      <strong>Webb:</strong>
      <a :href="school.website" target="_blank">{{ school.website }}</a>
    </p>

    <div v-if="parsedPrograms.length">
      <p><strong>Program:</strong></p>
      <ul>
        <li v-for="(program, index) in parsedPrograms" :key="index">
          {{ program }}
        </li>
      </ul>
    </div>

    <p class="desc">{{ school.description || 'Ingen beskrivning tillgänglig.' }}</p>

    <router-link to="/" class="back-link">⬅ Tillbaka till alla skolor</router-link>
  </main>


  <div v-else-if="loading" class="loading">Laddar skolinformation...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSchoolById } from '../api/clients.js'

const route = useRoute()
const school = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Parse programs from JSON objects to display just the names
const parsedPrograms = computed(() => {
  if (!school.value?.programs || !Array.isArray(school.value.programs)) {
    return []
  }

  return school.value.programs.map((program: any) => {
    // If it's already a string, return it
    if (typeof program === 'string') {
      try {
        const parsed = JSON.parse(program)
        return parsed.program?.name || parsed.name || program
      } catch {
        return program
      }
    }

    // If it's an object, extract the name
    return program.program?.name || program.name || 'Okänt program'
  })
})

onMounted(async () => {
  try {
    const id = route.params.id
    console.log('🔍 Route ID:', id)

    school.value = await getSchoolById(id)
    console.log('✅ School loaded:', school.value)
    console.log('📚 Programs:', school.value.programs)
  } catch (err: any) {
    error.value = err.message || 'Kunde inte hämta skolinformation.'
    console.error('❌ Error loading school:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.school-detail-page {
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.6s ease-in;
}

.school-detail-page h2 {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 2px solid #e52e71;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
}

.school-image {
  display: block;
  margin: 1rem auto;
  max-width: 100%;
  border-radius: 12px;
}

.desc {
  margin-top: 1rem;
  color: #555;
}

.back-link {
  display: block;
  margin-top: 2rem;
  text-align: center;
  text-decoration: none;
  color: #e52e71;
  font-weight: 500;
}

.back-link:hover {
  color: #ff8a00;
}

.loading, .error {
  text-align: center;
  margin-top: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #e52e71;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>