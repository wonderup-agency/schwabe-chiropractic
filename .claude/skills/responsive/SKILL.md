---
name: responsive
description: Revisa y corrige cómo se ve una section o una página completa en tablet, mobile landscape y mobile portrait — mide desbordes, ritmo de espaciado, tap targets, tipografía, tokens de color por theme, y el estado abierto de nav / slider / accordion / form. Usar SIEMPRE al terminar una section antes de darla por lista, y cada vez que el usuario reporta que algo "se ve mal en mobile", "se rompe en el celular", "el padding está raro", "no se ve el botón", "el slider está roto", o pide revisar responsive, breakpoints, tablet o mobile.
argument-hint: '[section o página a revisar]'
---

# Responsive: $ARGUMENTS

Ninguna section está terminada hasta que pasó por acá. Desktop es el borrador;
la mayoría de las visitas de una clínica local llegan desde un teléfono.

**Reporta primero, arregla después.** Igual que `/audit`: recorrés todo,
juntás todos los hallazgos, mostrás un reporte, y **esperás el OK antes de
tocar Webflow**. Si algo es ambiguo — si no está claro cuál es el
comportamiento correcto y no sólo cómo lograrlo — preguntá con
`AskUserQuestion` en vez de decidir por tu cuenta.

---

## Paso 0 — Alcance

Definí antes de abrir el browser:

1. **Qué se revisa.** Una section (lo normal, al terminarla) o una página
   entera. Si `$ARGUMENTS` está vacío, preguntá cuál — no asumas la Home.
2. **Dónde vive.** La URL de staging es `https://schwabe.webflow.io/`. El
   anchor de cada section de la Home está en
   `.claude/rules/` → memoria `schwabe-home-section-order`.
3. **Si hay diseño de referencia.** Si la section vino de Figma y existe el
   frame mobile, leelo con `get_screenshot` del MCP de Figma **antes** de
   juzgar. Sin referencia estás opinando; con referencia estás comparando.
   Si el frame mobile no existe, decilo en el reporte: lo que sigue son
   decisiones tuyas, no del diseño.
4. **Publicá si hace falta.** El sitio de staging sirve lo último publicado.
   Si el cambio está sólo en el Designer, no está en la URL. Confirmalo antes
   de reportar un bug que ya arreglaste.

---

## Paso 1 — Los seis viewports, y la trampa de los nombres

Los breakpoints de Webflow **no se llaman como los dispositivos reales**. Esta
tabla es la parte de la skill que más errores evita:

| Perfil | `emulate` viewport | Ancho | Breakpoint de Webflow |
| --- | --- | --- | --- |
| Portrait chico | `320x568x2,mobile,touch` | 320 | Mobile portrait |
| Portrait típico | `390x844x3,mobile,touch` | 390 | Mobile portrait |
| Portrait grande | `430x932x3,mobile,touch` | 430 | Mobile portrait |
| **Teléfono en landscape** | `844x390x3,mobile,touch,landscape` | 844 | **Tablet** ← el que sorprende |
| Tablet portrait | `768x1024x2,mobile,touch` | 768 | Tablet |
| Tablet landscape | `1024x1366x2,mobile,touch` | 1024 | **Desktop base** |

Dos consecuencias que hay que tener en la cabeza todo el tiempo:

- **"Mobile landscape" (480–767) no es ningún teléfono moderno en landscape.**
  Un iPhone acostado mide 844–932 de ancho y cae en **Tablet**. Ese
  breakpoint hoy cubre teléfonos viejos y ventanas angostas de desktop. Si
  arreglás "el celular acostado" tocando Mobile landscape, no arreglaste nada.
- **Tablet landscape usa los estilos de desktop.** Un iPad acostado a 1024 no
  toca ninguno de los breakpoints chicos. Si la section se ve mal ahí, el
  arreglo va en la base o en un breakpoint nuevo de 1280, no en Tablet.

**Usá `emulate`, no `resize_page`.** `resize_page` te da una ventana de
desktop angosta: `hover: hover` sigue matcheando, no hay touch, y el user
agent es de desktop. Todos los bugs de touch — el `:hover` pegado después del
tap, el zoom del input de iOS — son invisibles ahí. `emulate` con
`mobile,touch` es lo que reproduce el teléfono. El probe devuelve
`hoverCapable`: si vuelve `true` en un perfil mobile, emulaste mal y hay que
rehacerlo.

### Los bordes de breakpoint

Después de los seis perfiles, barré los seis píxeles donde el breakpoint da
vuelta: **479, 480, 767, 768, 991, 992**. Es donde vive el clásico "lo estilé
a 390 y a 479 está roto". Con `resize_page` alcanza acá — sólo buscás el salto
de layout, no comportamiento touch.

### Los dos color schemes

Los tokens de MAST usan `light-dark()`, así que el mismo CSS pinta distinto
según el theme del sistema. **Los dos son obligatorios**: `emulate` con
`colorScheme: 'light'` y otra vuelta con `colorScheme: 'dark'`. Un color que
sólo aparece con el teléfono en dark mode es un bug de token, y desde un Mac
en light mode no existe.

---

## Paso 2 — Correr el probe

