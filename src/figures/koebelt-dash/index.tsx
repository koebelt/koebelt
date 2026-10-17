import { AnatomyFigure, type Mount } from '../AnatomyFigure'
import type { FigureProps } from '..'
import { mountScreens } from '../screens'
import { DASH_DATA, DASH_SVG } from './art.generated'

const mount: Mount = (stage, say) => mountScreens(stage, DASH_DATA.devices, say)
const load = () => Promise.resolve(mount)

export default function KoebeltDash({ fig, copy }: FigureProps) {
  return <AnatomyFigure fig={fig} copy={copy} svg={DASH_SVG} load={load} />
}
