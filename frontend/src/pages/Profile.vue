<template>
  <main class="profile-page">

    <section v-if="edit" class="content">
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="name">Namn</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label for="email">E-post (används som användarnamn)</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Lösenord</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Minst 8 tecken, 1 versal, 1 siffra"
            autocomplete="new-password"
            pattern="(?=.*[A-Z])(?=.*\\d).{8,}"
            title="Minst 8 tecken, 1 versal, 1 siffra"
          />
          <p v-if="password && !isPasswordValid" class="error">
            Lösenordet måste innehålla minst 8 tecken, en versal och en siffra.
          </p>
        </div>

        <div class="form-group">
          <label for="age">Ålder</label>
          <input
            type="number"
            id="age"
            v-model.number="age"
            required
            min="1"
          />
        </div>

        <div class="form-group">
          <label for="school">Skola (valfritt)</label>
          <input
            type="text"
            id="school"
            v-model="school"
            placeholder="Din nuvarande skola (valfritt)"
          />
        </div>

        <div class="form-group">
          <label for="city">Stad</label>
          <input
            type="text"
            id="city"
            v-model="city"
            required
          />
        </div>

        <button type="submit" :disabled="loading || !formValid">Skicka</button>
        <button @click="toggleEdit">Avbryt</button>
        <p v-if="errorMsg" class="error" aria-live="polite" style="margin-top:.75rem">{{ errorMsg }}</p>
      </form>
    </section>

    <section v-else class="content">
      <div class="profile-header">
        <img :src="avatarUrl" alt="User avatar" class="avatar" />
        <h2>{{ name }}</h2>
      </div>

      <div class="info-card">
        <h3>Information</h3>
        <ul>
          <li><strong>E-post:</strong> {{ email }}</li>
          <li><strong>Ålder:</strong> {{ age }}</li>
          <li><strong>Skola:</strong> {{ school || 'Ej angiven' }}</li>
          <li><strong>Stad:</strong> {{ city }}</li>
        </ul>
      </div>

      <!-- Senaste quiz-rekommendation -->
      <section class="quiz-card" style="background:#fff; padding:20px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.08); margin:16px 0;">
        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:8px;">Senaste rekommendation</h3>

        <div v-if="latestQuiz">
          <p style="font-size:1.05rem; margin-bottom:6px;">
            <strong>{{ latestQuiz.name || latestQuiz.result }}</strong>
            <span v-if="latestQuiz.category" style="color:#6b7280"> ({{ latestQuiz.category }})</span>
          </p>
          <p style="font-size:0.9rem; color:#6b7280;">
            {{ new Date(latestQuiz.at || latestQuiz.timestamp).toLocaleString() }}
          </p>

          <div style="margin-top:12px; display:flex; gap:10px;">
            <router-link to="/quiz" style="text-decoration:none;">Gör om quiz</router-link>
            <button @click="clearQuizCard" style="border:none; background:none; color:#b91c1c; cursor:pointer; padding:0;">
              Rensa resultat
            </button>
          </div>
        </div>

        <div v-else>
          <p>Inget sparat resultat ännu. <router-link to="/quiz">Gör quizet</router-link>.</p>
        </div>
      </section>

      <button @click="toggleEdit">Ändra</button>
    </section>

    <section v-if="!edit">
      <h2> Sparade skolor</h2>
    </section>
  </main>
</template>

<script>
import { getMe, updateUser } from "../api/clients.js"
import { getLatestQuiz, clearLatestQuiz } from "../utils/quizStore"

export default {
  name: "Profile",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      age: "",
      school: "",
      city: "",
      edit: false,
      loading: false,
      errorMsg: "",
      avatarUrl: "",
      createdAt: "",
      latestQuiz: null, // senast sparat quizresultat
    }
  },
  computed: {
    // Minst 8 tecken, minst 1 versal och 1 siffra
    isPasswordValid() {
      if (!this.password) return true
      const pattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/
      return pattern.test(this.password)
    },
    formValid() {
      return this.isPasswordValid
    },
  },
  async mounted() {
    await this.getProfile()
    this.latestQuiz = getLatestQuiz() // hämta sparat quizresultat
  },
  methods: {
    toggleEdit() {
      this.edit = !this.edit
      if (!this.edit) window.location.reload()
    },

    async getProfile() {
      try {
        const user = await getMe()
        this.name = user.name ?? ""
        this.email = user.email ?? ""
        this.age = user.age ?? ""
        this.school = user.school ?? ""
        this.city = user.city ?? ""
        this.avatarUrl = `https://ui-avatars.com/api/?name=${this.name}&background=ff8a00&color=fff`
      } catch {
        this.errorMsg = "Kunde inte hämta profil."
      }
    },

    async handleUpdate() {
      if (!this.formValid || this.loading) {
        alert("Vänligen fyll i alla obligatoriska fält korrekt.")
        return
      }

      this.errorMsg = ""
      this.loading = true

      try {
        const payload = {
          name: this.name?.trim(),
          email: this.email?.trim(),
          age: this.age ? Number(this.age) : undefined,
          school: this.school?.trim() || undefined,
          city: this.city?.trim() || undefined,
        }

        if (this.password) {
          payload.password = this.password
        }

        await updateUser(payload)
      } catch (e) {
        this.errorMsg = e instanceof Error ? e.message : "Något gick fel."
      } finally {
        this.loading = false
        await this.getProfile() // uppdatera vyn med nya värden
      }
    },

    clearQuizCard() {
      clearLatestQuiz()
      this.latestQuiz = null
    },
  },
}
</script>

<style scoped>
.profile-page {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.6s ease-in;
}

.content {
  max-width: 400px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: 0.2s;
  outline: none;
}

button {
  padding: 0.7rem 1.4rem;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  object-fit: cover;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  padding: 1.5rem;
  animation: fadeIn 0.5s ease-in-out;
}
</style>
