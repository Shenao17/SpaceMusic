/**
 * player.js
 * Controla el reproductor fijo inferior.
 * No hay archivos de audio reales disponibles, así que la reproducción
 * se simula con un intervalo que avanza el tiempo actual de la canción,
 * pero toda la interfaz (play/pause, siguiente, anterior, progreso,
 * volumen) es completamente funcional.
 */

const Player = (() => {
  let currentGenre = null;
  let currentIndex = -1;
  let isPlaying = false;
  let elapsed = 0;
  let tickHandle = null;
  let volume = 0.7;

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
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function currentSong() {
    if (!currentGenre || currentIndex < 0) return null;
    return currentGenre.songs[currentIndex];
  }

  function render() {
    const song = currentSong();
    if (!song) return;

    els.title.textContent = song.title;
    els.artist.textContent = song.artist;
    els.timeCurrent.textContent = formatTime(elapsed);
    els.timeDuration.textContent = formatTime(song.duration);

    const pct = Math.min(100, (elapsed / song.duration) * 100);
    els.progressFill.style.width = `${pct}%`;
    els.progressHandle.style.left = `${pct}%`;

    els.playBtn.classList.toggle("is-playing", isPlaying);
    els.playBtn.setAttribute("aria-label", isPlaying ? "Pausar" : "Reproducir");

    // Actualiza la portada con un degradado propio del género activo.
    els.cover.className = `player-cover ${currentGenre.planetClass}`;

    // Marca la fila activa en la lista de canciones, si está visible.
    document.querySelectorAll(".song-row").forEach((row) => {
      const rowIndex = Number(row.dataset.index);
      row.classList.toggle("is-active", rowIndex === currentIndex);
      row.classList.toggle("is-playing", rowIndex === currentIndex && isPlaying);
    });
  }

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

  function show() {
    els.bar.classList.add("is-visible");
  }

  function play(genre, index) {
    currentGenre = genre;
    currentIndex = index;
    elapsed = 0;
    isPlaying = true;
    show();
    startTicking();
    render();
  }

  function togglePlay() {
    if (!currentSong()) return;
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
    const nextIndex = (currentIndex + 1) % currentGenre.songs.length;
    play(currentGenre, nextIndex);
  }

  function prev() {
    if (!currentGenre) return;
    // Si llevamos más de 3s de la canción, "anterior" reinicia la canción actual.
    if (elapsed > 3) {
      elapsed = 0;
      render();
      return;
    }
    const prevIndex = (currentIndex - 1 + currentGenre.songs.length) % currentGenre.songs.length;
    play(currentGenre, prevIndex);
  }

  function seekTo(clientX) {
    const song = currentSong();
    if (!song) return;
    const rect = els.progressTrack.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    elapsed = pct * song.duration;
    render();
  }

  function setVolume(value) {
    volume = value;
  }

  function bindEvents() {
    els.playBtn.addEventListener("click", togglePlay);
    els.nextBtn.addEventListener("click", next);
    els.prevBtn.addEventListener("click", prev);

    els.progressTrack.addEventListener("click", (e) => seekTo(e.clientX));

    let dragging = false;
    els.progressHandle.addEventListener("mousedown", () => (dragging = true));
    window.addEventListener("mousemove", (e) => {
      if (dragging) seekTo(e.clientX);
    });
    window.addEventListener("mouseup", () => (dragging = false));

    els.volumeSlider.addEventListener("input", (e) => {
      setVolume(Number(e.target.value) / 100);
    });
  }

  function init() {
    cacheEls();
    bindEvents();
  }

  return { init, play, togglePlay, next, prev, isVisible: () => !!currentGenre };
})();
