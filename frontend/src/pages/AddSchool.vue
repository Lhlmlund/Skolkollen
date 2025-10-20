<template>
  <main class="add-school">
    <h2>🏫 Lägg till en ny skola</h2>
    <p class="intro">Fyll i uppgifterna nedan för att lägga till en skola i Skolkollen.</p>

    <form class="school-form">
      <div class="form-group">
        <label for="name">Skolans namn</label>
        <input id="name" type="text" placeholder="Ex. Sundbybergs gymnasium" />
      </div>

      <div class="form-group">
        <label for="program">Program</label>
        <input id="program" type="text" placeholder="Ex. Naturvetenskap, Teknik..." />
      </div>

      <div class="form-group">
        <label for="city">Stad</label>
        <input id="city" type="text" placeholder="Ex. Stockholm, Malmö..." />
      </div>

      <div class="form-group">
        <label for="description">Beskrivning</label>
        <textarea id="description" rows="4" placeholder="Kort beskrivning av skolan..."></textarea>
      </div>

      <button type="submit" class="submit-btn">Lägg till skola</button>
    </form>

    <router-link to="/" class="back-link">⬅ Till startsidan</router-link>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped>
.add-school {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.6s ease-in;
}

.add-school h2 {
  text-align: center;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.intro {
  text-align: center;
  color: #555;
  margin-bottom: 2rem;
  font-size: 1rem;
}

/* Form styling */
.school-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #444;
}

input, textarea {
  padding: 0.7rem 1rem;
  border: 2px solid #e52e71;
  border-radius: 9999px;
  outline: none;
  font-size: 1rem;
  transition: 0.3s;
}

textarea {
  border-radius: 16px;
  resize: none;
}

input:focus, textarea:focus {
  border-color: #ff8a00;
  box-shadow: 0 0 8px rgba(255,138,0,0.4);
}

/* Submit button */
.submit-btn {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.8rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

/* Back link */
.back-link {
  display: block;
  text-align: center;
  margin-top: 2rem;
  text-decoration: none;
  color: #e52e71;
  font-weight: 500;
  transition: 0.3s;
}

.back-link:hover {
  color: #ff8a00;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
