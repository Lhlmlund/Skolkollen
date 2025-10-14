<template>
  <main class="home">

    <!-- Slogan / tagline -->
    <section class="tagline">
      <p>Välj rätt, börja rätt – din väg till gymnasiet</p>
    </section>

    <!-- Search section -->
    <section class="search">
      <input type="text" placeholder="Sök gymnasium eller program..." />
      <button class="search-btn">Sök</button>
    </section>

    <!-- Filter buttons -->
    <section class="filters">
      <button>Alla</button>
      <button>Natur</button>
      <button>El</button>
      <button>Samhäll</button>
      <button>Fordon</button>
    </section>

    <!-- School cards -->
    <section class="school-list">
      <div class="school-card">Skolans namn och info om skolan</div>
      <div class="school-card">Skolans namn och info om skolan</div>
      <div class="school-card">Lista på ev. öppethus</div>
    </section>
  </main>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.home {
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  min-height: 100vh;
}

/* Tagline */
.tagline {
  margin: 2rem 0;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2b2b2b;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeIn 1s ease-in;
}

/* Search section */
.search {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.search input {
  width: 320px;
  padding: 0.7rem 1rem;
  border: 2px solid #e52e71;
  border-radius: 9999px;
  outline: none;
  transition: 0.3s;
  font-size: 1rem;
}

.search input:focus {
  border-color: #ff8a00;
  box-shadow: 0 0 10px #ffd1dc;
}

.search-btn {
  padding: 0.7rem 1.4rem;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.search-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Filters */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.filters button {
  background: white;
  border: 2px solid #e52e71;
  border-radius: 9999px;
  padding: 0.4rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.filters button:hover {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  transform: translateY(-2px);
}

/* School cards */
.school-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
  padding: 0 1rem;
}

.school-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: 0.3s;
}

.school-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

