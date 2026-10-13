/*
Component: guide-download
Webflow attribute: data-component="guide-download"

Delivers the Free Guide PDF the moment the visitor submits the guide form.
The Thank You page is only the landing: the download starts on its own.

Two roles, picked by `data-guide` on the element carrying the attribute:

- `data-guide="form"`: the `<form>` of `Section / Free Guide`. On submit it
  leaves a short-lived flag in sessionStorage. Webflow then redirects to
  /thank-you (form setting `redirect`).
- `data-guide="landing"`: the content wrapper of /thank-you. If the flag is
  there and fresh, it downloads the file the `#guide-download` button points
  to, and consumes the flag.

Why the flag: without it every visit to /thank-you (a refresh, a shared link,
the back button) would fire another download. With it, the file only arrives
right after a real submit, in the same tab, within FLAG_TTL.

Why a blob and not a plain link: the PDF lives on cdn.prod.website-files.com,
another origin, and the `download` attribute is ignored cross-origin, so the
browser would navigate to its PDF viewer and leave the page. The Webflow CDN
answers with `Access-Control-Allow-Origin: *`, so the file can be fetched,
turned into an object URL and saved with a real filename. If the fetch fails,
nothing happens automatically and the button still works as a normal link.
The manual button goes through the same path, so it downloads too.
*/

const LABEL = 'guide-download'
const FLAG = 'schwabe:guide-requested'
const FLAG_TTL = 10 * 60 * 1000
const AUTO_DELAY = 600

function setFlag() {
  try {
    sessionStorage.setItem(FLAG, String(Date.now()))
  } catch {
    // Private mode or blocked storage: the landing simply won't auto-download.
  }
}

function takeFlag() {
  try {
    const raw = sessionStorage.getItem(FLAG)
    sessionStorage.removeItem(FLAG)
    return raw !== null && Date.now() - Number(raw) < FLAG_TTL
  } catch {
    return false
  }
}

function fileName(href) {
  try {
    const last = new URL(href, window.location.href).pathname.split('/').pop()
    // Webflow prefixes assets with "<id>_"; drop it for a cleaner filename.
    const clean = decodeURIComponent(last || '').replace(/^[a-f0-9]{24}_/, '')
    return clean || 'guide.pdf'
  } catch {
    return 'guide.pdf'
  }
}

/** Resolves true when the save was handed to the browser. */
async function download(href) {
  try {
    const res = await fetch(href, { mode: 'cors' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName(href)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 30000)
    return true
  } catch (error) {
    console.warn(`[${LABEL}] download failed, falling back to the link`, error)
    return false
  }
}

function wireForm(form) {
  form.addEventListener('submit', setFlag)
}

function wireLanding(root) {
  const link = root.querySelector('#guide-download, [data-guide="file"]')
  const anchor = link && (link.closest('a') || link.querySelector('a'))
  const href = anchor && anchor.getAttribute('href')
  if (!href || href === '#') {
    console.warn(`[${LABEL}] no file linked on #guide-download yet`)
    return
  }

  anchor.addEventListener('click', async (event) => {
    event.preventDefault()
    const ok = await download(anchor.href)
    // After an await the click no longer counts as a user gesture, so a
    // window.open here would be popup-blocked. Opening the file in place is
    // the fallback that always works.
    if (!ok) window.location.href = anchor.href
  })

  if (takeFlag()) setTimeout(() => download(anchor.href), AUTO_DELAY)
}

export default function (elements) {
  elements.forEach((el) => {
    try {
      const role = el.getAttribute('data-guide')
      if (role === 'form') {
        const form = el.tagName === 'FORM' ? el : el.querySelector('form')
        if (form) wireForm(form)
      } else if (role === 'landing') {
        wireLanding(el)
      }
    } catch (error) {
      console.error(`[${LABEL}]`, error)
    }
  })
}
