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

  // Audio real del navegador.
  const audio = new Audio();
  audio.volume = volume;

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
    const safeSeconds = Number.isFinite(seconds) ? seconds : 0;

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

  function render() {
    const song = currentSong();

    if (!song) return;

    els.title.textContent = song.title;
    els.artist.textContent = song.artist;

    // Si estamos usando audio real, usamos su tiempo.
    // Si no, usamos el contador simulado.
    const currentTime = isRealAudio() ? audio.currentTime : elapsed;

    const duration = isRealAudio()
      ? audio.duration || song.duration
      : song.duration;

    els.timeCurrent.textContent = formatTime(currentTime);
    els.timeDuration.textContent = formatTime(duration);

    const pct = duration > 0
      ? Math.min(100, (currentTime / duration) * 100)
      : 0;

    els.progressFill.style.width = `${pct}%`;
    els.progressHandle.style.left = `${pct}%`;

    els.playBtn.classList.toggle("is-playing", isPlaying);

    els.playBtn.setAttribute(
      "aria-label",
      isPlaying ? "Pausar" : "Reproducir"
    );

    // Portada según el género.
    els.cover.className = `player-cover ${currentGenre.planetClass}`;

    // Marca la canción activa.
    document.querySelectorAll(".song-row").forEach((row) => {
      const rowIndex = Number(row.dataset.index);

      row.classList.toggle(
        "is-active",
        rowIndex === currentIndex
      );

      row.classList.toggle(
        "is-playing",
        rowIndex === currentIndex && isPlaying
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

    tickHandle = setInterval(tick, 1000);
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
    audio.pause();

    audio.currentTime = 0;
    audio.src = song.audioSrc;

    audio.load();
  }

  function clearRealAudio() {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }

  async function playRealAudio() {
    try {
      await audio.play();
      isPlaying = true;
      render();
    } catch (error) {
      console.error("No se pudo reproducir el audio:", error);

      isPlaying = false;
      render();
    }
  }

  function pauseRealAudio() {
    audio.pause();
    isPlaying = false;
    render();
  }

  // =========================
  // REPRODUCTOR
  // =========================

  function show() {
    els.bar.classList.add("is-visible");
  }

  function play(genre, index) {
    // Detener cualquier reproducción anterior.
    stopTicking();
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
    startTicking();
    render();
  }

  function togglePlay() {
    const song = currentSong();

    if (!song) return;

    if (isRealAudio()) {
      if (isPlaying) {
        pauseRealAudio();
      } else {
        playRealAudio();
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
      (currentIndex + 1) % currentGenre.songs.length;

    play(currentGenre, nextIndex);
  }

  function prev() {
    if (!currentGenre) return;

    const currentTime = isRealAudio()
      ? audio.currentTime
      : elapsed;

    // Si llevamos más de 3 segundos,
    // reinicia la canción actual.
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
      (currentIndex - 1 + currentGenre.songs.length) %
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
        (clientX - rect.left) / rect.width
      )
    );

    if (isRealAudio()) {
      const duration = audio.duration || song.duration;

      if (Number.isFinite(duration)) {
        audio.currentTime = pct * duration;
      }

      render();
      return;
    }

    // Canción simulada.
    elapsed = pct * song.duration;

    render();
  }

  function setVolume(value) {
    volume = Math.min(1, Math.max(0, value));

    // Aplicar volumen al audio real.
    audio.volume = volume;
  }

  // =========================
  // EVENTOS DEL AUDIO
  // =========================

  function bindAudioEvents() {
    // Actualiza la barra mientras suena el MP3.
    audio.addEventListener("timeupdate", () => {
      if (!isRealAudio()) return;

      render();
    });

    // Cuando el MP3 termina, pasa a la siguiente canción.
    audio.addEventListener("ended", () => {
      isPlaying = false;
      next();
    });

    // Cuando el navegador conoce la duración real.
    audio.addEventListener("loadedmetadata", () => {
      render();
    });

    // Si ocurre un error cargando el MP3.
    audio.addEventListener("error", () => {
      console.error(
        "No se pudo cargar el archivo de audio:",
        audio.src
      );

      isPlaying = false;
      render();
    });
  }

  // =========================
  // EVENTOS DE LA INTERFAZ
  // =========================

  function bindEvents() {
    els.playBtn.addEventListener("click", togglePlay);

    els.nextBtn.addEventListener("click", next);

    els.prevBtn.addEventListener("click", prev);

    // Click en la barra de progreso.
    els.progressTrack.addEventListener("click", (e) => {
      seekTo(e.clientX);
    });

    // Arrastrar la barra de progreso.
    let dragging = false;

    els.progressHandle.addEventListener("mousedown", () => {
      dragging = true;
    });

    window.addEventListener("mousemove", (e) => {
      if (dragging) {
        seekTo(e.clientX);
      }
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
    });

    // Volumen.
    els.volumeSlider.addEventListener("input", (e) => {
      setVolume(Number(e.target.value) / 100);
    });
  }

  function init() {
    cacheEls();
    bindEvents();
    bindAudioEvents();
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