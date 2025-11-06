<template>
  <main class="about-page">
    <h2>Om Skolkollen</h2>
    <p class="intro">Välj rätt, börja rätt – din väg till gymnasiet</p>

    <section class="content">
      <p>
        Skolkollen är en digital plattform som hjälper dig som går i högstadiet att hitta rätt gymnasieutbildning.
        Vi vet att gymnasievalet kan kännas både stressigt och förvirrande – det är ett stort beslut, och det finns många alternativ att välja mellan.
        Därför har vi skapat Skolkollen: en plats där du enkelt kan hitta, jämföra och utforska gymnasieskolor och program på ett överskådligt sätt.
      </p>

      <h3>Vår vision</h3>
      <p>
        Vi vill göra gymnasievalet enklare, tryggare och mer informerat för alla elever.
        Med smarta verktyg, tydlig information och uppdaterade resurser hoppas vi kunna minska stressen
        och göra beslutsprocessen mer självklar.
      </p>

      <h3>Vad du hittar på Skolkollen</h3>
      <ul>
        <li><strong>Smarta sökverktyg</strong> som hjälper dig att filtrera skolor och program utifrån dina intressen.</li>
        <li><strong>En komplett skolöversikt</strong> med info om program, inriktningar, profiler och behörigheter.</li>
        <li><strong>Aktuell information om öppet hus</strong> – så att du kan planera dina besök och få en känsla för skolorna innan du väljer.</li>
      </ul>

      <h3>För vem?</h3>
      <p>
        Skolkollen är utvecklat främst för dig som går i årskurs 9,
        men kan också vara till hjälp för föräldrar, SYV:are och andra som vill stötta i valet till gymnasiet.
      </p>

      <blockquote>
        <strong>Skolkollen är inte en officiell myndighetssida</strong>,
        men ett komplement till informationen från SYV och Skolverket.
        Vårt mål är att göra den information du behöver mer lättillgänglig och anpassad efter dina behov.
      </blockquote>

      <router-link to="/" class="back-link">⬅ Till startsidan</router-link>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.6s ease-in;
}

.about-page h2 {
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

.content h3 {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.3rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.content p {
  color: #444;
  line-height: 1.7;
  margin-bottom: 1.2rem;
  font-size: 1rem;
}

.content ul {
  list-style: disc;
  margin-left: 1.5rem;
  color: #444;
  margin-bottom: 1.5rem;
}

.content li {
  margin-bottom: 0.5rem;
}

blockquote {
  border-left: 4px solid #e52e71;
  background: #fff5f8;
  padding: 1.2rem 1.5rem;
  border-radius: 10px;
  font-style: italic;
  color: #555;
  margin: 2rem 0;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .about-page {
    padding: 1.5rem;
    margin: 1.5rem;
  }

  .about-page h2 {
    font-size: 1.7rem;
  }

  .content h3 {
    font-size: 1.2rem;
  }

  .content p,
  .content li,
  .intro {
    font-size: 0.95rem;
  }

  blockquote {
    padding: 1rem 1.2rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .about-page {
    padding: 1.2rem;
    margin: 1rem;
    border-radius: 14px;
  }

  .about-page h2 {
    font-size: 1.5rem;
  }

  .content h3 {
    font-size: 1.1rem;
  }

  .content p,
  .intro {
    font-size: 0.9rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>