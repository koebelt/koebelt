import { Diagram, label, type Labels } from './Diagram'

/*
 * koebelt/dash, in three drawings. Every number in them comes from the
 * protocol (koebelt_dash/protocol/PROTOCOL.md): control at 20 Hz as the
 * heartbeat, telemetry at 30 Hz, STOP sent three times, the device's own
 * failsafe after 1.8 s, and stored sequences that run through a lost link.
 */

type Props = { title: string; caption: string; t: Labels }

/** Device, links and app: what goes each way. */
export function Architecture({ title, caption, t }: Props) {
  const L = (k: string) => label(t, k)
  const chips = ['wifi', 'ble', 'usb', 'radio']
  return (
    <Diagram title={title} caption={caption} viewBox="0 0 960 424">
      {({ arrow, arrowAccent }) => (
        <>
          {/* the device */}
          <rect x="1" y="1" width="300" height="300" rx="8" className="dg-box" />
          <text x="24" y="40" className="dg-title">{L('device')}</text>
          <rect x="20" y="62" width="262" height="88" rx="6" className="dg-box" />
          <text x="36" y="92" className="dg-label">{L('codeLabel').toUpperCase()}</text>
          <text x="36" y="122" className="dg-text">{L('code')}</text>
          <rect x="20" y="168" width="262" height="114" rx="6" className="dg-box-accent" />
          <text x="36" y="202" className="dg-title">koebelt/link</text>
          <text x="36" y="232" className="dg-text">Arduino · Python · Rust · ROS 2</text>
          <text x="36" y="258" className="dg-text">{L('libDuty')}</text>

          {/* what goes each way */}
          <text x="480" y="84" textAnchor="middle" className="dg-label">{L('up').toUpperCase()}</text>
          <line x1="304" y1="100" x2="654" y2="100" className="dg-line" markerEnd={arrow} />
          {chips.map((c, i) => (
            <g key={c}>
              <rect x={314 + i * 86} y="140" width="78" height="30" rx="15" className="dg-box" />
              <text x={353 + i * 86} y="160" textAnchor="middle" className="dg-label">{L(c).toUpperCase()}</text>
            </g>
          ))}
          <line x1="656" y1="212" x2="306" y2="212" className="dg-line-accent" markerEnd={arrowAccent} />
          <text x="480" y="240" textAnchor="middle" className="dg-label-accent">{L('down1').toUpperCase()}</text>
          <text x="480" y="260" textAnchor="middle" className="dg-label">{L('down2').toUpperCase()}</text>

          {/* the app */}
          <rect x="659" y="1" width="300" height="300" rx="8" className="dg-box" />
          <text x="683" y="40" className="dg-title">koebelt/dash</text>
          {['live', 'control', 'program', 'tune', 'replay'].map((k, i) => (
            <text key={k} x="683" y={84 + i * 32} className="dg-text">{L(k)}</text>
          ))}
          <text x="683" y="270" className="dg-text">iOS · Android · macOS · Windows · Linux</text>

          {/* boards that connect as they are */}
          <rect x="1" y="342" width="300" height="80" rx="8" className="dg-box-faint" />
          <text x="24" y="374" className="dg-text">ArduPilot · PX4 · Betaflight · Tello</text>
          <text x="24" y="402" className="dg-text">{L('fcNote')}</text>
          <path d="M 302 382 H 720 V 306" className="dg-line" markerEnd={arrow} />
        </>
      )}
    </Diagram>
  )
}

/** The device's first messages, and the screens the app builds from them. */
export function Describe({ title, caption, t }: Props) {
  const L = (k: string) => label(t, k)
  // [indent, text, highlighted part]
  const code: [number, string, string?][] = [
    [0, '{"t":"hello", ', '"kind":"drone",'],
    [1, '', '"sensors":["GPS","IMU","BARO"],'],
    [1, '', '"video":[{"label":"Front"}],'],
    [1, '', '"seq":32}'],
    [0, '{"t":"chan","ch":[{', '"id":"motor_temp",'],
    [1, '"axes":["M1","M2","M3","M4"]}]}'],
    [0, '{"t":"params","p":[', '["MAX_TILT",35,10,60]'],
    [1, ']}'],
  ]
  const tiles: [string, string][] = [
    ['KIND · DRONE', 'kind'],
    ['SENSORS · GPS', 'gps'],
    ['SENSORS · IMU', 'imu'],
    ['SENSORS · BARO', 'baro'],
    ['VIDEO · FRONT', 'video'],
    ['CHAN · MOTOR_TEMP', 'chan'],
    ['PARAMS', 'params'],
    ['SEQ · 32', 'seq'],
  ]
  return (
    <Diagram title={title} caption={caption} viewBox="0 0 960 380">
      {({ arrowAccent }) => (
        <>
          <rect x="1" y="1" width="410" height="378" rx="8" className="dg-box" />
          <text x="24" y="34" className="dg-label">{L('sent').toUpperCase()}</text>
          {code.map(([indent, plain, key], i) => (
            <text key={i} x={24 + indent * 22} y={74 + i * 34} className="dg-code">
              {plain}
              {key ? <tspan className="dg-code-key">{key}</tspan> : null}
            </text>
          ))}

          <text x="480" y="176" textAnchor="middle" className="dg-label-accent">{L('builds').toUpperCase()}</text>
          <line x1="420" y1="192" x2="540" y2="192" className="dg-line-accent" markerEnd={arrowAccent} />

          {tiles.map(([src, k], i) => {
            const x = 550 + (i % 2) * 205,
              y = 1 + Math.floor(i / 2) * 95
            return (
              <g key={k}>
                <rect x={x} y={y} width="204" height="88" rx="6" className="dg-box" />
                <text x={x + 16} y={y + 32} className="dg-label">{src}</text>
                <text x={x + 16} y={y + 62} className="dg-text">{L(k)}</text>
              </g>
            )
          })}
        </>
      )}
    </Diagram>
  )
}

