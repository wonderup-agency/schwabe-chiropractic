# Auditoría Figma ↔ producción — el prompt y el inventario

Barrido exhaustivo de deltas entre el canvas **"Final review"** del Figma
canonical y el sitio publicado: **página por página, section por section, texto
por texto, imagen por imagen.**

Dos fases separadas por un gate:

| Fase | Qué hace | Escrituras |
| --- | --- | --- |
| **1 — Inventario** | Produce las tablas de deltas del final | **Cero.** Read-only |
| **2 — Corrección** | Se aplican los deltas uno a uno | Sólo con OK item por item |

**La fase 1 no corrige nada.** El valor está en tener la lista completa antes de
tocar el primer elemento: si se arregla mientras se audita, a la tercera página
nadie sabe qué se miró y qué no.

---

## El canvas de review

`erUTGKdYCcmvlPiKW4MZMf` → canvas **`1237:9927` "Final review"**, 32 frames de
primer nivel: **18 páginas y 14 alternativas**.

### Las 18 páginas, mapeadas contra las 21 vistas publicadas

Reconciliado el **2026-09-27** (frames leídos por MCP, vistas verificadas
curleando códigos de respuesta). **No falta ninguna: la cobertura es completa.**
Dos frames cubren más de una vista.

| # | Frame | Nombre en Figma | Vista en prod |
| --- | --- | --- | --- |
| 1 | `1241:10399` | Home page - Final | `/` |
| 2 | `1249:12003` | Care Hub | `/care-hub` |
| 3 | `1249:12270` | Care Hub \| Injury (template) | `/care/sports-activity-overuse-injuries` |
| 4 | `1249:15030` | Care Hub \| Wellness Membership | `/wellness-membership` |
| 5 | `1249:14334` | Fees & Practical Details | `/fees-and-policies` |
| 6 | `1249:18150` | New Patients \| New Patients | `/new-patients` |
| 7 | `1249:19487` | New Patients \| FAQ | `/faq` |
| 8 | `1249:17334` | About \| Our Story | `/about/our-story` |
| 9 | `1249:17851` | About \| Our Team | `/about/team` |
| 10 | `1249:17937` | About \| Community partners | `/about/community-partners` |
| 11 | `1249:23751` | Patient Stories | `/patient-stories` |
| 12 | `1249:23160` | Blog | `/blog` |
| 13 | `1249:23553` | Blog Post | **los 3 artículos** |
| 14 | `1249:25161` | Contact | `/contact` |
| 15 | `1249:26302` | Products We Recommend | `/products-we-recommend` |
| 16 | `1249:26448` | Join Our Team | `/join-our-team` |
| 17 | `1249:26662` | Privacy Policy/Terms of use Template | `/privacy-policy` **y** `/terms-of-use` |
| 18 | `1249:26809` | 404 page | La vista 404 |

**Las 5 páginas de `/care/*` del dropdown no tienen frame propio**, y las cinco
dan 404 hoy (`back-neck-pain`, `headaches-tmj`, `plantar-fasciitis`,
`prenatal-postpartum`, `wellness`). El review sólo trae *Injury (template)*, que
es justamente su plantilla. **No es un delta de esta auditoría** — es la
decisión pendiente de construir las cinco desde la plantilla o sacar los links
del nav. Ya está en el TODO.

### Los 14 frames alternativos — son decisiones, no deltas

Cada uno vive al lado de la página a la que pertenece (misma coordenada `x`).
**Una alternativa NO es el spec.** Auditar contra una sin que esté elegida es
reportar como "falta" algo que nadie aprobó.

| Frame | Qué es | Al lado de |
| --- | --- | --- |
| `1244:11889` | Final CTA 2 | Home |
| `1249:28104` | Final CTA 1 | — |
| `1249:13430` | CTA alternative | Injury |
| `1249:14990` | Section | Fees |
| `1249:15366` | alternative CTA | Wellness |
| `1249:17809` | Section | Our Story |
| `1249:17876` | alternative CTA | Our Team |
| `1249:18116` | Section | Community Partners |
| `1249:19447` | Section | New Patients |
| `1249:23076` | Process alternative | FAQ / New Patients |
| `1249:23486` | Frame 427319047 | Blog |
| `1249:23711` | Section | Blog Post |
| `1249:24106` | CTA alternative | Patient Stories |
| `1249:26387` | alternative cta | Products |

**El frame de la Home ya incorpora `Final CTA 1`** como hijo (`1249:22956`), y
el Blog Post también (`1249:28484`). O sea que en esas dos la alternativa ya
está elegida dentro del frame; las demás están sueltas al costado y **necesitan
tu decisión antes de auditar esa section.**

### 🔴 El Announcement Bar no existe en producción

El frame de la Home arranca con un **`Announcement Bar` de 1440×51** arriba del
`top nav`. Medido: aparece **una sola vez en todo el canvas** (sólo Home), y
grepeando el HTML publicado **no hay nada equivalente** en ninguna página.

Es un elemento entero que hay que construir, o un sobrante del frame. Necesita
tu decisión antes de empezar: **si va, va en el componente `Nav` y toca las 21
vistas**, no sólo la Home.

---

## El prompt

Pegar tal cual en una sesión nueva. El mapa de arriba ya está reconciliado, así
que el auditor arranca directo en la primera página.

````markdown
## Objetivo

Inventariar **todos** los deltas entre el canvas "Final review" del Figma y el
sitio Schwabe publicado. Cuatro ejes por section: **textos, imágenes,
CTAs/links y presencia/orden de las sections.**

**Esto es una auditoría de FASE 1: leé, medí, reportá. NO escribas NADA en el
Designer, ni en el CMS, ni en el repo.** Ni siquiera un arreglo obvio de una
palabra. La corrección es una fase aparte y va item por item con mi OK.

## Contexto

- **Webflow site**: `6a9880576ec4624829beb2f5`, publicado en `schwabe.webflow.io`.
- **Framework**: **MAST**, ya detectado. NO es Client-First — no uses su
  vocabulario ni sus utilidades, y no lo re-detectes.
- **Figma**: `erUTGKdYCcmvlPiKW4MZMf`, canvas `1237:9927` "Final review".
- **El mapa página ↔ frame ya está reconciliado** en
  `.claude/rules/FIGMA-AUDIT.md`. Leelo antes de nada: tiene los 18 frames de
  página, los 14 alternativos y las tres cosas que necesitan decisión.
- **Skill obligatoria**: cargá `webflow-build`. Sus §1 (framework agnosticism),
  §2 (semantics) y §8 (MCP operational reality) son el criterio.
- **Docs**: leé `.claude/rules/TODO.md` primero, y la doc de cada página antes
  de auditarla. **Mucho de lo que parece un delta ya está documentado como
  decisión tomada** — reportarlo de nuevo es ruido.

## Paso 0 — publicar y fijar la línea de base

El Designer tiene cambios escritos y sin publicar. Si auditás staging tal cual,
vas a reportar como "falta" cosas que ya están hechas.

1. **Publicá a staging** (`data_sites_tool`; si el MCP no lo permite, pedímelo).
2. Fijá la línea de base y escribila en el encabezado del inventario:

   ```
   curl -s https://schwabe.webflow.io/ | grep -oE 'href="[^"]*schwabe[^"]*\.css"'
   curl -s https://schwabe.webflow.io/ | grep -o 'schwabe-chiropractic@[^/]*'
   ```

   **El hash del CSS NO sirve para confirmar el publish**: sólo cambia si
   cambiaron estilos, así que un publish que sólo trae contenido lo deja igual
   y parece que falló. Medido el 2026-09-27 — publiqué, el hash se quedó en
   `d12efbd98` y el publish había salido perfecto. **Lo que confirma es
   `lastPublished` de `get_site`**: tiene que avanzar. El hash sirve para otra
   cosa: es la etiqueta de la línea de base contra la que valen los deltas.
3. Todo delta vale **contra ese hash**. Un hash nuevo invalida el inventario.

## Paso 1 — una página por pasada

**Una página por respuesta, y appendeá el resultado al inventario en disco.**
No acumules las 18 en contexto: a la sexta el trabajo se degrada y no hay forma
de notarlo desde adentro.

El orden es **Home primero**, y no es arbitrario: el Nav, el Footer y el
`Section / CTA Banner` (9 instancias) son compartidos, así que cada delta que
aparezca ahí se propaga a las 21 vistas y conviene tenerlo antes de auditar las
otras 17. Después **Blog Post**, que nunca fue auditable porque el template
daba 404. El resto lo ordenás vos.

Por cada página, en este orden:

### a. El Figma

- `get_metadata` del frame → el árbol. **La mayoría de las páginas envuelve
  todo en un único `Frame` hijo**, así que las sections están un nivel más
  abajo; drilleá.
- `get_screenshot` del frame → el render. **Es lo que resuelve las ambigüedades
  del árbol**; no lo saltees por ahorrar contexto.
- `get_design_context` **sólo** de los nodos que hagan falta. Es caro. Un
  `get_metadata` del canvas entero devuelve ~900K caracteres: pedí por frame,
  nunca por canvas.

### b. La producción

```
curl -s https://schwabe.webflow.io/<slug> > /tmp/<slug>.html
```

Extraé el texto renderizado en orden de DOM. Para contar y ubicar elementos,
grepeá el HTML: es más barato y más fiel a lo que ve el visitante que leer el
árbol del Designer por MCP.

### c. Las cuatro tablas

Una por eje. **Una fila por elemento, no por section** — el pedido es texto por
texto e imagen por imagen.

**Textos**

| # | Section | Elemento | Figma dice | Prod dice | Delta |
| --- | --- | --- | --- | --- | --- |

**Imágenes**

| # | Section | Rol | Node id del Figma | Asset que sirve prod | Delta |
| --- | --- | --- | --- | --- | --- |

**CTAs y links**

| # | Section | Label Figma | Label prod | Destino Figma | Destino prod |
| --- | --- | --- | --- | --- | --- |

**Sections**

| # | Section del Figma | ¿Está en prod? | Orden Figma | Orden prod |
| --- | --- | --- | --- | --- |

Más una quinta, al pie: **placeholders del Figma** (ver regla 8).

## Las once reglas de comparación

Son las trampas que ya costaron tiempo en este proyecto. No son sugerencias.

1. **El nombre de capa de Figma NO es el texto.** Un layer llamado *"Img -
   Abstract acoustic wave treatment graphic"* puede traer una foto de consulta.
   Leé el contenido del nodo o la screenshot, nunca el nombre.
2. **Los frames arrastran capas ocultas de otras páginas.** Contact trae adentro
   las cards de "Sound familiar?" de la Home en `hidden="true"`. Filtrá el
   subárbol oculto o vas a auditar una página que no existe.
3. **Una alternativa no es el spec.** Los 14 frames alternativos son decisiones
   sin tomar. Si una section tiene alternativa al lado, **preguntá cuál manda**
   antes de reportar su delta.
4. **Un corte de línea del Figma no se reproduce copiando el ancho de la caja.**
   El diseñador lo tipea a mano: el H2 de Patient Stories venía en dos `<p>`
   dentro de una caja de 680px y 680 no reproducía el corte — la ventana real
   medida era 437–521px. Si reportás un corte, reportá **el ancho de las
   frases**, no el de la caja.
5. **El Figma puede ser ANTERIOR a los comentarios de Derek y Olha.** Ya pasó:
   `1154:14667` todavía dibujaba la foto que Derek pide sacar. **Donde chocan,
   manda el comentario** — es la instrucción más nueva. Marcá el choque
   explícito en vez de elegir solo.
6. **El texto se compara literal**, incluidas comillas curvas, `®`, guiones
   largos e itálicas. Normalizá whitespace; **no** normalices tipografía.
7. **Las imágenes se comparan por identidad, no por parecido.** Anotá el node id
   del Figma y el `src` del `<img>` que sirve prod. **NO exportes los assets en
   esta fase** — se bajan recién al corregir, porque las URLs de export de
   Figma expiran a los 7 días y re-exportar es más barato que tenerlas vencidas.
8. **Un placeholder del Figma no es un delta, es un pendiente de contenido.**
   Van en la tabla aparte del pie. El key visual de `#plan` y las 6 imágenes de
   las utility ya están así en el TODO.
9. **El `®` a tamaño completo es un problema conocido y global.** Una línea por
   página con cuántas apariciones tiene, no una fila por aparición.
10. **"No está en prod" no es lo mismo que "no lo encontré".** Una página con
    Collection List rinde su template N veces y el HTML no se parece al árbol
    del Designer. Contá antes de concluir que falta algo.
11. **Prohibido `extraHttpHeaders` para bustear caché.** Convierte los GET en
    requests con preflight CORS, jsDelivr los rechaza, no carga jQuery, y parece
    que rompiste el nav. La URL del CSS publicado ya lleva hash.

## Lo que NO entra en esta auditoría

Decirlo importa tanto como decir qué sí, porque los cuatro tientan:

- **Responsive.** Eso es la skill `/responsive` con sus seis perfiles. Acá se
  audita **a 1440 y nada más**.
- **Performance / Lighthouse.**
- **Componetización y naming de clases.** Tienen su propio prompt en
  `COMPONENTS-NAMING.md`.
- **Reescribir copy.** Si el Figma y el Master Copy v0.35 no coinciden,
  reportá el choque; no elijas.

## Formato de salida

Appendeá al final de `.claude/rules/FIGMA-AUDIT.md`, bajo un `## <URL>` por
página, las cuatro tablas más la de placeholders.

**Y por cada delta accionable, una fila en `.claude/rules/TODO.md`** con sus
cuatro columnas (✓ · Qué no matchea · Prod · Doc), apuntando a este archivo en
la columna Doc. El TODO es el índice; el razonamiento vive acá.

**Un item sin el delta concreto no sirve.** No *"arreglar el hero"* sino
*"666px contra los 726 del Figma"*.

## Al cerrar cada página

1. Appendear las tablas.
2. Agregar las filas al TODO.
3. Un resumen de **5 líneas máximo** en el chat: cuántos deltas por eje y los
   dos más graves. El detalle está en el archivo — no lo repitas.
4. **Parar.** No arranques la siguiente sin que yo lo pida.

## Criterios de aceptación de la fase 1

| # | Check |
| --- | --- |
| 1 | Las 3 decisiones abiertas (Announcement Bar, las 14 alternativas, las 5 `/care/*`) están resueltas o explícitamente diferidas |
| 2 | Cada una de las 18 páginas tiene sus 4 tablas + la de placeholders |
| 3 | Cada delta accionable tiene su fila en el TODO con el delta concreto |
| 4 | El `lastPublished` no avanzó entre la primera y la última página (si avanzó, alguien publicó en el medio y hay que re-verificar lo cerrado) |
| 5 | **Cero escrituras** en Designer, CMS y repo |
````

---

## Lo que necesita tu decisión antes de arrancar

| # | Qué | Por qué bloquea |
| --- | --- | --- |
| 1 | **El Announcement Bar** | No existe en prod. Si va, va en el `Nav` y toca las 21 vistas |
| 2 | **Las 14 alternativas** | Auditar contra una sin elegirla reporta como "falta" algo que nadie aprobó |
| 3 | **Las 5 páginas de `/care/*`** | Sin frame propio y en 404. O se construyen desde el template, o se sacan del nav |

---

## El inventario

*Una section `## <URL>` por página, en el orden en que se auditaron.*

### Línea de base

| Qué | Valor | Cuándo |
| --- | --- | --- |
| CSS publicado | `schwabe.webflow.shared.d12efbd98.css` | 2026-09-27 |
| CDN del bundle | `@970fb4b` | 2026-09-27 |
| Publish previo a la auditoría | ✅ `lastPublished` **14:40:54** (venía de 14:33:46) | 2026-09-27 |
| Dominio propio | **No hay ninguno configurado** (`customDomains: []`) — el sitio vive sólo en el subdominio | 2026-09-27 |


---

## `/` — Home

Auditada el **2026-09-27** contra `1241:10399` "Home page - Final", con el sitio
publicado a las 14:40:54. **12 deltas**: 1 section, 4 imágenes, 2 layouts,
1 bloque de texto, 3 de links.

### Sections — el orden es idéntico, falta una

| # | Section del Figma | ¿Está en prod? | Orden Figma | Orden prod |
| --- | --- | --- | --- | --- |
| 1 | **`Announcement Bar`** (dentro de `1241:10400`) | ❌ **NO EXISTE** | 1 | — |
| 2 | `top nav` | ✅ | 2 | nav |
| 3 | Hero | ✅ `#hero` | 3 | 1 |
| 4 | Fee bar | ✅ `#fees-at-a-glance` | 4 | 2 |
| 5 | Sound familiar? (`Hero 5`) | ✅ `#sound-familiar` | 5 | 3 |
| 6 | Statement (**dentro de `Hero 5`**) | ✅ `#you-need-answers` | 6 | 4 |
| 7 | Meet your doctor | ✅ `#meet-your-doctor` | 7 | 5 |
| 8 | `Process 3` | ✅ `#plan` | 8 | 6 |
| 9 | What makes this different | ✅ `#what-makes-this-different` | 9 | 7 |
| 10 | `Testimonials 1` | ✅ `#in-their-own-words` | 10 | 8 |
| — | `1241:10803` — **oculta en el Figma** | correctamente ausente | — | — |
| 11 | Colorado Shockwave | ✅ `.cc-shockwave-card` | 11 | 9 |
| 12 | The cost of waiting (`Hero 4`) | ✅ `#the-cost-of-waiting` | 12 | 10 |
| 13 | Find us in Platt Park | ✅ `#find-us` | 13 | 11 |
| 14 | `Final CTA 1` | ✅ `#book-now` | 14 | 12 |
| 15 | Free guide | ✅ `#free-guide` | 15 | 13 |
| 16 | `Footer / 2` | ✅ `.cc-footer` | 16 | 14 |

**El Statement vive DENTRO del frame `Hero 5`**, no como section de primer
nivel. Un parser que sólo mire hijos de nivel 2 no lo ve y concluye —mal— que
la section se eliminó del diseño. Está, y prod la tiene en el lugar correcto.

### Imágenes — 4 deltas, y son los "cambios chicos" del Figma

| # | Section | Rol | Figma | Prod | Delta |
| --- | --- | --- | --- | --- | --- |
| 1 | `#plan` | Media de la columna izquierda | **Foto real**: la doctora mostrándole un libro de anatomía a una paciente | **Ninguna** — `.plan_media` es un rectángulo beige vacío | 🔴 **Falta la imagen.** El Figma ya NO tiene el placeholder de *"abstract acoustic wave graphic"* de 9.2MB que documentaba `HOME-FIGMA-SYNC.md`: ahora trae la foto definitiva |
| 2 | `#in-their-own-words` | Fondo a sangre | **Pradera alpina de verano** — cielo azul, tundra verde, montañas al fondo | `testimonials-background.jpg` (`6ab12b49…`) | 🔴 **Foto distinta** |
| 3 | `.cc-shockwave-card` | Media de la card | **Foto del tratamiento**: la doctora aplicando el cabezal en el tobillo de una paciente | `colorado-shockwave-key-visual.png` (`6aabf771…`) — el gráfico abstracto de **1.6MB** | 🔴 **Foto distinta.** Cierra de paso el item de optimizar ese PNG: deja de usarse |
| 4 | `#book-now` | Media de la card | **Foto de recepción** con los dos carteles de marca, en la columna derecha | `cta-banner-background.jpg` (`6ab12b4a…`) a sangre detrás de un scrim | 🔴 **Foto distinta + cambia de rol** (ver layout) |
| 5 | `#hero` | Foto principal | Dos mujeres charlando afuera | `home-hero-active-conversation.jpg` | ✅ matchea |
| 6 | `#you-need-answers` | Textura del fondo | Textura al 15% sobre el oliva | `statement-texture.png` (`6ab12a7e…`) | ✅ **ya está aplicada** |
| 7 | `#meet-your-doctor` | Retrato en arco | Consulta, máscara de arco | `doctor-kati-schwabe-consult.jpg` | ✅ matchea |
| 8 | `#the-cost-of-waiting` | Foto a sangre | Huella de esquí en el nevado | `cost-of-waiting-ski.jpg` | ✅ matchea |
| 9 | Footer | Logotipo + lockup Shockwave | ✅ | `logo-dark.svg` + `colorado-shockwave-lockup-on-forest` | ✅ matchea |

