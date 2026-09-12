import { Card, SectionHeading } from '@ds'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SphereCaption } from '../components/SphereCaption'
import { skillGroups } from '../content/skills'
import { useSphere } from '../three/SphereContext'
import { TagGroup } from './About'

export function Skills() {
  const sphere = useSphere()

  return (
    <Section
      id="skills"
      wide={
        // Four cards, not Tabs: tabs would hide three quarters of this at all times.
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(var(--card-min-sm), 1fr))',
            gap: 'var(--grid-gap)',
            marginTop: 'var(--space-10)',
          }}
        >
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} order={i}>
              {/* Each card is one orbital shell in the sphere; hovering focuses it. */}
              <Card
                onMouseEnter={() => sphere?.setFocus(i)}
                onMouseLeave={() => sphere?.setFocus(null)}
                style={{ height: '100%' }}
              >
                <TagGroup label={group.label} items={group.items} />
              </Card>
            </Reveal>
          ))}
        </div>
      }
    >
      <Reveal>
        <SectionHeading
          eyebrow="02 — Skills"
          title="Technical skills"
          description="Four disciplines, four shells. Hover a card to pick one out."
        />
      </Reveal>

      <div style={{ marginTop: 'var(--space-9)' }}>
        <SphereCaption scene="skills" />
      </div>
    </Section>
  )
}
