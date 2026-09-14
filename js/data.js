/**
 * data.js
 * Todos los datos de SpaceMusic viven aquí como objetos estáticos.
 * Esto simula lo que en el futuro sería una respuesta de backend/API,
 * así que la app nunca debe leer datos "quemados" en el HTML.
 */

const GENRES = [
  {
    id: "pop",
    name: "Pop",
    planetClass: "planet--pop",
    tagline: "Órbitas brillantes, melodías que no se olvidan.",
    songs: [
      { title: "Blinding Lights", artist: "The Weeknd", duration: 200 },
      { title: "As It Was", artist: "Harry Styles", duration: 167 },
      { title: "Levitating", artist: "Dua Lipa", duration: 203 },
      { title: "Bad Guy", artist: "Billie Eilish", duration: 194 },
      { title: "Don't Start Now", artist: "Dua Lipa", duration: 183 },
    ],
  },
  {
    id: "rock",
    name: "Rock",
    planetClass: "planet--rock",
    tagline: "Roca, fuego y guitarras a la deriva.",
    songs: [
      { title: "Mr. Brightside", artist: "The Killers", duration: 222 },
      { title: "Seven Nation Army", artist: "The White Stripes", duration: 231 },
      { title: "Do I Wanna Know?", artist: "Arctic Monkeys", duration: 272, audioSrc: "assets/audio/Arctic Monkeys - Do I Wanna Know.mp3"  },
      { title: "Somebody Told Me", artist: "The Killers", duration: 197 },
      { title: "Take Me Out", artist: "Franz Ferdinand", duration: 237 },
    ],
  },
  {
    id: "hiphop",
    name: "Hip-Hop",
    planetClass: "planet--hiphop",
    tagline: "Gravedad baja, ritmo pesado.",
    songs: [
      { title: "God's Plan", artist: "Drake", duration: 198 },
      { title: "HUMBLE.", artist: "Kendrick Lamar", duration: 177 },
      { title: "Sicko Mode", artist: "Travis Scott", duration: 312 },
      { title: "Money Trees", artist: "Kendrick Lamar", duration: 386 },
      { title: "Nonstop", artist: "Drake", duration: 267 },
    ],
  },
  {
    id: "electronica",
    name: "Electrónica",
    planetClass: "planet--electronica",
    tagline: "Señales sintéticas desde el borde del sistema.",
    songs: [
      { title: "Strobe", artist: "deadmau5", duration: 634 },
      { title: "Levels", artist: "Avicii", duration: 203 },
      { title: "Opus", artist: "Eric Prydz", duration: 543 },
      { title: "Reload", artist: "Sebastian Ingrosso", duration: 384 },
      { title: "Ghosts 'n' Stuff", artist: "deadmau5", duration: 234 },
    ],
  },
  {
    id: "indie",
    name: "Indie",
    planetClass: "planet--indie",
    tagline: "Un satélite pequeño con luz propia.",
    songs: [
      { title: "Mystery of Love", artist: "Sufjan Stevens", duration: 259 },
      { title: "Electric Feel", artist: "MGMT", duration: 229 },
      { title: "Two Weeks", artist: "FKA twigs", duration: 244 },
      { title: "Skinny Love", artist: "Bon Iver", duration: 238 },
      { title: "Youth", artist: "Daughter", duration: 244 },
    ],
  },
  {
    id: "latino",
    name: "Latino",
    planetClass: "planet--latino",
    tagline: "Calor tropical flotando en el vacío.",
    songs: [
      { title: "Ojitos Lindos", artist: "Bad Bunny", duration: 257 },
      { title: "Provenza", artist: "Karol G", duration: 209 },
      { title: "Vagabundo", artist: "Rauw Alejandro", duration: 191 },
      { title: "Yandel 150", artist: "Yandel", duration: 202 },
      { title: "La Fama", artist: "Rosalía", duration: 188 },
    ],
  },
];

/**
 * Devuelve un género por su id, o undefined si no existe.
 */
function getGenreById(id) {
  return GENRES.find((genre) => genre.id === id);
}
