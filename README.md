# SpaceMusic — Notas y siguientes pasos

Este MVP funciona 100% sin agregar nada: los planetas, portadas y fondo
estelar son generados con CSS (gradientes), y las canciones se "reproducen"
de forma simulada (la barra de progreso avanza sola). No necesitas poner
ningún archivo para probar el flujo completo.

Las carpetas `assets/images/` y `assets/audio/` están vacías a propósito,
por si más adelante quieres reemplazar lo simulado por contenido real.
Esto es opcional — nada de lo siguiente es necesario para que el
prototipo funcione.

## 1. Audio real por canción (opcional)

Ahora mismo `player.js` simula la reproducción con un contador (no usa
`<audio>`). Si quieres que las canciones suenen de verdad:

1. Coloca archivos `.mp3` en `assets/audio/`, por ejemplo:
   ```
   assets/audio/blinding-lights.mp3
   assets/audio/as-it-was.mp3
   ```
2. En `js/data.js`, agrega un campo `audioSrc` a cada canción:
   ```js
   { title: "Blinding Lights", artist: "The Weeknd", duration: 200,
     audioSrc: "assets/audio/blinding-lights.mp3" }
   ```
3. En `js/player.js` habría que crear un `new Audio()`, asignarle
   `audio.src = song.audioSrc` en `play()`, y usar sus eventos
   (`timeupdate`, `ended`) en vez del `setInterval` actual. Si algún día
   quieres esto, dilo y lo conecto.

No necesitas audio real para cada canción — puedes empezar con 1 o 2 de
prueba y dejar el resto simulado; el reproductor ya soporta ambos casos.

## 2. Portadas/imágenes reales por canción o género (opcional)

Ahora mismo las "portadas" (planeta, ícono de género, thumbnail de
canción, portada del reproductor) son círculos con gradiente CSS según
el género — no hay imágenes.

Si quieres portadas reales:

1. Coloca imágenes cuadradas (ideal 300×300px o más, `.jpg`/`.png`/`.webp`)
   en `assets/images/`, por ejemplo:
   ```
   assets/images/covers/blinding-lights.jpg
   assets/images/planets/pop.jpg
   ```
2. Agrega el campo correspondiente en `js/data.js` (`cover` por canción,
   o `planetTexture` por género).
3. En `js/app.js` y `js/player.js`, donde hoy se asigna una `className`
   con el color del género, habría que usar `background-image` con esa
   ruta en vez del gradiente. También es un cambio puntual si lo pides.

## 3. Logo o favicon (opcional)

Si quieres un ícono de pestaña del navegador, coloca un archivo
`favicon.ico` o `favicon.png` en `assets/images/` y agrega en el
`<head>` de `index.html`:
```html
<link rel="icon" href="assets/images/favicon.png" />
```

## 4. Más géneros o canciones

No requiere ningún archivo nuevo por defecto: solo edita el arreglo
`GENRES` en `js/data.js` y agrega objetos con la misma forma (`id`,
`name`, `planetClass`, `tagline`, `songs`). Si agregas un género nuevo
necesitarás también:
- una clase de color nueva en `css/style.css` (copiando el patrón de
  `.planet--pop`, `.planet--rock`, etc.)
- un slot de posición nuevo en el sistema solar (`.planet--slot-6`) si
  pasas de 6 planetas en desktop.
