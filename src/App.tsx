import { Button, Logo, NavBar } from '@ds'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { DevHud } from './components/DevHud'
import { LocaleToggle } from './components/LocaleToggle'
import { Splash } from './components/Splash'
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
          <Splash />
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

  // Publish the sticky bar's height as --nav-height, so the hero can fill the
  // screen below it rather than a full screen that runs past the fold. The
  // design system's NavBar takes no ref and its height is not a token, so it is
  // measured. It is the page's only <header>.
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return
    const root = document.documentElement
    const ro = new ResizeObserver(() => {
      root.style.setProperty('--nav-height', `${header.offsetHeight}px`)
    })
    ro.observe(header)
    return () => ro.disconnect()
  }, [])

  const go = (id: string) => {
    if (!onHome) {
      navigate(`/#${id}`)
      return
    }
    // Aim at the section's scroll stop, not its top: landing on the padding above
    // it would make the section snap settle a second time, a visible double move.
    const section = document.getElementById(id)
    const stop = section?.querySelector(':scope > .grid12') ?? section
    stop?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
  const navigate = useNavigate()
  const link = (to: string, label: string) => (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
    >
      {label}
    </a>
  )

  // The design system's FooterBar, with the same structure and tokens, plus the
  // privacy and terms links in its bottom row: FooterBar has no slot for links,
  // and the design system is not edited here. Its socials are left out: they
  // render as IconButtons with no href, and the real links live in the contact
  // section. The email is set at --text-display-md (56px) with display tracking,
  // which overflows any phone, so .footer-bar clamps it and narrows the padding.
  return (
    <footer
      className="footer-bar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-9)',
        borderTop: 'var(--border-width) solid var(--border-hairline)',
        padding: 'var(--space-10) var(--gutter-inline-lg) var(--space-8)',
        background: 'var(--surface-sunken)',
      }}
    >
      <a href={`mailto:${site.email}`} style={{ font: 'var(--text-display-md)', letterSpacing: 'var(--tr-display)', border: 0, color: 'var(--text-primary)' }}>
        {site.email}
      </a>
      <div className="footer-row">
        <Logo size={24} assetBase="/assets/" />
        <span>{copy.footerNote}</span>
        <nav className="footer-legal" aria-label={`${copy.legal.privacy.title}, ${copy.legal.terms.title}`}>
          {link('/privacy', copy.legal.privacy.title)}
          {link('/terms', copy.legal.terms.title)}
        </nav>
        <span>{`© ${new Date().getFullYear()}`}</span>
      </div>
    </footer>
  )
}
