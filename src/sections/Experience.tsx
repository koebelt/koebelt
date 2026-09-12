import { SectionHeading, WorkRow } from '@ds'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SphereCaption } from '../components/SphereCaption'
import { roles } from '../content/site'
import { useCopy } from '../i18n/LocaleContext'
import { useSphere } from '../three/SphereContext'

export function Experience() {
  const { experience } = useCopy()

  return (
    <Section id="experience" wide={<Roles />}>
      <Reveal>
        <SectionHeading
          eyebrow={experience.eyebrow}
          title={experience.title}
          description={experience.description}
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
  const { experience } = useCopy()

  return (
    <div style={{ marginTop: 'var(--space-10)' }}>
      {roles.map((role, i) => (
        <Reveal key={role.id} order={i}>
          <WorkRow
            className="work-row"
            index={role.index}
            title={role.org}
            discipline={experience.roles[role.id]}
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
  )
}
