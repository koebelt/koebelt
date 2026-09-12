import { Divider, SectionHeading, Tag } from '@ds'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SphereCaption } from '../components/SphereCaption'
import { about } from '../content/site'

export function About() {
  return (
    <Section id="about">
      <Reveal>
        <SectionHeading eyebrow="01 — About" title="Profile" />
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
        <TagGroup label="Languages" items={about.languages} />
      </Reveal>

      <Reveal order={3} style={{ marginTop: 'var(--space-8)' }}>
        <TagGroup label="Soft skills" items={about.softSkills} />
      </Reveal>

      <div style={{ marginTop: 'var(--space-10)' }}>
        <SphereCaption scene="about" />
      </div>
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
