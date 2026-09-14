/**
 * player.js
 * Controla el reproductor fijo inferior.
 *
 * Soporta dos tipos de canciones:
 * 1. Canciones con audioSrc → reproducción real mediante <audio>.
 * 2. Canciones sin audioSrc → reproducción simulada mediante contador.
 */

const Player = (() => {
  let currentGenre = null;
  let currentIndex = -1;

  let isPlaying = false;
  let elapsed = 0;
  let tickHandle = null;
  let volume = 0.7;

  // =========================
  // CONFIGURACIÓN DEL FADE
  // =========================

  const FADE_DURATION = 300;

  // Audio real del navegador.
  const audio = new Audio();
  audio.volume = volume;

  let fadeHandle = null;

  let els = {};

  function cacheEls() {
    els = {
      bar: document.getElementById("player"),
      cover: document.getElementById("player-cover"),
      title: document.getElementById("player-title"),
      artist: document.getElementById("player-artist"),
      playBtn: document.getElementById("player-play"),
      prevBtn: document.getElementById("player-prev"),
      nextBtn: document.getElementById("player-next"),
      progressFill: document.getElementById("player-progress-fill"),
      progressHandle: document.getElementById("player-progress-handle"),
      progressTrack: document.getElementById("player-progress-track"),
      timeCurrent: document.getElementById("player-time-current"),
      timeDuration: document.getElementById("player-time-duration"),
      volumeSlider: document.getElementById("player-volume"),
    };
  }

  function formatTime(seconds) {
    const safeSeconds = Number.isFinite(seconds)
      ? seconds
      : 0;

    const m = Math.floor(safeSeconds / 60);
    const s = Math.floor(safeSeconds % 60);

    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function currentSong() {
    if (!currentGenre || currentIndex < 0) {
      return null;
    }

    return currentGenre.songs[currentIndex];
  }

  function isRealAudio() {
    const song = currentSong();

    return !!(song && song.audioSrc);
  }

  // =========================
  // FADE
  // =========================

  function stopFade() {
    if (fadeHandle) {
      cancelAnimationFrame(fadeHandle);
      fadeHandle = null;
    }
  }

  function fadeVolume(
    targetVolume,
    duration = FADE_DURATION
  ) {
    stopFade();

    const startVolume = audio.volume;
    const difference =
      targetVolume - startVolume;

    const startTime = performance.now();

    return new Promise((resolve) => {
      function animate(currentTime) {
        const elapsedTime =
          currentTime - startTime;

        const progress = Math.min(
          elapsedTime / duration,
          1
        );

        // Suaviza el movimiento del volumen.
        const easedProgress =
          1 - Math.pow(1 - progress, 3);

        audio.volume =
          startVolume +
          difference * easedProgress;

        if (progress < 1) {
          fadeHandle =
            requestAnimationFrame(animate);
        } else {
          audio.volume = targetVolume;
          fadeHandle = null;
          resolve();
        }
      }

      fadeHandle =
        requestAnimationFrame(animate);
    });
  }

  // =========================
  // RENDER
  // =========================

  function render() {
    const song = currentSong();

    if (!song) return;

    els.title.textContent = song.title;
    els.artist.textContent = song.artist;

    const currentTime = isRealAudio()
      ? audio.currentTime
      : elapsed;

    const duration = isRealAudio()
      ? audio.duration || song.duration
      : song.duration;

    els.timeCurrent.textContent =
      formatTime(currentTime);

    els.timeDuration.textContent =
      formatTime(duration);

    const pct = duration > 0
      ? Math.min(
          100,
          (currentTime / duration) * 100
        )
      : 0;

    // Movimiento visual suave.
    els.progressFill.style.transition =
      "width 120ms linear";

    els.progressHandle.style.transition =
      "left 120ms linear, transform 120ms ease";

    els.progressFill.style.width =
      `${pct}%`;

    els.progressHandle.style.left =
      `${pct}%`;

    els.playBtn.classList.toggle(
      "is-playing",
      isPlaying
    );

    els.playBtn.setAttribute(
      "aria-label",
      isPlaying
        ? "Pausar"
        : "Reproducir"
    );

    els.cover.className =
      `player-cover ${currentGenre.planetClass}`;

    document
      .querySelectorAll(".song-row")
      .forEach((row) => {
        const rowIndex =
          Number(row.dataset.index);

        row.classList.toggle(
          "is-active",
          rowIndex === currentIndex
        );

        row.classList.toggle(
          "is-playing",
          rowIndex === currentIndex &&
          isPlaying
        );
      });
  }

  // =========================
  // REPRODUCCIÓN SIMULADA
  // =========================

  function tick() {
    const song = currentSong();

    if (!song) return;

    elapsed += 1;

    if (elapsed >= song.duration) {
      next();
      return;
    }

    render();
  }

  function startTicking() {
    stopTicking();

    tickHandle =
      setInterval(tick, 1000);
  }

  function stopTicking() {
    if (tickHandle) {
      clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  // =========================
  // AUDIO REAL
  // =========================

  function loadRealAudio(song) {
    stopFade();

    audio.pause();

    audio.volume = 0;
    audio.currentTime = 0;
    audio.src = song.audioSrc;

    audio.load();
  }

  async function playRealAudio() {
    try {
      audio.volume = 0;

      await audio.play();

      isPlaying = true;
      render();

      // Entra suavemente.
      await fadeVolume(volume);

    } catch (error) {
      console.error(
        "No se pudo reproducir el audio:",
        error
      );

      isPlaying = false;
      audio.volume = volume;

      render();
    }
  }

  async function pauseRealAudio() {
    // Sale suavemente.
    await fadeVolume(0);

    audio.pause();

    isPlaying = false;

    // Restauramos el volumen
    // para la próxima reproducción.
    audio.volume = volume;

    render();
  }

  // =========================
  // REPRODUCTOR
  // =========================

  function show() {
    els.bar.classList.add("is-visible");
  }

  async function play(genre, index) {
    // Detener cualquier reproducción anterior.
    stopTicking();
    stopFade();

    if (isRealAudio()) {
      await fadeVolume(0);
    }

    audio.pause();

    currentGenre = genre;
    currentIndex = index;
    elapsed = 0;
    isPlaying = true;

    const song = currentSong();

    if (!song) return;

    show();

    // Canción con MP3 real.
    if (song.audioSrc) {
      loadRealAudio(song);
      render();
      playRealAudio();
      return;
    }

    // Canción sin MP3: simulación.
    audio.volume = volume;

    startTicking();
    render();
  }

  async function togglePlay() {
    const song = currentSong();

    if (!song) return;

    if (isRealAudio()) {
      if (isPlaying) {
        await pauseRealAudio();
      } else {
        await playRealAudio();
      }

      return;
    }

    // Canción simulada.
    isPlaying = !isPlaying;

    if (isPlaying) {
      startTicking();
    } else {
      stopTicking();
    }

    render();
  }

  function next() {
    if (!currentGenre) return;

    const nextIndex =
      (currentIndex + 1) %
      currentGenre.songs.length;

    play(currentGenre, nextIndex);
  }

  function prev() {
    if (!currentGenre) return;

    const currentTime = isRealAudio()
      ? audio.currentTime
      : elapsed;

    if (currentTime > 3) {
      if (isRealAudio()) {
        audio.currentTime = 0;
      } else {
        elapsed = 0;
      }

      render();
      return;
    }

    const prevIndex =
      (currentIndex - 1 +
        currentGenre.songs.length) %
      currentGenre.songs.length;

    play(currentGenre, prevIndex);
  }

  function seekTo(clientX) {
    const song = currentSong();

    if (!song) return;

    const rect =
      els.progressTrack.getBoundingClientRect();

    const pct = Math.min(
      1,
      Math.max(
        0,
        (clientX - rect.left) /
          rect.width
      )
    );

    if (isRealAudio()) {
      const duration =
        audio.duration ||
        song.duration;

      if (Number.isFinite(duration)) {
        audio.currentTime =
          pct * duration;
      }

      render();
      return;
    }

    elapsed =
      pct * song.duration;

    render();
  }

  function setVolume(value) {
    volume = Math.min(
      1,
      Math.max(0, value)
    );

    // Actualizamos el slider visual.
    els.volumeSlider.value =
      Math.round(volume * 100);

    // Si no estamos haciendo fade,
    // aplicamos directamente el nuevo volumen.
    if (!fadeHandle) {
      audio.volume = volume;
    }
  }

  // =========================
  // CONTROLES DE TECLADO
  // =========================

  function changeVolume(amount) {
    const newVolume = Math.min(
      1,
      Math.max(
        0,
        volume + amount
      )
    );

    setVolume(newVolume);
  }

  function bindKeyboardEvents() {
    window.addEventListener(
      "keydown",
      (e) => {
        const tag =
          document.activeElement?.tagName;

        // No interferir con inputs,
        // textareas o selects.
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT"
        ) {
          return;
        }

        switch (e.code) {
          case "Space":
            e.preventDefault();
            togglePlay();
            break;

          case "ArrowLeft":
            e.preventDefault();
            prev();
            break;

          case "ArrowRight":
            e.preventDefault();
            next();
            break;

          case "ArrowUp":
            e.preventDefault();
            changeVolume(0.05);
            break;

          case "ArrowDown":
            e.preventDefault();
            changeVolume(-0.05);
            break;
        }
      }
    );
  }

  // =========================
  // EVENTOS DEL AUDIO
  // =========================

  function bindAudioEvents() {
    audio.addEventListener(
      "timeupdate",
      () => {
        if (!isRealAudio()) return;

        render();
      }
    );

    audio.addEventListener(
      "ended",
      () => {
        isPlaying = false;
        next();
      }
    );

    audio.addEventListener(
      "loadedmetadata",
      () => {
        render();
      }
    );

    audio.addEventListener(
      "error",
      () => {
        console.error(
          "No se pudo cargar el archivo de audio:",
          audio.src
        );

        isPlaying = false;
        audio.volume = volume;

        render();
      }
    );
  }

  // =========================
  // EVENTOS DE LA INTERFAZ
  // =========================

  function bindEvents() {
    els.playBtn.addEventListener(
      "click",
      togglePlay
    );

    els.nextBtn.addEventListener(
      "click",
      next
    );

    els.prevBtn.addEventListener(
      "click",
      prev
    );

    els.progressTrack.addEventListener(
      "click",
      (e) => {
        seekTo(e.clientX);
      }
    );

    let dragging = false;

    els.progressHandle.addEventListener(
      "mousedown",
      () => {
        dragging = true;
      }
    );

    window.addEventListener(
      "mousemove",
      (e) => {
        if (dragging) {
          seekTo(e.clientX);
        }
      }
    );

    window.addEventListener(
      "mouseup",
      () => {
        dragging = false;
      }
    );

    els.volumeSlider.addEventListener(
      "input",
      (e) => {
        setVolume(
          Number(e.target.value) / 100
        );
      }
    );
  }

  // =========================
  // INICIALIZACIÓN
  // =========================

  function init() {
    cacheEls();
    bindEvents();
    bindAudioEvents();
    bindKeyboardEvents();
  }

  return {
    init,
    play,
    togglePlay,
    next,
    prev,
    isVisible: () => !!currentGenre,
  };
})();