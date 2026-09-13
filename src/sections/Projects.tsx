import { ProjectCard, SectionHeading } from '@ds'
import { useNavigate } from 'react-router-dom'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { projectImages } from '../content/site'
import { useCopy } from '../i18n/LocaleContext'
import { PROJECT_SLUGS } from '../i18n/types'
import { useSphere } from '../three/SphereContext'

export function Projects() {
  const sphere = useSphere()
  const navigate = useNavigate()
  const { projects } = useCopy()

  return (
    <Section
      id="projects"
      // The four stops need vertical room for the loose ones to spread.
      slotMinHeight="calc(var(--space-15) * 1.3)"
      wide={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(var(--card-min-md), 1fr))',
            gap: 'var(--grid-gap)',
            marginTop: 'var(--space-10)',
          }}
        >
          {PROJECT_SLUGS.map((slug, i) => {
            const project = projects.entries[slug]
            return (
              <Reveal key={slug} order={i}>
                <ProjectCard
                  title={project.title}
                  summary={project.summary}
                  tags={project.tags}
                  image={projectImages[slug]}
                  href={`/work/${slug}`}
                  // Hovering a card spins that project's stop faster.
                  onMouseEnter={() => sphere?.setFocus(i)}
                  onMouseLeave={() => sphere?.setFocus(null)}
                  onClick={(e) => {
                    // Let modified clicks open a new tab the way a real link should.
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                    e.preventDefault()
                    navigate(`/work/${slug}`)
                  }}
                />
              </Reveal>
            )
          })}
        </div>
      }
    >
      <Reveal>
        <SectionHeading
          eyebrow={projects.eyebrow}
          title={projects.title}
          description={projects.description}
        />
      </Reveal>
    </Section>
  )
}
