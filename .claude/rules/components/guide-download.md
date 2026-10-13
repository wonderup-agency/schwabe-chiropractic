# guide-download

## Purpose

Entrega el PDF de la Free Guide **en el momento en que se envía el form**. La
página `/thank-you` es sólo el landing: la descarga arranca sola ahí.

Creado el **2026-10-08** a pedido de Pablo ("que la guía se descargue cuando se
envía el form y la thank you sea sólo landing"). Decidido: sin email, sólo
descarga.

## Por qué no un link con `download`

El PDF vive en `cdn.prod.website-files.com`, otro origen. Cross-origin el
atributo `download` se ignora y el browser navega a su visor de PDF (se va de
la página). El CDN de Webflow responde `Access-Control-Allow-Origin: *`
(verificado con curl), así que el JS hace `fetch` → blob → object URL →
`<a download>` y el archivo se guarda con nombre limpio (sin el prefijo
`<id>_` de Webflow).

## Por qué un flag en sessionStorage

Si la thank you descargara en cada visita, un refresh, el back o un link
compartido dispararían otra descarga. El form deja
`schwabe:guide-requested = Date.now()` al hacer submit; el landing lo consume
y sólo descarga si tiene menos de 10 minutos. Mismo tab, una sola vez.

## Webflow Setup

| Atributo | Dónde | Para qué |
| --- | --- | --- |
| `data-component="guide-download"` + `data-guide="form"` | El `<form>` de `Section / Free Guide` (`#email-form`) | En submit deja el flag |
| `data-redirect="/thank-you"` | El mismo form | **webflow.js lee `data-redirect`, no `redirect`.** El setting de redirect vía MCP sólo escribe `redirect`, por eso se agregó el atributo a mano |
| `data-component="guide-download"` + `data-guide="landing"` | `.error_content` de `/thank-you` | Dispara la descarga |
| ID `guide-download` | El Button "Download the guide" (prop ID) | De ahí sale la URL del PDF. Alternativa: `data-guide="file"` |

**Mientras el botón apunte a `#` no pasa nada** (warning en consola). Hay que
subir el PDF a Assets y linkearlo en el botón.

## Behavior

- Landing con flag fresco: descarga a los 600ms (deja pintar la página).
- Click manual en el botón: misma ruta blob, descarga sin salir de la página.
  Si el fetch falla, abre el PDF en el mismo tab (un `window.open` después de
  un `await` lo bloquea el popup blocker).
- Sin sessionStorage (modo privado estricto): no hay auto-descarga, el botón
  funciona igual. Por eso el copy dice "If it didn't start, use the button below."

## Verificado (2026-10-08, Playwright contra staging con un PNG del CDN como archivo de prueba)

- Sin flag → no descarga. Con flag → descarga `webclip.png`. Refresh después → no descarga.
- Click en el botón → descarga y la URL sigue siendo `/thank-you`.
- Pendiente: probar el flujo real (submit → redirect → descarga) cuando esté el PDF y el JS deployado.
