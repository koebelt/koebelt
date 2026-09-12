import { Button, FooterBar, NavBar } from '@ds'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { DevHud } from './components/DevHud'
import { site } from './content/site'
import { SceneProvider, useActiveScene } from './scroll/SceneContext'
import { useIsNarrow } from './scroll/useMediaQuery'
import { SphereCanvas } from './three/SphereCanvas'
import { SCENE_ORDER } from './three/types'

const NAV_ITEMS = SCENE_ORDER.filter((s) => s !== 'hero')

export default function App() {
  return (
    <SceneProvider>
      <SphereCanvas>
        <div className="layer-content">
          <Nav />
          <main>
            <Outlet />
          </main>
          <FooterBar
            email={site.email}
            // FooterBar renders socials as IconButtons with no href, so they
            // would be unclickable. The real links live in the contact section.
            socials={[]}
            note={site.footerNote}
          />
        </div>
        {/* Inside SphereCanvas: the HUD reads the engine off its context. */}
        <DevHud />
      </SphereCanvas>
    </SceneProvider>
  )
}

function Nav() {
  const scene = useActiveScene()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const narrow = useIsNarrow()

  return (
    <NavBar
      // The design system's NavBar lays its items out in a non-wrapping flex row
      // with no responsive behaviour, so five of them overflow a phone. Below the
      // grid breakpoint the list is dropped for a single Contact action.
      items={narrow ? [] : [...NAV_ITEMS]}
      active={onHome ? scene : undefined}
      onNavigate={(item: string) => {
        if (!onHome) {
          navigate(`/#${item}`)
          return
        }
        document.getElementById(item)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
      // The design system hardcodes an ink-600 bar over an ink-800 page, which
      // reads one step light. Overridden through style, which merges last.
      style={{ background: 'color-mix(in srgb, var(--surface-page) 82%, transparent)' }}
      action={
        narrow ? (
          <Button
            as="a"
            href="#contact"
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault()
              if (!onHome) {
                navigate('/#contact')
                return
              }
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Contact
          </Button>
        ) : null
      }
    />
  )
}