Leé `references/probe.md` y corré el script en cada viewport. Guardá cada
salida etiquetada por perfil: la comparación entre perfiles es la mitad del
valor.

Después del probe en reposo, disparar los estados: nav abierto, slider
avanzado, accordion abierto, cada input enfocado. Están listados al final de
`references/probe.md`.

**Screenshot de cada perfil también** (`take_screenshot` con `fullPage: true`).
El probe encuentra lo verificable; la screenshot encuentra lo feo. Necesitás
las dos, y hay que **mirar** la screenshot, no sólo adjuntarla.

---

## Paso 3 — El checklist

Todo lo que sigue se verifica en los seis perfiles. Reportá sólo los fallos.

### Layout

- Cero scroll horizontal. `documentScrollWidth > viewportWidth` es fallo, no
  detalle.
- Nada de anchos fijos en px en un contenedor: `max-width: 100%` o el token.
- Los grids colapsan a una columna cuando corresponde, y el orden en que
  quedan las celdas es el orden que se quiere leer — no el que salió.
- Nada de `100vh`: `100dvh` o medido en JS. La barra de direcciones de iOS
  cambia `vh` al scrollear y produce un salto.
- El contenido no se corta ni se tapa. Especial atención a los `overflow:
  hidden` heredados y a cualquier elemento con `position: absolute` puesto
  para desktop.

### Espaciado — el ritmo, no el valor

Esto es lo que más se rompe y lo que menos se nota de a una section.

- **Un solo padding lateral en toda la página.** `paddingClusters.horizontal`
  tiene que tener una sola entrada. Dos = alguna section se salió del sistema.
- **El padding vertical viene del token**, no de un número escrito a mano.
  Como máximo dos o tres pares distintos, y cada excepción tiene que tener una
  razón que se pueda decir en una frase.
- **`contentInsets` con un valor dominante.** Un h2 arrancando en 20px y su
  párrafo en 44px dentro de la misma section es una card con padding propio
  encima del padding de la section — el bug de "mucho padding en los costados".
  El arreglo casi nunca es bajar los dos: es sacarle el padding lateral a la
  card en mobile y dejar que el de la section haga el trabajo.
- El gap entre elementos escala hacia abajo. Un gap de 80px de desktop
  intacto en un viewport de 390 deja huecos que se leen como error.

### Tipografía

- Nada abajo de 14px. Los inputs, **16px como mínimo**: abajo de eso iOS
  zoomea al enfocar y ya no salís del zoom.
- Los display sizes bajan de verdad. Un h1 de 64px en 320px de ancho parte
  palabras.
- Sin huérfanas obvias ni palabras cortadas. Sin `text-wrap: balance` en
  párrafos largos (es para títulos).
- El largo de línea no se vuelve absurdo en tablet landscape.

### Color y theme

- **Correr en light y dark.** Todo par de fondo/texto tiene que seguir siendo
  legible en los dos.
- Ningún token resuelto a un color inesperado. Si un fondo aparece en un color
  que no está en la paleta de la section, el sospechoso es un `light-dark()`
  cayendo del lado que no esperabas, o una variable de Webflow que no se emitió
  porque ninguna clase la consume (ver el comentario de fallbacks en
  `src/components/styles/nav.css`).
- El contraste se chequea sobre el par final, no sobre el token de diseño.

### Nav

El nav tiene reglas propias porque es lo primero que se ve y porque es mitad
MAST, mitad nuestro:

- **El menú mobile es el navbar nativo de Webflow**, no nuestro `nav.js`. Los
  dropdowns de `nav.js` están scopeados a `min-width: 992px` con
  `gsap.matchMedia()` y no corren en mobile.
- **El estado scrolleado sí corre en mobile.** El `IntersectionObserver` de
  `nav.js` no está scopeado por breakpoint, así que `[data-nav-bg]` pinta
  `--nav-surface` en todos los viewports. Si el color del nav en mobile está
  mal, ese layer es el primer sospechoso.
- Nav abierto: se revisa como layout aparte. Que no desborde, que se lea el
  logo, que el CTA se distinga del fondo, que el botón de cerrar esté donde se
  puede llegar con el pulgar, y que el scroll del menú funcione si es más largo
  que el viewport.
- El nav fijo no se puede comer más del ~15% del alto del viewport.
- Ver `.claude/rules/components/nav.md` antes de tocar nada del nav.

### Táctil

- Todo target clickeable, 44×44 mínimo.
- Nada que dependa de hover para funcionar. El hover del Button ya está
  scopeado a `(hover: hover) and (pointer: fine)` — ver
  `.claude/rules/animations/BUTTON-HOVER.md`. Si aparece un hover nuevo sin ese
  guard, es fallo.
- Los targets no se pisan ni quedan a menos de 8px uno del otro.
- Los contenedores con scroll propio necesitan `data-lenis-prevent` cuando
  Lenis esté activo.

### Componentes interactivos

- **Slider**: la slide entra completa, el track no arrastra desborde, los dots
  y las flechas son alcanzables, y el swipe funciona. Los sliders de MAST
  necesitan desvincularse para tocarlos — ver memoria
  `mast-slider-adaptation`.
