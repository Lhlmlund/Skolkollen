<template>
  <main class="school-list-page">
    <h2>Alla skolor</h2>
    <p class="intro">Här ser du alla skolor som finns registrerade i Skolkollen.</p>

    <div v-if="loading" class="loading">Laddar skolor...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

<section v-else class="school-list">
  <router-link
    v-for="school in schools"
    :key="school.id"
    :to="{ name: 'school-detail', params: { id: school.id } }"
    class="school-card-link"
  >
    <div class="school-card">
      <h3>{{ school.name }}</h3>

      <!-- City -->
      <p class="city"><strong>Stad:</strong> {{ school.city || 'Okänd' }}</p>

      <!-- Programs (supports both shapes: string[] or [{ program: {...} }]) -->
      <div class="program" v-if="hasAnyProgram(school)">
        <p><strong>Program:</strong></p>
        <ul>
          <li v-for="(p, i) in normalizedPrograms(school)" :key="p.id || p.name || i">
            {{ p.name }}
          </li>
        </ul>
      </div>
      <p v-else class="program"><strong>Program:</strong> Ingen information</p>

      <!-- Description: prefer school.description, else first non-empty program.description -->
      <p class="desc">
        {{
          school.description
            ?? firstProgramDescription(school)
            ?? 'Ingen beskrivning tillgänglig.'
        }}
      </p>
    </div>
  </router-link>
</section>


    <router-link to="/" class="back-link">⬅ Till startsidan</router-link>
  </main>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchGymnasiumSchools } from '../api/clients.js' //keep relative path

const schools = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const hasAnyProgram = (school) => {
  const progs = school?.programs;
  if (!Array.isArray(progs) || progs.length === 0) return false;
  // strings OR objects with program.name
  return progs.some(p => typeof p === 'string' || p?.program?.name || p?.name);
};

const normalizedPrograms = (school) => {
  const progs = Array.isArray(school?.programs) ? school.programs : [];
  // Normalize to { id?, name, description? }
  return progs.map(p => {
    if (typeof p === 'string') return { name: p };
    if (p?.program) {
      return {
        id: p.program.id,
        name: p.program.name,
        description: p.program.description ?? null,
      };
    }
    // already flat object { id?, name?, description? }
    return {
      id: p?.id,
      name: p?.name ?? '',
      description: p?.description ?? null,
    };
  }).filter(x => x.name);
};

const firstProgramDescription = (school) => {
  const first = normalizedPrograms(school).find(p => p.description && p.description.trim().length > 0);
  return first?.description ?? null;
};

onMounted(async () => {
  try {
    const res = await fetchGymnasiumSchools()
    // safety client-side filter in case backend returns extra
    schools.value = (Array.isArray(res) ? res : []).filter(s => s.is_gymnasium === true)
  } catch (e) {
    error.value = e?.message ?? 'Kunde inte hämta skolor.'
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
