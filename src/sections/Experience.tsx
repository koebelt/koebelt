import { Divider, SectionHeading, WorkRow } from '@ds'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SphereCaption } from '../components/SphereCaption'
import { degrees } from '../content/education'
import { roles } from '../content/experience'
import { useSphere } from '../three/SphereContext'

export function Experience() {
  return (
    <Section
      id="experience"
      // The timeline column is tall; give it a slot with room to stand up in.
      slotMinHeight="calc(var(--space-15) * 1.15)"
      wide={<Roles />}
    >
      <Reveal>
        <SectionHeading
          eyebrow="04 — Experience"
          title="Experience"
          description="Five roles since 2021. The sphere stands them up as a column."
        />
      </Reveal>

      <div style={{ marginTop: 'var(--space-9)' }}>
        <SphereCaption scene="experience" />
      </div>
    </Section>
  )
}

function Roles() {
  const sphere = useSphere()

  return (
    <>
      <div style={{ marginTop: 'var(--space-10)' }}>
        {roles.map((role, i) => (
          <Reveal key={role.index} order={i}>
            <WorkRow
              index={role.index}
              title={role.org}
              discipline={role.discipline}
              year={role.year}
              // WorkRow is always an anchor with no non-link mode. Roles with no
              // public URL anchor back to this section rather than navigating.
              href={role.href ?? '#experience'}
              target={role.href ? '_blank' : undefined}
              rel={role.href ? 'noreferrer' : undefined}
              onMouseEnter={() => sphere?.setFocus(i)}
              onMouseLeave={() => sphere?.setFocus(null)}
              onClick={(e) => {
                if (!role.href) e.preventDefault()
              }}
            />
          </Reveal>
        ))}
      </div>

      <Divider label="Education" style={{ margin: 'var(--space-10) 0 var(--space-3)' }} />

      <div>
        {degrees.map((degree, i) => (
          <Reveal key={degree.index} order={i}>
            <WorkRow
              index={degree.index}
              title={degree.org}
              discipline={degree.discipline}
              year={degree.year}
              href="#experience"
              onClick={(e) => e.preventDefault()}
            />
          </Reveal>
        ))}
      </div>

    </>
  )
}
