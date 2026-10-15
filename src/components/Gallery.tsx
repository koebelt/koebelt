import { Dialog, IconButton, MediaFrame } from '@ds'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { ProjectImage } from '../content/site'
import { useCopy } from '../i18n/LocaleContext'
import { Reveal } from './Reveal'

/**
 * A case study's screens: desktop shots half a row wide, phones a quarter, each
 * opening full size in the design system's Dialog. Dialog is only the panel and
 * scrim, so the keyboard handling (Escape, arrows), the scroll lock and putting
 * focus back on the thumbnail live here.
 */
export function Gallery({ images, captions }: { images: ProjectImage[]; captions: Record<string, string> }) {
  const { projects } = useCopy()
  const [open, setOpen] = useState<number | null>(null)
  const thumbs = useRef<(HTMLButtonElement | null)[]>([])

  const close = useCallback(() => {
    setOpen((i) => {
      if (i !== null) thumbs.current[i]?.focus()
      return null
    })
  }, [])
  const step = useCallback((by: number) => setOpen((i) => (i === null ? i : (i + by + images.length) % images.length)), [images.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, step])

  const current = open === null ? null : images[open]

  return (
    <>
      <div className="gallery">
        {images.map((img, i) => (
          <Reveal key={img.id} order={i % 4} className={`gallery-item gallery-${img.shape}`}>
            <button
              ref={(el) => {
                thumbs.current[i] = el
              }}
              type="button"
              className="gallery-thumb"
              aria-label={`${projects.viewer.open}: ${captions[img.id] ?? img.id}`}
              onClick={() => setOpen(i)}
            >
              <MediaFrame src={img.src} alt={captions[img.id] ?? ''} ratio={img.ratio} label={img.id} />
            </button>
            {captions[img.id] ? <p className="gallery-caption">{captions[img.id]}</p> : null}
          </Reveal>
        ))}
      </div>

      <Dialog
        open={current !== null}
        title={open === null ? '' : `${open + 1} / ${images.length}`}
        onClose={close}
        width={1280}
        footer={
          images.length > 1 ? (
            <>
              <IconButton name="arrow-right" label={projects.viewer.previous} variant="outline" onClick={() => step(-1)} style={{ transform: 'rotate(180deg)' }} />
              <IconButton name="arrow-right" label={projects.viewer.next} variant="outline" onClick={() => step(1)} />
            </>
          ) : null
        }
      >
        {current ? (
          <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <img
              src={current.src}
              alt={captions[current.id] ?? ''}
              style={{ display: 'block', maxWidth: '100%', maxHeight: '70vh', margin: '0 auto', borderRadius: 'var(--radius-media)' }}
            />
            {captions[current.id] ? <figcaption style={{ font: 'var(--text-body-md)', color: 'var(--text-secondary)' }}>{captions[current.id]}</figcaption> : null}
          </figure>
        ) : null}
      </Dialog>
    </>
  )
}
