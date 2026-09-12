import { Marquee } from '@ds'

import { marqueeItems } from '../content/skills'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Experience } from '../sections/Experience'
import { Hero } from '../sections/Hero'
import { Projects } from '../sections/Projects'
import { Skills } from '../sections/Skills'

export default function Home() {
  return (
    <>
      <Hero />
      {/* The design system's one sanctioned continuous animation. */}
      <Marquee items={marqueeItems} speed={44} />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </>
  )
}