- **Form**: los inputs llegan al ancho completo, el label se lee, el input no
  hereda un ancho de desktop, el `font-size` es ≥16px, el submit se distingue,
  y el estado de error/éxito cabe. Ojo que el submit de Webflow es un
  `<input type="submit">` y **no** una instancia del componente `Button`: no
  tiene `data-btn` (pendiente anotado en `BUTTON-HOVER.md`).
- **Accordion / tabs**: abrir el panel más largo y volver a medir. Cambia el
  alto del documento.

### Animación

- `prefers-reduced-motion` respetado.
- Parallax y scrub apagados abajo de 768px salvo decisión explícita.
- `ScrollTrigger.config({ ignoreMobileResize: true })` presente, o la barra de
  direcciones de iOS dispara refreshes y las animaciones saltan.
- El resto está en `.claude/skills/animate/references/qa.md` §8.

### Imágenes

- `oversizeFactor` del probe abajo de 2. Más que eso es peso de descarga
  regalado en 4G.
- `alt` en todo lo que no sea decorativo.
- `loading="lazy"` en todo lo que esté abajo del fold; **nunca** en la imagen
  del hero.

---

## Paso 4 — El reporte

Un solo bloque, agrupado por severidad, sólo fallos:

```
## <section> — responsive

**Rompe** (hay que arreglarlo antes de dar la section por lista)
- <perfil>: <qué pasa> → <arreglo propuesto> · <dónde va>

**Inconsistente** (no rompe, pero se sale del sistema)
- ...

**Dudas** (necesito que decidas)
- ...

Pasó: <perfiles y estados que quedaron limpios>
```

Cada fallo necesita **las tres cosas**: en qué perfil, qué pasa, y dónde va el
arreglo. Un reporte sin la tercera columna no es accionable.

Corto. Ver memoria `reports-must-be-short`.

---

## Paso 5 — Dónde va cada arreglo

Elegir mal el lugar es cómo se acumula deuda invisible en un proyecto Webflow.

| El problema es | El arreglo va en |
| --- | --- |
| Layout, espaciado, tamaño de fuente, orden de grid | **Designer**, en el breakpoint que corresponda |
| Un valor que debería ser token y es un px suelto | **Variable de Webflow**, y después se aplica |
| Estilo de un nodo que inyecta el JS | `src/components/styles/<name>.css` |
| Estilo global sin componente (el hover del Button) | `src/styles/<name>.css` |
| Comportamiento — un listener, un scope de breakpoint | El componente en `src/components/` |
| Un componente de MAST que se resiste | Desvincular primero. Ver memoria `mast-slider-adaptation` |

**La cascada de Webflow es la regla que más se olvida.** Los estilos bajan de
992 hacia abajo: lo que tocás en Tablet también le pasa a Mobile landscape y
Mobile portrait. Por eso:

1. Arreglá **de arriba hacia abajo**: Tablet primero, después Mobile landscape,
   después portrait.
2. Después de cada arreglo, **volvé a verificar los breakpoints de abajo**. Un
   arreglo en Tablet que rompe portrait es el bug más común de esta skill, y
   por eso el Paso 6 no es opcional.
3. Si un valor tiene que ser igual en todos, va en la base — no repetido en
   cada breakpoint. Estilos duplicados por breakpoint son el "orphaned
   breakpoint-only styles" que caza el pre-handoff de `/webflow-build`.

---

## Paso 6 — Re-verificar

Después de aplicar arreglos: **publicar, y correr el Paso 1 y el Paso 2
completos otra vez**. Los seis perfiles, los dos color schemes, los estados
disparados. No alcanza con volver a mirar el viewport que arreglaste — la
cascada garantiza que tocaste más de uno.

La section se declara lista sólo cuando el reporte vuelve vacío.

---

## Paso 7 — Cerrar

- Si apareció una regla nueva que va a aplicar a futuro, va a
  `.claude/rules/RESPONSIVE.md`, no enterrada en el reporte.
- Si algo queda sin arreglar, va al backlog de `RESPONSIVE.md` con el perfil y
  el síntoma. Un bug reportado y no anotado se reporta de nuevo en dos semanas.
- Doc del componente actualizada en la misma respuesta si cambió su
  comportamiento (`CLAUDE.md`).
- `npm run build` **sólo** si el usuario pide deployar.

---

## Si el MCP de Chrome DevTools no está

Es la dependencia dura de esta skill. Si no conecta, **decilo y pará** — no
adivines cómo se ve. Las dos salidas, en orden:

1. **Reintentar la conexión.** Suele ser Chrome no corriendo con debugging, o
   el plugin caído. Ver la skill `chrome-devtools-mcp:troubleshooting`.
2. **Device real vía túnel.** `npm run tunnel` levanta la URL de Cloudflare, se
   abre en el teléfono, y el usuario manda screenshots. Verificás lo estético
   pero **perdés toda la medición** — sin probe no hay desbordes de 3px, ni tap
   targets, ni tabla de padding. Sirve para confirmar un arreglo, no para
   hacer el barrido.

Nunca reportes un responsive como verificado si sólo lo miraste en screenshots.
