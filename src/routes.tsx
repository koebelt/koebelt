import type { RouteObject } from 'react-router-dom'

import App from './App'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'

// App is the layout route, so it owns the WebGL canvas and the scene controller
// across navigations — the context is created once for the life of the tab.
// Shared by the browser entry and the prerender entry, so both render one tree.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'work/:slug', element: <ProjectDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
