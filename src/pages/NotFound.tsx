import { Button, Icon, SectionHeading } from '@ds'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="container section">
      <SectionHeading eyebrow="404" title="That page does not exist." />
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
          Back to the portfolio
        </Button>
      </div>
    </div>
  )
}
