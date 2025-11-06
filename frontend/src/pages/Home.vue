<template>
  <main class="home">
    <section class="tagline">
      <p>Välj rätt, börja rätt – din väg till gymnasiet</p>
    </section>

    <!-- Quiz-teaser (demo-läge = ingen backend krävs) -->
    <QuizTeaser />

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
        v-for="f in quickFilters"
        :key="f"
        :class="{ active: activeFilter === f }"
        @click="setFilter(f)"
      >{{ f }}</button>
    </section>

    <section class="school-list" style="margin-top: 12px;">
      <div
        v-for="s in filteredSchools"
        :key="s.id"
        class="school-card"
        style="background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.06);"
      >
        <h3 style="margin: 0 0 6px 0">{{ s.name }}</h3>
        <p style="margin: 0 0 6px 0"><strong>Stad:</strong> {{ s.city }}</p>
        <p style="margin: 0"><strong>Program:</strong> {{ s.programs.join(', ') }}</p>
      </div>

      <div v-if="!filteredSchools.length" class="no-results">
        Inga skolor matchar din sökning.
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import QuizTeaser from '../components/QuizTeaser.vue' // byt till '@/components/QuizTeaser.vue' om du har '@' alias

// 🔒 Offline-data (ingen fetch)
const SCHOOLS = [
  { id: 3, name: 'Göta Akademi', city: 'Göteborg', programs: ['Naturvetenskapsprogrammet', 'Teknikprogrammet'] },
  { id: 8, name: 'Helsingborg Kreativa Skola', city: 'Helsingborg', programs: ['Samhällsvetenskapsprogrammet', 'Estetiska programmet'] },
  { id: 6, name: 'Karlstad Kunskapsgymnasiet', city: 'Karlstad', programs: ['Samhällsvetenskapsprogrammet', 'Ekonomiprogrammet'] },
  { id: 2, name: 'Norrby Tekniska', city: 'Uppsala', programs: ['Teknikprogrammet', 'Industritekniska programmet'] },
  { id: 5, name: 'Skåne Framtidsgymnasium', city: 'Malmö', programs: ['Vård- och omsorgsprogrammet', 'Barn- och fritidsprogrammet'] },
  { id: 1, name: 'Södra Gymnasiet', city: 'Stockholm', programs: ['Naturvetenskapsprogrammet', 'Samhällsvetenskapsprogrammet'] },
  { id: 7, name: 'Västerås Gymnasium', city: 'Västerås', programs: ['El- och energiprogrammet', 'Fordons- och transportprogrammet'] },
  { id: 4, name: 'Östra Real', city: 'Stockholm', programs: ['Humanistiska programmet', 'Ekonomiprogrammet'] },
]

const schools = ref([...SCHOOLS])
const filteredSchools = ref([...SCHOOLS])
const searchQuery = ref('')
const activeFilter = ref('Alla')
const quickFilters = ['Alla', 'Natur', 'Teknik', 'Samhäll']

function setFilter(f) {
  activeFilter.value = f
  filterSchools()
}

function filterSchools() {
  const q = searchQuery.value.trim().toLowerCase()
  filteredSchools.value = schools.value.filter((s) => {
    const matchText =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.programs.some(p => p.toLowerCase().includes(q))

    const matchFilter =
      activeFilter.value === 'Alla' ||
      (activeFilter.value === 'Natur'   && s.programs.some(p => p.includes('Naturvetenskaps'))) ||
      (activeFilter.value === 'Teknik'  && s.programs.some(p => p.includes('Teknik'))) ||
      (activeFilter.value === 'Samhäll' && s.programs.some(p => p.includes('Samhäll') || p.includes('Ekonomi') || p.includes('Humanist')))

    return matchText && matchFilter
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
  padding: 0.4rem 1.2rem;
  border: 2px solid #e52e71;
  border-radius: 9999px;
  font-weight: 500;
  background-color: white;
  color: #2b2b2b;
  transition: all 0.3s;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  font-size: 1rem;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='14' height='10' viewBox='0 0 14 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23e52e71' d='M7 10L0 0h14z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 0.6rem;
  padding-right: 2.5rem;
}

.program-dropdown:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.program-dropdown:focus {
  outline: none;
  border-color: #ff8a00;
  box-shadow: 0 0 10px #ffd1dc;
}
.program-dropdown.active {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  border-color: transparent;
}
.program-dropdown option {
  padding: 0.5rem;
  font-size: 1rem;
  color: #2b2b2b;
}
.program-dropdown option:checked {
  background-color: #ffd1dc; /* Light pink or something that fits */
  color: #2b2b2b;
}
.program-dropdown option[disabled][selected] {
  color: #e52e71; /* or #999 or a color matching your design */
  font-weight: 500;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}

.school-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.2rem;
}

.school-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center; /* keep headings centered */
  border: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: 0.3s;
}

.school-card .program {
  text-align: left;
}
.school-card h3 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
.school-card-link {
  text-decoration: none;
  color: inherit;
}

.school-card-link .school-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.school-card-link .school-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.school-city {
  text-align: left;
  margin-top: 0.5rem;
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

