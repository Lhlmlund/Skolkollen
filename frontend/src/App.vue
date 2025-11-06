<template>
  <div id="app">
    <header class="site-header">
      <h1>Skolkollen</h1>
      <nav class="site-nav" aria-label="Huvudnavigation">
        <router-link to="/" exact-active-class="active" class="nav-link">Hem</router-link>
        <router-link to="/about" exact-active-class="active" class="nav-link">Om</router-link>
        <router-link to="/school-list" exact-active-class="active" class="nav-link">Alla skolor</router-link>
        <router-link to="/selected-schools" exact-active-class="active" class="nav-link">Utvalda skolor</router-link>
        <!-- ✅ Quiz-knappen i samma stil -->
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
// RouterLink/RouterView är globala – inget behövs här
</script>

<style scoped>
/* —— Header + titel —— */
.site-header {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: #fff;
  text-align: center;
  padding: 28px 16px 36px;
}
.site-header h1 {
  margin: 0 0 12px 0;
  font-size: 2.75rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: .5px;
  color: #fff;
}

/* —— Navbar: pillerknappar, samma känsla som tidigare —— */
.site-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;               /* gör att inget klipps bort om det blir trångt */
  margin: 6px auto 0;
}
.nav-link {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  text-decoration: none;
  color: #ffffff;
  background: rgba(255,255,255,0.28);
  box-shadow: 0 6px 18px rgba(0,0,0,.12);
  transition: transform .15s ease, background .15s ease, color .15s ease;
}
.nav-link:hover {
  transform: translateY(-1px);
  background: rgba(255,255,255,0.38);
}
/* aktiv: fylld knapp med varmare ton (som dina tidigare knappar) */
.nav-link.active {
  color: #fff;
  background: linear-gradient(45deg, #ff9a3d, #ff4f7a);
}

/* —— Main + footer —— */
.site-main {
  min-height: 60vh;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  padding: 12px 16px 28px;
}
.site-footer {
  text-align: center;
  padding: 14px 10px;
  color: #fff;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
}
.site-footer p { margin: 0; }
</style>
