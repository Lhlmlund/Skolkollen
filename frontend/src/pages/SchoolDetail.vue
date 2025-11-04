<template>
  <main class="school-detail-page" v-if="!loading && school">
    <img
        :src="school.image_url"
        alt="Skolbild"
        class="school-image"
    />

    <h2>{{ school.name }}</h2>

    <div class="info-grid">
      <p><strong>Stad:</strong> {{ school.city }}</p>
      <p>
        <strong>Adress:</strong><br />
        {{ formatAddress(school.address) }}
      </p>
      <p><strong>Grundad:</strong> {{ school.founded_year }}</p>
      <p><strong>Rektor:</strong> {{ school.principal }}</p>
      <p><strong>Typ:</strong> {{ school.school_type }}</p>
      <p><strong>Ägare:</strong> {{ school.ownership }}</p>
      <p><strong>Elever:</strong> {{ school.student_count || 'Ingen data' }}</p>
      <p><strong>Meritvärde:</strong> {{ school.merit_value || 'Ingen data' }}</p>
      <p><strong>Ranking i Sverige:</strong> {{ school.ranking_position }}</p>
    </div>

    <p v-if="school.website">
      <strong>Webb:</strong>
      <a :href="school.website" target="_blank">{{ school.website }}</a>
    </p>

    <div class="school-extra-info">
      <div v-if="parsedPrograms.length" class="info-row">
        <strong> Program:</strong>
        <ul>
          <li v-for="program in parsedPrograms" :key="program">{{ program }}</li>
        </ul>
      </div>

      <div v-if="school.languages_offered?.length" class="info-row">
        <strong> Språk som erbjuds:</strong> {{ school.languages_offered.join(', ') }}
      </div>

      <div v-if="school.clubs?.length" class="info-row">
        <strong> Klubbar och föreningar:</strong> {{ school.clubs.join(', ') }}
      </div>

      <div v-if="school.facilities?.length" class="info-row">
        <strong> Faciliteter:</strong> {{ school.facilities.join(', ') }}
      </div>

      <div class="info-row">
        <strong> Miljöprofil:</strong>
        <span v-if="school.environmental_focus">Ja</span>
        <span v-else>Nej</span>
      </div>

      <div v-if="school.exchange_programs?.length" class="info-row">
        <strong> Utbytesprogram:</strong> {{ school.exchange_programs.join(', ') }}
      </div>

      <div v-if="school.notable_alumni?.length" class="info-row">
        <strong> Kända alumner:</strong> {{ school.notable_alumni.join(', ') }}
      </div>

      <p class="school-desc">{{ school.description || 'Ingen beskrivning tillgänglig.' }}</p>
    </div>

    <router-link to="/" class="back-link">⬅ Tillbaka till alla skolor</router-link>
    <div class="toggle-buttons">
      <button @click="goToPrevious" :disabled="currentIndex === 0">⬅ Föregående</button>
      <button @click="goToNext" :disabled="currentIndex === schools.length - 1">Nästa ➡</button>
    </div>

  </main>

  <div v-else-if="loading" class="loading">Laddar skolinformation...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { schools } from '../data/school'

const route = useRoute()
const router = useRouter()
const school = ref<any>(null)
const error = ref<string | null>(null)
const loading = ref(true)
const currentIndex = ref(0)

const loadSchool = (id: number) => {
  const foundIndex = schools.findIndex(s => s.id === id)
  if (foundIndex !== -1) {
    school.value = schools[foundIndex]
    currentIndex.value = foundIndex
    error.value = null
  } else {
    school.value = null
    error.value = 'Ingen skolinformation hittades för ID ' + id
  }
}

onMounted(() => {
  loadSchool(Number(route.params.id))
  loading.value = false
})

watch(
    () => route.params.id,
    (newId) => loadSchool(Number(newId))
)

const goToPrevious = () => {
  if (currentIndex.value > 0) {
    const prev = schools[currentIndex.value - 1]
    router.push({ name: 'school-detail', params: { id: prev.id } })
  }
}

const goToNext = () => {
  if (currentIndex.value < schools.length - 1) {
    const next = schools[currentIndex.value + 1]
    router.push({ name: 'school-detail', params: { id: next.id } })
  }
}

const formatAddress = (address: string) => {
  const parts = address.split(',')
  return parts.length > 1 ? `${parts[0]}\n${parts[1].trim()}` : address
}

const parsedPrograms = computed(() => school.value?.programs || [])
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
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem 1rem;
  margin-bottom: 1.5rem;
}

.info-grid p {
  margin: 0.25rem 0;
  white-space: pre-line;
}

.school-detail-page a {
  color: #e52e71;
  text-decoration: none;
}

.school-detail-page a:hover {
  text-decoration: underline;
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
.school-extra-info {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  padding: 1.8rem 2rem;
  margin-top: 1.8rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background-image: linear-gradient(#fff, #fff),
  linear-gradient(90deg, #ff7a18, #e52e71);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.school-extra-info:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 24px rgba(229, 46, 113, 0.15);
}

.info-row {
  margin-bottom: 0.8rem;
  line-height: 1.6;
  color: #333;
  font-size: 0.98rem;
}

.info-row strong {
  background: linear-gradient(90deg, #ff7a18, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  display: inline-block;
  margin-right: 0.3rem;
}

.info-row ul {
  margin: 0.4rem 0 0.4rem 2.2rem; /* increased from 1.2rem */
  padding-left: 0.8rem; /* extra internal padding */
  list-style-type: disc;
}

.school-desc {
  margin-top: 1.4rem;
  color: #555;
  font-style: italic;
  text-align: center;
  line-height: 1.5;
}

.toggle-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.toggle-buttons button {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.toggle-buttons button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toggle-buttons button:hover:not(:disabled) {
  opacity: 0.85;
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