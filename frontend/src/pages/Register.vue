<template>
  <main class="register-page">
    <h2>Registrera konto</h2>
    <p class="intro">Skapa ett konto för att komma igång med Skolkollen</p>

    <section class="content">
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="namn">Namn</label>
          <input
              type="text"
              id="name"
              v-model="name"
              required
              placeholder="john doe"
          />
        </div>

        <div class="form-group">
          <label for="email">E-post (används som användarnamn)</label>
          <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="din@epost.se"
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
              v-model="age"
              required
              placeholder="Ange din ålder"
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
              placeholder="Staden du bor i"
          />
        </div>

        <button type="submit" :disabled="!formValid">Registrera</button>
      </form>

      <p class="login-link">
        Har du redan ett konto?
        <router-link to="/login">Logga in här</router-link>
      </p>

      <router-link to="/" class="back-link">⬅ Till startsidan</router-link>
    </section>
  </main>
</template>

<script>
import {register} from "../api/clients.js";

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      age: '',
      school: '',
      city: ''
    }
  },
  computed: {
    isPasswordValid() {
      const pattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/
      return pattern.test(this.password)
    },
    formValid() {
      return (
          this.name &&
          this.email &&
          this.age &&
          this.city &&
          this.isPasswordValid
      )
    }
  },
  methods: {
    handleRegister() {
      if (!this.formValid) {
        alert('Vänligen fyll i alla obligatoriska fält korrekt.')
        return
      }

      // Example output (replace with API call)
      register(this. name, this.email, this.password, this.age, this.school, this.city)

      alert('Registrering lyckades! Du kan nu logga in.')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-page {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.6s ease-in;
}

.register-page h2 {
  text-align: center;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.intro {
  text-align: center;
  color: #555;
  font-weight: 500;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.content {
  max-width: 400px;
  margin: 0 auto;
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

input:focus {
  border-color: #e52e71;
  box-shadow: 0 0 0 3px rgba(229, 46, 113, 0.15);
}

button {
  width: 100%;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.8rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #e52e71;
  font-size: 0.9rem;
  margin-top: 0.4rem;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #555;
  font-size: 0.95rem;
}

.login-link a {
  color: #e52e71;
  font-weight: 500;
  text-decoration: none;
  transition: 0.3s;
}

.login-link a:hover {
  color: #ff8a00;
}

.back-link {
  display: block;
  text-align: center;
  text-decoration: none;
  color: #e52e71;
  font-weight: 500;
  margin-top: 2rem;
  transition: 0.3s;
}

.back-link:hover {
  color: #ff8a00;
}

/* Responsive */
@media (max-width: 768px) {
  .register-page {
    padding: 1.5rem;
    margin: 1.5rem;
  }

  .register-page h2 {
    font-size: 1.7rem;
  }

  .intro {
    font-size: 0.95rem;
  }

  input,
  button {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .register-page {
    padding: 1.2rem;
    margin: 1rem;
    border-radius: 14px;
  }

  .register-page h2 {
    font-size: 1.5rem;
  }

  .intro {
    font-size: 0.9rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
