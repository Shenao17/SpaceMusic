# Próximas actualizaciones — SpaceMusic

Roadmap de lo que falta o queda pendiente para las próximas versiones
del MVP. Nada de esto es necesario para que el prototipo actual
funcione — es la lista de "siguientes pasos" cuando se quiera seguir
avanzando.

## Pendiente

- [ ] **Recursos de los planetas.** El cohete ya se integró
      (`assets/images/rocket.png`); los planetas siguen siendo CSS
      (gradientes) porque así se pidió mantenerlos. Si en algún
      momento se quiere reemplazarlos por ilustraciones reales
      (como se hizo con el cohete), se agregan en
      `assets/images/planets/` y se conectan en `js/app.js` +
      `css/style.css`.
- [ ] **Audio real por canción.** Actualmente el reproductor simula
      la reproducción (la barra avanza sola, sin sonido). La
      conexión a audio real está siendo organizada por fuera de este
      MVP — cuando esté lista, se agrega el campo `audioSrc` en
      `js/data.js` y se ajusta `js/player.js` para usar
      `HTMLAudioElement` en vez del contador simulado.
- [ ] **Favicon / logo de pestaña.** Falta un ícono para la pestaña
      del navegador. Se agrega el archivo en `assets/images/` y un
      `<link rel="icon">` en el `<head>` de `index.html`.
- [ ] **Portadas reales por canción o género.** Hoy las portadas
      (ícono de género, thumbnail de canción, portada del
      reproductor) son círculos con gradiente CSS según el género. Se
      pueden reemplazar por imágenes reales sin tocar la estructura
      general — es un cambio puntual en `js/data.js` (campo `cover`)
      y en los estilos que hoy usan `background` por color.

## Ideas para más adelante

- Más géneros musicales además de los 6 actuales (Pop, Rock, Hip-Hop,
  Electrónica, Indie, Latino) — solo requiere agregar un objeto en
  `GENRES` (`js/data.js`) y una clase de color nueva en
  `css/style.css`.
- Posible conexión a un backend/API real en el futuro, ya que los
  datos están separados de la interfaz desde el diseño original del
  MVP (pensado justo para poder crecer sin rehacer todo).
- Revisar la vista de género y el reproductor en pantallas muy
  pequeñas (celulares angostos) una vez haya contenido real (audio e
  imágenes) para ajustar espacios si hace falta.

---

¿Se te ocurre algo que falte acá? Se puede ir agregando a esta lista
a medida que surjan nuevas ideas.
