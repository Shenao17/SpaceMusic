/**
 * app.js
 * Controla los tres estados de la SPA: landing, solar-system, genre.
 * No hay enrutador externo: solo se alternan clases sobre las vistas.
 */

const App = (() => {
  const views = {};
  let activeGenreId = null;

  function cacheViews() {
    views.landing = document.getElementById("view-landing");
    views.solar = document.getElementById("view-solar-system");
    views.genre = document.getElementById("view-genre");
  }

  function goTo(state) {
    Object.values(views).forEach((v) => v.classList.remove("view--active"));
    if (state === "landing") views.landing.classList.add("view--active");
    if (state === "solar-system") views.solar.classList.add("view--active");
    if (state === "genre") views.genre.classList.add("view--active");
  }

  // ---------- Campo estelar ----------

  function buildStarfield() {
    const layer = document.getElementById("starfield");
    const COUNT = window.innerWidth < 700 ? 70 : 140;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < COUNT; i++) {
      const star = document.createElement("span");
      star.className = "star";
      const size = Math.random() * 1.6 + 0.6;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 6 + 4}s`;
      star.style.animationDelay = `${Math.random() * 6}s`;
      frag.appendChild(star);
    }
    layer.appendChild(frag);
  }

  // ---------- Lanzamiento ----------

  function bindLaunch() {
    const launchBtn = document.getElementById("launch-btn");
    launchBtn.addEventListener("click", () => {
      launchBtn.disabled = true;
      const landing = views.landing;
      landing.classList.add("is-launching");

      // Tras la animación del cohete, revelamos el sistema solar.
      window.setTimeout(() => {
        goTo("solar-system");
        window.setTimeout(() => {
          views.solar.classList.add("is-revealed");
        }, 30);
      }, 1900);
    });
  }

  // ---------- Sistema solar ----------

  function buildSolarSystem() {
    const field = document.getElementById("planet-field");
    field.innerHTML = "";

    GENRES.forEach((genre, i) => {
      const planet = document.createElement("button");
      planet.type = "button";
      planet.className = `planet ${genre.planetClass} planet--slot-${i}`;
      planet.setAttribute("aria-label", `Explorar ${genre.name}`);
      planet.dataset.genreId = genre.id;

      planet.innerHTML = `
        <span class="planet__body">
          <span class="planet__shade"></span>
          <span class="planet__ring"></span>
        </span>
        <span class="planet__label">
          <span class="planet__name">${genre.name}</span>
          <span class="planet__hint">Explorar</span>
        </span>
      `;

      planet.addEventListener("click", () => selectPlanet(genre.id, planet));
      field.appendChild(planet);
    });
  }

  function selectPlanet(genreId, planetEl) {
    const allPlanets = document.querySelectorAll(".planet");
    allPlanets.forEach((p) => {
      if (p !== planetEl) p.classList.add("is-fading");
    });
    planetEl.classList.add("is-warping");

    window.setTimeout(() => {
      views.solar.classList.remove("is-revealed");
      renderGenre(genreId);
      goTo("genre");
      window.setTimeout(() => {
        // Reinicia estado visual del sistema solar para la próxima visita.
        allPlanets.forEach((p) => {
          p.classList.remove("is-fading", "is-warping");
        });
      }, 50);
    }, 850);
  }

  function bindBackButton() {
    document.getElementById("back-to-system").addEventListener("click", () => {
      goTo("solar-system");
      window.setTimeout(() => {
        views.solar.classList.add("is-revealed");
      }, 30);
    });
  }

  // ---------- Vista de género ----------

  function renderGenre(genreId) {
    const genre = getGenreById(genreId);
    if (!genre) return;
    activeGenreId = genreId;

    const view = views.genre;
    view.querySelector(".genre-planet-icon").className =
      `genre-planet-icon ${genre.planetClass}`;
    view.querySelector(".genre-label").textContent = "Planeta musical";
    view.querySelector(".genre-name").textContent = genre.name.toUpperCase();
    view.querySelector(".genre-tagline").textContent = genre.tagline;

    const list = view.querySelector(".song-list");
    list.innerHTML = "";

    genre.songs.forEach((song, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "song-row";
      row.dataset.index = String(index);

      row.innerHTML = `
        <span class="song-row__index">${String(index + 1).padStart(2, "0")}</span>
        <span class="song-row__cover ${genre.planetClass}"></span>
        <span class="song-row__info">
          <span class="song-row__title">${song.title}</span>
          <span class="song-row__artist">${song.artist}</span>
        </span>
        <span class="song-row__duration">${formatDuration(song.duration)}</span>
      `;

      row.addEventListener("click", () => Player.play(genre, index));
      list.appendChild(row);
    });
  }

  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ---------- Init ----------

  function init() {
    cacheViews();
    buildStarfield();
    bindLaunch();
    buildSolarSystem();
    bindBackButton();
    Player.init();
    goTo("landing");
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
