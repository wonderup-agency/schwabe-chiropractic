/*
Absolute chunk URLs for the entry's dynamic imports.

The problem (found 2026-10-05 reviewing the site inside Pastel): main.js loads
every component with `import('./plan-xxxx.js')`. A relative specifier resolves
against the URL of the module that runs it. Normally that is
cdn.jsdelivr.net/.../dist/main.js, so './plan-xxxx.js' lands next to it.

Pastel (the client review tool) proxies the page and re-runs our main.js in a
way that makes the page itself the base URL. Every chunk was then requested as
`schwabe.webflow.io/plan-xxxx.js` through the proxy, 404'd, and the loader's
catch swallowed it (terser drops console.* in prod). Result in Pastel: no
global.js, no GSAP components, sections stuck in their hidden anti-FOUC state.

The fix: in the entry only (src/main.js and the registry in src/components.js,
where every import() lives), rewrite

    import('./plan-xxxx.js')
into
    import(new URL('./plan-xxxx.js', __schwabeChunkBase()).href)

__schwabeChunkBase() returns the same base the head snippet chose
(window.__devBase: jsDelivr in prod, 127.0.0.1:8080 in dev), so outside Pastel
the URL is byte-for-byte what the browser resolved before. Chunks themselves
are untouched: they are loaded from their real URL, so their own relative
imports already resolve correctly.

No import.meta on purpose: if a proxy ever evaluates main.js as a classic
script, import.meta is a syntax error that would kill the whole bundle.
*/

const ENTRY_MODULES = [/[\\/]src[\\/]main\.js$/, /[\\/]src[\\/]components\.js$/]

const HELPER = `function __schwabeChunkBase(){var b=window.__devBase;if(b)return b.replace(/\\/?$/,"/");var s=document.querySelector('script[src*="/main.js"]');return s&&s.src?s.src:location.href}`

export default function absoluteChunks() {
  return {
    name: 'absolute-chunks',
    renderDynamicImport({ moduleId }) {
      if (!moduleId || !ENTRY_MODULES.some((re) => re.test(moduleId)))
        return null
      return { left: 'import(new URL(', right: ', __schwabeChunkBase()).href)' }
    },
    // The helper goes into the main entry only; no other chunk calls it.
    intro(chunk) {
      return chunk.isEntry && chunk.name === 'main' ? HELPER : ''
    },
  }
}
