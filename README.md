# SpaceMusic

> "Tu música está en otro planeta."

Un MVP/prototipo frontend de una experiencia musical con temática
espacial: lanzas un cohete, viajas a un sistema solar donde cada
planeta es un género musical, aterrizas en uno y escuchas sus
canciones destacadas desde un reproductor propio.

---

## Historia

SpaceMusic empezó en 2023 como una idea en papel: bocetos, paleta de
colores, la metáfora de "cada género es un planeta" — pero sin la
tecnología ni el enfoque para llevarla a producción en ese momento. El
proyecto quedó guardado.

Ahora, con mejores herramientas y más foco, SpaceMusic finalmente está
saliendo del papel. Esta primera versión es el MVP: un frontend 100%
funcional, sin backend, que demuestra la experiencia completa —
lanzamiento, sistema solar, selección de género y reproductor — y que
queda listo para crecer hacia el producto real.

---

## Cómo probarlo

No necesitas instalar nada ni agregar archivos. Simplemente abre
`index.html` en el navegador (recomendado: doble click, o click
derecho → "Abrir con" tu navegador).

Todo lo visual (planetas, fondo estelar, portadas) está generado con
CSS, y las canciones se "reproducen" de forma simulada (la barra de
progreso avanza sola) — así se puede probar el flujo completo sin
depender de archivos de audio reales.

---

## Estructura del proyecto

```
spacemusic/
├── index.html          Estructura de las 3 vistas + reproductor
├── css/
│   └── style.css        Identidad visual, animaciones, responsive
├── js/
│   ├── data.js           Géneros y canciones (datos estáticos)
│   ├── app.js             Estados de la SPA (landing/solar/género)
│   └── player.js           Lógica del reproductor
└── assets/
    ├── images/            Recursos visuales (cohete, etc.)
    └── audio/              (vacío por ahora — ver "Próximos pasos")
```

---

## Changelog

### v0.3 — Rediseño de la pantalla principal
- El cohete pasó a ser el elemento protagonista: mucho más grande y
  centrado (`.rocket-wrap` en `css/style.css`).
- El texto "SpaceMusic" + el tagline dejaron de ser el titular
  principal: ahora son un pie de página pequeño y discreto, estilo
  copyright, fijo en la parte inferior (`.landing__footer`).
- Se dejaron comentarios `🔧 PERSONALIZAR` en el HTML y CSS marcando
  justo dónde tocar si se quiere ajustar tamaño o posición.

### v0.2 — Cohete ilustrado real
- Se reemplazaron las formas de CSS (cuerpo, ventana, aletas) del
  cohete por el recurso ilustrado real, tanto en la pantalla de
  lanzamiento como en el ícono central del sistema solar.
- Se mantuvo la animación de flotado, el despegue y la llama (esta
  última sigue siendo CSS, ya que el recurso no la incluía).

### v0.1 — MVP inicial
- Flujo completo: landing con cohete → despegue animado → sistema
  solar con 6 planetas (Pop, Rock, Hip-Hop, Electrónica, Indie,
  Latino) → vista de género con lista de canciones → reproductor fijo
  inferior.
- Datos de géneros/canciones como objetos JS estáticos, sin backend,
  sin base de datos, sin autenticación.
- Campo estelar animado, planetas con textura/iluminación propia vía
  gradientes CSS, flotado orbital sutil, hover con glow.
- Responsive: en desktop los planetas se distribuyen orgánicamente
  alrededor del centro; en móvil/tablet se convierten en un carrusel
  horizontal con scroll-snap.
- **Fix**: los "swatches" de género (ícono en la vista de género,
  portada en la lista de canciones, portada del reproductor)
  reutilizaban las clases de planeta, pero las reglas CSS originales
  solo pintaban `.planet__body` anidado — se agregaron selectores
  directos por clase de género para que también se vean coloreados.

---

## Próximos pasos

Ver [`PROXIMAS-ACTUALIZACIONES.md`](./PROXIMAS-ACTUALIZACIONES.md)
para el roadmap y las tareas pendientes.
