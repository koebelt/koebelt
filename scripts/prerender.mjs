// Renders every route to static HTML after the client build, so crawlers and AI
// agents that do not run JavaScript read the full page. React hydrates it in the
// browser (src/main.tsx). Runs as the last step of `npm run build`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')
const origin = 'https://koebelt.com'

const { render, head, paths, jsonLd, llmsTxt, LLMS_FILES } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const template = await readFile(join(dist, 'index.html'), 'utf8')

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Swaps a tag's attribute value, failing loudly if the template stops matching. */
function setAttr(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`prerender: no match for ${pattern}`)
  return html.replace(pattern, (_, before, after) => `${before}${escape(value)}${after}`)
}

function page(appHtml, { title, description, url, path, noindex = false }) {
  let html = template.replace('<!--app-html-->', appHtml)
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  html = setAttr(html, /(<meta property="og:title" content=")[^"]*(")/, title)
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*(")/, url)
  html = setAttr(html, /(<meta property="og:url" content=")[^"]*(")/, url)
  if (description) {
    html = setAttr(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, description)
    html = setAttr(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, description)
  }
  if (noindex) html = html.replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
  else html = html.replace('</head>', `  <script type="application/ld+json">${jsonLd(path)}</script>\n  </head>`)
  return html
}

for (const path of paths) {
  const meta = head(path)
  const html = page(await render(path), { ...meta, path, url: `${origin}${path}` })
  // /work/facix -> work/facix.html, which Cloudflare serves at /work/facix.
  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`
  await mkdir(dirname(join(dist, file)), { recursive: true })
  await writeFile(join(dist, file), html)
  console.log(`prerendered ${path} -> dist/${file}`)
}

// Served with a 404 status for any unknown path (wrangler.jsonc).
const notFound = page(await render('/__not-found__'), {
  title: 'That page does not exist. | Thomas Koebel',
  description: '',
  url: `${origin}/`,
  noindex: true,
})
await writeFile(join(dist, '404.html'), notFound)
console.log('prerendered 404 -> dist/404.html')

// Plain-text versions for AI agents, one per locale (src/machine-readable.ts).
for (const [locale, file] of Object.entries(LLMS_FILES)) {
  await writeFile(join(dist, file), llmsTxt(locale))
  console.log(`wrote ${locale} text -> dist/${file}`)
}

await rm(ssrDir, { recursive: true, force: true })
