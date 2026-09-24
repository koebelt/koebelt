import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'

import { en } from './en'
import { fr } from './fr'
import { LOCALES, type Copy, type Locale } from './types'

const DICTIONARIES: Record<Locale, Copy> = { en, fr }
const STORAGE_KEY = 'koebelt.locale'

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * A remembered choice wins; otherwise the browser's preferred languages decide,
 * and English is the fallback. Storage can throw in a private window, so every
 * access is guarded.
 */
function detectLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Storage unavailable; fall through to detection.
  }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}

interface LocaleValue {
  locale: Locale
  copy: Copy
  setLocale: (next: Locale) => void
  setTitle: (title: string | null) => void
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Pages are prerendered in English, so the first render must be English too or
  // hydration would not match. The visitor's own locale is applied before paint.
  const [locale, setLocaleState] = useState<Locale>('en')

  useLayoutEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // A locale that cannot be remembered still applies for this visit.
    }
  }, [])

  // A page can replace the home title (useDocumentTitle). Held here, because this
  // provider's effect runs after its children's and would overwrite theirs.
  const [title, setTitle] = useState<string | null>(null)

  // Assistive technology and the browser both need to know what language the
  // document is actually in.
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = title ?? DICTIONARIES[locale].documentTitle
  }, [locale, title])

  const value = useMemo(
    () => ({ locale, copy: DICTIONARIES[locale], setLocale, setTitle }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

function useLocaleValue(): LocaleValue {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('LocaleProvider is missing above this component')
  return value
}

/** The active dictionary. Most components need only this. */
export function useCopy(): Copy {
  return useLocaleValue().copy
}

export function useLocale(): Pick<LocaleValue, 'locale' | 'setLocale'> {
  const { locale, setLocale } = useLocaleValue()
  return { locale, setLocale }
}

/** Replaces the tab title while the calling page is mounted. */
export function useDocumentTitle(title: string) {
  const { setTitle } = useLocaleValue()
  useEffect(() => {
    setTitle(title)
    return () => setTitle(null)
  }, [title, setTitle])
}
