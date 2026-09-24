import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'

import { en } from './i18n/en'
import { PROJECT_SLUGS } from './i18n/types'
import { routes } from './routes'

export { jsonLd, llmsTxt, LLMS_FILES } from './machine-readable'

/** Every URL that gets its own prerendered file. Not-found is rendered separately. */
export const paths = ['/', ...PROJECT_SLUGS.map((slug) => `/work/${slug}`)]

export interface Head {
  title: string
  description: string
}

/**
 * Head tags per route. Pages are prerendered in English, the default locale; the
 * browser switches to French on load when that is the visitor's language.
 */
export function head(path: string): Head {
  const slug = path.startsWith('/work/') ? path.slice('/work/'.length) : null
  const project = slug ? en.projects.entries[slug as keyof typeof en.projects.entries] : null
  if (project) {
    return { title: `${project.title} | Thomas Koebel`, description: project.summary }
  }
  return { title: en.documentTitle, description: '' }
}

export async function render(path: string): Promise<string> {
  const handler = createStaticHandler(routes)
  const context = await handler.query(new Request(`https://koebelt.com${path}`))
  if (context instanceof Response) throw new Error(`Unexpected redirect rendering ${path}`)
  const router = createStaticRouter(handler.dataRoutes, context)

  return renderToString(
    <StrictMode>
      {/* No loaders, so there is no data to hand the browser router. */}
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  )
}
