import { AnatomyFigure, type Mount } from '../AnatomyFigure'
import type { FigureProps } from '..'
import { mountScreens } from '../screens'
import { PORTFOLIO_DATA, PORTFOLIO_SVG } from './art.generated'

const mount: Mount = (stage, say) => mountScreens(stage, PORTFOLIO_DATA.devices, say)
const load = () => Promise.resolve(mount)

export default function Portfolio({ fig, copy }: FigureProps) {
  return <AnatomyFigure fig={fig} copy={copy} svg={PORTFOLIO_SVG} load={load} />
}
