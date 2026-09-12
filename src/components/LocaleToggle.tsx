import { useLocale } from '../i18n/LocaleContext'
import { LOCALES } from '../i18n/types'

/**
 * Two mono labels separated by a hairline — the design system's own label
 * language rather than a control it does not ship.
 */
export function LocaleToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <div
      role="group"
      aria-label="Language"
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
    >
      {LOCALES.map((code, i) => {
        const active = code === locale
        return (
          <span key={code} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {i > 0 ? (
              <span
                aria-hidden="true"
                style={{ width: 1, height: 'var(--space-5)', background: 'var(--border-hairline)' }}
              />
            ) : null}
            <button
              type="button"
              lang={code}
              aria-pressed={active}
              onClick={() => setLocale(code)}
              style={{
                background: 'none',
                border: 0,
                padding: 'var(--space-2)',
                cursor: active ? 'default' : 'pointer',
                font: 'var(--text-label-sm)',
                letterSpacing: 'var(--tr-label)',
                textTransform: 'uppercase',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'var(--transition-control)',
              }}
            >
              {code}
            </button>
          </span>
        )
      })}
    </div>
  )
}
