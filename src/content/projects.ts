export type ProjectSlug = 'quadcopter' | 'cbienla' | 'robotic-arm' | 'marketplace'

export interface Project {
  slug: ProjectSlug
  title: string
  year?: string
  /** One sentence. Feeds ProjectCard; never two. */
  summary: string
  tags: string[]
  role: string
  stack: string[]
  problem: string
  /** Bullet facts. Numbers over adjectives. */
  constraints: string[]
  decisions: { title: string; body: string }[]
  retrospective: string
  links?: { label: string; href: string }[]
}

/**
 * Four projects, given depth instead of count.
 *
 * TODO(thomas): the `problem`, `constraints`, `decisions` and `retrospective`
 * fields are drafted from the summaries and need your real numbers — component
 * names, loop rates, user counts, dates. Everything above them is verbatim from
 * the design prototype and is already accurate.
 */
export const projects: Project[] = [
  {
    slug: 'quadcopter',
    title: 'Stabilized quadcopter',
    summary:
      'Creation from A to Z of a stabilized quadcopter — selection of parts, PCB design, assembly, and internal guidance system.',
    tags: ['Personal project', 'Embedded systems', 'PCB design'],
    role: 'Sole designer and engineer',
    stack: ['C', 'C++', 'KiCad', 'STM32', 'IMU sensor fusion'],
    problem:
      'A quadcopter is unstable by construction: it has four actuators, six degrees of freedom, and no passive tendency to stay level. Keeping it in the air means closing a control loop faster than the airframe can fall out of one.',
    constraints: [
      'Every part selected and sourced individually, no kit',
      'Custom PCB, designed and populated by hand',
      'Attitude loop must run fast enough to correct before divergence',
      'Total mass budget fixed by the motors and props chosen first',
    ],
    decisions: [
      {
        title: 'Build the board rather than buy a flight controller',
        body: 'An off-the-shelf controller would have flown sooner, but the point was to understand the whole stack — power, sensing, actuation and the loop between them. Designing the PCB forced every one of those decisions to be explicit.',
      },
      {
        title: 'Sensor fusion over a single sensor',
        body: 'The accelerometer is trustworthy over long spans and noisy over short ones; the gyroscope is the reverse. Fusing them gives an attitude estimate that is neither jittery nor drifting, which is what the control loop actually needs.',
      },
      {
        title: 'Tune the inner loop before adding anything outer',
        body: 'Attitude hold had to be solid on its own before position or navigation could mean anything. Each outer loop was only added once the one beneath it stopped fighting back.',
      },
    ],
    retrospective:
      'I would instrument the loop from the first day instead of the first crash — logging attitude estimate and motor output to look at afterwards turned tuning from guesswork into reading a graph, and I only started doing it late.',
  },
  {
    slug: 'cbienla',
    title: 'Cbienlà.fr',
    year: '2025—',
    summary: 'Real-estate listing platform, Flutter app and Nuxt.js site on Firebase.',
    tags: ['Entrepreneurial', 'Flutter', 'Firebase'],
    role: 'Co-founder and software engineer',
    stack: ['Flutter', 'Dart', 'Nuxt.js', 'Vue', 'Firebase', 'Cloud Functions'],
    problem:
      'A listing platform needs two front ends that never disagree: a mobile app people browse on, and a public web surface search engines can read. Both describe the same properties, so the hard part is one source of truth rather than two codebases drifting.',
    constraints: [
      'Two co-founders, so build cost had to stay near zero at launch',
      'Listings must be indexable — a client-only app would be invisible to search',
      'Same data model serving app and site',
    ],
    decisions: [
      {
        title: 'Firebase as the backend rather than a server we run',
        body: 'At this stage the scarce resource is our time, not compute. Managed auth, storage and functions removed an entire category of work — and the cost curve only becomes a problem at a volume that would be a good problem to have.',
      },
      {
        title: 'Nuxt for the public site, Flutter for the app',
        body: 'The two surfaces have genuinely different jobs. Nuxt server-renders listings so they can be indexed and shared; Flutter gives one mobile codebase for both platforms. Splitting by job beat forcing one technology across both.',
      },
    ],
    retrospective:
      'The data model was shaped around the first screen we built rather than the queries we would need, and reshaping it later cost more than designing it up front would have.',
  },
  {
    slug: 'robotic-arm',
    title: 'Robotic arm',
    summary: 'Motorized robotic arm controlled from a mobile app.',
    tags: ['Personal project', 'Robotics'],
    role: 'Sole designer and engineer',
    stack: ['C++', 'Microcontroller firmware', 'Bluetooth', 'Mobile client'],
    problem:
      'Driving a multi-joint arm from a phone means a command leaves a touchscreen and has to arrive as coordinated motion across several motors — over a link that is neither fast nor reliable enough to be trusted with the details.',
    constraints: [
      'Wireless link with variable latency and real dropouts',
      'Several joints that must move together to be useful',
      'Arm must fail safe when the connection goes away',
    ],
    decisions: [
      {
        title: 'Send intent, not motor positions',
        body: 'The phone sends where the arm should go; the firmware decides how to get there. That keeps motion smooth when packets are late and means a dropped message delays a movement rather than corrupting one.',
      },
      {
        title: 'Hold position on link loss',
        body: 'The safe state for an arm holding something is not to release it. Losing the connection stops new commands rather than stopping the arm.',
      },
    ],
    retrospective:
      'I put the inverse kinematics in the app before moving it into the firmware. On the device it belonged in from the start — the app should only ever have described the destination.',
  },
  {
    slug: 'marketplace',
    title: 'Real-estate marketplace app',
    summary: 'Early solo marketplace app for property listings.',
    tags: ['Personal project', 'Web', 'Mobile'],
    role: 'Sole developer',
    stack: ['JavaScript', 'React', 'React Native'],
    problem:
      'A marketplace only works once both sides show up, so the build has to serve listing and browsing at once — and this was the project where I learned how much of that is product shape rather than code.',
    constraints: ['Solo build', 'Web and mobile from one skill set', 'No existing users on either side'],
    decisions: [
      {
        title: 'Share what React and React Native genuinely share',
        body: 'Data fetching and domain logic moved into shared modules; the views stayed separate. Trying to share components across the two would have cost more than writing each one twice.',
      },
    ],
    retrospective:
      'I built features before I understood the marketplace problem underneath them. It is the direct reason Cbienlà started with the listing model instead of the screens — this project is where that lesson came from.',
  },
]

export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)
