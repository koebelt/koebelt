import { useEffect, useState } from 'react'

import { useSphere } from '../three/SphereContext'
import type { EngineStats } from '../three/types'

/**
 * Visible only with ?debug=1.
 *
 * The number that matters is `calls`: the whole sphere is meant to be one draw
 * call, and this is where that claim is checked rather than assumed.
 */
export function DevHud() {
  const sphere = useSphere()
  const [stats, setStats] = useState<EngineStats | null>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(new URLSearchParams(window.location.search).get('debug') === '1')
  }, [])

  useEffect(() => {
    if (!on || !sphere) return
    const id = setInterval(() => setStats(sphere.getStats()), 250)
    return () => clearInterval(id)
  }, [on, sphere])

  if (!on) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: 'var(--space-5)',
        bottom: 'var(--space-5)',
        zIndex: 50,
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gap: 'var(--space-2) var(--space-5)',
        padding: 'var(--space-5)',
        background: 'var(--surface-sunken)',
        border: 'var(--border-width) solid var(--border-hairline)',
        borderRadius: 'var(--radius-card)',
        font: 'var(--text-label-sm)',
        letterSpacing: 'var(--tr-label)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}
    >
      {stats ? (
        <>
          <span>Scene</span>
          <span style={{ color: 'var(--text-primary)' }}>{stats.scene}</span>
          <span>Points</span>
          <span style={{ color: 'var(--text-primary)' }}>{stats.points.toLocaleString()}</span>
          <span>FPS</span>
          <span style={{ color: 'var(--text-primary)' }}>{stats.fps}</span>
          <span>Draw calls</span>
          <span style={{ color: stats.calls === 1 ? 'var(--accent)' : 'var(--signal-negative)' }}>
            {stats.calls}
          </span>
        </>
      ) : (
        <span>No sphere</span>
      )}
    </div>
  )
}
