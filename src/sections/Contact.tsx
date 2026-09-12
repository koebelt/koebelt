import { Button, Icon, SectionHeading } from '@ds'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SphereCaption } from '../components/SphereCaption'
import { site } from '../content/site'
import { useCopy } from '../i18n/LocaleContext'

export function Contact() {
  const { contact } = useCopy()

  return (
    <Section id="contact">
      <Reveal>
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          description={contact.description}
        />
      </Reveal>

      <Reveal order={1}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-9)',
          }}
        >
          {/* The page's single primary action. The design system allows one per view. */}
          <Button as="a" href={`mailto:${site.email}`} variant="primary" size="lg">
            {site.email}
          </Button>

          {/* Rendered only once a PDF exists — a disabled button with apologetic
              copy would break the voice rules. Set site.cvUrl to enable. */}
          {site.cvUrl ? (
            <Button
              as="a"
              href={site.cvUrl}
              download=""
              variant="secondary"
              size="lg"
              iconLeft={<Icon name="download" size={18} />}
            >
              {contact.downloadCv}
            </Button>
          ) : null}
        </div>
      </Reveal>

      <Reveal order={2}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-5)',
          }}
        >
          {/* FooterBar renders socials as IconButtons with no href, so the real
              links live here instead. */}
          <Button
            as="a"
            href={site.github}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
            iconLeft={<Icon name="github" size={18} />}
            iconRight={<Icon name="arrow-up-right" size={16} />}
          >
            GitHub
          </Button>
          <Button
            as="a"
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
            iconLeft={<Icon name="linkedin" size={18} />}
            iconRight={<Icon name="arrow-up-right" size={16} />}
          >
            LinkedIn
          </Button>
        </div>
      </Reveal>

      <div style={{ marginTop: 'var(--space-10)' }}>
        <SphereCaption scene="contact" />
      </div>
    </Section>
  )
}
