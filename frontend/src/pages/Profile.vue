<template>
  <main class="profile-page">


    <section v-if="edit" class="content">
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Namn</label>
          <input
              type="text"
              id="name"
              v-model="name"
              required
              placeholder="{{name}}" autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label for="email">E-post (används som användarnamn)</label>
          <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="{{email}}" autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Lösenord</label>
          <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="Minst 8 tecken, 1 versal, 1 siffra"
              autocomplete="new-password"
              pattern="(?=.*[A-Z])(?=.*\d).{8,}"
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
              required placeholder="{{age}}" min="1" />
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
              placeholder="Staden du bor i"
          />
        </div>

        <button @click="sendEdit">Skicka</button>
        <button @click="toggleEdit">Avbryt</button>
      </form>
    </section>

        <section v-else class="content">
          <form>
            <div class="form-group">
              <label for="name">{{name}}</label>
            </div>

            <div class="form-group">
              <label for="email">{{email}}</label>
            </div>

            <div class="form-group">
              <label for="age">{{age}}</label>
            </div>

            <div class="form-group">
              <label for="school">{{school}}</label>
            </div>

            <div class="form-group">
              <label for="city">{{city}}</label>
            </div>

            <button>Ändra</button>
          </form>
        </section>
    <section v-if="!edit">
      <h2> Sparade skolor</h2>
    </section>
  </main>

</template>

<script>
import {getMe} from "../api/clients.js";
export default {
  name: 'Profile',
  data() {
    return {
      name: 'alex',
      email: '',
      age: '',
      school: '',
      city: '',
      edit: true,
    }
  },computed: {
    getProfile() {
      const {name, email, age, school, city} = getMe()

    }
  }, methods: {
    sendEdit(){
      this.edit = false;
    },
    toggleEdit(){
      this.edit = !this.edit
    }
  }
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
</style>