### Layout — 2 deltas estructurales

| # | Section | Figma | Prod | Alcance |
| --- | --- | --- | --- | --- |
| 1 | `.cc-shockwave-card` | **Media izquierda**, copy derecha | **Copy izquierda**, media derecha (verificado por orden de DOM) | Sólo la Home |
| 2 | `#book-now` | **Card de 2 columnas**: bloque oliva sólido con el copy + foto al lado | **Foto a sangre** con `cta_scrim` y el copy encima | 🔴 **9 instancias en 9 páginas** |

El del CTA Banner no es un cambio de foto: es otro componente. Pasa de
*imagen de fondo con scrim* a *dos columnas sin superposición* — lo que además
elimina el problema de contraste del scrim.

### Textos — 1 delta

| # | Section | Elemento | Figma dice | Prod dice | Delta |
| --- | --- | --- | --- | --- | --- |
| 1 | `#sound-familiar` | Las cards de síntoma | **Título + cuerpo**: *"Your shoulder nags"* / *"every time you press overhead, reach into the back seat, or sleep on that side."* | **Una sola frase** por card: *"Your shoulder nags every time you press overhead…"* | 🔴 Confirma el item abierto de `HOME-FIGMA-SYNC.md`. **El copy también cambió**: prod dice *"Your hip, plantar fascia, or low back never fully settles…"* y el Figma *"Your low back never fully settles"* / *"or your hip, or your plantar fascia, …"*. **Hay que leer las 6 cards una por una** — la marquesina del Figma las clipea y sólo se leen 4 completas |

Los otros **94 textos del frame matchean exacto**, incluidas comillas curvas y
el `®`. Verificado por diff normalizado, section por section.

**Un falso positivo que conviene no volver a perseguir**: *"Send me the guide"*
aparece como faltante en un diff ingenuo porque en prod es
`<input type="submit" value="Send me the guide">` — el valor de un atributo, no
un nodo de texto. **Sí está.**

### CTAs y links — 3 deltas

| # | Dónde | Delta |
| --- | --- | --- |
| 1 | Nav | **6 links dan 404**: `/care` y las 5 de `/care/*` (`back-neck-pain`, `headaches-tmj`, `plantar-fasciitis`, `prenatal-postpartum`, `wellness`) |
| 2 | Footer | **Los 4 links sociales apuntan a `#`** — ya anotado en [FOOTER.md](FOOTER.md) |
| 3 | Footer | 5 links de la columna Care mandan a `/care-hub`. **No es un bug** — es el fallback deliberado que documenta `FOOTER.md` para no sumar 404. Lo que sí es un bug es que **el nav haga lo contrario y rompa** |

### El footer matchea el Figma — verificación independiente

