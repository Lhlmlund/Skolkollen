<template>
  <div id="app">
    <header class="site-header">
      <h1>Skolkollen</h1>
      <nav class="site-nav" aria-label="Huvudnavigation">
        <router-link to="/" exact-active-class="active" class="nav-link">Hem</router-link>
        <router-link to="/about" exact-active-class="active" class="nav-link">Om</router-link>
        <router-link to="/school-list" exact-active-class="active" class="nav-link">Alla skolor</router-link>
        <router-link to="/selected-schools" exact-active-class="active" class="nav-link">Utvalda skolor</router-link>
        <!-- ✅ NY KNAPP -->
        <router-link to="/quiz" exact-active-class="active" class="nav-link">Quiz</router-link>
        <router-link to="/login" exact-active-class="active" class="nav-link">Logga in</router-link>
      </nav>
    </header>

    <main class="site-main">
      <router-view />
    </main>

    <footer class="site-footer">
      <p>© 2025 Skolkollen</p>
    </footer>
  </div>
</template>

<script setup>
// RouterLink/RouterView är globala i Vue 3 – inget behövs här
</script>

<style>
/* Bas */
* { box-sizing: border-box; }
html, body, #app { height: 100%; }
body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  color: #2b2b2b;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
.site-header {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: #fff;
  text-align: center;
  padding: 1.2rem 0 0.9rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
.site-header h1 {
  font-size: 1.8rem;
  margin: 0 0 0.6rem 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Nav */
.site-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 0 1rem 0.3rem;
}
.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  background: rgba(255,255,255,0.15);
  padding: 0.42rem 0.9rem;
  border-radius: 9999px;
  transition: transform .2s, background .2s, box-shadow .2s;
}
.nav-link:hover {
  background: rgba(255,255,255,0.28);
  transform: translateY(-1px);
}
.nav-link.active {
  background: rgba(255,255,255,0.38);
  box-shadow: 0 3px 10px rgba(0,0,0,0.12);
}

/* Main – lägger extra bottenmarginal så sticky footer inte täcker innehåll */
.site-main {
  flex: 1;
  padding: 2rem 1.25rem 6.5rem; /* extra padding-bottom ≈ footerhöjd */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Footer (sticky) */
.site-footer {
  position: fixed;
  bottom: 0; left: 0; width: 100%;
  background: linear-gradient(90deg, #e52e71, #ff8a00);
  color: #fff;
  text-align: center;
  padding: 1rem;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  font-size: 0.95rem;
  z-index: 10;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.08);
}
.site-footer p { margin: 0; opacity: 0.9; }

/* Små skärmar */
@media (max-width: 420px) {
  .site-header h1 { font-size: 1.4rem; }
  .nav-link { padding: 0.36rem 0.75rem; font-size: 0.95rem; }
  .site-main { padding: 1.25rem 1rem 6.5rem; }
}
</style>
