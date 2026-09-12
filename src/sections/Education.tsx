import { SectionHeading, WorkRow } from '@ds'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SphereCaption } from '../components/SphereCaption'
import { degrees } from '../content/site'
import { useCopy } from '../i18n/LocaleContext'
import { useSphere } from '../three/SphereContext'

/** Its own section rather than a footnote under Experience, which read as one list. */
export function Education() {
  const { education } = useCopy()

  return (
    <Section id="education" wide={<Degrees />}>
      <Reveal>
        <SectionHeading
          eyebrow={education.eyebrow}
          title={education.title}
          description={education.description}
        />
      </Reveal>

      <div style={{ marginTop: 'var(--space-9)' }}>
        <SphereCaption scene="education" />
      </div>
    </Section>
  )
}

function Degrees() {
  const sphere = useSphere()
  const { education } = useCopy()

  return (
    <div style={{ marginTop: 'var(--space-10)' }}>
      {degrees.map((degree, i) => (
        <Reveal key={degree.id} order={i}>
          <WorkRow
            className="work-row"
            index={degree.index}
            title={degree.org}
            discipline={education.degrees[degree.id]}
            year={degree.year}
            href="#education"
            onMouseEnter={() => sphere?.setFocus(i)}
            onMouseLeave={() => sphere?.setFocus(null)}
            onClick={(e) => e.preventDefault()}
          />
        </Reveal>
      ))}
    </div>
  )
}
