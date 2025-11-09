<template>
  <div id="app">
    <header>
      <h1>Skolkollen</h1>
     <nav class="navbar">
  <div class="nav-list">
    <router-link to="/" exact-active-class="active" class="pill">Hem</router-link>
    <router-link to="/about" exact-active-class="active" class="pill">Om</router-link>
    <router-link to="/school-list" exact-active-class="active" class="pill">Alla skolor</router-link>
    <router-link to="/selected-schools" exact-active-class="active" class="pill">Utvalda skolor</router-link>
    <router-link to="/quiz" exact-active-class="active" class="pill">Quiz</router-link>

    <router-link v-if="isUser" to="/profile" exact-active-class="active" class="pill">Mina sidor</router-link>
    <router-link v-if="!isUser" to="/login" exact-active-class="active" class="pill">Logga in</router-link>
    <a v-if="isUser" @click="logOut" class="pill pill-outline">Logga ut</a>
  </div>
</nav>

    </header>

    <!-- Main content area that grows -->
    <main>
      <router-view />
    </main>

    <footer>
      <p>© 2025 Skolkollen</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isUser: ''
    }
  },mounted() {
    // this should in the future check for a valid token and not just a token
    const token = localStorage.getItem("token");
    if (token) {
      this.isUser = true;
    }
  },
  methods: {
    logOut() {
      localStorage.clear()
      this.$router.push('/')
      this.isUser = false
    },
  }
}

</script>

<style>
body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  color: #2b2b2b;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
header {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  text-align: center;
  padding: 1.2rem 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

header h1 {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  letter-spacing: 1px;
}

/* Navigation Pills */
.navbar {
  display: flex;
  justify-content: center;
  padding: 14px 12px;
}

.nav-list {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  line-height: 1;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.18);
  color: #fff;
  backdrop-filter: blur(6px);
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease, color .12s ease;
}

.pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0,0,0,.15);
  background: rgba(255,255,255,0.28);
}

.pill.active {
  border-color: transparent;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  box-shadow: 0 10px 22px rgba(229,46,113,.28);
}

.pill-outline {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.55);
  color: #fff;
}

.pill-outline:hover {
  background: rgba(255,255,255,0.15);
}

/* Main */
main {
  flex: 1;
  padding: 2rem;
}

/* Sticky Footer */
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(90deg, #e52e71, #ff8a00);
  color: white;
  text-align: center;
  padding: 1rem;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  font-size: 0.95rem;
  z-index: 10;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
}

footer p {
  margin: 0;
  opacity: 0.9;
}
</style>