El rebuild ya estaba hecho y documentado en [FOOTER.md](FOOTER.md)
(2026-09-25); esto lo confirma contra el frame `1249:29335`. Medido link por
link: las 4 columnas del Figma (**CARE** 8, **NEW PATIENTS** 4,
**ABOUT & RESOURCES** 7, **CONTACT** con teléfono, dirección + *Get directions*
y email), la banda del medio (logotipo grande, *"Also home to Colorado
Shockwave®"* + la marca, **CONNECT WITH US** con las 4 píldoras) y la línea
legal con `Privacy Policy · Terms of Use` a la izquierda y
`© 2026 Schwabe Family & Sports Chiropractic, P.C. All rights reserved.` a la
derecha — **está todo**. Los pendientes que quedan son los que `FOOTER.md` ya lista:
los 4 destinos sociales en `#`, los `footer-link` abajo del tap target, y el
`/responsive` sin correr.

**Hallazgo menor de semántica**: el footer es un `<section>`, no un `<footer>`.
El documento no tiene ningún `<footer>`, así que se pierde el landmark. Está
fuera del alcance de esta auditoría pero vale anotarlo.

### Placeholders del Figma — ninguno

El frame no tiene contenido marcado como placeholder. Las 5 capas con nombre
`Body` son capas renombradas cuyo texto real se leyó del render, no
placeholders.

---

## `/care-hub` — Care Hub

Frame `1249:12003`. **2 deltas.** El orden de las 8 sections y los textos matchean.

| Eje | # | Delta |
| --- | --- | --- |
| Imagen | 1 | **`#approach` no tiene foto.** El Figma dibuja *"Candid chiropractic treatment photography area"*, **590×719**, en la columna derecha. Prod tiene la columna de copy y el testimonial de Joy, pero **0 imágenes** |
| Layout | 2 | **`#csw-bridge` tiene las columnas invertidas.** Figma: media a la **izquierda** (`x=80`), copy a la derecha (`x=720`). Es el mismo patrón que la card de Shockwave de la Home |

**Lo que sí matchea**: el hero con su banda de foto a sangre (`007_SC-OURSTORY-PH-003…`, el mismo asset), los 6 iconos de Areas of Care, el H2 *"Care across the full arc of an active life."*, el bloque de Shockwave palabra por palabra y el CTA final.

**Ojo con las 6 cards de Areas of Care del Figma**: las seis tienen el **mismo título y el mismo cuerpo** (*"Sports & Activity Injuries"*). Es un componente repetido en el mockup, no copy real — prod tiene los 6 títulos correctos. **No es un delta.**

---

## `/care/sports-activity-overuse-injuries` — Injury template

Frame `1249:12270`. **1 delta de copy, menor.**

| Eje | # | Delta |
| --- | --- | --- |
| Texto | 1 | La línea de hombro: Figma *"Shoulder pain, **shoulder strains**, rotator cuff irritation…"* · prod *"Shoulder pain, **strains**, rotator cuff irritation…"* |

Las otras 2 diferencias que marcó el diff son **falsos positivos**: son nombres de capa **truncados** en Figma (*"Dr. Schwabe is a Certified Chiropract…"*), no textos distintos.

Las 13 condiciones, el hero, `#recognition`, `#care-approach`, `#csw-bridge`, `#faq` y `#final-cta` matchean.

---

## `/wellness-membership` — Wellness Membership

Frame `1249:15030`. **2 deltas**, y uno es un precio.

| Eje | # | Delta |
| --- | --- | --- |
| 💵 Dato | 1 | **El per-visit rate de Ultimate Longevity · 4 visitas.** Figma **`$143`**, prod **`$145`**. **La aritmética le da la razón a prod**: $580 ÷ 4 = $145. O el Figma tiene el error, o el monthly fee tendría que ser $572. **Es un precio: necesita confirmación, no una suposición.** El mismo `$143` aparece en el frame de Fees |
| Imagen | 2 | **`#fit` no tiene foto.** El Figma dibuja una imagen de **542×768** a la izquierda de *"Is Wellness Membership right for you?"*. Prod tiene sólo la columna de copy |

**Los otros 11 precios matchean exacto**: Move Well $88/$88, $168/$84, $320/$80 · Ultimate $160/$160, $306/$153, $580.

**Lo que sí matchea**: el hero con `home-hero-active-conversation.jpg`, `#recognition`, `#what-it-is`, la banda de foto (`wellness-img.png`), las 8 inclusiones, las 2 tablas, el FAQ de 4 accordions y el footer.

---

## `/fees-and-policies` — Fees & Practical Details

Frame `1249:14334`. **La página que más diverge: 4 deltas y dos son bloques enteros.**

| Eje | # | Delta |
| --- | --- | --- |
| Section | 1 | **🔴 El bloque de Medicare no existe en prod.** El Figma trae 5 sub-bloques: *Medicare patients* · *What Part B covers* · *Maintenance and wellness care* · *Medicare Advantage (Part C)* · *Questions before you book*. En prod la palabra "Medicare" aparece **una sola vez, en el intro del hero** — que además **promete** ese contenido: *"Direct answers on fees, insurance, payment, cancellations, **and Medicare**"*. La página promete algo que no entrega |
| Section | 2 | **🔴 Falta *"Three ways to pay for ongoing care."*** — Pay-per-visit · Care Package · Wellness Membership, con su bajada *"After your first visit, your doctor will explain what kind of care makes sense and which payment structure fits."* Prod tiene `#wellness-membership` pero no la comparación de las tres |
| Texto | 3 | **Las cards de *The quick version* son otras.** Figma: 5 con labels `out of network` · `superbill ready` · `due today` · `HSA/FSA` · `Not covered`. Prod: **3 cards de estadística** — `60 Full minutes` · `20 Hands-on minutes` · `3 Ways to pay`. Es otro modelo de contenido, no un wording distinto |
| 💵 Dato | 4 | El mismo **`$143` contra `$145`** de Wellness |

**La política de cancelación NO es un delta, y conviene dejarlo escrito** porque parece uno: el Figma dibuja **dos ventanas distintas** —48h para la primera visita, 24h para las de seguimiento, y el depósito de $100 se pierde abajo de 24h— y **prod las tiene las dos, exactas**. El FAQ dice 24h para seguimiento, consistente.

👉 **Eso responde la pregunta que el TODO tenía abierta** sobre las dos políticas sin definir del Master Copy. Lo construido es coherente; lo único que falta es el sign-off de Kati, no una decisión de producto.

**El cuerpo repetido 5 veces en el Figma** (*"So you can actually be understood, not processed…"*) es **placeholder del mockup**, no copy — aparece idéntico en las 5 cards.

---

## `/faq` — FAQ

Frame `1249:19487`. **0 deltas reales.** Es la página más limpia del sitio.

| Check | Figma | Prod |
| --- | --- | --- |
| Preguntas | 10 + 9 + 10 + 6 + 6 + 3 = **44** | **44 `<details>`** ✅ |
| Categorías | First Visit & Booking · Care & Treatment · Insurance, Payment & Policies · Pregnancy, Children & Family Care · Colorado Shockwave® · Evidence & Safety | **Las 6, en el mismo orden** ✅ |
| Árbol del hero | vector 747×778 a la derecha | `faq-tree-clean.svg` ✅ |
| Cierre | *"Still have questions?"* + *"Call or text us at 720-432-9157…"* + CTA | ✅ |

**Dos trampas que este frame trae y hay que no reportar como deltas:**

1. **Los 6 botones de categoría del Figma tienen nombres placeholder** — `Text one`, `Category two`, `Category three`, `Category four` ×3. Prod tiene las etiquetas reales, que son las correctas.
2. **El frame arrastra dos sections ocultas de Community Partners** (`1249:19533` y `1249:19551`, *"Rooted in Platt Park, connected across South Denver"*). Son exactamente el caso de la regla 2: si no se filtra el subárbol `hidden`, se audita una página que no existe.

---

## `/about/our-story` — Our Story

Frame `1249:17334`. **2 sections del Figma no existen en prod.**

| Eje | # | Delta |
| --- | --- | --- |
| Section | 1 | **🔴 Falta el carrusel de testimonials.** El Figma trae `1249:17670` con **6 instancias de `Testimonial`** de 480×622 y sus dos flechas de 44px. En prod no hay ni `swiper-slide` ni `.testimonial-card` |
| Section | 2 | **🔴 Falta *"Find us in Platt Park"*.** El Figma trae `1249:17687`: mapa de 610×700 a la izquierda, dirección, **la tabla de los 7 días con horarios**, teléfono y *Arriving*. Prod no tiene la tabla (ni la palabra "Wednesday") |
| Section | 3 | Prod cierra con `#community` (*"We're not just in this neighborhood. We're of it."* + 2 CTAs). El Figma cierra con `Final CTA 1`. **Son contenidos distintos en el mismo lugar** — hay que decidir cuál manda |

**Lo que sí matchea, y es mucho**: el hero, la banda de foto a sangre, *Rooted in Platt Park* con sus 3 párrafos, *Meet Dr. Schwabe* completa (incluidos los dos blockquotes — *"My hands just take me there."* y el de la empatía), *The health journey that changed how she listens*, los 6 items de **Credentials & Training**, las 4 cards del Schwabe Standard y *The space*.

**Las 4 imágenes de prod son fotos reales** (`our-story-band`, `our-story-platt-park`, `our-story-dr-schwabe`, `our-story-the-space`), mientras el Figma sigue usando los placeholders `001_SC-HOME-PH-001…` y `007_SC-OURSTORY-PH-003…`. **Prod está adelante del Figma acá** — no es un delta a corregir.

---

## `/about/team` — Our Team

Frame `1249:17851`. **2 deltas, y son inversos.**

| Eje | # | Delta |
| --- | --- | --- |
| Section | 1 | **Prod tiene una section que el Figma no**: `#growing-team` — *"We're growing thoughtfully."* con su foto `team-growing-reception.png` y un CTA |
| Section | 2 | **El Figma tiene un `Final CTA 1` que prod no.** Prod termina en `#growing-team` y pasa directo al footer |

**Lo que matchea**: el hero (*"The people behind the Schwabe Standard."*), la banda de foto de equipo (`team-culture-group.png`, el mismo asset), *"Meet the team."* y **las 2 cards de persona** — Figma dibuja 2, prod tiene 2 (Dr. Kati Schwabe y Frank Hernandez).

**Las dos son la misma decisión**: si `#growing-team` se queda, el `Final CTA 1` del Figma sobra; si no, hay que agregarlo. No lo resuelvo solo.

---

## `/new-patients` — New Patients

Frame `1249:18150`. **0 deltas.** El diff normalizado da **cero** textos del Figma ausentes en prod, y las 8 sections están en orden: `#hero` · `#what-to-expect` · `#after-booking` · `#fees-link` · `#arrival-details` · `#faq` · `#final-cta` · footer.

Las 4 imágenes de prod son fotos reales (`new-patients-hero-welcome`, `new-patients-treatment`, `new-patients-clinic-exterior`, `south-denver-map`).

**Sigue abierto lo que ya estaba en el TODO** y esta auditoría no cambia: el `<source>` del video de la orientación está **vacío**.

---

## `/about/community-partners` — Community Partners

Frame `1249:17937`. **1 delta.**

| Eje | # | Delta |
| --- | --- | --- |
| Section | 1 | Prod cierra con `#final-cta` — *"Looking for care that fits into your bigger health picture"* + `community-cta.png`. El Figma cierra con `Final CTA 1`. **Mismo lugar, contenido distinto** — la misma decisión que en Our Story y Our Team |

**Los 6 partners matchean**: The Point Denver · Healing Roots Natural Medicine · Stefany Testerman (Serenity) · Rise Rehab and Sport Performance · Dr. Amy Osborne (Apto) · Kalo Fitness, con sus descripciones completas.

⚠️ **En el Figma los 6 links dicen `kalofitness.com`** — es un placeholder repetido, no 6 destinos. **Prod tiene los reales** (`aptophysicaltherapy.com`, `healingrootsclinic.com`, `kalofitness.com`…). **Prod está adelante del Figma; no se toca.**

---

## `/blog` — Blog

Frame `1249:23160`. **2 deltas de texto.**

| Eje | # | Delta |
| --- | --- | --- |
| Texto | 1 | El H2 de la grilla: Figma **"Expert guidance for moving better."** · prod **"All articles."** |
| Texto | 2 | **Falta el bloque `Advanced clinical training`** del intro — el Aside con *"Dr. Schwabe is a Certified Chiropract…"* que el Figma pone bajo los dos párrafos. En prod no está |

**Lo que matchea**: el eyebrow *Educational library*, el H2 *"Helpful education for active South Denver patients."*, los dos párrafos del intro, y las **3 cards de artículo** con su categoría, fecha y bajada.

**Dos placeholders del Figma que no son deltas:**
- **9 cards, no 9 artículos.** El Figma repite los mismos 3 artículos **tres veces** para llenar la grilla. Prod tiene 3, que es lo correcto.
- **Los 4 chips de categoría** se llaman `View all`, `Text one`, `Category two`, `Category three`. Prod tiene las etiquetas reales.

---

## `/blog/<slug>` — Blog Post

Frame `1249:23553`. **Auditable por primera vez**, porque el template recién publica. **2 deltas.**

| Eje | # | Delta |
| --- | --- | --- |
| Section | 1 | **🔴 Falta *"Subscribe to our newsletter"*.** El Figma trae `CTA / 26 /` con H2, bajada, input de email, botón `Subscribe` y la línea *"By clicking Sign Up you're confirming that you agree with our Terms and Conditions."* En prod ese lugar lo ocupa `#free-guide` (*"Not ready to book yet? Start here."*) — **es otra oferta**: el lead magnet de la guía en vez de una suscripción |
| Texto | 2 | **Falta `Image caption`** bajo la foto del cuerpo. Ya estaba en el TODO; el frame nuevo lo confirma |

**Lo que sí está, y vale confirmarlo porque nunca se había podido ver**: el breadcrumb, el byline con fecha y read time, el índice *"In this article"* a la derecha, **"Share this post"** con sus 4 botones, *"More from the practice."*, *"View all articles"* y el `Final CTA 1`.

**El cuerpo del Figma es Lorem ipsum entero** — prod tiene el copy real de los 3 artículos. **Prod está adelante.**

**Sigue abierto** el 🔴 del TODO que esta auditoría no puede cerrar: el byline no lee el CMS (el `Image` del retrato sin `assetId`, los `Plain Text` sin override de `Text`). El Figma nuevo además **saca el retrato**, así que la parte de la foto se resuelve borrándola, no bindeándola.

---

## `/contact` — Contact

Frame `1249:25161`. **0 deltas.** El diff normalizado da **cero** textos ausentes, y las 5 sections coinciden: `#contact-hero` · `#clinic-details` · `#the-space` · `#inquiry-form` · footer.

**Sigue abierto de antes**: el hero y el mapa usan el mismo asset placeholder de MAST (`Surreal Architectural Dreamsc…`), y la notificación del formulario no tiene destinatario.

---

## `/join-our-team` — Join Our Team

Frame `1249:26448`. **0 deltas.** Los 10 bloques de copy que verifiqué uno por uno están todos: el H1, *"Clinical depth over throughput. Every time."*, las dos vacantes (**Associate Chiropractor** y **Chiropractic Assistant**) con sus listas de *What this role is* / *What we are looking for*, y el formulario de Standing Interest con su `Role type` y su `Brief introduction`.

El Figma **tampoco** tiene `Final CTA 1` acá, así que prod coincide en terminar en `#standing-interest`.

---

## `/products-we-recommend` — Products We Recommend

Frame `1249:26302`. **1 delta.**

| Eje | # | Delta |
| --- | --- | --- |
| Texto | 1 | **El tag de la card.** Figma muestra **`Sleep & Comfort`** y tiene `Available in Clinic` **oculto**. Prod muestra **`Available in Clinic`**. Están invertidos |

**Lo que matchea**: el eyebrow *A short, trusted list*, el H1 *"Products we trust enough to recommend."*, *"Useful over noisy. Trusted over trendy."*, y la card de Pillowise completa con sus 4 párrafos y *Custom-Fitted Pillows*.

**Los 7 chips de categoría del Figma son placeholder** (`View all`, `Text one`, `Category two`, `Category three` ×4). No son 7 categorías reales.

---

## `/privacy-policy` y `/terms-of-use` — las legales

Frame `1249:26662` (un solo template para las dos). **3 deltas, los mismos en ambas páginas.**

| Eje | # | Delta |
| --- | --- | --- |
| Imagen | 1 | **Falta el árbol del hero.** El Figma pone el logotipo-árbol de **747×778** a la derecha (`x=744`), igual que en el FAQ. Prod no tiene ningún SVG ahí |
| Section | 2 | **Falta la card `Questions?`** al pie del índice lateral — *"We are happy to clarify how these policies relate…"* + `info@schwabechiropractic.com`. El email **sí** está en la página, pero no esa card |
| Texto | 3 | **Falta `Share this post`** al pie del documento, al lado de *Last Modified* |

**Lo que matchea**: el H1, el índice lateral con su rótulo **`On this page`** (no *"In this article"* — prod usa el correcto), y el cuerpo legal completo.

**Un falso positivo que conviene anotar**: *"Last Modified"* no aparece en el HTML porque el rótulo lo pone un **`::before` de CSS** sobre `.legal_meta` — en el markup sólo está la fecha. **Está bien construido**; un grep del HTML no lo ve.

**El cuerpo del Figma es Lorem ipsum entero.** Prod tiene el texto legal real. Prod está adelante.

---

## La vista 404

Frame `1249:26809`. **1 delta.**

| Eje | # | Delta |
| --- | --- | --- |
| CTA | 1 | **La etiqueta del botón.** Figma: **`BACK TO HOME`**. Prod: **`Contact Clinic`** |

Esto **cambió respecto del frame contra el que se construyó**: `UTILITY-PAGES.md` documenta que el 404 se hizo contra `1004:5645`, donde el diseño mandaba a Contact, y que la salida a la home la daba el logo del nav. El frame nuevo invierte esa decisión.

Todo lo demás matchea exacto: el numeral **404**, *"Looks like this page wandered off the trail"* en itálica, el párrafo, la foto del nevado con huella de esquí y el velo claro, más el nav y el footer.

---

## `/patient-stories` — Patient Stories

Frame `1249:23751`. **2 deltas, y los dos ya estaban en el TODO** — el frame nuevo los confirma.

| Eje | # | Delta |
| --- | --- | --- |
| Layout | 1 | **`#themes` cambió de estructura.** Figma: columna izquierda de **430px** con la lista de categorías **vertical** y el título del theme (*"Feeling heard, safe, and understood"*) encima de las citas, en una columna de **650px** a la derecha. Prod: chips horizontales arriba de una grilla |
| Imagen | 2 | **La historia destacada sigue con foto.** El Figma ya no la dibuja — es el pedido de Derek. Prod todavía la tiene |

**Lo que matchea**: el hero con su trustbar (`50+ · Google reviews`, `Since 2013`), *"The details are different. The pattern is familiar."*, la historia de Sarah completa con sus 4 blockquotes, *"What patients notice."*, la banda de Shockwave con su lockup y **"See more patient stories"** (la etiqueta nueva de Derek, ya aplicada), y *"Want to hear from more patients?"* con las estrellas oliva.

**Un falso positivo que casi reporto**: el H1 *"Real patients. Real relationships. Real outcomes."* da "ausente" en un grep porque prod lo parte en **tres nodos de texto**, uno por frase. Está completo y correcto.

**La banda de Shockwave ya no tiene foto de fondo** en prod, que es lo que pedía Derek — ese ítem del TODO está cerrado de hecho.

---

# 🖼️ Segunda pasada — el eje de imágenes, comparado a ojo

**La primera pasada de este eje estaba mal hecha y hay que decirlo.** Comparé
**presencia** y **nombre de archivo**, no las imágenes. Con eso escribí, sobre
Our Story, que *"prod está adelante del Figma — no es un delta a corregir"*.
Eso fue **una decisión de producto que no me correspondía tomar**: con el Figma
como base de verdad, toda foto distinta es un delta.

Rehecho el **2026-09-27** bajando cada imagen de prod, renderizando cada nodo
de imagen del Figma por separado y mirándolas lado a lado en hojas de
comparación.

## La regla que invalidó el atajo

**El nombre del asset no dice nada.** El `#cc-media-band` de Care Hub sirve un
archivo llamado literalmente
`007_SC-OURSTORY-PH-003_placeholder_v1_dr-schwabe-primary-trust-image` — **el
mismo nombre que la capa del Figma** — y es **otra foto**. Un diff por nombre
las habría dado por iguales.

**Hay que mirar las dos imágenes. Siempre.**

## Lo que el Figma tiene y prod no

El Figma trae **una producción fotográfica nueva, hecha en la clínica real**:
se reconocen la pared con el mural de ramas, los dos carteles de marca
(Schwabe Chiropractic + Colorado Shockwave), el equipo real, las salas de
tratamiento, el expositor de Pillowise y el cabezal de shockwave en uso.

Prod corre un set **anterior y distinto**, más dos placeholders del starter de
MAST que nunca se reemplazaron.

## Las 5 que SÍ matchean

| Página | Slot |
| --- | --- |
| Home | Hero — misma foto (el Figma la recorta más apretada) |
| Home | Meet your doctor |
| Home | The cost of waiting |
| Community Partners | La banda de South Pearl Street |
| Our Story | *Rooted in Platt Park* — **misma foto, distinto recorte**: el Figma la enmascara en **arco**, prod la deja rectangular |

## Las 23 que NO matchean

| # | Página · slot | Figma | Prod |
| --- | --- | --- | --- |
| 1 | **Contact** · hero | Saludo en recepción, doctora de verde | 🔴 **Render violeta de arquitectura surrealista — placeholder del starter de MAST** |
| 2 | **Contact** · mapa | Mapa de la zona | 🔴 **El mismo placeholder violeta** |
| 3 | **Products** · foto del producto | El **expositor de Pillowise** con las almohadas y el chip *Available in Clinic* | 🔴 **Degradado abstracto genérico de MAST** |
| 4 | **Products** · hero | El expositor de Pillowise en la clínica | La foto del hero de la Home |
| 5 | **Our Story** · banda | La doctora en **recepción**, con los dos carteles de marca | La doctora junto a una camilla |
| 6 | **Our Story** · Meet Dr. Schwabe | **Retrato de estudio**, fondo gris azulado, suéter granate | De cuerpo entero en sala de tratamiento |
| 7 | **Our Story** · The space | **Pasillo** con las puertas de tratamiento | Sala con cielorraso de cielo |
| 8 | **Our Team** · banda de cultura | La doctora **y Frank** apoyados en el mostrador, con los carteles | Cuatro mujeres del equipo |
| 9 | **Join Our Team** · banda de cultura | La doctora **conversando con una visitante** en recepción | La misma foto de las cuatro mujeres |
| 10 | **Patient Stories** · banda | **Los dos carteles de marca** en primer plano sobre el mural de ramas | Ajuste lateral en camilla |
| 11 | **Patient Stories** · hero | La doctora trabajando **la rodilla** de un paciente | Doctora con paciente sentada |
| 12 | **New Patients** · hero | Saludo en recepción, otra toma | Saludo con el cartel SCHWABE CHIROPRACTIC |
| 13 | **New Patients** · `#after-booking` | La doctora trabajando **el brazo**, en arco | Doctora con paciente sentada |
| 14 | **Care Hub** · banda del hero | Ajuste con paciente **boca abajo**, pared de panel ondulado | Ajuste lateral en camilla |
| 15 | **Care Hub** · `#approach` | Manos sobre el hombro, en **arco** | 🔴 **No hay imagen** |
| 16 | **Care Hub** · `#csw-bridge` | **Foto del tratamiento** — el cabezal en la rodilla | El key visual abstracto de 1.6MB |
| 17 | **Injury** · hero | La doctora trabajando la rodilla | Doctora con paciente, otra sala |
| 18 | **Injury** · `#csw-bridge` | La misma foto del tratamiento | El mismo key visual abstracto |
| 19 | **Wellness** · hero | **Ejercicio con banda**, la doctora asistiendo una sentadilla | La foto del hero de la Home |
| 20 | **Wellness** · banda | La misma foto del ejercicio con banda | La doctora saludando en recepción |
| 21 | **Wellness** · `#fit` | La doctora con una paciente, en **arco** | 🔴 **No hay imagen** |
| 22 | **Blog Post** · banda del hero | **Ajuste cervical** en primer plano | Doctora tomando notas frente a una paciente |
| 23 | **Home** · `#plan`, Testimonials, Shockwave, CTA | (ya documentados arriba) | (ídem) |

## Prod reutiliza fotos donde el Figma tiene una distinta por página

Esto no sale de comparar una página: sale de cruzar las 18. **Cinco assets
cubren dos slots cada uno**, y el Figma les da foto propia a todos:

| Asset de prod | Usado en | El Figma tiene |
| --- | --- | --- |
| `home-hero-active-conversation.jpg` | Home hero · **Wellness hero** · **Products hero** | 3 fotos distintas |
| `new-patients-treatment.png` | New Patients `#after-booking` · **Patient Stories hero** | 2 distintas |
| `team-culture-group.png` | Our Team · **Join Our Team** | 2 distintas |
| `007_SC-OURSTORY-PH-003_…` | Care Hub banda · **Patient Stories banda** | 2 distintas |
| `our-story-neighborhood.jpg` | Our Story `#community` · **New Patients** `#final-cta` | — |

## Cómo se rehace esto

Las hojas de comparación se arman con un script en el scratchpad
(`/tmp/aud/sheet.py`): baja el asset de prod por su `src`, renderiza el nodo de
imagen del Figma con `get_screenshot` sobre **el id del nodo de imagen**, no de
la section, y los pega lado a lado. Una hoja por página, una lectura por hoja.

**Las URLs de export de Figma expiran a los 7 días**, así que las hojas se
re-generan, no se archivan.

---

# 🔬 Tercera pasada — section por section, renderizadas

**La segunda pasada tampoco alcanzaba.** Comparé textos (del árbol del Figma) e
imágenes (el asset), pero **no la composición renderizada de cada section**. Un
diff de texto no ve que un marcador pase de numeral a check, que un mapa sea un
rectángulo vacío, o que un scrim sea un degradado en vez de un corte duro.

Rehecho el **2026-09-27** con **Chrome headless por CDP** —la receta de
`RESPONSIVE.md`, porque el MCP de Chrome sigue caído— capturando cada section de
prod por su selector y pegándola al lado del render del nodo de Figma.

## El capturador

`/tmp/aud/shot.js <url> <prefijo> <sel...>` navega a 1440, espera
`document.fonts.ready`, **fuerza el estado final de las animaciones** e
**invisibiliza el nav** (que si no se cuela en toda captura con
`scrollIntoView`), y saca un `Page.captureScreenshot` clipeado al
`getBoundingClientRect()` de cada section.

**Forzar el estado final no es opcional.** La primera corrida salió con las
cards de Four Things en `opacity` casi cero: el stagger de `reveal.js` no había
disparado, y la captura mostraba una section vacía que no es la que ve un
visitante. El script inyecta un `<style>` con `opacity:1 !important` sobre todo
y agrega `.anim-failsafe` en `<html>`.

---

## 🔴 Dos cosas que esta pasada CORRIGE de las anteriores

### El CTA Banner no cambió de estructura — esto era mi error

La segunda pasada decía: *"Figma: card de 2 columnas. Prod: foto a sangre con
scrim. **No es un cambio de foto, es otro componente**, 9 instancias en 9
páginas"*, y recomendé empezar por ahí.

**Renderizadas las dos, la composición es la misma**: bloque oliva a la
izquierda con el copy, foto a la derecha. Lo que difiere es el borde:

| | Figma | Prod |
| --- | --- | --- |
| Transición oliva → foto | **Corte duro** vertical al medio | **Degradado** suave (`.cta_scrim`, `linear-gradient` de .88 a 0) |

Es un ajuste del scrim, **no un rebuild**. Baja de 🔴 alta a media y deja de
ser el primer item de la lista.

**La lección**: leí `cta_scrim` + `cc-media-fill` en el HTML y deduje
"foto a sangre con el copy encima". El DOM decía la verdad y yo le puse encima
una conclusión visual que no había mirado.

### La card de Colorado Shockwave sí está en la Home

La segunda pasada no la reportó como faltante, pero mi captura recortada la
sugería. Verificado en el DOM: `#what-makes-this-different` **tiene**
`.shockwave-band` con su marca y su botón. **No es un delta.**

---

## Deltas nuevos que sólo aparecen renderizando

| # | Página · section | Delta |
| --- | --- | --- |
| 1 | **Our Story** · *Four things…* | 🔴 **El marcador de cada columna.** Figma: **check ✓ dentro de un disco relleno**. Prod: **numeral 1 · 2 · 3 · 4** sin disco |
| 2 | **Home** · `#find-us` | 🔴 **El mapa no existe.** El Figma dibuja un **mapa ilustrado de Platt Park** con calles, etiquetas y un pin. Prod tiene un **rectángulo gris vacío con un ícono de pin** — medido: 0 `<img>` y 0 `<svg>` en la section |
| 3 | **Home** · `#what-makes-this-different` | **La stat de la card 4.** Figma **`100%` / of visits**. Prod **`+` / soft tissue work** |
| 4 | **Home** · ídem | **Dos títulos de card.** Figma *"A Private Room **to Yourself at Every Visit**"* · prod *"A Private Room **at Every Appointment**"*. Y *"…Built Into Every **Visit**"* · prod *"…Every **Session**"* |
| 5 | **Our Story** · *The space* | 🔴 **Prod tiene un bloque que el Figma no dibuja**: *Four treatment rooms · A dedicated shockwave suite · Warm, considered design · In the heart of Platt Park*, más una **card de ubicación** con mapa, dirección, teléfono y horarios |
| 6 | **Our Story** · cierre | Figma: **card oliva con foto** a la derecha. Prod: **banda oliva plana**, sin foto |

### Y una corrección a la primera pasada

**"Find us in Platt Park" NO falta en Our Story.** La primera pasada la dio por
ausente porque buscó la palabra *"Wednesday"* en el HTML. El contenido está:
dirección, teléfono y horarios viven **dentro de `#cc-space`**, como card
lateral. Lo que difiere es el tratamiento — el Figma le da una section propia
con un mapa grande; prod la comprime en una card.

### Una inconsistencia dentro del propio Figma

En `#find-us` de la Home, el pin del mapa dice **`628 S PEARL`** mientras el
H2 al lado dice **`628 E Evans Ave, Ste 100`**. Es la dirección vieja, la del
primer local. **Antes de construir ese mapa hay que confirmar cuál va** — si se
copia el Figma tal cual, el sitio publica la dirección equivocada.

## Lo que matcheó renderizado

Home: hero · fee bar · *Free guide* (mismo mockup del libro y mismo form).
Our Story: hero · *Rooted in Platt Park* (arco + card de cita montada abajo a
la derecha, idénticos).

## 🔴 La dirección vieja está publicada en el mapa de New Patients

El delta más caro de esta pasada, y el único que es **un error de datos en
producción**, no una diferencia de diseño.

| | Pin del mapa |
| --- | --- |
| **Prod** `/new-patients` | **`628 S PEARL`** ← el local **original**, de South Pearl Street |
| **Figma** `1249:19120` | `628 E Evans-Suite 100` ← el correcto |

La clínica se mudó a 628 E Evans en 2026 — lo cuenta la propia página de Our
Story. **El mapa publicado manda a los pacientes a la dirección anterior**,
mientras el H2 al lado dice la nueva.

**Y el Figma lo tiene mal en el otro sentido en la Home**: el mapa de
`#find-us` (`1241:11006`) dibuja el pin en `628 S PEARL`. O sea que el asset
viejo está en los dos lados y sólo el frame de New Patients lo corrigió.

👉 **Un solo asset de mapa, bien rotulado, arregla las dos.** Antes de
exportarlo del Figma hay que mirar cuál de los dos frames trae el pin correcto.

---

## Sections comparadas renderizadas — el detalle

### Home

| Section | Resultado |
| --- | --- |
| Hero · fee bar | ✅ |
| `#what-makes-this-different` | ⚠️ **La stat de la card 4**: Figma `100%` / *of visits* · prod `+` / *soft tissue work*. **Dos títulos**: *"A Private Room **to Yourself at Every Visit**"* vs *"…**at Every Appointment**"*, y *"…Built Into Every **Visit**"* vs *"…Every **Session**"*. La banda de Colorado Shockwave **sí está** |
| `#find-us` | 🔴 **El mapa no existe en prod** — 0 `<img>` y 0 `<svg>`, un rectángulo gris con un ícono de pin. El Figma dibuja un mapa ilustrado de Platt Park |
| `#free-guide` | ✅ mismo mockup del libro, mismo form |
| `#book-now` | ⚠️ Misma composición. Difiere el borde: **corte duro** en el Figma, **degradado** en prod |

### Our Story

| Section | Resultado |
| --- | --- |
| Hero · *Rooted in Platt Park* | ✅ (arco + card de cita montada, idénticos) |
| *Four things…* | 🔴 **Check ✓ en disco** (Figma) vs **numeral** (prod) |
| *The space* | 🔴 Prod trae un bloque extra de 4 puntos + card de ubicación que el Figma no dibuja |
| Cierre | 🔴 Figma: card oliva **con foto**. Prod: banda plana |

### Care Hub

| Section | Resultado |
| --- | --- |
| *The approach* | 🔴 **Otro layout**: Figma = copy + **foto en arco** a la derecha, cita dentro de la columna. Prod = **dos columnas de texto**, sin foto, cita en card beige |
| *First visit process* | 🔴 Banda **oliva media** (Figma) vs **forest oscuro** (prod). Faltan los **checks ✓ en disco** y los **filetes** entre ellos |
| *Areas of care* | ✅ — la card oscura del Figma es el **hover**, decidido en `animations/AREA-CARD-HOVER.md`. **No es delta** |
| *Shockwave bridge* | ⚠️ Eyebrow: Figma = **lockup de marca + `Colorado Shockwave®`** · prod = *"ALSO AVAILABLE HERE"* |

### New Patients

| Section | Resultado |
| --- | --- |
| `#after-booking` | ✅ composición idéntica (arco + card de cita oliva montada) |
| `#arrival-details` | 🔴 **El pin del mapa** (arriba). El botón de play chico en la esquina ya estaba en el TODO |

### Patient Stories

| Section | Resultado |
| --- | --- |
| `#themes` | 🔴 Confirmado con render: Figma = **columna izquierda** con título, bajada y lista **vertical** de categorías + **una columna** de 3 citas con el título del theme encima. Prod = título centrado, **chips horizontales** y grilla de 3 columnas con 13 citas |
| `#featured-story` | 🔴 Confirmado: Figma **sin foto**, dos columnas de texto. Prod **con foto en arco** |

---

## ⚠️ Cobertura de esta pasada

**5 de 18 páginas** están comparadas section por section renderizadas: Home,
Our Story, Care Hub, New Patients y Patient Stories.

**Faltan 13**: Injury · Wellness · Fees · FAQ · Our Team · Community Partners ·
Blog · Blog Post · Contact · Products · Join Our Team · las dos legales · 404.

Las 13 tienen hecho el eje de **texto** (primera pasada) y el de **imágenes**
(segunda). Lo que no tienen es este tercer eje — y las 5 que sí lo tienen
sacaron **11 deltas que los otros dos ejes no veían**, así que hay que
asumir que las 13 restantes esconden más.

---

# 💬 Los comentarios de "Final review" — la instrucción más nueva

Pasados por Pablo el **2026-09-27**. **Derek Anderson es el cliente; Olha
Horlach es la diseñadora.** Un comentario de Derek es un pedido. Uno de Olha es
una pregunta o una propuesta **hacia** Derek: sólo se aplica si él respondió
aprobándolo.

**Esto manda sobre el Figma**, que es la regla que este doc ya fijaba y que acá
se vuelve concreta: hay frames que dibujan exactamente lo que Derek pide sacar.

## ✅ Confirmados por el cliente — se implementan

### #101 · La regla del ® — **cierra una decisión que llevaba abierta desde el 2026-09-18**

`RESPONSIVE.md` medía el problema (0.673em de avance, *"decisión pendiente del
usuario"*) y el TODO lo tenía en *Necesita una decisión tuya*. **Derek la dio**,
y es más específica de lo que se había planteado:

| Regla | Detalle |
| --- | --- |
| Dónde | **Sólo en la primera mención de texto por página** |
| Dónde NO | **Nunca en botones**, nunca en menciones posteriores |
| Tamaño | **~60% del tamaño del texto** |
| Alineación | El tope aprox. a la **cap height**, no el glifo por defecto de la fuente |
| El logo | Si el ® es parte del logo, **siempre queda**. Y **el logo no cuenta**: la primera mención de texto igual lleva el suyo |

👉 **Esto vuelve viable la salida por JS** que `RESPONSIVE.md` proponía: un pase
en `global.js` que envuelva el ® en `<sup class="u-reg">`. Pero ya **no puede
ser un reemplazo global** — tiene que saltear botones y quedarse sólo con la
primera aparición de cada página. Es un selector con estado, no un
`replace()`.

### #101 (bis) · El eyebrow de Shockwave va con el logo horizontal real

En la section de shockwave de la Home, Derek pide **el logo horizontal real
como eyebrow**, no ícono + texto. El `.ai` está en Google Drive; alto **40–50px**
para que se lean "COLORADO" y el ®. Con el logo puesto, el ® del body va en su
primera mención y **el botón no lleva ®**.

👉 **Esto reemplaza mi hallazgo del eyebrow de Care Hub.** Yo había reportado
*"Figma = lockup marca + Colorado Shockwave® · prod = ALSO AVAILABLE HERE"*. La
instrucción es más nueva y más precisa: **ni una ni otra — va el logo
horizontal**.

### #99 · La imagen del CTA, y el principio de exclusividad

Derek: usar la **imagen 245** (el saludo en recepción) en el CTA, porque es
justo el momento al que el CTA invita. La **249** queda reservada para el hero
de **Join Our Team**, y quiere que **los heros sean exclusivos cuando se pueda**.

👉 **Esto valida el hallazgo de la segunda pasada** — prod reutiliza 5 fotos en
2 slots cada una — y le da el criterio del cliente para resolverlo.

⚠️ **Y abre una ambigüedad**: el comentario es sobre **`Final CTA 2`**, que es
uno de los 14 frames alternativos sueltos. Pero **el frame de la Home tiene
embebido `Final CTA 1`** (`1249:22956`). Hay que confirmar cuál de los dos es
el que va.

### #103 · Fees — sacar la imagen (el Figma dibuja lo contrario)

Derek: **no hace falta imagen, se puede sacar**. Heading **centrado**, checklist
**alineado a la izquierda** dentro de una columna angosta centrada.

👉 **Caso de libro de por qué el comentario manda.** El frame de Fees **sí
tiene** una imagen ahí (`1249:14888`, 560×480). Construir contra el Figma
habría agregado justo lo que el cliente pide sacar.

### #109 · New Patients · *What happens after you book*

Derek: *"The text placement on top of most of the photo doesn't work."*

👉 **Esta section yo la había dado por ✅.** Comparada renderizada, prod y Figma
tienen la **misma** composición — arco + card de cita oliva montada encima. Lo
que pasa es que **Derek quiere que las dos cambien**. Matchear el Figma acá no
alcanza.

### #110 · Patient Stories · hero

Derek: mover la card y/o cambiar el crop para que el paciente quede menos
tapado. Subió una alternativa: **`0018_schwabe_chiropractic_chiro_treatment.jpg`**.

👉 Se suma a lo que ya tenía (la foto del hero difiere). Ahora son **tres**
candidatas: la de prod, la del Figma, y esta.

### #108 · El logo del footer

Derek: usar la versión **"reversed"** que subió a Google Drive. Hoy prod sirve
`logo-dark.svg`.

## ⏳ Esperando a Derek

### #106 · Wellness · *Is Wellness Membership right for you?*

Derek reconoce que se le pasó esa página —su build original no tenía imágenes—,
está de acuerdo en que queda mejor con imágenes y **va a mandarlas**. Salvo la
repetida del CTA, va a elegir distintas y no usadas.

👉 **Mi item "#fit no tiene foto" está BLOQUEADO**, no pendiente de hacer. No
se pone la del Figma: se espera la de Derek.

## 💡 Sin respuesta — se mantiene lo diseñado

| # | Qué | Qué hacer |
| --- | --- | --- |
| **#102** | New Patients, *The 60-minute first visit* en verde: Olha agregó el patrón **kintsugi** de fondo + una animación de reveal por pasos | Mantener como está diseñado |
| **#104** | Wellness hero: Olha duda de la imagen, sugiere una vertical | Mantener la actual |
| **#105** | Wellness *Regular care, structured simply*: **Olha puso ahí la misma imagen del hero porque el manifest no la especificaba** | 👉 **Explica por qué el Figma repite la foto en el hero y en la banda de Wellness. Es un placeholder de la diseñadora, no una decisión — no replicarlo como si lo fuera.** Va a cambiar con #106 |
| **#107** | Our Story, **slider de imágenes de la oficina**: *"will this slider work?"* | Implementar el slider como está diseñado |

### #107 corrige DOS hallazgos míos sobre Our Story

Renderizado el nodo `1249:17670`: **no es un carrusel de testimonials.** Es un
**slider de fotos de la clínica**, donde cada slide lleva una imagen del
consultorio **más uno de los cuatro puntos** — *Four treatment rooms · A
dedicated shockwave suite · Warm, considered design · In the heart of Platt
Park* — con flechas prev/next.

Eso deja sin efecto las dos cosas que había escrito:

| Lo que reporté | Lo que es |
| --- | --- |
| *"Falta el carrusel de 6 testimonials"* | No hay testimonials. Es el slider de la oficina |
| *"Prod tiene un bloque extra que el Figma no dibuja"* | **Es el mismo contenido**: prod rinde como **lista de texto estática** lo que el Figma rinde como **slider con una foto por punto** |

El delta real, entonces: **`#cc-space` de Our Story tiene que pasar de cuatro
párrafos a un slider de imágenes**, y Olha ya marcó que nadie confirmó que el
slider funcione.

## 📦 Los assets que hay que buscar en Google Drive

| Asset | Para |
| --- | --- |
| Logo **"reversed"** | El footer (#108) |
| Logo horizontal de **Colorado Shockwave®** (`.ai`) | El eyebrow, a 40–50px (#101) |
| **Imagen 245** | El CTA de la Home (#99) |
| **Imagen 249** | El hero de Join Our Team, **exclusiva** (#99) |
| `0018_schwabe_chiropractic_chiro_treatment.jpg` | Alternativa del hero de Patient Stories (#110) |
| Las de Wellness | **Las manda Derek** (#106) |

---

# 📘 Cuarta pasada — Master Copy v0.36, SEO y anclas

Pasado por Pablo el **2026-09-27**. **v0.36 es más nuevo que el v0.35 contra el
que se construyó el sitio**, y su changelog documenta exactamente qué cambió.

## La conclusión de la pasada

> **El Figma está alineado con v0.36. Producción quedó en v0.35.**

Eso resuelve tres deltas que yo había encontrado sólo comparando Figma ↔ prod y
sobre los que no podía decir cuál de los dos tenía razón. **El Master Copy dice
que la razón es del Figma.**

## Home-06 · los 5 cambios de v0.36, ninguno aplicado en prod

| Qué | v0.36 + Figma | Prod (v0.35) |
| --- | --- | --- |
| Arch de Soft Tissue | **`100%` / OF VISITS** | `+` / soft tissue work |
| Label de Private Room | **`1` / PATIENT PER ROOM** | `1` / Private room |
| Título de Private Room | *"A Private Room **to Yourself at Every Visit**"* | *"…at Every Appointment"* |
| Título de Soft Tissue | *"…Built Into Every **Visit**"* | *"…Every **Session**"* |
| Cierre de Soft Tissue | *"each **visit builds** on the last"* | *"each appointment can build on the last"* |

El changelog explica el porqué de dos de ellos, y conviene no "corregirlos" de
vuelta:

- **`1 / PRIVATE ROOM` → `1 / PATIENT PER ROOM`** se cambió *"para evitar que
  se lea como que hay una sola sala"*.
- La regla que los gobierna: **un arch numérico tiene que leerse como una
  cantidad de su label, y cada heading tiene que afirmar el mismo hecho que su
  arch.** Por eso el título de Private Room también cambió.
- **Vocabulario**: v0.36 fija *"visit"* para la atención en Schwabe y
  *"appointment"* para la experiencia genérica del proveedor anterior. Los dos
  cambios de *Session/Appointment* → *Visit* salen de ahí.

⚠️ El arch del `100%` está **pendiente del sign-off clínico de Kati** según el
propio changelog. No se publica sin eso.

## Home-03 · son 7 cards, no 5, y sólo 2 matchean

v0.36 reestructuró la section a **dos tiers** — `Lead` en serif display y
`Trigger` en sans — que es exactamente el split que el Figma dibuja.

| Card | Lead | Estado en prod |
| --- | --- | --- |
| 1 | A ski day costs you two days | ❌ otro copy |
| 2 | Your SI joint lights up | ✅ |
| 3 | Your shoulder nags | ✅ |
| 4 | Your low back never fully settles | ❌ otro copy |
| 5 | You got the exercise sheet | ❌ otro copy |
| 6 | You're quietly starting to wonder | ❌ **no existe** |
| 7 | You tweaked something recently | ❌ **no existe** |

⚠️ **La card 6 lleva un FLAG explícito en el Master Copy**: su lead no tiene
sustantivo concreto a propósito, *"the recognition hook here is emotional, not
anatomical. Do not 'correct' this to add a body part"*. Es la card que rompe el
ritmo del set — y es justo la que el Figma pinta en oscuro para mostrar el
hover.

## 🔴 Las 4 URLs no son las del spec — y eso reescribe el item de "links rotos"

| Página | `[URL:]` del Master Copy | Slug real |
| --- | --- | --- |
| Our Story | **`/our-story/`** | `/about/our-story` |
| Our Team | **`/team/`** | `/about/team` |
| Community Partners | **`/community-partners/`** | `/about/community-partners` |
| Care Hub | **`/care/`** | `/care-hub` |

👉 **Los links del nav no están mal: los slugs sí.** El TODO llevaba estos
404 anotados como *"links rotos"* y la salida propuesta era cambiar los links.
El Master Copy dice lo contrario: `/care` y `/team` **son** las URLs correctas
y las páginas están en el lugar equivocado.

**El arreglo correcto es mover las 4 páginas**, no reescribir los links. Y hay
que poner redirects 301 de los slugs viejos, porque ya están publicados.

**Ojo con el 301 de Webflow**: `/our-story/` devuelve 301 y puede parecer que
existe. Es sólo Webflow sacando el trailing slash; el destino (`/our-story`) da
404. **Hay que seguir el redirect antes de concluir.**

## SEO — lo que falta, medido

| Check | Resultado |
| --- | --- |
| `<title>` contra `[SEO TITLE:]` | ✅ **17 de 17 exactos** |
| `<meta description>` contra `[META DESCRIPTION:]` | ✅ 18 de 19 — **falta en el template de Blog Post** |
| `og:description` | ❌ **falta en 17 de 19**. Sólo Home y 404 lo tienen |
| `<meta robots>` | ❌ **falta en las 19** |
| `[ROBOTS: noindex, follow]` en las legales | ❌ **Privacy y Terms se van a indexar** |
| `<link rel="canonical">` | ❌ ninguna página |

El `og:description` falta porque las páginas tienen `descriptionCopied: false`
en Open Graph y nadie escribió uno. **Se arregla poniendo ese flag en `true`**,
que copia la description de SEO — 17 escrituras, sin redactar nada.

## Anclas — 24 del spec no existen, pero las 3 que importan sí

| Página | Anclas del spec presentes |
| --- | --- |
| Community Partners · Care Hub · New Patients · Patient Stories · Sports Injuries · Wellness · Join · Blog | ✅ completas |
| Fees | 10/11 — falta **`medicare`** (la section no existe, ver arriba) |
| Our Story | 5/6 — falta `our-clinic` (prod usa `cc-space`) |
| Our Team | 3/5 — faltan `dr-kati-schwabe`, `frank-hernandez` |
| Products | 3/5 · FAQ 5/8 · Contact 1/3 | |
| Privacy · Terms · 404 | 0/1 cada una |
| **Home** | **2 de 12** |

**Las 3 anclas que son destino de un link interno del Master Copy funcionan
todas**: `/new-patients/#arrival-details`, `/new-patients/#what-to-expect` y
`/our-story/#dr-schwabe`. O sea que el impacto real hoy es bajo — pero cualquier
link nuevo que el copy pida va a romper.

La Home es el caso extremo: prod usa nombres descriptivos (`sound-familiar`,
`meet-your-doctor`, `what-makes-this-different`) donde el spec usa
estructurales (`problem-recognition`, `guide`, `differentiators`).

## Lo que el Master Copy CIERRA de mis pendientes

| Item que tenía abierto | Lo que dice v0.36 |
| --- | --- |
| **El Announcement Bar: ¿va o no?** | **Va.** Está especificado entero en `# GLOBAL: Announcement Bar`: 36–40px, arriba del header, en todas las páginas, con dismiss que persiste ~14 días, y **`[FLAG: LAUNCH STATE — at site launch, the bar must be toggled ON]`** con el mensaje que ya vi en el Figma |
| **Los 4 links sociales del footer van a `#`** | **Las URLs existen**: `instagram.com/schwabechiro` · `facebook.com/SchwabeChiropractic` · `youtube.com/@schwabechiropractic` · `linkedin.com/company/schwabechiropractic` |
| **La política de cancelación** | Confirmada igual que prod, **pero con dos FLAGs de revisión abiertos**: *"DO NOT PUBLISH UNTIL POLICY LANGUAGE MATCHES SIGNED PATIENT FINANCIAL FORMS"* |
| **El precio $143 vs $145** | **El Master Copy dice `$145`.** Prod tiene razón; **el Figma tiene el error** |

## Y una contradicción a tres bandas en el 404

| Fuente | Qué dice |
| --- | --- |
| **Master Copy** | H1 *"Page not found."* + **5 CTAs**: Book · Return Home · Explore Care Options · New Patients · Contact Us |
| **Figma** | `404` grande + *"Looks like this page wandered off the trail"* + **1 botón: BACK TO HOME** |
| **Prod** | Igual que el Figma pero el botón dice **Contact Clinic** |

Las tres son distintas. Necesita decisión.

## Dos errores de medición míos, anotados para no repetirlos

1. **Webflow emite `<meta content="…" name="description">`, con los atributos
   al revés.** Un regex que pida `name` primero no matchea, y da *"cero meta
   descriptions en todo el sitio"*. **Un chequeo de metadata tiene que ser
   agnóstico al orden de atributos.**
2. **`grep -c` cuenta líneas, no ocurrencias**, y Webflow minifica el `<head>`
   en una sola línea. `grep -c '<meta'` devuelve `1` en una página con doce.
   Para contar, `grep -o | wc -l`.

---

# 📢 El Announcement Bar — construido el 2026-09-28

Era la **decisión #1** de las tres que este doc listaba como bloqueantes de la
fase 1. Ya no lo es: está construido, en las **19 páginas reales** del sitio, y
verificado en el HTML servido.

## Las dos fuentes, y en qué difieren

El Figma dibuja la barra (`1241:10401`, 1440×51) y el Master Copy la especifica
como comportamiento. **Ninguna de las dos alcanza sola.**

| | Figma `1241:10401` | Master Copy (`# GLOBAL: Announcement Bar`) |
| --- | --- | --- |
| Copy | *"Now seeing patients at our new Platt Park clinic."* | idéntico ✅ |
| CTA | `Get directions` + flecha **↗** | `Get directions →` |
| Destino | no lo dice | **`https://maps.app.goo.gl/G92hGT21js2ZptsQ6`** |
| Cerrar | **no lo dibuja** | `<button aria-label="Dismiss announcement">×</button>` |
| Persistencia | — | **~14 días** |
| Estado de lanzamiento | — | **ON** |

Se construyó con **el diseño del Figma y el comportamiento del Master Copy**: la
flecha es la del Figma (un `ph-arrow-up-right`, no el `→` del copy), y el control
de cerrar existe aunque el Figma no lo dibuje — es un requisito funcional
explícito, la misma clase de omisión que el botón de play del video.

## Las medidas, leídas del render

| Qué | Valor | Cómo se obtuvo |
| --- | --- | --- |
| Fondo | **`#474d33`** = Brand/Ink | Pixel muestreado del PNG — **no** es el Forest Green del footer |
| Texto | **`#fbfaf8`** = Brand/Beige, DM Sans **Medium** | Ídem; el peso se vio comparando el render contra prod |
| Filete del link | **`#cacdb7`** = Border Strong, **2px** | **232 píxeles** contados = 116 × 2, el ancho exacto del bloque del CTA |
| Alto | 51px | 14 + 23 + 14 |
| Contenido | 452px centrado, gap 8px | Del metadata del nodo |

## Dónde vive, y por qué no dentro del Nav

Pablo eligió *"construirlo ahora, en el Nav"*, y **la barra quedó como hermana
del Nav, no adentro**. La razón es medible: `.nav` es `position: sticky` y mide
70px. Metiendo la barra adentro, el header pegajoso pasaría a **121px**, que a
844×390 —un teléfono acostado— es **31% del viewport**, contra el techo del 15%
que fija `RESPONSIVE.md` (y que el nav solo ya incumple con 18%). Como hermana
anterior, la barra scrollea y se va, que es además lo que hace cualquier barra
de anuncio.

**Se pone como primer hijo de `.page-wrapper`**, o sea antes del componente
`Custom Code`, que no renderiza nada visible.

## MAST trae un `Nav Banner` y NO se usó

`a2abdfb6-e5dc-7a4c-b99d-82e7d49533b7`, 6 instancias, descripción *"Only
intended to be used above the Nav component at the top of any page"*. Parecía el
candidato obvio y no sirve, por dos razones concretas:

1. **Su raíz es un `Link`**, o sea la barra entera es un `<a>`. El Figma tiene un
   link específico adentro de una frase — y un `<a>` dentro de otro `<a>` es
   HTML inválido.
2. **Tiene un solo `Text`.** La frase y el CTA subrayado son dos tratamientos
   distintos; un único nodo de texto no los puede expresar.

Verificado además que sus 6 instancias **no están en ninguna página del
cliente** (grep de `nav-banner` en 9 páginas publicadas: 0). Son de las páginas
demo de MAST, así que tampoco había nada que heredar.

## Verificado

Publicado el 2026-09-28 y curleado. **19 de 19 páginas** con `class="announcement"`,
`announcement_dismiss` y el link real de Maps: Home, Our Story, Our Team,
Community Partners, New Patients, FAQ, Care Hub, Injury, Fees, Wellness,
Patient Stories, Blog, Blog Post, Contact, Products, Join Our Team, Privacy,
Terms y 404.

## Lo que queda

- **El dismiss no persiste hasta el deploy del bundle.** `announcement.js` está
  escrito y registrado; falta `npm run build` + push + bump del CDN.
- **`/responsive`** sobre la barra, sin correr.

---

# 🔎 El delta que encontró Pablo, y el agujero de cobertura que revela

Reportado el **2026-09-28** con dos capturas del `#meet-your-doctor` de la Home.

## El delta, medido

| | Figma `1241:10579` | Prod |
| --- | --- | --- |
| Dónde | **Dentro de la columna de copy**, entre el ¶3 y el ¶4 | **Card verde flotando sobre la foto**, abajo a la derecha |
| Tratamiento | **Blockquote**: filete vertical a la izquierda, sangría 21px, 24px de aire arriba y abajo | Card rellena con radio, texto beige sobre verde |
| Atribución | **No hay** | *"Dr. Kati Schwabe"* |
| Itálica | Sí | **Sí también** — `.doctor_quote` ya lleva `u-italic` con la variante `quote-large` |

⚠️ **El Figma TIENE la card verde y la tiene apagada.** `1241:10589` es un
`Aside` con la cita y la atribución, `hidden="true"`. O sea que esto no es "el
Figma no lo dibujó": el diseño **desactivó explícitamente** la composición que
tiene prod y movió la cita adentro del artículo.

⚠️ **Y prod también cambia el orden del copy**: en el Figma el ¶4
(*"She built this practice…"*) va **después** de la cita; en prod la cita no
está en la columna, así que los cuatro párrafos corren seguidos.

El tratamiento pedido **ya existe en el sitio**: es `rooted_quote`
(filete 2px con el token Divider, sangría 1.5rem, 1.25rem de aire), construido
el 2026-09-23 para Community Partners.

**La decisión que lleva**: el Figma elimina la atribución — razonable, porque la
cita está dentro de la bio de quien la dice — y con eso el prop `Attribution` de
`Section / Meet Your Doctor` se queda sin consumidor.

## El agujero de cobertura, que es lo que importa

`#meet-your-doctor` **nunca se comparó renderizado**, y la Home figura en este
doc como una de las 5 páginas que sí pasaron por el tercer eje. Mirando lo que
esa pasada reportó de la Home —hero, fee bar, what-makes-different, find-us,
free-guide, book-now— faltan **10 de las 16 sections**.

O sea que el pendiente no es sólo *"faltan 13 páginas"*: **dentro de las 5
auditadas la cobertura tampoco fue completa**, y el método lo permitió porque
elegí qué sections capturar en vez de enumerarlas.

**La corrección al prompt de la fase 1**: la tabla de sections del paso (c) deja
de ser un inventario de presencia/orden y pasa a ser **la lista de trabajo** —
una fila por section del frame, y cada una se tacha con su veredicto
(✅ / delta / no aplica). Una section sin veredicto es una section sin auditar,
y hoy no había forma de distinguirla de una que pasó limpia.

---

# 🔄 Aplicado el 2026-09-28 — la cita del doctor y la variante del CTA

## La cita de `#meet-your-doctor`, movida

Aplicado lo que dibuja el Figma:

| | Antes | Ahora |
| --- | --- | --- |
| Dónde | Card verde flotando sobre la foto | **Dentro de `.doctor_copy`, entre el ¶3 y el ¶4** |
| Tratamiento | Card rellena Olive, radio 1rem, texto Beige | **Filete de 2px Olive a la izquierda**, sangría 1.5rem, 1.25rem de aire, texto Ink heredado |
| Atribución | *"Dr. Kati Schwabe"* | **Oculta** |

El color del filete se **muestreó del render**: `(107,116,78)` = `#6b744e` Olive
Green. El fondo de la section es Beige Muted y el texto Ink — por eso
`.doctor_quote` dejó de declarar `color`, para heredarlo.

`.doctor-media_col` perdió su `padding-bottom: 2rem`, que existía **sólo** para
dejar lugar a la card que sobresalía por abajo.

**Verificado en el HTML publicado**: la cita dentro de `doctor_copy`, **0**
dentro de `doctor-media_col`, y **0** apariciones de la atribución.

## 🔴 Corrección: el CTA de prod no matchea ninguno de los dos diseños

La tercera pasada de este doc decía:

> *"Renderizadas las dos, la composición es la misma: bloque oliva izquierda,
> foto derecha. Lo único que difiere es el borde — corte duro en el Figma,
> degradado en prod. Es un ajuste de `.cta_scrim`, no un rebuild."*

**Es falso.** Renderizados los tres lado a lado:

| | Composición |
| --- | --- |
| **`Final CTA 1`** (el que embebe el frame de la Home) | Bloque verde en la **mitad izquierda**, foto en la derecha a sangre del card, **corte duro** vertical. Sin scrim |
| **`Final CTA 2`** / los 6 `alternative CTA` | Card **Ink** con la foto **inset y redondeada adentro**, márgenes de 48px alrededor |
| **Prod** | Foto **a sangre** de todo el card con **scrim en degradado**, texto encima |

Prod no es ninguna de las dos. El delta alcanza las **9 instancias**.

## La variante `Card Inset`

`d801551c-6271-3fdf-d489-6c404135edce`, sobre `Section / CTA Banner`.
Reproduce `Final CTA 2` y **las 6 alternativas de página son la misma
composición**, así que una variante cubre todas.

Medido del frame `1244:11904` y reproducido exacto:

| Qué | Figma | Construido |
| --- | --- | --- |
| Card | 1360×540, padding 80 izq / 48 resto | `padding: 3rem 3rem 3rem 5rem` |
| Columnas | 584 + 64 + 584 | `1fr 1fr` con `column-gap: 4rem` → medido **530 + 64 + 530** en el container real |
| Foto | 584×444 inset, radio 16 | `aspect-ratio: 584/444`, radio 1rem |
| Fondo | **`#474d33` Brand/Ink** | ✅ medido `rgb(71,77,51)` |

**Y el parallax sigue funcionando adentro del marco**: medido, el `img` queda
`position: absolute; top: -40px; height: 484px` dentro de un marco de 403 — el
mismo patrón de `media-band_frame`.

### ⚠️ La regla de plataforma que costó una vuelta

**La clase de variante de un componente NO llega a los elementos internos de
una instancia anidada.** Medido en el HTML publicado:

```
class="card cc-cta-card w-variant-d801551c-…"        ← la del CTA Banner ✅
class="img-component w-variant-0375267a-… cc-media-fill"  ← la del componente Image ❌
```

El `img-component` lleva **la variante de su propio componente**, no la del
padre. Escribir `set_variant_styles` sobre `cc-media-fill` devuelve `success`,
la regla **existe en el CSS publicado** — y no aplica nunca, porque el selector
`.img-component.cc-media-fill:where(.w-variant-<padre>)` no matchea ningún
elemento.

**La salida es un wrapper que el componente padre sí posea.** Se creó
**`.cta_media`** (absolute inset 0 en base, o sea render idéntico al de hoy) y
la variante lo reposiciona. Es la misma forma que `media-band_frame` y
`space_frame`.

**La regla general: una variante sólo puede re-estilar lo que vive en su propia
definición.** Antes de planear una variante, mirá si lo que hay que mover es una
instancia anidada — si lo es, hace falta un wrapper primero.

### Lo que la variante NO arregla

**El botón.** Medido: `rgb(107,116,78)` de fondo con texto Beige. Los dos frames
del Figma lo dibujan **relleno Beige con texto Olive**, que es el combo
`.cc-on-dark` que el sitio ya tiene. Es una instancia anidada del `Button`, así
que cae bajo la misma regla: hace falta **exponer un prop `Button Class`** en
`Section / CTA Banner`. Es un delta **preexistente del base**, no lo introdujo la
variante.

### Estado

Construida, verificada renderizada en la Home, y **revertida**: producción sigue
en `base` en las 9 páginas. Cambiar cualquiera es **un prop**.

---

# 🔄 Las DOS variantes del CTA — 2026-09-28

El Figma dibuja **dos** CTA y producción no es ninguno. Los dos están
construidos como variantes de `Section / CTA Banner`, así que cambiar cualquiera
de las 9 páginas es un prop.

| Variante | Reproduce | Composición |
| --- | --- | --- |
| `base` (hoy en las 9) | **nada del Figma** | Foto a sangre + scrim en degradado, texto encima |
| **`Split`** `14f91dbb-…` | **`Final CTA 1`** `1249:22956` — el que el frame de la Home **embebe** | Dos mitades exactas de 680, **corte duro**, Ink a la izquierda, foto a ras del borde derecho |
| **`Card Inset`** `d801551c-…` | **`Final CTA 2`** `1244:11889` y las **6** `alternative CTA` de página | Card Ink con la foto **inset y redondeada adentro** |

## `Split` — medido contra `1249:22956`

| Qué | Figma | Construido y medido |
| --- | --- | --- |
| Card | 1360×560, Ink `#474d33`, padding 0 | ✅ `min-height: 35rem`, `rgb(71,77,51)`, padding 0 |
| Columnas | 680 + 680, **sin hueco** | ✅ `1fr 1fr`, gap 0 → 626 + 626 en el container real |
| Copy | padding 80 izq / 64 der, centrado vertical | ✅ `48px 64px 48px 80px` + `justify-content: center` |
| Foto | mitad derecha a ras, recortada por el radio del card | ✅ `relative`, `height: 100%`, sin radio propio |
| Botón | **relleno Beige, texto Olive** | ✅ `rgb(251,250,248)` / `rgb(107,116,78)` |

**El parallax sigue vivo**: el `img` queda `absolute; top: -56px; height: 672px`
dentro de un marco de 560.

## El botón: el prop que faltaba

Los **dos** frames dibujan la píldora clara y prod la tiene invertida. La
variante no lo podía arreglar — el `Button` es una **instancia anidada**, el
mismo techo que obligó a crear `.cta_media`.

Se expuso el prop **`Button Class`** en `Section / CTA Banner`, bindeado al
`Button Class` del botón, con default **`cc-icon-circle`**: **cero cambio en las
9 páginas de hoy**. Con `cc-icon-circle cc-on-dark` sale la píldora del Figma.

## Lo que un switch completo implica

Cambiar una página al diseño del Figma son **tres props**, no uno:

| Prop | Valor |
| --- | --- |
| `Variant` | `Split` o `Card Inset` |
| `Button Class` | `cc-icon-circle cc-on-dark` |
| `Title Class` | `cc-cta-sm u-mb-0` |

El tercero porque los dos frames dibujan el título en **48px** y prod lo rinde en
**60**; sin él, en `Split` el titular envuelve en dos líneas donde el Figma lo
pone en una. Ese prop ya existe y **4 páginas ya lo usan**.

## Lo que queda distinto, y no es del CTA

Con los tres props puestos, la única diferencia que sobrevive es que **el
párrafo envuelve en 4 líneas donde el Figma pone 3**: la columna mide 626 contra
los 680 del diseño, porque el `.container` del sitio descuenta **86.4px** de
gutter por lado y el Figma dibuja **40**. Es el pendiente del gutter que este
TODO ya tiene, y alcanza a todas las sections.

## Estado

Las dos variantes verificadas renderizadas en la Home y **revertidas**:
producción sigue en `base` en las 9 páginas.

## `Split` aplicado en las 9 — 2026-09-28

Decisión de Pablo. Las 9 instancias pasaron a `Split`, con los tres props que el
switch requiere:

| Prop | Valor |
| --- | --- |
| `Variant` | `Split` |
| `Button Class` | `cc-icon-circle cc-on-dark` |
| `Button Right Icon Modifier` | `cc-circle-olive` |
| `Title Class` | `cc-cta-sm u-mb-0` (Fees conserva su `u-mw-32`) |

Verificado en el HTML servido: **9 de 9** con la variante, el marco de media, el
disco oliva y la píldora clara. Sports Injuries y Fees venían con un `Button
Variant` propio elegido para su card clara; con el card Ink se normalizaron a
`base`. Fees además venía en el variant `Compact`.

### `/responsive` — siete perfiles, cero fallos

| Perfil | Columnas | Card | Foto | Tap | Overflow | hScroll |
| --- | --- | --- | --- | --- | --- | --- |
| 1440 | 2 | 1252×560 | 626×560 | 335×48 | 0 | ✅ |
| 1024 iPad landscape | 2 | 901×480 | 451×480 | 335×48 | 0 | ✅ |
| 844×390 acostado | 1 | 743×828 | arriba | 335×48 | 0 | ✅ |
| 768 iPad portrait | 1 | 676×785 | arriba | 335×48 | 0 | ✅ |
| 430 | 1 | 378×701 | arriba | 330×58 | 0 | ✅ |
| 390 | 1 | 343×734 | arriba | 295×58 | 0 | ✅ |
| 320 | 1 | 282×747 | arriba | 234×58 | 0 | ✅ |

⚠️ **A 1024 el botón envolvía en dos líneas** en la primera medición. Copiar el
padding del Figma (80 izq / 64 der) deja la columna en **307px** a ese ancho,
porque el iPad landscape usa los estilos de desktop. Corregido scopeando ese
padding a **`large` (≥1280)** y dejando **40 / 32** en la base — que es
exactamente la regla que `RESPONSIVE.md` fija para los combos que ensanchan algo
en desktop. Re-medido: 335×48 en una línea.

## El parallax del CTA, apagado — 2026-09-28

Pedido de Pablo, sobre las 9 instancias. **El parallax y el "zoom de la imagen"
resultaron ser lo mismo**: no hay ni un `scale()` en el CSS publicado de
Webflow, y el aumento que se veía era el sobrante que la propia variante de
parallax le da al `img` (`height: 120%`, `top: -10%`) recortado por
`object-fit: cover`.

Se quitaron los dos atributos de la definición — `data-anim="parallax-media"`
del `.card.cc-cta-card` y `data-component="reveal"` de la raíz, que sin ningún
`[data-anim]` adentro ya no tenía nada que hacer. Medido después: ratio
img/frame **1.000** contra el 1.2 de antes, sobrante 0 arriba y abajo,
`transform: none` y **cero ScrollTriggers** en la section, en 4 posiciones de
scroll y en dos páginas (una donde `reveal.js` ya no carga y otra donde sí).

**Esto NO toca el encuadre**: el `object-position: 100% 50%` que trae el
`Image Fit` del componente se queda, así que la foto sigue anclada a la derecha
como se eligió. El razonamiento completo está en
[components/reveal.md](components/reveal.md).

---

# 📄 Our Story, section por section — 2026-09-29

Primera página auditada con el método corregido: **la tabla de sections es la
lista de trabajo**, una fila por section del frame y cada una con su veredicto.
Frame `1249:17334`, prod a 1440.

| # | Section del Figma | y | Prod | Veredicto |
| --- | --- | --- | --- | --- |
| 1 | `top nav` | 0 | Nav | ✅ |
| 2 | Hero (eyebrow + H1 + párrafo + CTA) | 88 | `#hero` Page Header `base` | ✅ |
| 3 | Foto a sangre 1440×1080 | 564 | `.cc-band` Photo Band | ⚠️ **otra foto** (ver imágenes) |
| 4 | *One room. One conviction.* | 1644 | `#our-story` `cc-story` | ✅ **corregido hoy** — la cita |
| 5 | *Meet Dr. Schwabe* + bio + credenciales | 2596 | `#dr-schwabe` `cc-bio` | ⚠️ **otro retrato** |
| 6 | *Four things…* | 5172 | `#schwabe-standard` `cc-four` | 🔴 **domo+check vs numeral** (el filete está bien — ver abajo) |
| 7 | *A space designed for this kind of care* | 6309 | `.cc-space` | ⚠️ otra foto |
| 8 | **Slider de 6 slides** 480×622 + flechas | 7907 | ❌ **no existe** | 🔴 section nueva |
| 9 | **Find us in Platt Park** — mapa 610×700 + tabla 7 días | 8773 | comprimido en una card dentro de `#cc-space` | 🔴 section nueva |
| 10 | `Final CTA 1` **1440×760** | 9633 | `#community` `cc-cta` `Split` | ✅ **corregido hoy** — el alto |
| 11 | `Footer` | 10393 | `.cc-footer` | ✅ |

## 🔴 La cita de `#our-story` — era una regresión mía, no un delta de diseño

Pablo la mandó con captura y propuso *"podríamos crear una variante si es un
componente"*. **No hizo falta variante, y el componente ya estaba bien
diseñado**: la descripción de `Section / Story` dice textual *"an arched
portrait with **an olive pull-quote card** on the right"*, y tiene el prop
**`Pull Quote`** con exactamente ese texto.

**Lo que pasó**: `.doctor_quote` la comparten **tres** páginas —
`#meet-your-doctor` (Home), `#our-story` (Our Story) y `#after-booking`
(New Patients)— y el **2026-09-28**, aplicando el Figma de la Home, la cambié
a *blockquote con filete izquierdo*. Las otras dos heredaron el cambio sin que
nada avisara, y la card oliva montada de Our Story pasó a ser una caption bajo
la foto.

**La regla que sale de acá, y que ya costó dos veces**: antes de re-estilar una
clase para aplicar el Figma de UNA página, hay que contar en cuántas páginas
vive. El chequeo es de una línea sobre el HTML publicado:

```
for p in "" our-story new-patients …; do curl -s "$B/$p" | grep -c 'doctor_quote'; done
```

### El arreglo es aditivo, a propósito

Se creó el combo **`.doctor_quote.cc-overlay`** y se aplicó **sólo** al
elemento de `Section / Story`. La base queda como está, así que **la Home y New
Patients no se tocan** — verificado después: las dos siguen en `static` con
fondo transparente.

| Propiedad | Valor | De dónde sale |
| --- | --- | --- |
| `position` / `right` / `bottom` | `absolute` / `0` / **`-4rem`** | El Figma la saca ~72px abajo de la foto; 64 es el escalón de la escala |
| `width` / `max-width` | `25rem` / `80%` | Figma: card 420 sobre foto 550 = 76% |
| `padding` | `1.5rem` | Figma: 24px |
| `background-color` | **Olive Green** `#6b744e` | **Muestreado del render**, no deducido — no es el Ink |
| `color` | Brand/Beige | ″ |
| `border-radius` | `0.75rem` | Figma |
| `border-left-width` | `0` | Mata el filete que hereda de la base |

**No hizo falta tocar `.doctor-media_col`**, que es la otra clase compartida.
Con la cita fuera del flujo la columna cae de 755 a 658 (el alto de la foto) y
los 64px que sobresalen entran en el hueco que ya existía: medido, quedan
**56px de aire** contra la section siguiente.

Medido después de publicar: **400×134**, `absolute`, fondo `rgb(107,116,78)`,
texto `rgb(251,250,248)`, `quote.top` 2367 < `foto.bottom` 2438 (montada),
alineada al borde derecho (0px) y sin pisar nada.

## El CTA no necesitaba una variante más chica — le sobraba padding

Pablo: *"el cta split debería tener una variante más chica"*. Medido, el
problema no era el card:

| | Prod (antes) | Figma | Prod (ahora) |
| --- | --- | --- | --- |
| Section `#community` | **845** | **760** | ✅ **765** |
| Card | 565 | ~560 | 565 |
| `padding` de `.section.cc-cta` | 80 / **200** | ~100 / 100 | **100 / 100** |

O sea que los 85px de más eran **enteros del `padding-bottom: 12.5rem`** de
`.section.cc-cta`. Bajado a `6.25rem` arriba y abajo: **una escritura para las
9 páginas**, sin variante nueva y sin tocar el card.

Verificado en **Home, New Patients, Blog, Fees y Patient Stories: 760 exactos**.

⚠️ **Patient Stories midió 970 en la primera lectura y era falso** — la página
no había asentado. Re-medida: 760. Es la trampa que este doc ya anota: *una
captura sin esperar el render no es evidencia*.

## Lo que queda de Our Story, medido y sin aplicar

### Four Things: el marcador es un DOMO, no un disco

La tercera pasada decía *"check ✓ dentro de un disco relleno"*. Renderizado el
nodo `1249:17443`, **no es un disco**: es un **domo** — 80×58, esquinas
superiores completamente redondeadas y las de abajo rectas — **relleno beige
`#fbfaf8` con el check en oliva**. Es exactamente el patrón que el sitio ya
tiene en `.intro_dome` (`border-radius: 999px 999px 1rem 1rem`).

Prod pone `.four_num`: numeral oliva sobre fondo **forest**, que es el color de
la section — o sea que el numeral **es la máscara del filete**, el mismo patrón
que `.plan-step_num`. Cambiarlo a domo beige **rompe esa máscara**, así que hay
que resolver el filete al mismo tiempo.

### ⚠️ El filete NO está roto — fue un falso positivo mío

Escribí que `.four_rule` computaba `0×1` y que el filete estaba roto en
producción. **Es falso.** El elemento lleva `data-anim="rule"` de `reveal.js`,
que lo arranca en `scaleX(0)` y lo dibuja cuando la section entra en viewport —
y yo lo medí **sin scrollear hasta ahí**, o sea en su estado inicial.

Re-medido con la section en viewport: **967×1, `transform: matrix(1,0,0,1,0,0)`
(identidad), `opacity: 1`**. Funciona exactamente como fue diseñado.

Y el cálculo es correcto: el filete va de x 228.7 a 1195.3, que son **el centro
del primer marcador y el centro del cuarto** (medidos en 228, 551, 874, 1197).

Es la tercera vez en este proyecto que una medición tomada antes de que el
estado se asiente produce un hallazgo falso. La regla ya está escrita —*una
captura sin esperar el render no es evidencia*— y hay que extenderla: **medir un
elemento animado sin llevarlo a viewport tampoco lo es.**

### El check va SÓLO en la variante `Columns`, y está medido

`Section / Four Things` (`613ee37b-c54d-fa8c-82b7-f4a6ddcd3a8e`) tiene **3
instancias y las tres usan una variante distinta**:

| Página | Section | Variante | Copy | Marcador |
| --- | --- | --- | --- | --- |
| Our Story | `#schwabe-standard` | **`columns`** | *"Four things that are true at every appointment"* | 🔴 **check** |
| New Patients | `#what-to-expect` | `stacked` | *"The 60-minute first visit."* | ✅ numeral |
| Injury | `#care-approach` | `stacked-light` | *"Your activity, injury, and goals shape the plan."* | ✅ numeral |

**Medido, no deducido**: el frame de New Patients (`1249:18150`) tiene **cero
nodos llamados `✓`** y 18 llamados `1`. O sea que las variantes apiladas
conservan el numeral.

Y el contenido lo respalda, que es la regla *structure is information* que este
proyecto ya tiene escrita: cuatro cosas que son verdad **siempre** no son una
secuencia, y un numeral ahí promete un orden que no existe; la primera visita
y el plan de cuidado **sí** lo son.

**Consecuencia práctica**: el cambio no va en la definición. Los estilos van por
`set_variant_styles` sobre `columns`, y el contenido (`✓` en vez de `1..4`) en
los props **de la instancia de Our Story**. Las otras dos quedan intactas por
construcción, sin tener que confiar en que nadie las mire.

### El spec del domo, listo para aplicar

Medido del render `1249:17443` y del estado actual de prod:

| | Hoy (`.four_num`) | Figma |
| --- | --- | --- |
| Caja | 63×48 | **80×58** |
| Fondo | Forest `rgb(38,47,35)` — **es la máscara del filete** | **Beige `#fbfaf8`** |
| Color | Olive `rgb(107,116,78)` | Olive (el check) |
| Radio | 0 | **`999px 999px 0 0`** (domo, no disco) |
| Contenido | `1` `2` `3` `4` | `✓` |

El domo beige sigue siendo opaco, así que **conserva el trabajo de máscara** que
hoy hace el numeral forest: el filete continuo pasa por detrás y los cuatro
domos lo cortan. No hacen falta los tres segmentos que dibuja el Figma.

Tokens: Beige `variable-673fc796-8959-0fd8-3f8c-c3680779cbe7`, Olive
`variable-6b5f6515-b16b-d72d-229d-7dde8855d613`.

### `#cc-space` son TRES sections en el Figma, no una

Y esto corrige otra vez la lectura anterior. El Figma tiene:

| Nodo | Qué es | Tamaño |
| --- | --- | --- |
| `1249:17532` | *A space designed for this kind of care* — eyebrow `628 E Evans Ave, Ste 100`, H2, body, y una imagen de 1440×1080 | 1440×1598 |
| **`1249:17670`** | **Un slider**: 6 slides de **480×622** más dos flechas de **44px**. Cada slide lleva una foto de la clínica y uno de los cuatro puntos (*Four treatment rooms*, etc.) | 1440×866 |
| **`1249:17687`** | ***Find us in Platt Park*** — mapa de **610×700** a la izquierda; a la derecha eyebrow, la dirección como **H2**, la **tabla de los 7 días**, Phone y Arriving | 1440×860 |

Prod tiene **una sola** section: la foto grande, los cuatro puntos como lista
de texto y la ubicación comprimida en una card con mapa chico.

**Ojo con el nombre de las capas del slider**: las 6 instancias se llaman
`Testimonial` y **no son testimonials** — el render muestra fotos de la clínica
con su título y cuerpo. Es la regla de *el nombre de capa no es el texto*, otra
vez.

---

# 🎯 Pasada de paridad — 2026-09-29

Primera tanda de la sesión de *"que las páginas de Figma matcheen 100% con
prod"*. Medido con **Chrome headless por CDP a 1440** (el MCP de Chrome sigue
caído) contra el CSS publicado **`schwabe.webflow.shared.6e44d9a75.css`**, y
contra el canvas `1237:9927`.

## `/join-our-team` — frame `1249:26448`

### Los colores, medidos token por token

Muestreados del render de Figma píxel a píxel y leídos de `get_variable_defs`;
contrastados contra `getComputedStyle` en el sitio servido.

| Section | Figma | Prod | Delta |
| --- | --- | --- | --- |
| Hero | Beige `#fbfaf8` | Beige | ✅ |
| **Practice Philosophy** | **Ink `#474d33`** + texto Beige | **Beige** + texto Ink | 🔴 **invertida** |
| **Current Openings** | **Beige `#fbfaf8`** | **Beige Muted `#eeece4`** | 🔴 |
| Standing Interest | Beige Muted `#eeece4` | Beige Muted | ✅ |
| Card de vacante | fondo `#fbfaf8`, filete **`#d1d6c2`** (`brand--border`) | fondo Beige, filete **`#cacdb7`** (`border-strong`) | ⚠️ |
| Banda *To apply* | `#eeece4` Beige Muted | Beige Muted | ✅ |
| Disco abierto | relleno `#6b744e` Olive con `−` | ídem (`job-card.css`) | ✅ |
| Inputs | relleno Beige, filete `#cacdb7` | ídem | ✅ |
| Botón del form | Olive `#6b744e` | ídem | ✅ |

**El par Openings / Standing está cruzado**, y no es un detalle: en el CSS
publicado las dos clases comparten la misma declaración
(`.section.cc-openings, .section.cc-standing { background-color: beige-muted }`).
Con Openings en Beige Muted, la card de vacante —que es Beige— se lee como una
caja clara flotando, en vez de la card con filete sobre su mismo fondo que
dibuja el Figma.

### El form: una clase que falta explica casi todo

```html
<select id="si-role" name="Role-Type" class="w-select">   ← sin inquiry_input
```

Medido en el sitio:

| | `#si-name` (input) | `#si-role` (select) |
| --- | --- | --- |
| Alto | **48px** | **38px** |
| Fondo | Beige `#fbfaf8` | **`#f3f3f3`** (el gris de Webflow) |
| Radio | **999px** (pill) | **0px** |
| Filete | `#cacdb7` | **`#ccc`** |
| `font-size` | 16px | **14px** |

Los 14px además violan la regla de `RESPONSIVE.md` — **abajo de 16px iOS
zoomea al enfocar y el visitante no sale del zoom**.

Dos cosas más del mismo form:

- **Los 5 `<label for="">` están vacíos.** Los inputs tienen id (`si-name`,
  `si-email`, `si-phone`, `si-role`, `si-intro`) y ningún label los apunta.
  Como son `u-sr-only`, hoy **no anuncian nada**: es peor que no tenerlos.
- **El textarea tiene `resize: both`**, el default del navegador. El Figma no
  lo dibuja y arrastrarlo rompe la grilla.

### Tipografía

| Elemento | Figma | Prod |
| --- | --- | --- |
| H1 del hero | 60px EB Garamond Medium, 3 líneas | **60px, 3 líneas** ✅ |
| Columnas del hero | alineadas **abajo** (la derecha empieza en y=126 de 234) | **alineadas abajo** (las dos terminan en y=409) ✅ |
| H2 de Philosophy | 48px | 48px ✅ |
| **Lede de Philosophy** | **EB Garamond Medium Italic 32px** (token H4) | **DM Sans Regular 18px, redonda** 🔴 |
| H2 de Current Openings | 48px, centrado, caja de 680 | 48px, centrado, 680 ✅ |
| **H2 de Standing Interest** | **60px** (token `Desktop/Heading 1` — caja de 520×240 = 4 líneas a lh 1) | **48px** en una columna de 569 → 2 líneas 🔴 |

### Geometría

- **La foto pisa la banda de abajo 100px.** El frame de la foto termina en
  y=1205.94 y la banda de Philosophy arranca en y=1105.94. Prod las deja a
  tope (la banda empieza exactamente donde termina la foto).
  **El patrón ya existe en el sitio**: `.section.cc-rooted` de Community
  Partners lleva `margin-top: -6.25rem` justamente para esto.
- **Radio de la card de vacante**: prod `1rem`; medido en el render del Figma
  el borde izquierdo se endereza a ~20px del borde superior, o sea **1.5rem**
   — que es el token `card--border-radius-large` que el sitio ya tiene.
- **Gutter**: el Figma usa **40px** en el hero y **120px** en las otras tres
  sections; prod usa **86.4px** en todas (el token de Layout). Es el pendiente
  global del gutter que este TODO ya lista — **no se tocó acá**, porque mueve
  las 19 páginas.

### El eyebrow hidden y el botón hidden del Figma

Dos capas del frame están en `hidden="true"` y **no son deltas**: el eyebrow
*"Why these stories matter"* arriba de *Current Openings* (sobrante de la
plantilla) y el botón *"Email Your Application"* de cada vacante. Prod
tampoco los tiene. ✅

---

## El `Photo Band` recorta la foto en las tres páginas que lo usan

El hallazgo con más alcance de esta tanda, y **no es de una página**: es del
componente.

`.media-band_frame` declara `aspect-ratio: 1360/812` = **1.675**, y
`.media-band_img` la llena con `object-fit: cover` / `object-position: 50% 50%`.
Las fotos cargadas son más altas que eso, así que **cover se come alto, mitad
arriba y mitad abajo**:

| Página | Asset | Natural | Ratio | Alto que se pierde |
| --- | --- | --- | --- | --- |
| Join Our Team | `0249_…patient_interaction` | 2560×1707 | 1.500 | **10%** |
| Our Team | `0350_…team_other_headshot` | 2560×1707 | 1.500 | **10%** |
| **Community Partners** | `partners-platt-park-street` | 1448×1086 | **1.333** | **20%** |

Contra el render del Figma se ve exactamente qué se pierde: en Partners **la
copa del árbol arriba y la vereda abajo**; en Our Team **el aire sobre las
cabezas**. Las dos fotos son la misma toma que el Figma — lo que difiere es el
encuadre.

**`object-position` no lo arregla solo**: correrlo elige qué borde se come,
no devuelve material. Las salidas reales son (a) subir un recorte 1360×812 de
cada original —están en el Drive del fotógrafo— o (b) llevar el
`aspect-ratio` del frame al de las fotos. La (b) es **una escritura para las
3 instancias** y no necesita assets, pero se aparta del frame del Figma.

## Our Team · `#growing-team`

Dos deltas, y el primero es de composición.

| | Figma | Prod |
| --- | --- | --- |
| Layout | **dos mitades exactas, sin hueco**; la foto pegada al borde superior, derecho e inferior del card, recortada por su radio | `padding: 60px`, `grid: 526px 526px`, `column-gap: 80px`, foto **inset con radio propio de 24px** |
| Alto del card | ~**556px** | **482px** |
| Foto | **la puerta al espacio nuevo** — listones de madera, planta, heladera de vidrio, estantería | `team-growing-reception.png` (tres mujeres en recepción) |

**Es la misma composición que la variante `Split`** que se construyó para
`Section / CTA Banner` el 2026-09-28. `Section / Feature Card` es otro
componente y nunca la recibió — incluido el wrapper propio que hizo falta allá
(`cta_media`), porque **la clase de una variante no llega a una instancia
anidada** y la foto acá también es una instancia del componente `Image`.

## Community Partners · el CTA

La foto **es la correcta** — `0245`, la que Derek pidió en #99 — y la variante
`Split` está aplicada. Lo que no matchea es el encuadre:
`object-position: 100% 50%` la ancla a la derecha y **deja a la mujer de
camisa celeste cortada contra el borde izquierdo de la media**. El Figma
muestra a las dos completas, centradas en la mitad derecha.

Viene del prop `Image Fit` del componente `Image`, así que el arreglo es de
instancia, no de clase.

## ⚠️ El MCP de Figma se cayó a mitad de la pasada

A partir de la lectura de Our Team, `get_metadata` y `get_screenshot` empezaron
a devolver **`mcp_oauth_token_read_unsupported`**. Lo de Join Our Team se midió
con la metadata exacta del frame; **lo de Our Team y Community Partners se
midió sobre los renders ya bajados**, que alcanzan para el encuadre y la
composición pero no para confirmar el `aspect-ratio` exacto del frame del
Photo Band en esas dos páginas. Hay que reconfirmarlo cuando el conector
vuelva.

## Las tres decisiones de Pablo — 2026-09-29

| Qué | Decisión | Consecuencia |
| --- | --- | --- |
| El recorte del `Photo Band` | **Bajar `.media-band_frame` de `1360/812` a `3/2`** | Una escritura alcanza las **3 instancias** y no necesita assets nuevos. Join Our Team y Our Team dejan de recortar (sus fotos son 3:2 exactas). ⚠️ **Community Partners sigue perdiendo ~12%** porque su foto es 4:3 — se cierra el día que se reemplace por una 3:2. ⚠️ Y es un apartamiento deliberado del frame del Figma, que dibuja 1.675 |
| La primera vacante | **Arranca abierta** | Matchea el Figma literal. Es el `open` del primer `<details>`; el estado ya está pintado por `job-card.css` (disco oliva + `−`), así que no hace falta CSS nuevo |
| La nota del form | **Se oculta** | El botón queda solo en su fila, a la derecha. **El copy no se borra**, se oculta — volver atrás es una escritura |

## ⚠️ Los dos conectores se cayeron antes de poder aplicar nada

A partir de la mitad de la pasada, **Figma y Webflow** empezaron a devolver el
mismo error:

```
permission_error · mcp_oauth_token_read_unsupported
"The stored OAuth token for this server cannot be read with this request's credential."
```

No es un límite de scope ni un 429: es el token guardado del conector, y afecta
a los dos servidores por igual. **Cero escrituras aplicadas en esta pasada** —
todo lo de arriba está medido y decidido, nada está escrito en el Designer.

## Four Things · el spec cerrado y los ids — listo para aplicar (2026-09-29)

Todo lo de abajo está **leído del Designer**, no deducido. La próxima tanda son
**2 llamadas**, sin volver a medir nada.

### ⚠️ `Columns` es la variante `base`, no una variante propia

Eso invalida el plan obvio de *"escribir los estilos en la variante columns"*:
escribir en la base alcanza a las tres instancias. Y las Stacked **no pisan ni
el fondo ni el radio**, así que heredarían el domo:

| Variante | id | Qué pisa hoy sobre `.four_num` |
| --- | --- | --- |
| **Columns** | **`base`** | — (es la base) |
| Stacked | `ad38b09b-8c79-985e-2bb4-213946a77e19` | sólo `text-align` y `padding` |
| Stacked Light | `69bbd089-e9ed-7fa8-2c21-d970e463668a` | `background-color`, `text-align`, `padding` |

**Por eso se creó una variante nueva.**

### 🟡 Ya existe una variante vacía en el Designer: `Columns Check`

**`9f9b1bae-5bfd-1149-0b71-887116176c69`** — creada el 2026-09-29 justo antes de
que se cayera el conector. **Está vacía y no la usa ninguna instancia**, así que
no cambia nada de lo publicado, pero es un cabo suelto real: si esta tanda no se
retoma, hay que borrarla en vez de dejarla ahí sin explicación.

### Los ids que hacen falta

**Componente** `613ee37b-c54d-fa8c-82b7-f4a6ddcd3a8e` ·
**Página Our Story** `6aa7f57458bf3fcec50691d6`

| Qué | Id |
| --- | --- |
| Instancia en Our Story | `{component: "6aa7f57458bf3fcec50691d6", element: "59dc18b8-8218-640e-a4b7-90b62034466c"}` |
| Prop `Variant` | `882cba41-ad46-82ac-cefd-9a2e18009952` — hoy en `base` |
| Prop `Number` · Item 1 | `b1f84c54-e2aa-9d23-3b88-2d848bbec71c` |
| Prop `Number` · Item 2 | `cab7b6ce-93d1-75e3-aae1-9708615247b0` |
| Prop `Number` · Item 3 | `a5644751-1107-fc24-1259-8868e367652b` |
| Prop `Number` · Item 4 | `fb0417e1-5025-eeb3-e4ae-76cefdc0b4f1` |

Los 4 `.four_num` de la definición son `…3a9c`, `…3aa5`, `…3aae`, `…3ab7`; cada
uno tiene adentro un `Plain Text` con su `Text` bindeado al prop `Number`
correspondiente y `Size` = `8ad65db6-2c49-8954-46ef-9d5073969b80`.

### Las 2 llamadas

**1 · Props de la instancia de Our Story** (`set_component_instance_prop_values`):
el `Variant` a `9f9b1bae-…` y los **4 `Number` a `✓`**. Los cuatro son de tipo
`textContent`, así que van como `type: "string"`.

**2 · Estilos de la variante** (`set_variant_styles`, `variant_id: 9f9b1bae-…`,
`style_name: "four_num"`) — sólo las **diferencias** contra la base, que es lo
único que hace falta porque la variante nueva hereda de ella:

| Propiedad | Valor |
| --- | --- |
| `width` / `height` | `5rem` / `3.625rem` (80×58) |
| `background-color` | `variable-673fc796-8959-0fd8-3f8c-c3680779cbe7` (Beige) |
| `color` | `variable-6b5f6515-b16b-d72d-229d-7dde8855d613` (Olive) |
| `border-top-left-radius` / `-right-radius` | `999px` |
| `border-bottom-left-radius` / `-right-radius` | `0px` |
| `display` / `justify-content` / `align-items` | `flex` / `center` / `center` |
| `padding-*` | `0` en los cuatro — la base trae `padding-left: 1.25rem` |

### ⚠️ Lo que estas dos llamadas NO resuelven: el tamaño del glifo

El `✓` no lo dimensiona `.four_num` sino el **`Plain Text` hijo**, cuya variante
`Size` (`8ad65db6-…`) vive en la **definición** y por lo tanto es **compartida
por las tres variantes**. Un `font-size` escrito en `.four_num` desde la
variante **no le gana**: el hijo declara el suyo.

O sea que el check va a salir a la escala del numeral actual. El Figma lo dibuja
en una caja de 40×48 dentro del domo de 80×58. **Hay que mirarlo renderizado
después de aplicar** y, si no coincide, la salida es un combo sobre el
`Plain Text` —no tocar su variante, que es compartida— aplicado por el prop
`Class` de esa instancia.

### Y el filete no hay que tocarlo

El domo beige es opaco igual que el numeral forest de hoy, así que **sigue
enmascarando el filete continuo**. No hacen falta los tres segmentos que dibuja
el Figma, y `.four_rule` ya funciona (967×1, `scaleX(1)` con la section en
viewport).

---

# 🩺 Care Hub — el lado de PROD medido, 2026-09-29

Medido con **Chrome headless por CDP a 1440** (el MCP de Chrome sigue caído) el
2026-09-29. **Sólo el lado de producción**: los conectores de Figma y Webflow
volvieron a no estar disponibles en la sesión, así que el frame `1249:12003`
sigue sin leerse y no se aplicó **ni una** escritura.

Esto no es la auditoría completa — es **la mitad que ya no hay que volver a
hacer**. Cada delta queda con su columna "prod dice" cerrada en números, y lo
único que falta es contrastarla contra el frame.

## ⚠️ La línea de base se movió

| Qué | El TODO decía | Medido hoy |
| --- | --- | --- |
| CSS publicado | `schwabe.webflow.shared.6e44d9a75.css` | **`…11c375068.css`** |
| CDN del bundle | `@970fb4b` | `@970fb4b` (sin cambio) |

O sea que **alguien publicó Webflow entre la tanda anterior y hoy**. Los deltas
de abajo valen contra `11c375068`; los de `/join-our-team` que siguen sin
aplicar se midieron contra el hash viejo y **hay que reconfirmarlos**, porque
ese publish pudo tocarlos.

## El mapa de la página

Siete sections dentro de `.page-main`, en este orden:

| # | Section | Fondo | Alto | imgs |
| --- | --- | --- | --- | --- |
| 1 | `#hero` `cc-page-header` | Beige `#fbfaf8` | 408 | 0 |
| 2 | `.cc-media-band` | — | 851 | 1 |
| 3 | `#approach` `cc-approach` | Beige Muted `#eeece4` | 895 | **0** |
| 4 | `#first-visit` `cc-process` | **Forest `#262f23`** | 815 | 0 |
| 5 | `#care-areas` `cc-areas` | Beige | 1691 | 6 |
| 6 | `#csw-bridge` `cc-shockwave` | Beige | 1005 | 1 |
| 7 | `#final-cta` `cc-care-cta` | Beige | 676 | 1 |

## Delta 1 · `#approach` — la foto y la columna de la cita

| Qué | Prod, medido |
| --- | --- |
| `.approach_grid` | 2 columnas **569 / 603**, hueco 81px |
| Columna **izquierda** | `.doctor_heading` — **sólo eyebrow + H2**, alto 142 |
| Columna **derecha** | `.approach_body` — 3 párrafos + `.approach_quote` |
| `.approach_quote` | card **Beige `#fbfaf8`**, radio **16px**, al pie de la derecha |
| Imágenes / SVG | **0 y 0** |

Confirma los dos puntos de Pablo: **no hay foto**, y **la cita está en la
columna derecha**. El Figma pide copy + cita a la izquierda y foto en arco a la
derecha — o sea que las dos columnas cambian de contenido, no es "agregar una
imagen".

## Delta 2 · `#first-visit` — las tres cosas, las tres confirmadas

| # | Qué | Prod, medido |
| --- | --- | --- |
| 1 | Fondo de la banda | **`rgb(38,47,35)` = `#262f23` Forest Green** |
| 2 | Marcador arriba del título | **No existe.** El primer hijo de las 3 `.process_col` es el `heading-component` (*Your history* · *Your movement* · *Your plan*). **0 `<svg>` y 0 iconos Phosphor** en las tres |
| 3 | Botón | **`button cc-icon-circle`**, variant `primary`, fondo **Olive `#6b744e`**, texto **Beige `#fbfaf8`** — la píldora rellena, sin `cc-on-dark` |

**"Oliva media" no se puede resolver sin el frame.** Los dos candidatos del
sistema son **Ink `#474d33`** y **Olive Green `#6b744e`**; el fondo actual es
Forest `#262f23`, más oscuro que los dos.

### ✅ Los filetes SÍ están — y mi primera medición decía lo contrario

Primera lectura: `.process_rule` en **0×1**. Con la section en viewport:
**144×1, `rgba(255,255,255,0.12)`, `matrix(1,0,0,1,0,0)`, `opacity: 1`.**

Llevan `data-anim="rule"` de `reveal.js`, así que arrancan en `scaleX(0)`. Es
**exactamente** el falso positivo que este doc ya documentó con `.four_rule` de
Our Story, repetido por mí en la misma semana. La regla vale doble entonces:
**medir un elemento animado sin llevarlo a viewport no es evidencia.**

La grilla es de **5 pistas** — `321.4 / 144 / 321.4 / 144 / 321.4` — o sea 3
columnas con los 2 filetes como pistas propias.

### 🔴 El botón necesita DOS cambios, no uno

Medido el árbol del icono: el disco es **`icon-color cc-circle`** — fondo
**Beige `#fbfaf8`** con la flecha **Olive**. Hoy se ve porque la píldora es
oliva.

Pasarlo a `cc-on-dark` (píldora Beige, texto Olive) **deja el disco Beige sobre
píldora Beige, o sea invisible** — y al hacer hover aparecería de la nada,
porque `--btn-circle-bg-hover` es Olive para todos los botones del sitio.

Es **el mismo bug que se diagnosticó y corrigió en el CTA el 2026-09-28**
(`BUTTON-HOVER.md`, *"el hover quedaba raro… no era el hover: era el reposo"*).
La corrección es la misma: `Button Right Icon Modifier` = **`cc-circle-olive`**
junto con `cc-on-dark`. Si se aplica sólo el primero, se reintroduce el bug ya
cerrado.

## Delta 3 · Areas of Care — ✅ **el hover FUNCIONA. No es un delta.**

Item abierto desde el 2026-09-17 —*"nunca se verificó corriendo en un
navegador"*— **cerrado hoy**, con un mouse real por CDP (`Input.dispatchMouseEvent`;
un `.dispatchEvent` sintético no dispara `:hover`).

| | Reposo | Con hover real |
| --- | --- | --- |
| Fondo de la card | Beige `rgb(251,250,248)` | **Ink `rgb(71,77,51)`** |
| Texto | Ink | **Beige** |
| Borde | Border Strong `rgb(202,205,183)` | **Ink** |
| Texto y borde del `Button` interno | Ink / Border Strong | **Beige / Beige** |

- `matchMedia('(hover: hover) and (pointer: fine)')` → **`true`** en headless.
- **6 cards con `data-area-card`**, 6 con `.area-card`.
- Hover sobre la card 1: **sólo ella se invierte**, la 2 queda intacta — cero
  sangrado.
- Las reglas `[data-area-card]:hover` y `[data-area-card][data-area-card]:hover .button`
  están **servidas** en `@970fb4b/dist/styles.css`.

**Queda una sola cosa por confirmar contra el frame**: el hover pinta **Ink
`#474d33`** y el reporte dice *"forest oscuro"* (`#262f23`). Si el Figma pide
Forest, es cambiar una variable en `area-card.css`; si pide Ink, no hay nada
que hacer. `AREA-CARD-HOVER.md` declara Ink a propósito.

## Delta 4 · `#csw-bridge` — 3 de 4 confirmados, 1 es más chico de lo anotado

| # | Qué | Prod, medido |
| --- | --- | --- |
| 1 | Orden de columnas | **`.shockwave_body` a la izquierda (x=167)**, `.shockwave_media` a la derecha (x=753). Grilla `505 / 505`. ✅ **invertido** respecto del Figma |
| 2 | Eyebrow | **"Also available here"**, y **0 imágenes de marca** en el bloque. ✅ sin logo |
| 3 | La card | `.shockwave_band` — fondo **Beige Muted `#eeece4` RELLENO**, **borde 1px `rgb(113,156,161)`**, radio 32px |
| 4 | Botón | `button …(secondary) cc-teal`, fondo **transparente**, texto y borde 2px `rgb(62,85,88)`, **sin disco de flecha** ✅ |

**El punto 3 es más chico de lo que dice el TODO.** Está anotado como *"el Figma
es clara con filete slate y prod la tiene en Beige Muted rellena"*, que se lee
como "hay que agregarle un filete". **El filete ya está** — el delta es sólo el
**relleno** (Beige Muted → claro).

**Y dos valores crudos que no son tokens**: el borde `#719ca1` y el botón
`#3e5558` **no matchean ningún token de `Brand`** (el más cercano es
`slate-line #7a999e`). Es una violación de *"no raw values where a token
exists"* de `webflow-build` §1, preexistente y ajena a esta tanda.

## Delta 5 · El CTA — 🔴 **el TODO parte de una premisa falsa**

El TODO dice: *"la variante `Split` ya está aplicada en las 9 instancias desde
el 2026-09-28, así que esto es de **esta instancia**"*.

**El CTA de Care Hub no es `Section / CTA Banner`.** Es
`section#final-cta.cc-care-cta` con `.care-cta_grid` — o sea
**`Section / Care CTA`** (`d2c66413-7ac4-cf34-1bdb-55eed8793455`, 5 props), otro
componente. Las 9 instancias de CTA Banner son Home, Our Story, Community
Partners, New Patients, Patient Stories, Blog, Sports Injuries, Fees y el
template de artículo — **Care Hub no está en esa lista y nunca pudo recibir
`Split`**.

Medido:

| Qué | Prod |
| --- | --- |
| `.care-cta_grid` | **586 / 586**, gap 80, `align-items: center` |
| Orden en el DOM | **`img.care-cta_media` a la IZQUIERDA (x=86)**, copy a la derecha (x=753) |
| La foto | **`doctor-kati-schwabe-consult.jpg`** |
| Su tamaño natural | **1439×2158 (vertical 2:3)** en una caja de **586×476** (horizontal) |
| Botón | `cc-icon-circle` primary, Olive relleno, disco Beige |

**Dos cosas que el TODO no anotaba y valen más que el orden:**

1. **La foto es la del retrato de la Home** (`#meet-your-doctor`), reusada. Es
   justo el problema de fotos repetidas que Derek pide resolver en **#99**.
2. **Se recorta el ~46% del alto.** Es una foto vertical 2:3 metida en una caja
   horizontal 1.23:1 con `object-fit: cover`. Mismo patrón que el `Photo Band`,
   y peor.

## 🔒 En cuántas páginas vive cada clase — el scoping, medido

El chequeo que este proyecto ya pagó caro dos veces (`.doctor_quote` re-estilada
para la Home rompió Our Story; `.media-band_frame` alcanza 3 páginas). Contado
sobre el HTML publicado de las 15 páginas:

| Clase | `/care` | Otras páginas | ¿Se puede tocar la base? |
| --- | --- | --- | --- |
| `.approach_grid` | 1 | **Fees, Wellness** | 🔴 **NO** — combo |
| `.approach_quote` | 1 | ninguna | ✅ sí |
| `.shockwave_band` (pelada) | 1 | **Injury** | 🔴 **NO** — combo |
| `.shockwave_band.cc-light` | — | Fees | (otro combo, no se toca) |
| `.care-cta_grid` | 1 | ninguna | ✅ sí |
| `.process_col` · `.cc-process` | 3 · 1 | ninguna | ✅ sí |
| `[data-area-card]` | 6 | ninguna | ✅ sí |
| `.cc-approach` | 1 | **Fees ×3, Wellness ×2** | 🔴 **NO** |
| `.cc-care-cta` | 1 | ninguna | ✅ sí |

**Consecuencia directa sobre los deltas**: el 1 (`#approach`) y el 4
(`#csw-bridge`) **no se pueden arreglar cambiando la clase** — necesitan un
combo, como ya lo necesitó `.doctor_quote.cc-overlay`. Los deltas 2 y 5 sí, y
el 3 no necesita nada.

## Lo que sigue sin medirse

**Todo el lado de Figma.** El frame `1249:12003` no se pudo abrir. Concretamente
queda sin confirmar: qué verde exacto pide `#first-visit`, si el hover de las
cards va en Ink o en Forest, cuál es la composición exacta de `#approach`, y
qué orden y qué foto pide el CTA.

---

# 🔁 Tercer publish, y el inventario re-verificado — 2026-09-29

Sesión abortada por los conectores (ver abajo). Lo único que se pudo hacer es
lo que no los necesita: **confirmar que los deltas medidos siguen vivos.**

## La línea de base se movió otra vez

| Tanda | CSS publicado |
| --- | --- |
| Primera medición | `schwabe.webflow.shared.6e44d9a75.css` |
| Reconfirmación por CDP | `…11c375068.css` |
| **Hoy** | **`…4262d11b9.css`** |

**Tres hashes en tres tandas.** El CDN del bundle no se movió (`@970fb4b`), o
sea que los publishes son del Designer, no deploys del repo.

Eso dispara el criterio de aceptación #4 del prompt de la fase 1 — *"si el
`lastPublished` avanzó, hay que re-verificar lo cerrado"*. Se re-verificó.

## Ningún publish tocó un delta medido

Curleando el CSS y el HTML servidos, **declaración por declaración**:

| # | Delta | Estado contra `4262d11b9` |
| --- | --- | --- |
| 1 | `.section.cc-philosophy` | `background-color: brand--beige` · `color: brand--ink` — 🔴 **sigue invertida** contra el Figma |
| 2 | `.section.cc-openings, .section.cc-standing` | **una sola regla compartida**, las dos en `beige-muted` — 🔴 **siguen cruzadas** |
| 3 | `.media-band_frame` | `aspect-ratio: 1360 / 812` — 🔴 el cambio a **`3/2`** decidido **no está aplicado** |
| 4 | `.approach_grid` | `544fr 576fr`, `align-items: start`, gap `3rem 5rem` — 🔴 sigue sin foto |
| 5 | `.four_num` | `background: forest-green`, `color: olive-green`, `padding-left: 1.25rem` — 🔴 **sigue el numeral**, no el domo |
| 6 | `<select id="si-role" class="w-select">` | 🔴 **sigue sin `inquiry_input`** |
| 7 | Los 5 `<label for="" class="u-sr-only">` | 🔴 **siguen vacíos** |
| 8 | `<details class="job-card job-card">` ×2 | 🔴 **ninguno abierto** |
| 9 | La nota *"We read every introduction…"* | 🔴 **sigue visible** (1 ocurrencia) |

**Y uno que confirma lo aplicado**: `.doctor_quote.cc-overlay` está servido
completo —`absolute`, `olive-green`, `25rem`, `bottom: -4rem`, `right: 0`,
`border-left-width: 0`— o sea que **el fix de Our Story sobrevivió los tres
publishes**.

👉 **No hay que re-medir nada. Lo que falta es aplicar.**

## La variante `Columns Check` sigue vacía — y ahora está confirmado

`9f9b1bae-5bfd-1149-0b71-887116176c69` aparece **0 veces** en las 252KB del CSS
publicado. Las otras dos variantes de `four_num` **sí** están
(`ad38b09b` pisa `text-align` y `padding`; `69bbd089` pisa además
`background-color`), que es exactamente lo que este doc predecía.

O sea que la variante existe en el Designer, no declara **ni una** propiedad, y
**ninguna instancia la usa**. Confirma las dos mitades de la nota anterior: el
spec de las 2 llamadas sigue siendo correcto, y si esto no se retoma **hay que
borrarla**.

## 🔴 Los conectores no están caídos — están sin autorizar

La sesión anterior los perdió con `mcp_oauth_token_read_unsupported` y lo
anotó como una caída. **No es eso.** Hoy **Figma y Webflow no aparecen
siquiera en la lista de herramientas**: están en el grupo *"requieren
autenticación"*, y la sesión es no interactiva, así que el flujo de OAuth **no
se puede correr desde acá**.

Consecuencia práctica, y es la que importa para planificar:

- **No se arregla reintentando.** Hay que reautorizar los conectores de Figma y
  Webflow desde **claude.ai → Connectors**, y recién después abrir la sesión.
- **El MCP de Chrome DevTools también está caído** (`CONNECTION_CLOSED`), pero
  ése **no bloquea**: la receta de `RESPONSIVE.md` —Chrome headless a mano por
  CDP con el WebSocket nativo de Node— sigue funcionando, y es con lo que se
  midió todo lo de arriba.

O sea que **el lado de prod se puede medir sin conectores; el lado de Figma y
toda escritura, no.**


## Four Things · re-medido y aplicado en el Designer (2026-09-29, sin publicar)

Pablo pidió re-chequear los checks contra el frame antes de dar la tanda por
buena. **El spec de "las 2 llamadas" de arriba estaba incompleto**: medía el
domo pero no su contenido ni lo que lo rodea. Leído de `get_design_context` y
`get_metadata` sobre `1249:17441` (el row) y `1249:17443` (la columna 1):

| | Spec anterior | Figma | Aplicado en `Columns Check` |
| --- | --- | --- | --- |
| `.four_num` padding | 0 en los 4 | **8 arriba / 2 abajo**, 0 a los lados | `0.5rem` / `0.125rem` |
| `.four_num` radio inferior | 0 | **34px** (el render lo deja en ~1.4px porque el 999px de arriba escala todo; se puso el valor literal para que el cálculo del navegador sea el mismo del Figma) | `2.125rem` |
| Gap domo → título (`.four_item`) | no medido | **20px** (título en y=78, domo de 58) | `grid-row-gap: 1.25rem` (base: 2.5rem) |
| Filete `top` (`.four_rule`) | no medido | **32px** | `2rem` (base: 2.5rem) |
| Filete color | no medido | **`#474D33` = Brand/Ink** (stroke del SVG `1249:17475`) | `variable-aec33a49-796d-03c0-a97d-124eb7591408` (base: `divider-on-dark`, blanco 12%) |
| Glifo `✓` | "mirarlo renderizado" | EB Garamond Medium **48px**, `-0.96px`, leading 1, Olive | **no hace falta tocarlo**: el `Plain Text` va en `Size` = h2, que a 1440 da 48px, 500, `-0.02em` |

Todo va por `set_variant_styles` sobre `9f9b1bae-…`, así que las variantes
Stacked (New Patients, Injury) **no se tocan por construcción**. Leído de
vuelta con `get_variant_styles`: persistió.

### Lo que sigue abierto

1. **Publicar y medir** con la section en viewport (trampa del `data-anim="rule"`).
2. 🟡 **Decisión de Pablo — los segmentos del filete.** El Figma dibuja **3
   segmentos de 170px** (`Line 7/8/9`) que **no tocan** los domos: queda
   **~50px de aire** a cada lado (domo 1 termina en x=195, segmento arranca en
   246). Prod es un filete continuo enmascarado por los domos, o sea que **toca**
   los domos. La nota anterior ("no hacen falta los 3 segmentos") era falsa
   para una paridad 1:1. Opciones: (a) aceptar el filete continuo; (b) 3
   elementos de segmento en la definición, sólo visibles en `Columns Check`.
3. Gap título → cuerpo: Figma 17px, prod 16 (`.doctor_heading` 1rem). 1px, se
   anota y no se toca — `.doctor_heading` es compartida.
4. `/responsive` de la section.


---

# Tanda de paridad 2026-09-29 — lo que se escribió, lo que se midió

Sesión Cowork con Figma + Webflow MCP. Todo **publicado** en `schwabe.webflow.io` y **medido renderizado** con Chromium (Playwright) a 1440, con cada section llevada a viewport antes de medir. `/responsive` corrido en los 6 perfiles × light/dark sobre lo tocado.

## Four Things (Our Story) — cerrado
- Variante **`Columns Check`** (`9f9b1bae-…`) en la instancia de Our Story; los 4 `Number` = `✓`.
- `.four_num` en la variante: 80×58, Beige, Olive, radio `999 999 34 34`, padding **8/2** (el glifo no va centrado). Glifo: `Plain Text` Size h2 → 48px, 500, −0.96px sin tocar nada.
- `.four_item` en la variante: gap **20px** (base 40).
- **3 segmentos** en vez del filete continuo (decisión de Pablo): clase nueva **`four_segment`** + combos `cc-left` / `cc-center` / `cc-right`, `top: 2rem`, **Ink `#474d33`**, ancho `calc(25% - 170.5px)`, `left` `calc(12.5%+75.25px)` / `calc(37.5%+85.25px)` / `calc(62.5%+95.25px)`. `display:none` en la base y en Tablet; `block` sólo en `Columns Check`. Llevan `data-anim="rule"` → `reveal.js` los saca del stagger y los dibuja solos. `.four_rule` oculto en la variante.
- Medido: aire domo↔segmento **50.2 / 50.3px** (Figma 50.75), `y=32`, título en `y=78`. New Patients e Injury siguen con numeral 1–4.

## Photo Band — cerrado, con una corrección al handoff
- `.media-band_frame` → `3/2`. ⚠️ El handoff decía 3 instancias: **son 6**. Care Hub, Patient Stories y Wellness usan la variante full-bleed `5115a7a3`, que no pisaba el ratio. Se fijó `1360/812` en esa variante para no cambiarlas. Medido: base 1.500, full-bleed 1.675.

## Join Our Team — 10 deltas cerrados
Philosophy Ink/Beige + solape 100px (`margin-top:-6.25rem`, `padding-top:13.75rem`, precedente `cc-rooted`) · Openings Beige · `select` con `inquiry_input` (48px, pill, 16px) · 5 `for` puestos como atributo (salen en el HTML) · `resize:none` · lede en `Plain Text` **`70443b83`** (h4) + `u-italic` → EB Garamond 500 italic 32px · H2 Standing en h1 (60px) · `job-card` borde `brand--border` + radio `card--border-radius-large` (se sacó el alias `border-color`, trampa #8) · nota oculta (`Visibility` false) · combo nuevo **`inquiry_footer.cc-end`** (Contact comparte la base).
- **La primera vacante abierta necesitó 2 atributos**: `open="open"` (un `open=""` vacío Webflow lo descarta) **y** `data-accordion-start-open="true"`, porque `accordion.min.js` de MAST cierra todo `<details open>` que no lo tenga (ver `animations/ACCORDION-OPEN.md`).

## Our Team `#growing-team` — el Figma es el CTA, no un Feature Card
El frame `1249:17851` no tiene un Feature Card: "We're growing thoughtfully" **es la instancia `Final CTA 1`** (1360×560, foto a sangre 680). Se reemplazó el `Section / Feature Card` por un **`Section / CTA Banner` variante `Split`** con los mismos props que las otras 9 (`cc-icon-circle cc-on-dark`, `cc-circle-olive`, `cc-cta-sm u-mb-0`), Section ID `growing-team`, secundario *Join Our Team*. Los dos párrafos van en el `textContent` con `\n\n` y se renderizan separados. Props del Feature Card borrado (para volver atrás): Title, Paragraph, Second Paragraph, Image `6aa80d71e81270e66164d40c`, Secondary → `/contact`.

## Care Hub — lo leído del frame `1249:12003` y lo aplicado
- **A `#approach`**: copy + cita a la izquierda, **foto en arco** a la derecha. Foto = **`0037_…chiro_treatment`** (`6ab9836a8c3ad0a33bf77de2`), hash perceptual **0** contra el asset del Figma, no usada en otra página. Clases nuevas `approach_copy`, `approach_media` (radio `500 500 24 24`, `height:0; min-height:100%; align-self:stretch` para igualar la altura del copy) y combo `approach_grid.cc-media` (650fr/590fr, gap 120, 1fr en Tablet). Lede a `Size` base (el Figma lo pone en cuerpo 16px). `approach_quote` margin-top 1rem.
- **B `#first-visit`**: banda **Ink `#474d33`** (el Figma no es oliva media ni forest). Domos nuevos: clase **`process_num`** (mismo spec que Four Things, tipografía por variables h2) como `Paragraph` con `✓`. ⚠️ El `data_element_builder` con `TextBlock` crea un Block con el placeholder *"This is some text inside of a div block."* e ignora `set_text` → usar `Paragraph` y `set_text` después. `.process_rule`: Olive `#6b744e`, `margin-top 2.625rem`, `margin-left/right -4.375rem` → 284px con 53px de aire. Botón: `cc-icon-circle cc-on-dark` + `cc-circle-olive` (los dos props).
- **C Areas of Care**: el frame no dibuja el estado hover → no se puede confirmar Ink vs Forest desde el Figma.
- **D `#csw-bridge`**: variante nueva **`Media Left`** (`47fc56d7-03eb-f9dc-ecd7-a6f3f0ebf628`) de `Shockwave Bridge` (Injury comparte el componente): foto primero, card **Beige** (no Beige Muted), borde **2px `slate-line`** (`#7a999e` ≈ `#79979d`), radio 24, texto **`slate-ink #465659`** (token exacto), foto radio 16. Abiertos: eyebrow con logo, botón con disco.
- **E `#final-cta`**: copy izquierda / foto derecha, H1 60px, padding 120, combo `approach_body.cc-cta` (gap 40). **Foto del Figma = 0245** (hash 0), ya usada en los CTA de Home y Community Partners → pendiente de Pablo.

## Tanda 5 — no se aplicó
`Image Fit` = *cover center-right* (`70209591`) está fijo en la definición del CTA Banner, **sin prop expuesto**, y lo usan 8 páginas. No es un arreglo de instancia como decía el handoff.

## Decisiones de Pablo aplicadas (2026-09-29, misma sesión)
- **Encuadre del CTA por página**: `Image Fit` es un prop de tipo *variant* y el MCP no puede crear props de ese tipo, así que no se puede exponer tal cual. Se hizo con una **variable CSS**: la variante *cover center-right* (`70209591`) declara `object-position: var(--img-pos, 100% 50%)`, y el CTA Banner tiene un prop nuevo **`Image Style`** bindeado al `Style` del `Image` anidado. Vacío = igual que antes. Community Partners usa `--img-pos: 50% 50%`.
- Care CTA con la **0245**. Team → `/join-our-team`. Join Our Team colapsa en mobile.


---

## Home · feedback 2026-10-01

Pablo marcó 4 cosas en la Home. Medido en el publicado con Playwright a 1440.

1. **Línea entre las reviews y la fee bar.** No es un borde: es una costura.
   `.hero_band` es absoluta, termina en y=952.797 y `#fees-at-a-glance` arranca
   en el mismo y fraccional. A DPR 1.25 y 1.5 queda una fila más clara (brillo 78–92
   sobre fondo 38); a DPR 1 y 2 no. Fix: `.section.cc-fee-bar { margin-top: -1px }`,
   la fee bar (mismo color) tapa el pixel.
2. **Línea de las cards de Sound Familiar.** En el publicado está: `::before` de
   `symptom-card.css`, 24×2 Olive Green. El Designer no la muestra porque el CSS
   viene del bundle del CDN. Pendiente confirmar con Pablo dónde la ve.
3. **Flechas.** Inventario de los 29 botones con flecha del sitio: en reposo son
   consistentes (disco olive sobre píldora clara, disco beige sobre píldora olive).
   Lo que no estaba bien:
   - los 2 botones de Shockwave de la Home no tenían flecha. Ahora tienen
     `ph-arrow-up-right` + `.icon-color.cc-circle-teal` (Shockwave Teal `#719ca1`,
     flecha Beige) y `cc-icon-circle cc-slate`;
   - al hover los botones teal tomaban el wash olive de `button.css`. Corregido
     en código (bloque `.cc-slate`/`.cc-teal`), falta deploy.
4. **Mapa → Google Maps** (pedido nuevo). `find-us_overlay` es un Link Block
   absoluto sobre el mapa, `opacity 0 → 1` en `:hover` y `:focus-visible`, con
   fondo `rgba(38,47,35,.4)` y la pill `find-us_overlay-label`. Al ser el link
   el que recibe el hover no hace falta selector de descendiente ni CSS externo.
   En ≤991 la pill queda visible y el fondo transparente, porque en touch no
   hay hover. Vive en *Section / Find Us*, así que también aparece en Our Story.
   URL: `google.com/maps/search/?api=1&query=628+E+Evans+Ave+Suite+100+Denver+CO+80210`.

### Home · mobile, 2026-10-01 (tarde)

- **`#plan` a 390**: el número de 80px + 20 de gap dejaba 250px de texto en 350. A ≤767 el disco pasa a 48px y la columna de texto a 286. **La línea vertical vive en el estado *Before* de `.plan_steps`** (pseudo-elemento, `transform: scaleY(var(--plan-line, 1))` que anima `plan.js`), no en un elemento.
- **El remate de los pasos era DM Sans italic**; el Figma dice EB Garamond Medium Italic 24px. La itálica no alcanza: hay que mirar la familia.
- **Patrón general**: en mobile, todo "número + línea vertical" sigue a `#plan` — número en columna de 3rem, gap 1rem, línea centrada bajo el número. Aplicado a Four Things *Stacked* (New Patients) y *Stacked Light* (Injury). Los marcadores horizontales (Our Story `Columns Check`, Care Hub `#first-visit`) apilan centrados y **ocultan** la línea en mobile, y así quedan.
- El método completo, los scripts y el catálogo de errores recurrentes están en la skill `/figma-parity`.


## Our Story · #our-clinic y figma-parity, 2026-10-01

Frame `1249:17334`. Fuente del cambio: comentario del cliente sobre `1249:17670`
(*"slider for mobile; full grid for desktop"*) + `UPDATED_our-story-05-clinic-section-v0_1.md`
(lead image + grid de 6 bloques, CMS, 2×3, orphans a la izquierda, alturas iguales).

**Qué se construyó**

- Colección **Clinic Features** `6abe699b252643c279a51bba`. Campos: Name (título),
  Image `5c7b2fce…`, Body `b5ef819a…`, Sort Order `4d280d09…` (slug `sort-order`).
  6 items con alt propio. Template `6abe699b252643c279a51bc0` en draft.
- `section.section.cc-clinic` > `.container` > `.clinic_inner[data-component=clinic-slider]`
  > Collection List `.clinic_list` > `.clinic_items` > `.clinic_item` > `.clinic_card`
  (`.clinic_img`, `.clinic_body` > `h3.clinic_title` + `p.clinic_text`), y `.clinic_nav`
  con dos `<button>` `.button.cc-slider-nav.cc-light` (`data-clinic="prev|next"`).
- Sort por `sort-order` ascending. Orden verificado en el HTML publicado.

**Medido en `webflow.io`**

| Ancho | Layout | Card | Título |
| --- | --- | --- | --- |
| 1440 | 3 col, gap 40, filas de 514 | 427, foto 427×356 (6:5) | 22px |
| 768 | 2 col, gap 24 | 340 | 22px |
| 390 | fila deslizable (85%), scroll-snap | 298 | 20px |

Padding: 80 arriba y abajo en desktop (Figma `py-80`), 48 / section padding en ≤991.

**Aprendizaje del MCP (importante para otras páginas):** un Collection List
**dentro de la definición de un componente** no tiene contexto CMS para el MCP:
`get_bindable_sources` no lista los campos, el bind devuelve *"Element is not
inside a CMS context"* y el sort *"No source connected"*, aunque `source` sí se
guarda. Con el Designer conectado podría andar; sin él, el Collection List va a
nivel página. Otro detalle: el MCP no deja insertar ni mover **entre** dos
instancias (*"Cannot move an element before a component instance"*). Se resuelve
con un div temporal al final de `main` como ancla: se mueven las instancias de
abajo "before" del ancla y se borra.

**Formatos de settings del Collection List que acepta el MCP**
`source`: `{"collectionId": "…"}` · `sort`: `[{"fieldSlug": "sort-order", "direction": "ascending"}]`.

**Deltas del resto de la página (no aplicados, para que Pablo elija)**

| Section | Figma | Prod |
| --- | --- | --- |
| Hero | *don’t* con comilla tipográfica | comilla recta |
| Story | card de cita ~420×200, itálica ~28px | 400×134, ~20px |
| Bio | citas en Ink | citas en olive |
| Four Things | botón píldora Beige + disco olive, 80px abajo | píldora olive apagada, ~50px |
| The Space | H2 en 2 líneas (*care.* sola) | 1 línea con balance: lo pide el cliente, gana el cliente |
| Clinic | slider 480×622 con título 32px | grid por pedido del cliente, título 22px por la nota de build |
| Find Us | mapa 610×700, fondo claro | mapa más chico, fondo beige oscuro |
| CTA | botones en una fila | el secundario baja |


### Our Story · aplicado, 2026-10-01 (tarde)

- `#our-clinic`: las 6 cards pasaron a **estáticas** (pedido de Pablo). La colección *Clinic Features* quedó sin uso, sin borrar.
- Los 6 deltas de la tabla de arriba, aplicados y medidos (detalle por fila en TODO.md, bloque *Our Story · `#our-clinic` + figma-parity*).
- Find Us: el Figma de la **Home** es beige oscuro con py 148 y el de **Our Story** claro con py 80, así que hay variante *Light* sólo para Our Story. El mapa 610×700 vale para las dos.
- CTA Split: link secundario roto (`/about/community-partners`) corregido en el default del componente.


## Our Team · Community Partners · Join Our Team, 2026-10-01

Comparado section por section a escala 1 (hojas lado a lado) y aplicado lo que Pablo eligió (detalle en TODO.md).

**Patrones nuevos que salieron**

- **Contenedor de 1200 en las sections internas.** En Partners (*Rooted*) y en Join (*Philosophy*, *Openings*, *Standing*) el Figma pone el contenido en x120, 1200 de ancho; prod usaba los 1360 del container. Se resolvió con `max-width: 75rem` + margin auto en el grid de cada section, no tocando `.container`.
- **El `Final CTA 1` del Figma no tiene un solo ancho de panel.** Our Story 831/529, Team y Partners 680/680. Por eso hay dos variantes: *Split* (50/50) y *Split Wide*.
- **Títulos de hero con ancho propio por página** (480 en Partners, 631 en Join). Se manejan con el prop *Title Class* y utilities `u-max-width-*`.
- **Links viejos `/about/*`**: aparecieron dos más (CTA secundario y botón de Kati). Ojo al revisar el resto.

**Segunda pasada (re-check del mismo día):** 7 deltas más, aplicados (ver TODO). Patrón nuevo: el prop `Class` de Plain Text va al **wrapper** `.plain-text-component`, y la variante de tamaño vive en el `.plain-text` interno como `:where(.w-variant-…)`. Un combo en el wrapper no llega al tamaño desde el Designer; se resuelve redefiniendo la custom property de tipografía en el wrapper (`src/styles/plain-text.css`). El color sí hereda (ninguna regla de `.plain-text` declara `color`).

**No aplicado:** credenciales de Frank (copy). Borde de las job cards y padding derecho del CTA de Team (48 vs 64) sin comparar.

---

## Pasada visual de los 13 frames restantes, 2026-10-01

Section por section a escala 1, con hojas lado a lado (Figma | prod) y medición en las dos puntas (`get_design_context` + `getComputedStyle` a 1440). Reemplaza como fuente de verdad a la pasada de texto del 2026-09-25 para estas páginas. Hojas en el scratch de la sesión (no versionadas).

**Notas viejas ya resueltas en prod:** Care `#approach` tiene foto y `#csw-bridge` ya va media a la izquierda · Injury dice *shoulder strains* · Contact ya no usa el placeholder de MAST · Products: el tag ya coincide · 404 ya dice *Back to home* · Blog: H2 *Expert guidance…* y aside *Important* ya están.

### 🔴 Bugs (no son de Figma, verificados)

1. **`/blog`: las 3 cards linkean a `detail_blog` → 404.** El `u-link-cover` quedó con texto literal en vez del link al item.
2. **`/products-we-recommend` `#final-cta`: imagen rota (403)** — `…/webflow-prod-assets/…/6aa80d71e81270e66164d40c_team-growing-reception.png`.
3. **Blog Post: *Share this post* invisible** — `.article-share_label` color `#FBFAF8` sobre `#FBFAF8`.
4. **Blog Post *More from the practice*: incluye el artículo actual** (autolink).
5. **Contact `#inquiry-form`: filas del form pegadas** — el `gap: 24px` está en `.w-form`, no en el `<form>`; textarea a 6px de la nota.
6. **New Patients FAQ preview: 6 de 7 respuestas son Lorem ipsum.**

### Patrones compartidos (aparecen en varias páginas)

| Patrón | Figma | Prod | Dónde |
| --- | --- | --- | --- |
| Pregunta del accordion | EB Garamond 24, disco 32 borde `#d1d6c2`, abierto relleno olive | 20px, disco 28 borde ink 20% | FAQ, New Patients, Injury, Wellness |
| Contenedor interno | 1200 en x120 | 1360 en x40 | casi todas las sections de texto |
| Photo Band a sangre | 1440×1080 | 1440×860 | Care, Wellness, Patient Stories |
| `#csw-bridge` / Shockwave | lockup logo 32 + *COLORADO SHOCKWAVE®*, botón con disco teal `#79979d` y ®, ® en el cuerpo | divisor + *ALSO AVAILABLE HERE*, sin flecha, sin ® | Care, Injury (además columnas invertidas y colores de card), Fees |
| Eyebrow chico de asides/labels | DM Sans Medium 14 olive, tracking .56 | 16 ink | Injury, Wellness, Blog, Legal, Products |
| Final CTA | variante Split (1360×560, foto a sangre 680) | `feature_card` (pad 60, foto inset 580×399) | Products, Wellness, FAQ (*Still have questions* además es banner sin foto en Figma) |
| Fondo de la section del Final CTA | `#fbfaf8` | `#eeece4` | casi todas |
| Blockquote del rich text | EB Garamond Medium Italic 24/1.3, borde 1px olive, px20 | default Webflow (DM Sans italic 20.8, borde 5px) | Patient Stories, Blog Post |
| Article card | borde 2px `#cacdb7`, r24, p24, img 240 r16, título 24, sin botón | 1px, r12, p20, img 293, título 32, botón *Read more* | Blog, Blog Post |
| Rich text H2 | 40px (H3) / 32 (H4) | 48 | Legal, Blog Post |
| TOC | EB Garamond Medium 20, activo olive con disco | DM Sans 16 opacity .55, flecha a opacity 0, sangría 28 en inactivos | Legal, Blog Post |
| Botón sin flecha | pill 48 con disco | 37 de alto sin icono | Contact *quick details*, Wellness `#fit`, Shockwave |
| Apóstrofes rectos `'` | `’` | — | Care, Injury, New Patients, FAQ, Patient Stories |

### Por página (lo específico, además de los patrones)

**Care Hub** (`1249:12003`): `#first-visit` columnas con px40 interno, gaps 80/80 (prod 64/65), H2 680 de ancho (prod 900), glifo ✓ más fino · `#care-areas` ícono 160 (prod 120), domo 144 · *Learn more* 16px tracking .64 (prod 15) · card del medio oscura `#262f23` en Figma (¿hover o fijo?).

**Injury** (`1249:12270`): `#care-approach` H2 662 en 2 líneas, pt160/pb100, números a opacity .5 · `#csw-bridge` media a la **derecha** en prod (Figma izquierda), sección `#eeece4` + card `#fbfaf8` sin borde r24, texto `#465659` · `#conditions-treated` cards con filete 24×2 `#728738` y texto EB Garamond 24 (prod 20 sin filete), H2 670 · `#faq` H2 440 · Final CTA sección `#fbfaf8`.

**Wellness** (`1249:15030`): hero pt20 e imagen en x80 · `#recognition` 1200, pt160/pb120 · `#what-it-is` ícono 80 en domo 120×74, párrafos 18 · `#includes` fondo `#474c33` (prod `#262f23`), cards 584 gap 32, título 24/cuerpo 16 (prod 20/14) · `#options` eyebrow 14 olive, filas 54/62, precios Garamond Italic 24 (monthly ink 400, per-visit olive 600) vs prod 20/500 olive · nota al pie 680 de ancho · 💵 `$143` vs `$145` · `#fit` sin imagen y con otro layout [decisión] · *See all FAQ* oculto en Figma.

**Fees** (`1249:14334`): la que más diverge. **Orden y contenido distintos** [decisión]: faltan *Three ways to pay* y *Medicare patients*; prod tiene *HSA and FSA.* que el Figma oculta; *The quick version* son 6 cards 3×2 en Figma vs 5 stat cards. Además: *Out-of-pocket* con colores invertidos (Figma claro) y aside *ADVANTAGE CONFIRMED*; *Appointment fees* fondo `#474d33`, tabla con nombre Garamond 24 y precio Garamond Italic 32, filas 91; *Payment methods* con foto a la izquierda y checklist [decisión]; *Cancellation* cards borde 2px, H3 32, cuerpo 16; copy *full visit fee* vs *full session fee*.

**New Patients** (`1249:18150`): hero con la foto metida 60px en la sección oscura · *60-minute* fondo `#474d33` + textura, números en disco 80 `#555a43`, **falta el botón de reserva** · *After booking* review en card olive sobre la foto [decisión] · *Fees link* fondo `#eeece4` (prod `#d3dddf`), botón *See Fees & Practical Details* · video: radio 24, overlay + play 100 centrado · *Where we are*: títulos Garamond 24, cuerpo 18.

**FAQ** (`1249:19487`): contenedor 1200 · nav 14px, pill activa borde 2px · primer ítem de cada categoría abierto · CTA de Shockwave como pill outline · ® · *Still have questions* banner sin foto, H2 60 [decisión].

**Patient Stories** (`1249:23751`): hero foto 542×657 r24 y quote card Garamond Italic 32 · body 18 en hero/intro/outro/relationship · paddings 148 · featured sin foto con aside verde [decisión] · **faltan los disclaimers** (featured, relationship, themes, shockwave) · `#themes` lista vertical + título de tema [decisión] · shockwave con colores invertidos (Figma claro con texto `#465659`) y botón con disco teal · Google reviews eyebrow 14.

**Blog** (`1249:23160`): hero con foto 720 a la derecha [decisión] · botón del hero con padding de más (falta `cc-icon-circle`) · intro 1200, aside label 14 olive · chips 14 borde 2px · H2 de la grilla 348 en 2 líneas.

**Blog Post** (`1249:23553`): header y body arrancan en x120 · primer párrafo como heading Garamond 40 · imagen inline + caption [decisión, CMS] · newsletter vs free guide [decisión] · TOC con labels cortos [copy] · botones de share 34 borde 2px · Final CTA con copy propio del blog en prod.

**Contact** (`1249:25161`): hero padding 120 y texto arriba, imagen 712×420, dirección 20px · borde del botón *Call* `rgba(202,205,183,.5)` · *Quick details* 1200, botón 48 con disco · mapa 1200×700 (prod 1360×1020 con PNG de 800 estirado, borroso) · *Accessibility* cuerpo 18 · form H2 60, 1200, form de 600.

**Products** (`1249:26302`): hero con la imagen metida 60px en la sección siguiente, H1 569 · cita en itálica · **filtros** (6 chips con nombres reales) [decisión] · card 1200, imagen vertical 560×700 que llena el alto (prod deja ~300px vacíos), chip *Available in Clinic* blanco con punto verde, título 60, subtítulo Garamond Italic 24 · Final CTA Split.

**Legales** (`1249:26662`, igual en las dos): hero oscuro `#262f23` con árbol y *Last modified* [decisión] · columna 800 en x120 · padding 120 · H2 40 con 40/24 de aire · aside de dirección en card `#eeece4` · pie con divisor + *Back to top ↑* · TOC Garamond 20 · card *Questions?* [decisión].

**404** (`1249:26809`): gap titular itálico → párrafo 24 (prod 37). Prod usa `’`, Figma `'`: prod está mejor.

*Aplicado el mismo día salvo las decisiones de contenido; ver TODO.*
