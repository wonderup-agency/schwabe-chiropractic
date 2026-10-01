// Resuelve Playwright sin depender de dónde esté instalado (repo, global o el node de la sesión).
const path = require('path')
const tries = ['playwright', path.join(path.dirname(process.execPath), '..', 'lib', 'node_modules', 'playwright')]
for (const t of tries) { try { module.exports = require(t); return } catch (e) {} }
throw new Error('Playwright no está instalado: npm i -D playwright (o correr desde la sesión de Claude)')
