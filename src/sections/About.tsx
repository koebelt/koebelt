import { Divider, SectionHeading, Tag } from '@ds'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { useCopy } from '../i18n/LocaleContext'

export function About() {
  const { about } = useCopy()

  return (
    <Section id="about">
      <Reveal>
        <SectionHeading eyebrow={about.eyebrow} title={about.title} />
      </Reveal>

      <Reveal order={1} style={{ marginTop: 'var(--space-8)' }}>
        <p
          className="prose"
          style={{ font: 'var(--text-body-lg)', color: 'var(--text-secondary)', margin: 0 }}
        >
          {about.body}
        </p>
      </Reveal>

      <Reveal order={2} style={{ marginTop: 'var(--space-10)' }}>
        <TagGroup label={about.languagesLabel} items={about.languages} />
      </Reveal>

      <Reveal order={3} style={{ marginTop: 'var(--space-8)' }}>
        <TagGroup label={about.softSkillsLabel} items={about.softSkills} />
      </Reveal>
    </Section>
  )
}

export function TagGroup({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <Divider label={label} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        {items.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </div>
  )
}
