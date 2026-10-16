import type { JSX } from 'react'

import type { Labels } from './Diagram'
import { Architecture, Describe, LinkLoss } from './koebeltDash'

/** Diagram components, keyed "<slug>/<id>" as listed in projectDiagrams (site.ts). */
export const DIAGRAMS: Record<string, (props: { title: string; caption: string; t: Labels }) => JSX.Element> = {
  'koebelt-dash/architecture': Architecture,
  'koebelt-dash/describe': Describe,
  'koebelt-dash/link-loss': LinkLoss,
}
