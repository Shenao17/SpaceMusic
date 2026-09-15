/**
 * app.js
 * Controla los tres estados de la SPA:
 * landing, solar-system y genre.
 *
 * No hay enrutador externo:
 * las vistas se alternan mediante clases CSS.
 */

const App = (() => {
  const views = {};

  let activeGenreId = null;
  let isLaunching = false;

window.resetSpaceMusicLaunch = () => {
  isLaunching = false;
  console.log("🚀 Estado de lanzamiento reiniciado:", isLaunching);
};

  // =========================================================
  // VISTAS
  // =========================================================

function cacheViews() {
  views.landing = document.getElementById("view-landing");
  views.landingStage = views.landing.querySelector(".landing");

  views.solar = document.getElementById("view-solar-system");
  views.genre = document.getElementById("view-genre");
}

  function goTo(state) {
    Object.values(views).forEach((view) => {
      if (view) {
        view.classList.remove("view--active");
      }
    });

    if (state === "landing" && views.landing) {
      views.landing.classList.add("view--active");
    }

    if (state === "solar-system" && views.solar) {
      views.solar.classList.add("view--active");
    }

    if (state === "genre" && views.genre) {
      views.genre.classList.add("view--active");
    }
  }

  // =========================================================
  // CAMPO ESTELAR
  // =========================================================

  function buildStarfield() {
    const layer = document.getElementById("starfield");

    if (!layer) return;

    const COUNT = window.innerWidth < 700 ? 70 : 140;
    const frag = document.createDocumentFragment();

    layer.innerHTML = "";

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

  // =========================================================
  // LANZAMIENTO
  // =========================================================

  function bindLaunch() {
    const launchBtn = document.getElementById("launch-btn");

    if (!launchBtn) {
      console.warn("SpaceMusic: no se encontró #launch-btn.");
      return;
    }

    /*
     * Usamos onclick directamente para que el botón tenga
     * siempre una referencia clara a la secuencia de lanzamiento.
     *
     * Al asignarlo nuevamente evitamos acumular listeners
     * si App.init() vuelve a ejecutarse.
     */
    launchBtn.onclick = startLaunchSequence;
  }

  function startLaunchSequence() {
    if (isLaunching) return;

    const landing = views.landingStage;
    const launchBtn = document.getElementById("launch-btn");

    if (!landing || !launchBtn) {
      console.warn("SpaceMusic: no se pudo iniciar el lanzamiento.");
      return;
    }

    isLaunching = true;

    const buttonLabel = launchBtn.querySelector(".launch-btn__label");

    // -------------------------------------------------------
    // Preparar botón
    // -------------------------------------------------------

    launchBtn.disabled = true;
    launchBtn.classList.add("is-igniting");

    if (buttonLabel) {
      buttonLabel.textContent = "IGNICIÓN...";
    }

    // -------------------------------------------------------
    // FASE 1 — Ignición
    // -------------------------------------------------------

    window.setTimeout(() => {
      landing.classList.add("is-launching");
    }, 220);

    // -------------------------------------------------------
    // FASE 2 — Despegue
    // -------------------------------------------------------

    window.setTimeout(() => {
      landing.classList.add("is-liftoff");
    }, 700);

    // -------------------------------------------------------
    // FASE 3 — Warp
    // -------------------------------------------------------

    window.setTimeout(() => {
      landing.classList.add("is-warping");
    }, 1750);

    // -------------------------------------------------------
    // FASE 4 — Sistema solar
    // -------------------------------------------------------

    window.setTimeout(() => {
      goTo("solar-system");

      /*
       * Reiniciamos la animación de entrada del sistema solar
       * para que pueda reproducirse correctamente.
       */
      if (views.solar) {
        views.solar.classList.remove("is-revealed");

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            views.solar.classList.add("is-revealed");
          });
        });
      }

      /*
       * Dejamos la landing limpia para un posible regreso
       * futuro.
       */
      window.setTimeout(() => {
        landing.classList.remove(
          "is-launching",
          "is-liftoff",
          "is-warping"
        );

        launchBtn.classList.remove("is-igniting");

        if (buttonLabel) {
          buttonLabel.textContent = "DESPEGAR";
        }

        launchBtn.disabled = false;

        isLaunching = false;
      }, 100);
    }, 2350);
  }

  // =========================================================
  // SISTEMA SOLAR
  // =========================================================

  function buildSolarSystem() {
    const field = document.getElementById("planet-field");

    if (!field) return;

    field.innerHTML = "";

    GENRES.forEach((genre, i) => {
      const planet = document.createElement("button");

      planet.type = "button";

      planet.className =
        `planet ${genre.planetClass} planet--slot-${i}`;

      planet.setAttribute(
        "aria-label",
        `Explorar ${genre.name}`
      );

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

      planet.addEventListener("click", () => {
        selectPlanet(genre.id, planet);
      });

      field.appendChild(planet);
    });
  }

  function selectPlanet(genreId, planetEl) {
    const allPlanets =
      document.querySelectorAll(".planet");

    allPlanets.forEach((planet) => {
      if (planet !== planetEl) {
        planet.classList.add("is-fading");
      }
    });

    planetEl.classList.add("is-warping");

    window.setTimeout(() => {
      if (views.solar) {
        views.solar.classList.remove("is-revealed");
      }

      renderGenre(genreId);
      goTo("genre");

      window.setTimeout(() => {
        allPlanets.forEach((planet) => {
          planet.classList.remove(
            "is-fading",
            "is-warping"
          );
        });
      }, 50);
    }, 850);
  }

  function bindBackButton() {
    const backButton =
      document.getElementById("back-to-system");

    if (!backButton) return;

    backButton.onclick = () => {
      goTo("solar-system");

      window.setTimeout(() => {
        if (views.solar) {
          views.solar.classList.add("is-revealed");
        }
      }, 30);
    };
  }

  // =========================================================
  // VISTA DE GÉNERO
  // =========================================================

  function renderGenre(genreId) {
    const genre = getGenreById(genreId);

    if (!genre || !views.genre) return;

    activeGenreId = genreId;

    const view = views.genre;

    const planetIcon =
      view.querySelector(".genre-planet-icon");

    const genreLabel =
      view.querySelector(".genre-label");

    const genreName =
      view.querySelector(".genre-name");

    const genreTagline =
      view.querySelector(".genre-tagline");

    const list =
      view.querySelector(".song-list");

    if (!planetIcon || !genreLabel || !genreName ||
        !genreTagline || !list) {
      return;
    }

    planetIcon.className =
      `genre-planet-icon ${genre.planetClass}`;

    genreLabel.textContent =
      "Planeta musical";

    genreName.textContent =
      genre.name.toUpperCase();

    genreTagline.textContent =
      genre.tagline;

    list.innerHTML = "";

    genre.songs.forEach((song, index) => {
      const row = document.createElement("button");

      row.type = "button";
      row.className = "song-row";
      row.dataset.index = String(index);

      row.innerHTML = `
        <span class="song-row__index">
          ${String(index + 1).padStart(2, "0")}
        </span>

        <span class="song-row__cover ${genre.planetClass}"></span>

        <span class="song-row__info">
          <span class="song-row__title">
            ${song.title}
          </span>

          <span class="song-row__artist">
            ${song.artist}
          </span>
        </span>

        <span class="song-row__duration">
          ${formatDuration(song.duration)}
        </span>
      `;

      row.addEventListener("click", () => {
        Player.play(genre, index);
      });

      list.appendChild(row);
    });
  }

  // =========================================================
  // UTILIDADES
  // =========================================================

  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =
      Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  // =========================================================
  // INIT
  // =========================================================

  function init() {
    cacheViews();

    buildStarfield();
    bindLaunch();
    buildSolarSystem();
    bindBackButton();

    /*
     * El reproductor ya tiene su propia lógica.
     * No modificamos nada de ella aquí.
     */
    if (typeof Player !== "undefined") {
      Player.init();
    }

    goTo("landing");
  }

  return {
    init
  };
})();

// =========================================================
// ARRANQUE DE LA APP
// =========================================================

function bootSpaceMusic() {
  App.init();
}

/*
 * Si el DOM todavía está cargándose, esperamos.
 * Si el script se ejecuta cuando el DOM ya está listo,
 * inicializamos inmediatamente.
 */
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    bootSpaceMusic,
    { once: true }
  );
} else {
  bootSpaceMusic();
}