# Figma — el índice del archivo

**Los links de abajo son el índice del documento.** No es una comodidad: el
listado de páginas del MCP **está roto en este archivo** — un `get_metadata`
sin `nodeId` devuelve **una sola** página (`🖼️ Cover`) aunque el documento
tiene ocho canvases. Sin esta tabla, encontrar un diseño es adivinar.

Ya costó caro una vez: el 404 se construyó **dos veces** desde el copy porque
di su frame por inexistente. Existía.

## El archivo

**`erUTGKdYCcmvlPiKW4MZMf`** — el canonical, el único que se usa.

Hay un segundo archivo, **`vzmzEgWYtIR6PoN2TzDB2i`**, que **NO se usa**: misma
marca y misma tipografía, pero con rampas de color y UI Elements que el
canonical no tiene, y `Tag/Small` en 14px en vez de 12. Los dos se llaman
"Schwabe Chiropractic". **Verificá el fileKey antes de leer.**

## Los canvases

| Canvas | node id | Link |
| --- | --- | --- |
| **Home** | `590:358` | [Home page 3](https://www.figma.com/design/erUTGKdYCcmvlPiKW4MZMf/Schwabe-Chiropractic?node-id=974-1594) |
| **Inner group 1** — About, Team, Partners, New Patients, FAQ | `711:5005` | [link](https://www.figma.com/design/erUTGKdYCcmvlPiKW4MZMf/Schwabe-Chiropractic?node-id=711-5005) |
| **Inner group 2** — Care Hub, Injury template | `805:1531` | [link](https://www.figma.com/design/erUTGKdYCcmvlPiKW4MZMf/Schwabe-Chiropractic?node-id=805-1531) |
| **Wellness + Fees** | `888:1646` | [link](https://www.figma.com/design/erUTGKdYCcmvlPiKW4MZMf/Schwabe-Chiropractic?node-id=888-1646) |
| **Patient Stories + Blog** | `956:1863` | [link](https://www.figma.com/design/erUTGKdYCcmvlPiKW4MZMf/Schwabe-Chiropractic?node-id=956-1863) |
| **Utility pages** — Contact, Products, Join, legales, 404 | `1000:2086` | [link](https://www.figma.com/design/erUTGKdYCcmvlPiKW4MZMf/Schwabe-Chiropractic?node-id=1000-2086) |
| **🏁 Final review** — 18 páginas + 14 alternativas | `1237:9927` | [link](https://www.figma.com/design/erUTGKdYCcmvlPiKW4MZMf/Schwabe-Chiropractic?node-id=1237-9927) |
| **💎 Styleguide** — tipografía, color, buttons | `557:312` | [link](https://www.figma.com/design/erUTGKdYCcmvlPiKW4MZMf/Schwabe-Chiropractic?node-id=557-312) |

El link de Home apunta al **frame**, no al canvas: el canvas `590:358` se llama
*"Home page Proposal v1"* y contiene las dos propuestas, así que el id útil es
el del frame.

## 🏁 "Final review" es más nuevo que las cuatro rondas de *Feedback applied*

Agregado el **2026-09-27**, cuando Pablo lo pasó para la revisión final. Este
doc mapeaba 6 canvases y **ninguno era éste**.

Los ids lo ubican después de todo lo demás —`1237` contra `1214`, `1209`,
`1200`, `1154`— y su contenido lo confirma: **una sola tanda con un frame por
página**, 18 en total, que cubren las 21 vistas publicadas. Las rondas de
*Feedback applied* que este doc lista abajo están repartidas por canvas;
"Final review" las consolida.

**Consecuencia práctica**: los items del TODO que dicen *"esta página se
construyó contra el Figma viejo, la vigente es `1214:x`"* se auditan contra
**Final review**, no contra esos ids. Si un frame de Final review y uno de
Feedback applied chocan, manda Final review — salvo que un comentario del
prototipo sea posterior, que sigue siendo la regla de abajo.

El inventario de deltas está en [FIGMA-AUDIT.md](FIGMA-AUDIT.md).

## Cómo saber qué frame manda

**Cada canvas está partido en dos secciones de Figma**: `… - version 1` y
`… - Feedback applied`. La segunda es la que el equipo de diseño actualizó
después de la primera ronda de comentarios, y **es la que manda**.

Eso significa que un id de frame por sí solo no dice si está vigente. La
comprobación es el nombre de la **sección** que lo contiene, y el atajo es esta
tabla.

**Ojo con la excepción**: *"Feedback applied"* no siempre es lo más nuevo.
Los comentarios que Derek y Olha dejan **en el prototipo** son posteriores al
archivo. Ya pasó con Patient Stories: `1154:14667` todavía dibuja la foto de la
historia destacada, que es justo lo que Derek pide sacar. **Donde chocan, manda
el comentario** — es la instrucción más nueva.

### Home — `590:358`

Sin secciones: las dos propuestas son frames sueltos del canvas.

| Frame | id | Estado |
| --- | --- | --- |
| Home page 1 | `596:50` | Propuesta vieja. **Es contra la que se construyó la Home** |
| **Home page 3** — *Proposal 5.1.3* | `974:1594` | **La vigente.** Ver [HOME-FIGMA-SYNC.md](HOME-FIGMA-SYNC.md) |
| Shockwave (suelto) | `1075:534` | La section "Specialized", ver `1075:616` |

### Inner group 1 — `711:5005`

| Página | version 1 | **Feedback applied** |
| --- | --- | --- |
| About \| Our Story | `711:5006` | **`1214:12685`** |
| About \| Our Team | `711:5712` | **`1214:13206`** |
| About \| Community partners | `711:5897` | **`1214:13312`** |
| New Patients | `711:6203` | **`1214:13540`** |
| FAQ | `711:7634` | **`1214:14877`** |
| Process alternative | — | `1214:17295` |

Secciones: `1214:17294` (version 1) · `1214:12684` (Feedback applied).

🔴 **Las cinco páginas se construyeron contra `711:*` y el "Feedback applied"
nunca se miró.** Está en el TODO.

### Inner group 2 — `805:1531`

| Página | version 1 | **Feedback applied** |
| --- | --- | --- |
| Care Hub | `805:5891` | **`1200:7814`** |
| Care Hub \| Injury (template) | `805:6233` | **`1200:8069`** |
| alternative | `805:7734` | `1200:9269` *(beeter contrast)* |

🔴 **Mismo caso: construidas contra `805:*`.**

### Wellness + Fees — `888:1646`

| Página | version 1 | **Feedback applied** |
| --- | --- | --- |
| Fees & Practical Details | `888:3878` | **`1209:10644`** |
| Wellness Membership | `888:4523` | **`1209:11340`** |

🔴 **Mismo caso: construidas contra `888:*`.**

### Patient Stories + Blog — `956:1863`

| Página | version 1 | **Feedback applied** |
| --- | --- | --- |
| Patient Stories | `990:1246` | **`1154:14667`** ✅ aplicado el 2026-09-24 |
| Blog Post | `956:3351` | **`1154:14375`** ✅ aplicado el 2026-09-25 |
| Blog alternative | `956:3066` | **`1154:14090`** ⚠️ sin mirar |
| Blog | `956:2744` | — |
| 2 · 3 · alternative | `956:2647` · `956:2676` · `956:2700` | — |

Secciones: `1154:13761` (version 1) · `1154:13762` (Feedback applied).

### Utility pages — `1000:2086`

**Una sola sección**, `1154:4354` *"Utility pages - Feedback applied"*. O sea
que estos frames **son** lo vigente y lo construido salió de acá.

| Página | Frame |
| --- | --- |
| Contact 1 | `1000:2099` |
| **Contact 2** — el que se construyó | `1000:3342` |
| Products We Recommend | `1000:4041` |
| — alternative design (2+ productos) | `1000:4283` |
| Join Our Team | `1000:4324` |
| **Privacy Policy / Terms of use Template** | `1003:5313` |
| 404 page | `1004:5645` |

⚠️ **El frame de las legales existe y no se usó.** `UTILITY-PAGES.md` dice que
Privacy y Terms "no están en este canvas" y se construyeron desde el copy del
handoff. Es el mismo error que el 404, en la misma página de Figma. Está en el
TODO.

## Los frames que ya se midieron

Para no volver a medir lo que ya está escrito. Todos del canonical.

| Nodo | Qué es | Doc |
| --- | --- | --- |
| `974:1704` · `974:1747` | Card de síntoma, y la misma card en hover | [HOME-FIGMA-SYNC.md](HOME-FIGMA-SYNC.md) |
| `974:1763` | Statement — fondo ink + textura al 15% | ″ |
| `974:1802` · `974:1803` | La fila y la card de los reviews del doctor | ″ |
| `974:1811` | Process 3 — la section `#plan` | ″ |
| `974:1886` | La card de Colorado Shockwave | ″ |
| `974:1982` | Testimonials — foto de fondo y scrim | ″ |
| `974:2137` | **Oculto en Figma.** Lo reemplazó `1075:616` | ″ |
| `974:2344` | CTA Banner | ″ |
| `1075:616` | Section "Specialized" | ″ |
| `1183:538` → `1183:572` | La banda de footer en la Home → **master `Footer / 2`** | [FOOTER.md](FOOTER.md) |
| `1183:700` | Lockup de Colorado Shockwave del footer | ″ |
| `711:5934` | La cita de "Rooted in Platt Park" | [COMPONENTS-NAMING.md](COMPONENTS-NAMING.md) |
| `711:6086` | CTA Banner de Community Partners | [RESPONSIVE.md](RESPONSIVE.md) |
| `711:7168` | *The space* — el botón de play del video | [TODO.md](TODO.md) |
| `990:1302` · `990:1507` | Citas de Patient Stories (v1) | [RESPONSIVE.md](RESPONSIVE.md) |
| `1154:15157` | El layout nuevo de los filtros de themes | [TODO.md](TODO.md) |
| `1154:15228` | Las estrellas en Olive | [RESPONSIVE.md](RESPONSIVE.md) |
| `557:359` · `559:396` · `557:1559` | Typography · Color Styles · Buttons | memoria `schwabe-typography-phase1` |

## Cómo consultarlo sin perder tiempo

- **El listado de páginas está roto** (arriba). Los ids de esta doc son la
  única entrada.
- **`get_metadata` sobre un canvas revienta el límite de tokens** — los seis
  pesan entre 285KB y 720KB. El MCP lo guarda en un archivo y hay que
  procesarlo en disco. Lo que devuelve el outline de secciones y frames:

  ```bash
  python3 - "$ARCHIVO" <<'PY'
  import json,re,sys
  d=json.load(open(sys.argv[1]))
  t=''.join(x.get('text','') for x in d)
  for l in t.split('\n'):
      ind=len(l)-len(l.lstrip())
      if ind<=4 and re.match(r'\s*<(section|frame|canvas)\b', l):
          m=re.search(r'<(\w+) id="([^"]+)" name="([^"]*)"',l)
          if m: print(' '*ind + m.group(1), m.group(2), '|', m.group(3))
  PY
  ```

- **El barrido de ids secuenciales recorre UN canvas, no el documento.** El
  máximo id del subárbol de un frame +1 es el frame siguiente *del mismo
  canvas*. Los otros siete quedan invisibles — así se perdió el frame del 404.
- **Un frame puede traer capas ocultas de otra página.** Contact 2 tiene
  adentro las cards de "Sound familiar?" de la Home en `hidden="true"`. Hay que
  filtrar el subárbol oculto o se lee una página que no existe.
- **El nombre de una capa no es su texto.** Cuando la metadata y el diseño no
  coinciden, manda el screenshot.
