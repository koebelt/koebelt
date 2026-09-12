export interface SkillGroup {
  label: string
  items: string[]
}

/** Four groups — one per orbital shell in the `skills` sphere scene. */
export const skillGroups: SkillGroup[] = [
  { label: 'Languages', items: ['C / C++', 'JavaScript / TypeScript', 'Python', 'Haskell', 'Rust', 'Java'] },
  { label: 'Web', items: ['NodeJS', 'ReactJS', 'VueJS', 'NuxtJS', 'AngularJS'] },
  { label: 'Mobile', items: ['React Native', 'Flutter', 'Dart'] },
  { label: 'Cloud & infra', items: ['AWS', 'GCP', 'Firebase', 'Docker', 'Linux (Arch, Debian)'] },
]

/** Flat list for the Marquee band. */
export const marqueeItems: string[] = skillGroups.flatMap((g) => g.items)
