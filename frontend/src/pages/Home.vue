<template>
  <main class="home">
    <section class="tagline">
      <p>Välj rätt, börja rätt – din väg till gymnasiet</p>
    </section>

    <section class="search">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Sök gymnasium, program eller stad..."
          @input="filterSchools"
      />
      <button class="search-btn" @click="filterSchools">Sök</button>
    </section>

    <section class="filters">
      <button
          v-for="filter in filters"
          :key="filter"
          :class="{ active: activeFilter === filter }"
          @click="setFilter(filter)"
      >
        {{ filter }}
      </button>
    </section>

    <div class="content-layout">
      <!-- Left column: school list -->
      <section class="school-list">
        <div
            v-for="school in filteredSchools"
            :key="school.id"
            class="school-card"
        >
          <h3>{{ school.name }}</h3>
          <p><strong>Program:</strong> {{ school.program || 'Ingen information' }}</p>
          <p><strong>Stad:</strong> {{ school.city || 'Okänd' }}</p>
          <a :href="school.website" target="_blank" class="school-link">Besök hemsida</a>
        </div>

        <div v-if="!loading && filteredSchools.length === 0" class="no-results">
          Inga skolor matchar din sökning.
        </div>

        <div v-if="loading" class="loading">Laddar skolor...</div>
        <div v-if="error" class="error">{{ error }}</div>
      </section>

      <!-- Right column: open house card -->
      <aside class="openhouse-card">
        <h3>Öppet hus</h3>
        <ul>
          <li v-for="(event, index) in openHouses" :key="index">
            <strong>{{ event.school }}</strong><br />
            {{ event.date }} – {{ event.time }}
          </li>
        </ul>
        <router-link to="/openhouse" class="more-link">Visa alla</router-link>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSchools } from '../api/clients.js'

const schools = ref([])
const filteredSchools = ref([])
const searchQuery = ref('')
const activeFilter = ref('Alla')
const filters = ['Alla', 'Natur', 'El', 'Samhäll', 'Fordon']

const loading = ref(true)
const error = ref(null)

const openHouses = ref([
  { school: 'Tekniska Gymnasiet', date: '25 okt', time: '17:00–19:00' },
  { school: 'Samhällsakademin', date: '2 nov', time: '18:00–20:00' },
  { school: 'Fordonscollege', date: '5 nov', time: '16:30–18:30' }
])

onMounted(async () => {
  try {
    const data = await getSchools()
    schools.value = data
    filteredSchools.value = data
  } catch (err) {
    error.value = err.message || 'Kunde inte hämta skolor.'
  } finally {
    loading.value = false
  }
})

function setFilter(filter) {
  activeFilter.value = filter
  filterSchools()
}

function filterSchools() {
  const query = searchQuery.value.toLowerCase()
  filteredSchools.value = schools.value.filter((school) => {
    const matchesFilter =
        activeFilter.value === 'Alla' ||
        (school.program && school.program.toLowerCase().includes(activeFilter.value.toLowerCase()))
    const matchesSearch =
        school.name.toLowerCase().includes(query) ||
        (school.city && school.city.toLowerCase().includes(query)) ||
        (school.program && school.program.toLowerCase().includes(query))
    return matchesFilter && matchesSearch
  })
}
</script>

<style scoped>
.home {
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  min-height: 100vh;
}

.tagline {
  margin: 2rem 0;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2b2b2b;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeIn 1s ease-in;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.search input {
  width: 320px;
  padding: 0.7rem 1rem;
  border: 2px solid #e52e71;
  border-radius: 9999px;
  outline: none;
  transition: 0.3s;
  font-size: 1rem;
}

.search input:focus {
  border-color: #ff8a00;
  box-shadow: 0 0 10px #ffd1dc;
}

.search-btn {
  padding: 0.7rem 1.4rem;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.search-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.filters button {
  background: white;
  border: 2px solid #e52e71;
  border-radius: 9999px;
  padding: 0.4rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.filters button.active {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
}

.filters button:hover {
  transform: translateY(-2px);
}

/* Layout: main content + sidebar */
.content-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}

.school-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
}

.school-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: 0.3s;
}

.school-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.school-link {
  display: inline-block;
  margin-top: 0.6rem;
  color: #e52e71;
  text-decoration: none;
  font-weight: 500;
}

.school-link:hover {
  color: #ff8a00;
}

/* Full gradient border around the card */
.openhouse-card {
  position: relative;
  border-radius: 20px;
  padding: 1.8rem;
  background: linear-gradient(90deg, #ff8a00, #e52e71); /* outer gradient border */
  height: fit-content;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(229, 46, 113, 0.15);
}

/* Inner white layer */
.openhouse-card::before {
  content: "";
  position: absolute;
  inset: 2px; /* thickness of the border */
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fff7f9 100%);
  z-index: 0;
}

/* Actual content container inside */
.openhouse-card > * {
  position: relative;
  z-index: 1;
}

.openhouse-card:hover {
  transform: translateY(-14px);
  box-shadow: 0 12px 30px rgba(229, 46, 113, 0.25);
}

/* Title */
.openhouse-card h3 {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* List */
.openhouse-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.2rem 0;
  color: #444;
}

.openhouse-card li {
  background: #ffffff;
  border: 1px solid rgba(229, 46, 113, 0.1);
  border-radius: 12px;
  padding: 0.9rem;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  transition: 0.2s ease;
}

.openhouse-card li:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Link */
.more-link {
  display: block;
  text-align: center;
  text-decoration: none;
  color: #e52e71;
  font-weight: 500;
  transition: 0.3s;
}

.more-link:hover {
  color: #ff8a00;
}


/* Responsive adjustments */
@media (max-width: 900px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .openhouse-card {
    order: 2;
  }
}

.loading,
.error,
.no-results {
  text-align: center;
  margin-top: 1.5rem;
  font-weight: 500;
  color: #444;
}

.error {
  color: #e52e71;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
