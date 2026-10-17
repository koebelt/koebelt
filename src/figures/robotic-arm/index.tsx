import { AnatomyFigure, type Mount } from '../AnatomyFigure'
import type { FigureProps } from '..'
import { ARM_SVG } from './art.generated'
import { mountArm } from './live'

const mount: Mount = (stage, say) => mountArm(stage, (values) => say({ ...values }))
const load = () => Promise.resolve(mount)

export default function RoboticArm({ fig, copy }: FigureProps) {
  return <AnatomyFigure fig={fig} copy={copy} svg={ARM_SVG} load={load} />
}
