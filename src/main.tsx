import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import '@ds/styles.css'
import './styles/app.css'
// Anatomy figures load as their own chunks, but their styles cannot: the
// prerendered page carries the drawing, and it must be styled before (and
// without) the chunk.
import './figures/iso.css'
import './figures/palette.css'
import './figures/figures.css'

import { routes } from './routes'

const router = createBrowserRouter(routes)
const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

// Production pages arrive prerendered (scripts/prerender.mjs) so crawlers and AI
// agents that do not run JavaScript still read the full content; React adopts
// that markup rather than replacing it. The dev server serves a root holding
// only the placeholder comment, so it renders from scratch.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
