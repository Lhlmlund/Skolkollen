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
      <!-- First 4 filters as buttons -->
      <div
          v-for="filter in visibleFilters"
          :key="filter.name"
          class="filter-wrapper"
      >
        <button
            :class="{ active: activeFilter === filter.name }"
            @click="setFilter(filter.name)"
        >
          {{ filter.name }}
        </button>
      </div>

      <!-- Dropdown for remaining filters -->
      <div class="filter-wrapper">
        <select @change="setFilter($event.target.value)" class="program-dropdown">
          <option disabled selected>Fler program</option>
          <option
              v-for="filter in dropdownFilters"
              :key="filter.name"
              :value="filter.name"
          >
            {{ filter.name }}
          </option>
        </select>
      </div>
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
          <transition-group name="fold" tag="li">
            <li v-for="event in visibleOpenHouses" :key="event.school + event.date">
              <strong>{{ event.school }}</strong><br />
              {{ event.date }} – {{ event.time }}
            </li>
          </transition-group>
        </ul>

        <button class="toggle-btn" @click="toggleOpenHouses">
          {{ showAllOpenHouses ? 'Visa färre' : 'Visa alla' }}
        </button>
      </aside>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getSchools, getOpenHouses } from '../api/clients.js' // 👈 Add this

const schools = ref([])
const filteredSchools = ref([])
const searchQuery = ref('')
const activeFilter = ref('Alla')
const filters = [
  {
    name: 'Alla',
    programs: []
  },
  {
    name: 'Natur',
    programs: ['Naturvetenskapsprogrammet']
  },
  {
    name: 'Teknik',
    programs: ['Teknikprogrammet']
  },
  {
    name: 'Samhäll',
    programs: ['Samhällsvetenskapsprogrammet', 'Ekonomiprogrammet', 'Humanistiska programmet']
  },
  {
    name: 'Estet',
    programs: ['Estetiska programmet']
  },
  {
    name: 'Barn och fritid',
    programs: ['Barn- och fritidsprogrammet']
  },
  {
    name: 'Bygg',
    programs: ['Bygg- och anläggningsprogrammet']
  },
  {
    name: 'El',
    programs: ['El- och energiprogrammet', 'Industritekniska programmet']
  },
  {
    name: 'Fordon',
    programs: ['Fordons- och transportprogrammet']
  },
  {
    name: 'Försäljning & service',
    programs: ['Försäljnings- och serviceprogrammet']
  },
  {
    name: 'Frisör & stylist',
    programs: ['Frisör- och stylistprogrammet']
  },
  {
    name: 'Hotell & turism',
    programs: ['Hotell- och turismprogrammet']
  },
  {
    name: 'Naturbruk',
    programs: ['Naturbruksprogrammet']
  },
  {
    name: 'Restaurang',
    programs: ['Restaurang- och livsmedelsprogrammet']
  },
  {
    name: 'Vård & omsorg',
    programs: ['Vård- och omsorgsprogrammet']
  },
  {
    name: 'VVS',
    programs: ['VVS- och fastighetsprogrammet']
  },
];
const visibleFilters = [filters[0], ...filters.slice(1, 4)] // "Alla" + 3 programs
const dropdownFilters = filters.slice(4)



const loading = ref(true)
const error = ref(null)

// Default placeholders (visible until real data is fetched)
const openHouses = ref([
  { school: 'Tekniska Gymnasiet', date: '25 okt', time: '17:00–19:00' },
  { school: 'Samhällsakademin', date: '2 nov', time: '18:00–20:00' },
  { school: 'Fordonscollege', date: '5 nov', time: '16:30–18:30' }
])
const showAllOpenHouses = ref(false)

const visibleOpenHouses = computed(() => {
  return showAllOpenHouses.value
      ? openHouses.value
      : openHouses.value.slice(0, 3) // only first 3 initially
})

function toggleOpenHouses() {
  showAllOpenHouses.value = !showAllOpenHouses.value
}


onMounted(async () => {
  try {
    // Load schools
    const schoolData = await getSchools()
    schools.value = schoolData
    filteredSchools.value = schoolData

    // Try to load open house data from the backend
    const openHouseData = await getOpenHouses()
    if (openHouseData && openHouseData.length > 0) {
      openHouses.value = openHouseData
    }
  } catch (err) {
    error.value = err.message || 'Kunde inte hämta data.'
  } finally {
    loading.value = false
  }
})

function setFilter(filterOrProgram) {
  activeFilter.value = filterOrProgram
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
.filter-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.program-dropdown {
  margin-top: 0.3rem;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e52e71;
  cursor: pointer;
}

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

.openhouse-card {
  position: relative;
  border-radius: 20px;
  padding: 1.8rem;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  height: fit-content;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(229, 46, 113, 0.15);
}

.openhouse-card::before {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fff7f9 100%);
  z-index: 0;
}

.openhouse-card > * {
  position: relative;
  z-index: 1;
}

.openhouse-card:hover {
  transform: translateY(-14px);
  box-shadow: 0 12px 30px rgba(229, 46, 113, 0.25);
}

.openhouse-card h3 {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  text-align: center;
}

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

/* Vue transition classes – keep, used dynamically */
.fold-enter-active,
.fold-leave-active {
  transition: all 0.4s ease;
  display: block;
  overflow: hidden;
}

.fold-enter-from,
.fold-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

.fold-enter-to,
.fold-leave-from {
  max-height: 500px;
  opacity: 1;
  padding-top: 0.9rem;
  padding-bottom: 0.9rem;
  margin-bottom: 0.7rem;
}

.toggle-btn {
  display: block;
  width: 100%;
  border: none;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  border-radius: 12px;
  padding: 0.6rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 46, 113, 0.3);
}

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
