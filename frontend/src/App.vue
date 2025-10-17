<template>
  <div id="app">
    <header>
      <h1>Skolkollen</h1>
      <nav>
        <router-link to="/">Hem</router-link> |
        <router-link to="/about">Om</router-link> |
        <router-link to="/add-school">Lägg till skola</router-link> |
        <router-link to="/school-list">Alla skolor</router-link> |
        <router-link to="/login">Logga in</router-link>
      </nav>
    </header>

    <router-view />

    <footer>
      <p>© 2025 Skolkollen</p>
    </footer>
  </div>
</template>

<script>
export default { name: 'App' }
</script>

<style>
body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  color: #2b2b2b;
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

/* Navigation */
nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  transition: all 0.3s;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Footer */
footer {
  background: linear-gradient(90deg, #e52e71, #ff8a00);
  color: white;
  text-align: center;
  padding: 1rem;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: 2rem;
  font-size: 0.95rem;
}

footer p {
  margin: 0;
  opacity: 0.9;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

router-view {
  flex-grow: 1;
}
</style>
