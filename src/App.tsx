import { Button, FooterBar, NavBar } from '@ds'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { DevHud } from './components/DevHud'
import { LocaleToggle } from './components/LocaleToggle'
import { site } from './content/site'
import { LocaleProvider, useCopy } from './i18n/LocaleContext'
import { SceneProvider, useActiveScene } from './scroll/SceneContext'
import { useIsNarrow } from './scroll/useMediaQuery'
import { SphereCanvas } from './three/SphereCanvas'
import { SCENE_ORDER, type SceneId } from './three/types'

const NAV_SCENES = SCENE_ORDER.filter((s): s is Exclude<SceneId, 'hero'> => s !== 'hero')

export default function App() {
  return (
    <LocaleProvider>
      <SceneProvider>
        <SphereCanvas>
          <div className="layer-content">
            <Nav />
            <main>
              <Outlet />
            </main>
            <Footer />
          </div>
          {/* Inside SphereCanvas: the HUD reads the engine off its context. */}
          <DevHud />
        </SphereCanvas>
      </SceneProvider>
    </LocaleProvider>
  )
}

function Nav() {
  const scene = useActiveScene()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const copy = useCopy()
  const onHome = pathname === '/'
  const narrow = useIsNarrow()

  const go = (id: string) => {
    if (!onHome) {
      navigate(`/#${id}`)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // NavBar renders items as their own labels, so the label IS the identity. Map
  // back from the translated label to the scene id on navigate.
  const labels = NAV_SCENES.map((id) => copy.nav[id])
  const idForLabel = (label: string) => NAV_SCENES[labels.indexOf(label)] ?? 'about'

  return (
    <NavBar
      // The design system's NavBar lays its items out in a non-wrapping flex row
      // with no responsive behaviour, so six of them overflow a phone. Below the
      // grid breakpoint the list is dropped for the language toggle alone.
      items={narrow ? [] : labels}
      active={onHome ? copy.nav[scene as Exclude<SceneId, 'hero'>] : undefined}
      onNavigate={(label: string) => go(idForLabel(label))}
      // The design system hardcodes an ink-600 bar over an ink-800 page, which
      // reads one step light. Overridden through style, which merges last.
      style={{ background: 'color-mix(in srgb, var(--surface-page) 82%, transparent)' }}
      action={
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {narrow ? (
            <Button
              as="a"
              href="#contact"
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault()
                go('contact')
              }}
            >
              {copy.nav.contact}
            </Button>
          ) : null}
          <LocaleToggle />
        </div>
      }
    />
  )
}

function Footer() {
  const copy = useCopy()

  return (
    <FooterBar
      email={site.email}
      // FooterBar renders socials as IconButtons with no href, so they would be
      // unclickable. The real links live in the contact section.
      socials={[]}
      note={copy.footerNote}
      // The email is set at --text-display-md (56px) with display tracking, which
      // overflows any phone. Clamped down, and the inline padding drops to the
      // normal gutter so the bar stops pushing the page wider than the viewport.
      className="footer-bar"
    />
  )
}
