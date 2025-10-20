<template>
  <main class="login-page">
    <h2>Logga in</h2>
    <p class="intro">Välkommen till Skolkollen</p>

    <section class="content">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-post</label>
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
              placeholder="••••••••"
          />
        </div>

        <button type="submit">Logga in</button>
      </form>

      <p class="register-link">
        Har du inget konto?
        <router-link to="/register">Registrera dig här</router-link>
      </p>

      <router-link to="/" class="back-link">⬅ Till startsidan</router-link>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      console.log('Login with', this.email, this.password)
    }
  }
}
</script>

<style scoped>
.login-page {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.6s ease-in;
}

.login-page h2 {
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

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #555;
  font-size: 0.95rem;
}

.register-link a {
  color: #e52e71;
  font-weight: 500;
  text-decoration: none;
  transition: 0.3s;
}

.register-link a:hover {
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
  .login-page {
    padding: 1.5rem;
    margin: 1.5rem;
  }

  .login-page h2 {
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
  .login-page {
    padding: 1.2rem;
    margin: 1rem;
    border-radius: 14px;
  }

  .login-page h2 {
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
