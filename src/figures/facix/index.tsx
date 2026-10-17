import { AnatomyFigure, type Mount } from '../AnatomyFigure'
import type { FigureProps } from '..'
import { mountScreens } from '../screens'
import { FACIX_DATA, FACIX_SVG } from './art.generated'

const mount: Mount = (stage, say) => mountScreens(stage, FACIX_DATA.devices, say)
const load = () => Promise.resolve(mount)

export default function Facix({ fig, copy }: FigureProps) {
  return <AnatomyFigure fig={fig} copy={copy} svg={FACIX_SVG} load={load} />
}
