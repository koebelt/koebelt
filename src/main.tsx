import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import '@ds/styles.css'
import './styles/app.css'

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
// that markup rather than replacing it. The dev server serves an empty root.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
