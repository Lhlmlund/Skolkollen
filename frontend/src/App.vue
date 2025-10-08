<template>
  <div id="app">
    <header>
      <h1>Skolkollen</h1>
      <nav>
        <router-link to="/">Hem</router-link> |
        <router-link to="/about">Om</router-link> |
        <router-link to="/add-school">Lägg till skola</router-link>
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
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}
header, footer {
  padding: 1rem;
  background: #e5e7eb;
  text-align: center;
}
nav a {
  margin: 0 1rem;
  text-decoration: none;
}
</style>
