import type { Copy } from './types'

export const en: Copy = {
  localeName: 'English',

  nav: {
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Experience',
    education: 'Education',
    contact: 'Contact',
  },

  hero: {
    badge: 'Open to new opportunities',
    name: 'Thomas Koebel',
    statement: 'Software engineer building systems and products.',
    lede: "Backend, web, mobile and embedded. Master's in software engineering from EPITECH Strasbourg, based in Niort, France. I co-founded Cbienlà and build my own hardware when the problem calls for it.",
    cta: 'View work',
    scroll: 'Scroll',
  },

  about: {
    eyebrow: '01 — About',
    title: 'Profile',
    body: "I'm Thomas Koebel, a software engineer working across backend, web, mobile, and cloud systems. My work spans architecture, development, and technical leadership, with a focus on building reliable software and keeping complexity under control. I value clear design, pragmatic decisions, and understanding the problem before choosing the solution.",
    languagesLabel: 'Languages',
    softSkillsLabel: 'Soft skills',
    languages: ['French — native', 'English — TOEIC 860', 'German — A2'],
    softSkills: [
      'Communication',
      'Creativity',
      'Problem solving',
      'Adaptability',
      'Technical leadership',
      'Teaching',
      'Autonomy',
      'Teamwork',
      'Curiosity',
      'Pragmatism',
      'Attention to detail',
    ],
  },

  skills: {
    eyebrow: '02 — Skills',
    title: 'Technical skills',
    description: 'Four disciplines, four shells. Select any skill to see why I claim it.',
    levelLabel: 'How much I use it',
    close: 'Close',
    groupLabels: {
      languages: 'Languages',
      web: 'Web',
      mobile: 'Mobile',
      cloud: 'Cloud & infra',
    },
    levels: {
      c: "Since EPITECH",
      ts: "Daily, since EPITECH",
      python: "Production, at Nagarro and ALE",
      dart: "Daily, since Facix",
      haskell: 'Academic',
      rust: 'Working knowledge',
      java: "Since HFT Stuttgart",
      node: "Daily, since EPITECH",
      react: "Daily, since Facix",
      vue: 'Production',
      nuxt: 'Production',
      angular: "Since ALE",
      spring: "Since HFT Stuttgart",
      'react-native': "Since Facix",
      flutter: "Daily, since Facix",
      aws: "Since Facix",
      gcp: 'Production',
      firebase: 'Daily',
      docker: 'Production',
      linux: 'Daily driver',
    },
    why: {
      c: "The core languages of the EPITECH cursus, where I learned them, and then the ones every piece of hardware I have built runs on — the quadcopter firmware, its remote controller and the robotic arm are all C and C++ on bare metal. Writing the attitude loop meant caring about how long each iteration takes, so this is where I learned to read what the compiler actually produces rather than trusting it.",
      ts: "The backbone of every web project I have built, from the EPITECH cursus through to today. This portfolio is TypeScript, WebGL engine included, where the types carry real weight — shader uniforms and buffer layouts are exactly the kind of thing a compiler should be checking.",
      python: "Deployed to production at Nagarro and at ALE Enterprise, so this is not just my scripting language — I have had Python running as part of a real system, with the operational questions that come with it. It remains what I reach for when something has to exist by the end of the afternoon.",
      dart: "Came with the mobile work at Facix and is now the language of the Cbienlà app, written and maintained daily since 2025. Sound null safety and the isolate model are the parts I have had to think hardest about.",
      haskell: 'Studied at EPITECH rather than shipped. I keep it on the list because what it taught me about types, totality and pure functions shows up in the TypeScript I write every day, not because I would claim to be a Haskell engineer.',
      rust: 'Personal projects and reading rather than production. The ownership model changed how I think about lifetimes in C++, which is honestly most of the value I have got from it so far.',
      java: "Learned during my Erasmus exchange at HFT Stuttgart and used since. Comfortable reading and extending a Java codebase; I would want a ramp-up before designing one from scratch.",
      node: "With JavaScript and TypeScript, the core of all the web work I have done since EPITECH: backends, tooling and Cloud Functions. Most of what I have learned here is about the event loop — what blocks it, and what that does to latency under load.",
      react: "My main front-end framework since Facix, and what I have built the most in since. This site is React, and the sphere is deliberately kept outside it: the engine owns its own loop and never triggers a render, because 60fps and reconciliation do not mix.",
      vue: 'The reactive model behind the Nuxt site for Cbienlà. Picking it up after React was mostly a matter of learning where the framework does the work for you instead of asking you to.',
      nuxt: 'Serves the public side of Cbienlà. Chosen specifically for server rendering — property listings that search engines cannot read are listings nobody finds.',
      angular: "My first professional front-end framework, at ALE Enterprise. Dependency injection and RxJS were the adjustment; it is the one on this list I would most want a refresher on.",
      spring: "Also from HFT Stuttgart, where I built JVM services with it. Solid on the basics — controllers, dependency injection, persistence — but I have not run one in production long enough to have opinions on tuning it.",
      'react-native': "Where my mobile work started, at Facix. It is why I understand what a cross-platform framework actually costs you at the native boundary, which is the thing that decides whether the choice was right.",
      flutter: "Mobile work from Facix onwards, and now the Cbienlà app. I have built and shipped screens, state and platform integrations, and dealt with the awkward parts — deep links, background state, and the store review cycle.",
      aws: "Picked up at Facix and used since. Comfortable deploying onto it and reasoning about a bill; I have not designed an account structure for a team.",
      gcp: 'Where Cbienlà runs, through Firebase. Comfortable with the console, service accounts and quota behaviour, which I mostly learned by hitting them.',
      firebase: 'Auth, Firestore, Storage and Cloud Functions in production for Cbienlà. I know its shape well enough to know what it is bad at — querying across collections, and costs that scale with reads rather than data.',
      docker: 'How I ship and how I keep environments honest. Comfortable writing multi-stage builds and composing services; I have not operated an orchestrator at scale.',
      linux: 'Arch on my own machine, Debian on servers. Daily driving Arch is the reason I am comfortable with systemd, the boot path and the filesystem — you end up learning them whether you meant to or not.',
    },
  },

  projects: {
    eyebrow: '03 — Selected work',
    title: 'Projects',
    description: 'Four builds, each written up in full. Personal projects, plus one company I co-founded.',
    back: 'All projects',
    roleLabel: 'Role',
    stackLabel: 'Stack',
    problemLabel: 'The problem',
    constraintsLabel: 'Constraints',
    decisionsLabel: 'Decisions',
    retrospectiveLabel: "What I'd change",
    entries: {
      quadcopter: {
        title: 'Stabilized quadcopter',
        summary:
          'Creation from A to Z of a stabilized quadcopter — selection of parts, PCB design, assembly, and internal guidance system.',
        tags: ['Personal project', 'Embedded systems', 'PCB design'],
        role: 'Sole designer and engineer',
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

      'drone-controller': {
        title: 'Drone remote controller',
        summary:
          'A radio controller for the quadcopter, designed and 3D printed from scratch — enclosure, gimbals, electronics and firmware.',
        tags: ['Personal project', 'Industrial design', '3D printing', 'Embedded systems'],
        role: 'Sole designer and engineer',
        problem:
          'The quadcopter needed something to fly it with. A controller is held for the whole flight, so the hard part is not the radio link — it is that the shape, the stick feel and the layout decide whether the aircraft is actually controllable.',
        constraints: [
          'Enclosure modelled in CAD and printed on an FDM printer',
          'Print volume and layer adhesion set the maximum part size and where seams could fall',
          'Must run on battery for a full flying session',
          'Stick input has to reach the aircraft with latency low enough not to be felt',
        ],
        decisions: [
          {
            title: 'Design around the hands first, then fit the electronics',
            body: 'The grip angle and stick spacing were modelled and printed before the board layout was fixed, so the internals had to fit the shape rather than the shape growing around a PCB. Holding a printed shell is the only way to find out that it is wrong.',
          },
          {
            title: 'Print in parts with captive fasteners',
            body: 'A single-piece shell would have needed supports across the grip and left a poor surface exactly where it is held. Splitting the enclosure put the seams where the hands are not, and made every internal part serviceable without cutting anything.',
          },
          {
            title: 'Send stick positions at a fixed rate, not on change',
            body: 'A steady stream of small packets makes a dropped one a single missed update rather than a lost command, and it gives the aircraft a clear signal to detect when the link is gone.',
          },
        ],
        retrospective:
          'I iterated the enclosure far more times than the electronics, and each iteration cost hours of print time. Printing just the grip section as a test part first would have got me to the right shape for a fraction of the filament.',
      },

      cbienla: {
        title: 'Cbienlà.fr',
        summary: 'Real-estate listing platform, Flutter app and Nuxt.js site on Firebase.',
        tags: ['Entrepreneurial', 'Flutter', 'Firebase', 'Nuxt.js'],
        role: 'Co-founder and software engineer',
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
          {
            title: 'Build on what an earlier attempt taught me',
            body: 'I had built a property marketplace solo before this one and shipped features before understanding the marketplace problem underneath them. Cbienlà started from the listing model instead of the screens, which is the direct result of that.',
          },
        ],
        retrospective:
          'The data model was still shaped around the first screen we built rather than the queries we would need, and reshaping it later cost more than designing it up front would have.',
      },

      'robotic-arm': {
        title: 'Robotic arm',
        summary: 'Motorized robotic arm controlled from a mobile app.',
        tags: ['Personal project', 'Robotics'],
        role: 'Sole designer and engineer',
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
    },
  },

  experience: {
    eyebrow: '04 — Experience',
    title: 'Experience',
    description: 'Five roles since 2021. The sphere stands them up as a column.',
    roles: {
      cbienla: 'Co-founder & software engineer',
      nagarro: 'Software engineering consultant',
      facix: 'Mobile team lead',
      epitech: 'Teaching assistant, web development',
      ale: 'QA engineer, intern',
    },
  },

  education: {
    eyebrow: '05 — Education',
    title: 'Education',
    description: 'Five years of software engineering, one of them abroad.',
    degrees: {
      epitech: 'Master, software engineering',
      hft: 'Software technology, Erasmus exchange',
    },
  },

  contact: {
    eyebrow: '06 — Contact',
    title: 'Get in touch',
    description: 'Open to full-time roles in backend, web, mobile or embedded engineering.',
    downloadCv: 'Download CV',
  },

  captions: {
    hero: [
      'Working across backend, web, mobile and cloud systems.',
      'Based in Niort, France.',
      "Master's in software engineering from EPITECH Strasbourg.",
    ],
    about: ['One point on this Earth is Niort, where I work.'],
    skills: ['Four shells, one per discipline I work in.'],
    projects: ['Each cluster is one project you can open.'],
    experience: ['The column beats once for every role.'],
    education: ['Two layers, five years, one exchange.'],
    contact: ['The sphere reforms — same shape, six sections later.'],
  },

  footerNote: 'Portfolio built as a live demonstration of the KOEBELT design system.',

  notFound: {
    eyebrow: '404',
    title: 'That page does not exist.',
    back: 'Back to the portfolio',
  },
}
