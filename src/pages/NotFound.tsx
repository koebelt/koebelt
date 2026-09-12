import { Button, Icon, SectionHeading } from '@ds'
import { useNavigate } from 'react-router-dom'

import { useCopy } from '../i18n/LocaleContext'

export default function NotFound() {
  const navigate = useNavigate()
  const { notFound } = useCopy()

  return (
    <div className="container section">
      <SectionHeading eyebrow={notFound.eyebrow} title={notFound.title} />
      <div style={{ marginTop: 'var(--space-8)' }}>
        {/* Button renders a button or an anchor, never a router Link, so the
            href is real and the click is intercepted for client-side routing. */}
        <Button
          as="a"
          href="/"
          variant="secondary"
          iconLeft={<Icon name="arrow-right" size={18} />}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return
            e.preventDefault()
            navigate('/')
          }}
        >
          {notFound.back}
        </Button>
      </div>
    </div>
  )
}
