export interface Role {
  index: string
  org: string
  discipline: string
  year: string
  href?: string
}

/** Five roles — one gaussian bulge each in the `experience` sphere scene. */
export const roles: Role[] = [
  { index: '01', org: 'Cbienlà.fr', discipline: 'Co-founder & software engineer', year: '2025—', href: 'https://cbienla.fr' },
  { index: '02', org: 'Nagarro', discipline: 'Software engineering consultant', year: '2024—25' },
  { index: '03', org: 'Facix', discipline: 'Mobile team lead', year: '2023—25' },
  { index: '04', org: 'EPITECH Strasbourg', discipline: 'Teaching assistant, web development', year: '2023' },
  { index: '05', org: 'ALE Enterprise', discipline: 'QA engineer, intern', year: '2021—22' },
]
