import { Marquee } from '@ds'

import { useCopy } from '../i18n/LocaleContext'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Education } from '../sections/Education'
import { Experience } from '../sections/Experience'
import { Hero } from '../sections/Hero'
import { Projects } from '../sections/Projects'
import { Skills } from '../sections/Skills'

export default function Home() {
  const { skills } = useCopy()
  const marqueeItems = skills.groups.flatMap((g) => g.items)

  return (
    <>
      <Hero />
      {/* The design system's one sanctioned continuous animation. */}
      <Marquee items={marqueeItems} speed={44} />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </>
  )
}
