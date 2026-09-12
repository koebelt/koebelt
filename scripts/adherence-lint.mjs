#!/usr/bin/env node
/**
 * Enforces the KOEBELT design system's adherence rules against src/.
 *
 * The system ships `_adherence.oxlintrc.json`, but it cannot be run as-is:
 * it carries an `x-omelette` key oxlint's parser rejects, and its two most
 * important rules are `no-restricted-syntax` selectors, which oxlint does not
 * implement. So the rules are re-expressed here, reading the patterns and
 * messages straight out of that file so it stays the source of truth.
 *
 * Checks string literals only — the same scope as the original selectors — so
 * numeric props (size={18}) and GLSL floats are correctly left alone.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const CONFIG = join(ROOT, 'design_system/_adherence.oxlintrc.json')

/** Pull the literal-matching selectors out of the design system's own config. */
function loadRules() {
  const config = JSON.parse(readFileSync(CONFIG, 'utf8'))
  const entries = config.rules?.['no-restricted-syntax']
  if (!Array.isArray(entries)) return []

  const rules = []
  for (const entry of entries.slice(1)) {
    const selector = typeof entry === 'string' ? entry : entry.selector
    const message = typeof entry === 'string' ? selector : entry.message
    // Only Literal[value=/.../] selectors are re-implementable here.
    const m = /^Literal\[value=\/(.+)\/\]$/.exec(selector ?? '')
    if (m) rules.push({ re: new RegExp(m[1]), message })
  }
  return rules
}

/**
 * Blank out comments and template-literal bodies before scanning for strings,
 * preserving newlines so reported line numbers match the real file.
 */
const blankLines = (match) => match.replace(/[^\n]/g, ' ')

function strip(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blankLines)
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + ' '.repeat(m.length - p.length))
    .replace(/`(?:\\.|[^`\\])*`/g, blankLines)
}

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* files(path)
    else if (/\.(ts|tsx)$/.test(path)) yield path
  }
}

const rules = loadRules()
if (rules.length === 0) {
  console.error('adherence: no literal rules found in', relative(ROOT, CONFIG))
  process.exit(1)
}

const STRING = /'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g

/**
 * A line may opt out with `adherence-ignore: <reason>` in a comment on that line
 * or the one above it. The reason is mandatory, and every exemption is printed
 * on each run, so these stay visible rather than accumulating silently.
 *
 * The only legitimate use is a value that physically cannot be a custom
 * property: media-query condition strings and IntersectionObserver rootMargin
 * are parsed outside CSS, where var() does not resolve.
 */
const IGNORE = /adherence-ignore:\s*(.+?)\s*$/

let failures = 0
const exemptions = []

for (const file of files(SRC)) {
  const raw = readFileSync(file, 'utf8').split('\n')
  const lines = strip(readFileSync(file, 'utf8')).split('\n')
  lines.forEach((line, i) => {
    for (const literal of line.match(STRING) ?? []) {
      for (const rule of rules) {
        if (!rule.re.test(literal)) continue
        const excused = IGNORE.exec(raw[i] ?? '') ?? IGNORE.exec(raw[i - 1] ?? '')
        if (excused) {
          exemptions.push(`${relative(ROOT, file)}:${i + 1}  ${literal} — ${excused[1]}`)
          continue
        }
        failures += 1
        console.error(`${relative(ROOT, file)}:${i + 1}  ${literal}\n    ${rule.message}`)
      }
    }
  })
}

if (exemptions.length > 0) {
  console.log(`adherence: ${exemptions.length} documented exemption(s)`)
  for (const line of exemptions) console.log(`  ${line}`)
}

console.log(
  failures === 0
    ? `adherence: clean (${rules.length} rules checked against src/)`
    : `adherence: ${failures} violation(s)`,
)
process.exit(failures === 0 ? 0 : 1)
