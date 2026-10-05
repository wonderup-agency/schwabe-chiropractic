import { rollup } from 'rollup'
const cfg = (await import(process.cwd() + '/rollup.config.prod.js')).default
const plugins = cfg.plugins.filter(
  (p) => p && p.name !== 'delete' && p.name !== 'postcss'
)
const bundle = await rollup({
  input: cfg.input,
  plugins: [
    ...plugins,
    {
      name: 'nocss',
      transform(c, id) {
        if (id.endsWith('.css')) return 'export default ""'
      },
    },
  ],
})
await bundle.write({ ...cfg.output, dir: '/tmp/schwabe-build' })
