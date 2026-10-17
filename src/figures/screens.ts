/**
 * Moves an app figure: each device's screens crossfade from one real
 * screenshot to the next, a few seconds apart, the devices out of step so
 * they never change together. A click moves every device on at once.
 */
export function mountScreens(stage: HTMLElement, devices: Record<string, readonly string[]>, say: (values: { state: string }) => void) {
  const svg = stage.querySelector('svg')!
  const still = matchMedia('(prefers-reduced-motion: reduce)')
  const groups = Object.keys(devices).map((id, order) => ({
    id,
    order,
    shots: [...svg.querySelectorAll<SVGGElement>(`[data-device="${id}"] [data-screen]`)],
    at: 0,
  }))
  const first = groups[0]
  let timer = 0
  let tick = 0
  let visible = false

  const show = (g: (typeof groups)[number], next: number) => {
    if (g.shots.length < 2) return
    g.at = next % g.shots.length
    g.shots.forEach((shot, i) => {
      shot.style.transition = still.matches ? '' : 'opacity 0.6s ease'
      shot.style.opacity = i === g.at ? '1' : '0'
    })
  }
  const report = () => say({ state: devices[first.id][first.at] })

  const step = () => {
    tick++
    // One device at a time, in turn.
    const g = groups[tick % groups.length]
    show(g, g.at + 1)
    report()
  }
  const run = () => {
    clearInterval(timer)
    if (visible && !still.matches) timer = window.setInterval(step, 2600)
  }
  const onClick = () => {
    for (const g of groups) show(g, g.at + 1)
    report()
    run()
  }
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== ' ' && event.key !== 'Enter' && event.key !== 'ArrowRight') return
    event.preventDefault()
    onClick()
  }
  stage.addEventListener('click', onClick)
  stage.addEventListener('keydown', onKey)
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting
      run()
    },
    // adherence-ignore: IntersectionObserver rootMargin is not CSS; var() does not resolve here
    { rootMargin: '120px 0px' },
  )
  io.observe(stage)
  report()

  return {
    stop() {
      clearInterval(timer)
      io.disconnect()
      stage.removeEventListener('click', onClick)
      stage.removeEventListener('keydown', onKey)
    },
  }
}
