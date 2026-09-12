import { Card, Dialog, Divider, SectionHeading, Tag } from '@ds'
import { useEffect, useState } from 'react'

import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SphereCaption } from '../components/SphereCaption'
import { skillGroups, type SkillEntry } from '../content/site'
import { useCopy } from '../i18n/LocaleContext'
import { useSphere } from '../three/SphereContext'

export function Skills() {
  const sphere = useSphere()
  const { skills } = useCopy()
  const [open, setOpen] = useState<SkillEntry | null>(null)

  // The design system's Dialog traps neither focus nor Escape; at minimum it
  // should close the way every other dialog on the web does.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

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
            <Reveal key={group.id} order={i}>
              {/* Each card is one orbital shell in the sphere; hovering focuses it. */}
              <Card
                onMouseEnter={() => sphere?.setFocus(i)}
                onMouseLeave={() => sphere?.setFocus(null)}
                style={{ height: '100%' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <Divider label={skills.groupLabels[group.id]} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                    {group.items.map((skill) => (
                      <SkillButton key={skill.id} skill={skill} onOpen={() => setOpen(skill)} />
                    ))}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      }
    >
      <Reveal>
        <SectionHeading
          eyebrow={skills.eyebrow}
          title={skills.title}
          description={skills.description}
        />
      </Reveal>

      <div style={{ marginTop: 'var(--space-9)' }}>
        <SphereCaption scene="skills" />
      </div>

      <Dialog open={open !== null} title={open?.name} onClose={() => setOpen(null)} width={560}>
        {open ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span
                style={{
                  font: 'var(--text-label-sm)',
                  letterSpacing: 'var(--tr-label)',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                }}
              >
                {skills.levelLabel}
              </span>
              <span
                style={{
                  font: 'var(--text-label-md)',
                  letterSpacing: 'var(--tr-label)',
                  textTransform: 'uppercase',
                  color: 'var(--text-accent)',
                }}
              >
                {skills.levels[open.id]}
              </span>
            </div>
            <p
              style={{
                font: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
                maxWidth: 'var(--measure-prose)',
                margin: 0,
              }}
            >
              {skills.why[open.id]}
            </p>
          </div>
        ) : null}
      </Dialog>
    </Section>
  )
}

/**
 * The design system says a Tag is never interactive, so the affordance is added
 * around it rather than to it: a bare button carries the semantics, the focus
 * ring and the keyboard behaviour, and the Tag inside stays exactly as designed.
 */
function SkillButton({ skill, onOpen }: { skill: SkillEntry; onOpen: () => void }) {
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        background: 'none',
        border: 0,
        padding: 0,
        cursor: 'pointer',
        borderRadius: 'var(--radius-pill)',
      }}
    >
      <Tag
        tone={hover ? 'accent' : 'neutral'}
        style={{ pointerEvents: 'none', transition: 'var(--transition-control)' }}
      >
        {skill.name}
      </Tag>
    </button>
  )
}
