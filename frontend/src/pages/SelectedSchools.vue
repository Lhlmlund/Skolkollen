<template>
  <main class="selected-schools">
    <h2>Utvalda skolor</h2>
    <p class="intro">Här hittar du ett urval av skolor med detaljerad information.</p>

    <section class="selected-schools">
      <router-link
          v-for="school in schools"
          :key="school.id"
          :to="'/school/' + school.id" class="school-card-link">
        <div class="school-card">
          <h3>{{ school.name }}</h3>
          <p><strong>Stad:</strong> {{ school.city }}</p>
        </div>
      </router-link>
    </section>

    <router-link to="/" class="back-link">⬅ Till startsidan</router-link>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const schools = ref([
  {
    id: 1,
    name: 'Bernadottegymnasiet',
    city: 'Stockholm',
    student_count: 500,
    merit_value: 220,
    website: 'https://bernadottegymnasiet.se',
    description: 'En unik skola som kombinerar ledarskap, hälsa och samhällsutveckling.',
    programs: ['Samhällsvetenskapsprogrammet', 'Barn- och fritidsprogrammet'],
    image_url: 'images/bernadotte.jpg'
        },
  {
    id: 2,
    name: 'Burgårdens Gymnasium',
    city: 'Göteborg',
    student_count: 950,
    merit_value: 225,
    website: 'https://goteborg.se/burgarden',
    description: 'En kreativ och inkluderande skola i centrala Göteborg.',
    programs: ['Vård- och omsorgsprogrammet', 'Hantverksprogrammet'],
    image_url: 'images/burgarden.jpg'
  },
  {
    id: 3,
    name: 'CyberGymnasiet Stockholm',
    city: 'Stockholm',
    student_count: 850,
    merit_value: 230,
    website: 'https://cybergymnasiet.se',
    description: 'En modern skola med fokus på teknik och kreativitet.',
    programs: ['Teknikprogrammet', 'Estetiska programmet'],
    image_url: 'images/cyber.jpg'
  },
  {
    id: 4,
    name: 'Drottning Blankas Gymnasieskola',
    city: 'Helsingborg',
    student_count: 800,
    merit_value: 230,
    website: 'https://dbgy.se/helsingborg',
    description: 'En skola som sätter elevernas utveckling och framtid i centrum.',
    programs: ['Samhällsvetenskapsprogrammet', 'Ekonomiprogrammet'],
    image_url: 'images/dbgy.jpg'
  },
  {
    id: 5,
    name: 'Göteborgs Högre Samskola',
    city: 'Göteborg',
    student_count: 900,
    merit_value: 250,
    website: 'https://samskolan.se',
    description: 'En anrik gymnasieskola med höga ambitioner.',
    programs: ['Naturvetenskapsprogrammet', 'Samhällsvetenskapsprogrammet'],
    image_url: 'images/samskolan.jpg'
  },
  {
    id: 6,
    name: 'Hagagymnasiet',
    city: 'Norrköping',
    student_count: 700,
    merit_value: 225,
    website: 'https://hagagymnasiet.norrkoping.se',
    description: 'En skola med brett programutbud och stark gemenskap.',
    programs: ['Ekonomiprogrammet', 'Samhällsvetenskapsprogrammet'],
    image_url: 'images/haga.jpg'
  },
  {
    id: 7,
    name: 'Karlstads Fria Läroverk',
    city: 'Karlstad',
    student_count: 750,
    merit_value: 225,
    website: 'https://klarverket.se',
    description: 'Idrott och studier i en inspirerande miljö.',
    programs: ['Idrottsprogrammet', 'Naturvetenskapsprogrammet'],
    image_url: 'images/karlstad_fria.jpg'
  },
  {
    id: 8,
    name: 'Linköpings Idrottsgymnasium',
    city: 'Linköping',
    student_count: 500,
    merit_value: 215,
    website: 'https://linkopingsidrottsgymnasium.se',
    description: 'En skola för idrottsintresserade elever som vill nå toppen.',
    programs: ['Barn- och fritidsprogrammet', 'Samhällsvetenskapsprogrammet'],
    image_url: 'images/linkoping_idrott.jpg'
  },
  {
    id: 9,
    name: 'Luleå Gymnasium Hackspetten',
    city: 'Luleå',
    student_count: 600,
    merit_value: 220,
    website: 'https://luleagymnasieskola.se',
    description: 'En innovativ skola med fokus på teknik och miljö.',
    programs: ['Teknikprogrammet', 'Naturvetenskapsprogrammet'],
    image_url: 'images/lulea_hackspetten.jpg'
  },
  {
    id: 10,
    name: 'Lunds Fordonstekniska Gymnasium',
    city: 'Lund',
    student_count: 600,
    merit_value: 210,
    website: 'https://lfglund.se',
    description: 'Praktiskt inriktad skola för dig som älskar fordon och teknik.',
    programs: ['Fordon- och transportprogrammet', 'Industritekniska programmet'],
    image_url: 'images/lund_fordon.jpg'
  },
  {
    id: 11,
    name: 'Malmö Latinskola',
    city: 'Malmö',
    student_count: 1200,
    merit_value: 240,
    website: 'https://malmolatinskola.se',
    description: 'En traditionsrik skola med stark betoning på kultur och språk.',
    programs: ['Samhällsvetenskapsprogrammet', 'Estetiska programmet'],
    image_url: 'images/malmo_latinskola.jpg'
  },
  {
    id: 12,
    name: 'NTI Vetenskapsgymnasiet Gävle',
    city: 'Gävle',
    student_count: 550,
    merit_value: 235,
    website: 'https://nti.se/gavle',
    description: 'Ett modernt gymnasium med fokus på teknik och vetenskap.',
    programs: ['Teknikprogrammet', 'Naturvetenskapsprogrammet'],
    image_url: 'images/nti_gavle.jpg'
  },
  {
    id: 13,
    name: 'Realgymnasiet Örebro',
    city: 'Örebro',
    student_count: 500,
    merit_value: 220,
    website: 'https://realgymnasiet.se/orebro',
    description: 'En personlig skola med fokus på lärande genom upplevelser.',
    programs: ['Naturbruksprogrammet', 'Teknikprogrammet'],
    image_url: 'images/real_orebro.jpg'
  },
  {
    id: 14,
    name: 'Sjölins Gymnasium',
    city: 'Göteborg',
    student_count: 700,
    merit_value: 240,
    website: 'https://sjolinsgymnasium.se/goteborg',
    description: 'En modern gymnasieskola med fokus på casebaserat lärande.',
    programs: ['Ekonomiprogrammet', 'Samhällsvetenskapsprogrammet'],
    image_url: 'images/sjolins.jpg'
  },
  {
    id: 15,
    name: 'Skvaderns Gymnasieskola',
    city: 'Sundsvall',
    student_count: 650,
    merit_value: 235,
    website: 'https://skvadern.nu',
    description: 'En fristående gymnasieskola med fokus på kunskap och kreativitet.',
    programs: ['Naturvetenskapsprogrammet', 'Samhällsvetenskapsprogrammet'],
    image_url: 'images/skvadern.jpg'
  },
  {
    id: 16,
    name: 'Södra Latins gymnasium',
    city: 'Stockholm',
    student_count: 1150,
    merit_value: 260,
    website: 'https://sodralatin.stockholm.se',
    description: 'En välkänd skola med lång tradition inom musik och kultur.',
    programs: ['Estetiska programmet', 'Humanistiska programmet'],
    image_url: 'images/sodra_latin.jpg'
  },
  {
    id: 17,
    name: 'Teknikum Gymnasieskola',
    city: 'Växjö',
    student_count: 900,
    merit_value: 240,
    website: 'https://teknikum.se',
    description: 'Ett tekniskt gymnasium med framtidsfokus.',
    programs: ['Teknikprogrammet', 'El- och energiprogrammet'],
    image_url: 'images/teknikum.jpg'
  },
  {
    id: 18,
    name: 'Uppsala Katedralskola',
    city: 'Uppsala',
    student_count: 1100,
    merit_value: 255,
    website: 'https://katedralskolan.uppsala.se',
    description: 'Sveriges äldsta gymnasium med fokus på akademisk excellens.',
    programs: ['Naturvetenskapsprogrammet', 'Humanistiska programmet'],
    image_url: 'images/uppsala_katedral.jpg'
  },
  {
    id: 19,
    name: 'Wisbygymnasiet',
    city: 'Visby',
    student_count: 900,
    merit_value: 230,
    website: 'https://gotland.se/wisbygymnasiet',
    description: 'En stor skola på Gotland med brett utbud av program.',
    programs: ['Ekonomiprogrammet', 'Naturvetenskapsprogrammet'],
    image_url: 'images/wisby.jpg'
  },
  {
    id: 20,
    name: 'Östra Real',
    city: 'Stockholm',
    student_count: 1050,
    merit_value: 245,
    website: 'https://ostrereal.stockholm.se',
    description: 'En klassisk gymnasieskola i hjärtat av Stockholm med stark akademisk tradition.',
    programs: ['Samhällsvetenskapsprogrammet', 'Ekonomiprogrammet'],
    image_url: 'images/ostra_real.jpg'
  }
])
</script>

<style scoped>
.selected-schools {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.6s ease-in;
}

.selected-schools h2 {
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
