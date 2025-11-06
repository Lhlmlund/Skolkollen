<template>
  <section class="page">
    <div class="content-card">
      <h2>Alla skolor</h2>
      <p>Här ser du alla skolor som finns registrerade i Skolkollen.</p>

      <div v-if="schools.length === 0" class="error">Inga skolor att visa.</div>

      <ul style="list-style: none; padding: 0; margin: 16px 0 0 0;">
        <li
          v-for="s in schools"
          :key="s.id"
          style="background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.06);"
        >
          <h3 style="margin: 0 0 6px 0">{{ s.name }}</h3>
          <p style="margin: 0 0 6px 0"><strong>Stad:</strong> {{ s.city }}</p>
          <p style="margin: 0"><strong>Program:</strong> {{ s.programs.join(', ') }}</p>
        </li>
      </ul>

      <router-link to="/" class="back-link" style="display:inline-block; margin-top:12px;">
        ← Till startsidan
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Samma offline-data som på Hem
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
</script>

<style scoped>
.school-list-page {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.school-card {
  background: linear-gradient(135deg, #fdfbfb 0%, #f1f1f1 100%);
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.school-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.school-card * {
  box-shadow: none;
  border: none;
  background: transparent;
}

.school-card h3 {
  margin-top: 0;
  color: black;
  border-bottom: 2px solid #e52e71!important;
  padding-bottom: 0.4rem;
  margin-bottom: 0.8rem;
}
.school-card-link {
  text-decoration: none;
  color: inherit;
}

.school-card,
.school-card * {
  border: none !important;
  box-shadow: none !important;
}
.school-card a {
  color: #3366cc !important;
}
.school-card a:hover {
  color: #e52e71 !important;
  text-decoration: underline !important;
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
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
