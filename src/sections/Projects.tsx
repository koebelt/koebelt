import { ProjectCard, SectionHeading } from '@ds'
import { useNavigate } from 'react-router-dom'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SphereCaption } from '../components/SphereCaption'
import { projects } from '../content/projects'
import { useSphere } from '../three/SphereContext'

export function Projects() {
  const sphere = useSphere()
  const navigate = useNavigate()

  return (
    <Section
      id="projects"
      // Four knots in a row need vertical room to read as objects.
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
          {projects.map((project, i) => (
            <Reveal key={project.slug} order={i}>
              <ProjectCard
                title={project.title}
                year={project.year}
                summary={project.summary}
                tags={project.tags}
                href={`/work/${project.slug}`}
                // Hovering a card tightens that project's knot in the sphere.
                onMouseEnter={() => sphere?.setFocus(i)}
                onMouseLeave={() => sphere?.setFocus(null)}
                onClick={(e) => {
                  // Let modified clicks open a new tab the way a real link should.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                  e.preventDefault()
                  navigate(`/work/${project.slug}`)
                }}
              />
            </Reveal>
          ))}
        </div>
      }
    >
      <Reveal>
        <SectionHeading
          eyebrow="03 — Selected work"
          title="Projects"
          description="Four builds, each written up in full. Personal projects, plus one company I co-founded."
        />
      </Reveal>

      <div style={{ marginTop: 'var(--space-9)' }}>
        <SphereCaption scene="projects" />
      </div>
    </Section>
  )
}