/** The same lost link, while you fly and while a stored sequence runs. */
export function LinkLoss({ title, caption, t }: Props) {
  const L = (k: string) => label(t, k)
  const x = (s: number) => 150 + s * 100
  const ticks = (from: number, to: number) => {
    const out: number[] = []
    for (let s = from; s < to - 1e-9; s += 0.05) out.push(s)
    return out
  }
  const steps: [number, number, string][] = [
    [0, 1.2, 'takeoff'],
    [1.2, 3.6, 'goto'],
    [3.6, 5.6, 'goto'],
    [5.6, 6.4, 'wait'],
    [6.4, 7.8, 'land'],
  ]
  return (
    <Diagram title={title} caption={caption} viewBox="0 0 960 364">
      {() => (
        <>
          {/* the link is gone from 2.5 s to 6 s */}
          <rect x={x(2.5)} y="14" width={x(6) - x(2.5)} height="292" className="dg-band" />
          <text x={(x(2.5) + x(6)) / 2} y="36" textAnchor="middle" className="dg-label">{L('lost').toUpperCase()}</text>

          {/* live control */}
          <text x="0" y="100" className="dg-label">{L('lane1').toUpperCase()}</text>
          <text x={x(0)} y="58" className="dg-label">{L('ctl').toUpperCase()}</text>
          {[...ticks(0, 2.5), ...ticks(6, 8)].map((s) => (
            <line key={s} x1={x(s)} y1="66" x2={x(s)} y2="80" className="dg-tick" />
          ))}
          <rect x={x(0)} y="94" width={x(4.3) - x(0)} height="30" rx="4" className="dg-box" />
          <text x={x(0) + 12} y="114" className="dg-text">{L('pilot')}</text>
          <rect x={x(4.3)} y="94" width={x(6.6) - x(4.3)} height="30" rx="4" className="dg-box-accent" />
          <text x={x(4.3) + 12} y="114" className="dg-text">{L('failsafe')}</text>
          <rect x={x(6.6)} y="94" width={x(8) - x(6.6)} height="30" rx="4" className="dg-box" />
          <text x={x(6.6) + 12} y="114" className="dg-text">{L('again')}</text>
          <line x1={x(4.3)} y1="50" x2={x(4.3)} y2="134" className="dg-line-accent" />
          <text x={x(4.3) + 8} y="152" className="dg-label-accent">{L('after').toUpperCase()}</text>
          <line x1={x(6)} y1="50" x2={x(6)} y2="88" className="dg-line" />
          <text x={x(6) + 8} y="58" className="dg-label">{L('back').toUpperCase()}</text>

          {/* a stored sequence */}
          <text x="0" y="234" className="dg-label">{L('lane2').toUpperCase()}</text>
          {steps.map(([a, b, k], i) => (
            <g key={i}>
              <rect x={x(a) + 1} y="214" width={x(b) - x(a) - 2} height="34" rx="4" className="dg-box" />
              <text x={x(a) + 10} y="236" className="dg-text">{L(k)}</text>
            </g>
          ))}
          <circle cx={x(6)} cy="199" r="4" className="dg-arrow-accent" />
          <line x1={x(6)} y1="203" x2={x(6)} y2="214" className="dg-line-accent" />
          <text x={x(6) + 10} y="204" className="dg-label">{L('resync').toUpperCase()}</text>
          <line x1={x(0)} y1="262" x2={x(7.8)} y2="262" className="dg-line-accent" />
          <text x={x(0)} y="284" className="dg-label-accent">{L('keeps').toUpperCase()}</text>

          {/* time */}
          <line x1={x(0)} y1="320" x2={x(8)} y2="320" className="dg-line" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <g key={s}>
              <line x1={x(s)} y1="316" x2={x(s)} y2="324" className="dg-line" />
              <text x={x(s)} y="344" textAnchor={s === 8 ? 'end' : 'middle'} className="dg-label">{s} S</text>
            </g>
          ))}
        </>
      )}
    </Diagram>
  )
}
