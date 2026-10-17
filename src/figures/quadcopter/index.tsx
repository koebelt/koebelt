import { AnatomyFigure, type Mount } from '../AnatomyFigure'
import type { FigureProps } from '..'
import { QUAD_SVG } from './art.generated'
import { mountQuadcopter } from './live'

const mount: Mount = (stage, say) =>
  mountQuadcopter(stage, (roll, pitch, motors) => say({ roll, pitch, motors }))
const load = () => Promise.resolve(mount)

export default function Quadcopter({ fig, copy }: FigureProps) {
  return <AnatomyFigure fig={fig} copy={copy} svg={QUAD_SVG} load={load} />
}
