import { AnatomyFigure, type Mount } from '../AnatomyFigure'
import type { FigureProps } from '..'
import { mountScreens } from '../screens'
import { CBIENLA_DATA, CBIENLA_SVG } from './art.generated'

const mount: Mount = (stage, say) => mountScreens(stage, CBIENLA_DATA.devices, say)
const load = () => Promise.resolve(mount)

export default function Cbienla({ fig, copy }: FigureProps) {
  return <AnatomyFigure fig={fig} copy={copy} svg={CBIENLA_SVG} load={load} />
}
