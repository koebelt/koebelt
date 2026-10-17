import { AnatomyFigure, type Mount } from '../AnatomyFigure'
import type { FigureProps } from '..'
import { CONTROLLER_SVG } from './art.generated'
import { mountController } from './live'

const mount: Mount = (stage, say) => mountController(stage, (values) => say({ ...values }))
const load = () => Promise.resolve(mount)

export default function DroneController({ fig, copy }: FigureProps) {
  return <AnatomyFigure fig={fig} copy={copy} svg={CONTROLLER_SVG} load={load} />
}
