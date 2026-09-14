import type { Copy } from './types'

export const en: Copy = {
  localeName: 'English',
  documentTitle: 'Thomas Koebel | Software engineer',

  nav: {
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Experience',
    education: 'Education',
    contact: 'Contact',
  },

  hero: {
    badge: "Open to new roles",
    name: 'Thomas Koebel',
    statement: 'Software engineer',
    lede: "Full-stack engineer for web and mobile, from the interface to the services behind it. Master's in software engineering from EPITECH Strasbourg, based in Niort, France. I co-founded Facix and then Cbienlà, and build my own hardware on the side.",
    cta: 'View work',
    scroll: 'Scroll',
  },

  about: {
    eyebrow: '01 / About',
    title: 'Profile',
    body: "I'm a full-stack engineer focused on web and mobile: Flutter apps, React and Nuxt front ends, and the Node.js, Firebase or AWS services behind them. I have co-founded two products, delivered client systems as a consultant at Nagarro and mentored first-year students at EPITECH, so I have seen software from the seat of the person designing it, the person building it and the person reviewing it. Outside work I build hardware, from a flight controller to a robotic arm, which is where my attention to what runs underneath comes from. What I value most is understanding the problem before picking the tool, and keeping systems simple enough that whoever comes next can still change them.",
    languagesLabel: 'Languages',
    softSkillsLabel: 'Soft skills',
    languages: ['French (native)', 'English (TOEIC 860)', 'German (A2)'],
    softSkills: [
      'Technical leadership',
      'Mentoring',
      'Autonomy',
      'Pragmatism',
      'Client-facing communication',
    ],
  },

  skills: {
    eyebrow: '02 / Skills',
    title: 'Technical skills',
    description: "Languages at the base, three domains built on top of them. Each skill opens a short note on where I learned it, what I have done with it, and where my experience runs out.",
    levelLabel: 'How much I use it',
    close: 'Close',
    languagesNote: 'Not a domain of their own: every project below is written in these.',
    ai: {
      label: 'A note on AI',
      paragraphs: [
        'I learned to program before AI assistants were part of the job. For almost all of my studies they either did not exist or I did not use them, so every algorithm, every bug and every design decision was worked out by hand. That is where my judgement comes from, and I consider it the most valuable thing those years gave me.',
        'Since then I have deliberately trained myself in AI-assisted and agentic coding, because the productivity gain is obvious and real. I write code with them, from exploring an unfamiliar codebase to implementing whole features, and I am comfortable in teams that expect it.',
        'I am not a vibe coder. I cannot trust code I do not understand, so nothing I push has gone unreviewed: every line is read, understood and owned by me. The tools make me faster; the responsibility for what ships stays mine.',
      ],
    },
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
      bash: "Since EPITECH",
      sql: "Production, at Nagarro",
      dart: "Since Facix",
      haskell: 'Academic',
      rust: 'Working knowledge',
      java: "Since HFT Stuttgart",
      node: "Daily, since EPITECH",
      react: "Daily, since Facix",
      vue: 'Production, at Cbienlà',
      nuxt: 'Production, at Cbienlà',
      angular: "Since ALE",
      spring: "Since HFT Stuttgart",
      'react-native': "Since Facix",
      flutter: "Since Facix",
      aws: "Since Facix",
      gcp: 'Production, at Cbienlà',
      firebase: 'Production, at Cbienlà',
      docker: 'Production, at Nagarro',
      linux: 'Daily, Arch and Debian',
    },
    why: {
      c: "The core languages of the EPITECH cursus, where I learned them, and then the ones every piece of hardware I have built runs on: the quadcopter firmware, its remote controller and the robotic arm are all C and C++ on bare metal. Writing the attitude loop meant caring about how long each iteration takes, so this is where I learned to read what the compiler actually produces rather than trusting it.",
      ts: "The backbone of every web project I have built, from the EPITECH cursus through to today. This portfolio is TypeScript, WebGL engine included, where the types carry real weight: shader uniforms and buffer layouts are exactly the kind of thing a compiler should be checking.",
      python: "Deployed to production at Nagarro and at ALE Enterprise, so this is not just my scripting language. I have had Python running as part of a real system, with the operational questions that come with it. It remains what I reach for when something has to exist by the end of the afternoon.",
      bash: "Came with the Unix side of the EPITECH cursus and has stayed with me on every Arch and Debian machine since. It is the glue around everything else: build and deploy scripts, Docker entrypoints, and the small automations that save me from typing the same five commands twice.",
      sql: "Learned at HFT Stuttgart, then the backbone of several projects at Nagarro, where the data model was the part everything else depended on. My more recent products run on Firestore, and knowing what a relational database guarantees is exactly what tells me what a document store does not.",
      dart: "Came with the mobile work at Facix and is now the language of the Cbienlà app, which I have been building since 2025. Sound null safety and the isolate model are the parts I have had to think hardest about.",
      haskell: 'Studied at EPITECH rather than shipped. I keep it on the list because what it taught me about types, totality and pure functions shows up in the TypeScript I write every day, not because I would claim to be a Haskell engineer.',
      rust: 'Personal projects and reading rather than production. The ownership model changed how I think about lifetimes in C++, which is honestly most of the value I have got from it so far.',
      java: "Learned during my Erasmus exchange at HFT Stuttgart and used since. Comfortable reading and extending a Java codebase; I would want a ramp-up before designing one from scratch.",
      node: "With JavaScript and TypeScript, the core of all the web work I have done since EPITECH: backends, tooling and Cloud Functions. Most of what I have learned here is about the event loop: what blocks it, and what that does to latency under load.",
      react: "My main front-end framework since Facix, and what I have built the most in since. This site is React, and the sphere is deliberately kept outside it: the engine owns its own loop and never triggers a render, because 60fps and reconciliation do not mix.",
      vue: 'The reactive model behind the Nuxt site for Cbienlà. Picking it up after React was mostly a matter of learning where the framework does the work for you instead of asking you to.',
      nuxt: 'Serves the public side of Cbienlà. Chosen specifically for server rendering, because property listings that search engines cannot read are listings nobody finds.',
      angular: "My first professional front-end framework, at ALE Enterprise. Dependency injection and RxJS were the adjustment; it is the one on this list I would most want a refresher on.",
      spring: "Also from HFT Stuttgart, where I built JVM services with it. Solid on the basics (controllers, dependency injection, persistence), but I have not run one in production long enough to have opinions on tuning it.",
      'react-native': "Where my mobile work started, at Facix. It is why I understand what a cross-platform framework actually costs you at the native boundary, which is the thing that decides whether the choice was right.",
      flutter: "Mobile work from Facix onwards, and now the Cbienlà app. I have built and shipped screens, state and platform integrations, and dealt with the awkward parts: deep links, background state, and the store review cycle.",
      aws: "Picked up at Facix and used since. Comfortable deploying onto it and reasoning about a bill; I have not designed an account structure for a team.",
      gcp: 'Where Cbienlà runs, through Firebase. Comfortable with the console, service accounts and quota behaviour, which I mostly learned by hitting them.',
      firebase: 'Auth, Firestore, Storage and Cloud Functions in production for Cbienlà. I know its shape well enough to know what it is bad at: querying across collections, and costs that scale with reads rather than data.',
      docker: 'How I ship and how I keep environments honest. Comfortable writing multi-stage builds and composing services; I have not operated an orchestrator at scale.',
      linux: 'Arch on my own machine, Debian on servers. Daily driving Arch is the reason I am comfortable with systemd, the boot path and the filesystem. You end up learning them whether you meant to or not.',
    },
  },

  projects: {
    eyebrow: '03 / Selected work',
    title: 'Projects',
    description: "Six projects: two products I co-founded, this site, and three hardware builds taken from part selection to firmware. Each case study covers the problem, the constraints, the decisions that mattered and what I would do differently.",
    back: 'All projects',
    roleLabel: 'Role',
    stackLabel: 'Stack',
    problemLabel: 'The problem',
    constraintsLabel: 'Constraints',
    decisionsLabel: 'Decisions',
    retrospectiveLabel: "What I'd change",
    entries: {
      portfolio: {
        title: "This portfolio",
        summary:
          "This site: a React front end with a hand-written WebGL particle engine that changes shape for every section.",
        tags: ["Personal project", "Web", "WebGL", "Creative development"],
        role: "Sole designer and engineer",
        problem:
          "A portfolio has to say a lot to someone who will give it a minute. I wanted the page itself to show the work: one cloud of points that becomes a globe, orbits, a row of projects and a timeline as you scroll, without getting in the way of the text, slowing down a phone, or breaking for anyone who prefers less motion.",
        constraints: [
          "One draw call, from 3,000 points on phones to 7,000 on desktop",
          "Smooth on mid-range phones, stepping down in quality when the frame rate drops",
          "Every piece of content readable without the animation, and a static render under reduced motion",
          "Two languages sharing one layout",
        ],
        decisions: [
          {
            title: "Keep the engine outside React",
            body: "The engine owns its render loop and exposes a small imperative interface. Scrolling and hovering change shader uniforms, not React state, so animating at 60 frames per second never triggers a re-render.",
          },
          {
            title: "Derive every shape from each point's home position",
            body: "Each scene is computed from where a point sits on the sphere rather than sampled fresh, so every point travels a short way to a nearby spot in the next shape. Transitions read as the form deforming, not the cloud scrambling.",
          },
          {
            title: "Draw the globe as coastlines",
            body: "Filled continents needed far more points to be recognisable and turned the far side into a competing mass. A coastline mask generated from world map data is sparse enough to fade with depth, and still makes France readable with a few thousand points.",
          },
        ],
      },

      facix: {
        title: "Facix",
        summary:
          "An activity booking app for French associations, taken to a beta with pilot associations: Flutter, in-app payments and a serverless AWS backend.",
        tags: ["Entrepreneurial", "Flutter", "AWS", "Payments"],
        role: "Co-founder and mobile team lead",
        problem:
          "Associations run sports and cultural activities but take bookings through forms, phone calls and cash at the door. Facix gave them one place to publish an activity, and gave the public one place to find it, pick a date, register every participant and pay, on mobile and on the web. That meant handling money on behalf of organisations that had never taken a payment online.",
        constraints: [
          "Built alongside our studies, with a mobile team of two to three developers",
          "Card payments inside a Flutter app, where Stripe support was a community plugin rather than an official SDK",
          "Several participants per booking, each with their own details",
          "Running costs had to stay near zero before there was any revenue",
        ],
        decisions: [
          {
            title: "Serverless on AWS from the start",
            body: "Lambda, Cognito, DynamoDB and S3 meant no server to patch and a bill that followed usage, which for a startup with no revenue was close to nothing. DynamoDB also pushed us to design around how the data would be read, by activity, by user and by date, before writing the screens.",
          },
          {
            title: "Keep payment in the app, even with a weak plugin",
            body: "Sending people to a web checkout would have been easier to build and worse to use, at the one step where hesitation costs a booking. We kept payment native with flutter_stripe and worked around its gaps rather than leave the app.",
          },
          {
            title: "Design every state before building it",
            body: "The Figma file covers each flow in all its states: no account, no saved card, an existing card, success and error. Agreeing on them up front let a small team build screens in parallel without rediscovering the edge cases one by one.",
          },
        ],
        retrospective:
          "The app worked; the market did not. Associations were not ready to pay for a service, and we spent our time polishing the product instead of testing that assumption. I would put a paid pilot in front of a handful of associations before writing a single payment screen.",
      },

      quadcopter: {
        title: 'Stabilized quadcopter',
        summary:
          "A quadcopter built end to end, from part selection and PCB design to flight-control firmware, that holds a stable attitude in manual flight.",
        tags: ['Personal project', 'Embedded systems', 'PCB design'],
        role: 'Sole designer and engineer',
        problem:
          'A quadcopter is unstable by construction: it has four actuators, six degrees of freedom, and no passive tendency to stay level. Keeping it in the air means closing a control loop faster than the airframe can fall out of one.',
        constraints: [
          'Every part selected and sourced individually, no kit',
          'Custom PCB, designed and populated by hand',
          'Attitude loop running at about 1 kHz on an STM32, fast enough to correct before divergence',
          'Total mass budget fixed by the motors and props chosen first',
        ],
        decisions: [
          {
            title: 'Build the board rather than buy a flight controller',
            body: 'An off-the-shelf controller would have flown sooner, but the point was to understand the whole stack: power, sensing, actuation and the loop between them. Designing the PCB forced every one of those decisions to be explicit.',
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
          'I would instrument the loop from the first day instead of the first crash. Logging attitude estimate and motor output to look at afterwards turned tuning from guesswork into reading a graph, and I only started doing it late.',
      },

      'drone-controller': {
        title: 'Drone remote controller',
        summary:
          "A radio controller for the quadcopter, designed and 3D printed from scratch, that shows live telemetry from the aircraft on its own screen.",
        tags: ['Personal project', 'Industrial design', '3D printing', 'Embedded systems'],
        role: 'Sole designer and engineer',
        problem:
          "The quadcopter needed a way to be flown. A controller stays in your hands for the whole flight, so the hard part is not the radio link. It is that the shape, the stick feel and the layout decide whether the aircraft is actually controllable.",
        constraints: [
          'Enclosure modelled in CAD and printed on an FDM printer',
          'Print volume and layer adhesion set the maximum part size and where seams could fall',
          'Must run on battery for a full flying session',
          'nRF24L01 radio: short range, shared by commands going out and telemetry coming back',
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
          {
            title: "Bring telemetry back to the pilot's hands",
            body: "The link runs both ways: the aircraft answers with battery voltage, attitude, flight mode, armed state and link quality, shown live on an LCD on the controller. With a short-range radio, seeing the signal degrade before it drops is what lets the pilot turn back in time.",
          },
        ],
        retrospective:
          'I iterated the enclosure far more times than the electronics, and each iteration cost hours of print time. Printing just the grip section as a test part first would have got me to the right shape for a fraction of the filament.',
      },

      cbienla: {
        title: 'Cbienlà.fr',
        summary: "Real-estate listing platform I co-founded in 2025, now live: a Flutter app and a Nuxt.js site on a shared Firebase backend.",
        tags: ['Entrepreneurial', 'Flutter', 'Firebase', 'Nuxt.js'],
        role: 'Co-founder and software engineer',
        problem:
          'A listing platform needs two front ends that never disagree: a mobile app people browse on, and a public web surface search engines can read. Both describe the same properties, so the hard part is one source of truth rather than two codebases drifting.',
        constraints: [
          'Five co-founders and no revenue before launch, so build cost had to stay near zero at launch',
          'Listings must be indexable, since a client-only app would be invisible to search',
          'Same data model serving app and site',
        ],
        decisions: [
          {
            title: 'Firebase as the backend rather than a server we run',
            body: 'At this stage the scarce resource is our time, not compute. Managed auth, storage and functions removed an entire category of work, and the cost curve only becomes a problem at a volume that would be a good problem to have.',
          },
          {
            title: 'Nuxt for the public site, Flutter for the app',
            body: 'The two surfaces have genuinely different jobs. Nuxt server-renders listings so they can be indexed and shared; Flutter gives one mobile codebase for both platforms. Splitting by job beat forcing one technology across both.',
          },
          {
            title: 'Settle the business model before the product',
            body: "Before Cbienlà I co-founded Facix, an activity booking platform for French associations. The app worked, but associations were not ready to pay for a service, so the company never took off. With Cbienlà, how the company earns its keep was a question from the first day, not something to solve once the product existed.",
          },
        ],
        retrospective:
          'The data model was still shaped around the first screen we built rather than the queries we would need, and reshaping it later cost more than designing it up front would have.',
      },

      'robotic-arm': {
        title: 'Robotic arm',
        summary: "A robotic arm driven wirelessly from a mobile app: the phone sets the destination, the firmware works out the motion.",
        tags: ['Personal project', 'Robotics'],
        role: 'Sole designer and engineer',
        problem:
          'Driving a multi-joint arm from a phone means a command leaves a touchscreen and has to arrive as coordinated motion across several motors, over a link that is neither fast nor reliable enough to be trusted with the details.',
        constraints: [
          'Wireless link with variable latency and real dropouts',
          'Six servos, five joints and a gripper, that must move together to be useful',
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
          'I put the inverse kinematics in the app before moving it into the firmware. On the device it belonged in from the start; the app should only ever have described the destination.',
      },
    },
  },

  experience: {
    eyebrow: '04 / Experience',
    title: 'Experience',
    description: "Five roles since 2021: QA at ALE Enterprise, mentoring at EPITECH, consulting at Nagarro, and two companies co-founded, Facix and then Cbienlà.",
    roles: {
      cbienla: 'Co-founder & software engineer',
      nagarro: 'Software engineering consultant',
      facix: 'Co-founder & mobile team lead',
      epitech: 'Educational mentor, internship',
      ale: 'QA developer, internship',
    },
    details: {
      cbienla: "A real-estate listing and property management platform, launched by five co-founders. I designed the architecture and built both the Flutter app and the Nuxt.js site, with Firebase for auth, data and cloud functions.",
      nagarro: "Built custom Node.js systems for industrial and enterprise clients. For Phoenix Contact, software on an industrial PC that collects, stores and displays electrical data from more than 300 PLCs for the teams on site; before that, a live race-analysis dashboard fed by Gran Turismo 7 telemetry, and several client applications on SAP's cloud platform.",
      facix: "Co-founded, alongside my studies, an activity booking platform for French associations: they publish sports and cultural activities, and the public books and pays in the app. Led the design and development of the Flutter app with a small mobile team, on a serverless AWS backend, through to a beta with pilot associations.",
      epitech: "Six-month internship mentoring a class of under thirty first-year students in web development. I structured their learning path, followed their projects and helped them get unstuck on their own rather than handing them the answer.",
      ale: "Six-month internship in the QA team. Automated the testing of the company's phones and designed a new Python test framework to run faster and cover more, then built a Node.js tool to manage VLAN configuration for the company's new site.",
    },
  },

  education: {
    eyebrow: '05 / Education',
    title: 'Education',
    description: "Five years at EPITECH Strasbourg, a school that teaches through projects rather than lectures, including an Erasmus year at HFT Stuttgart.",
    degrees: {
      epitech: 'Master, software engineering',
      hft: 'Software technology, Erasmus exchange',
    },
    details: {
      epitech: "A five-year master's built on projects rather than lectures: C and C++, Unix systems and Haskell first, then web and mobile with Node.js and Flutter. It is where I learned to work problems out on my own and to ship as a team.",
      hft: "Two semesters of the Master of Software Technology on an Erasmus exchange, focused on software architecture, with Java and Spring Boot.",
    },
  },

  contact: {
    eyebrow: '06 / Contact',
    title: 'Get in touch',
    description: "I am looking for a permanent or fixed-term role in full-stack web and mobile engineering: remote, hybrid or on-site around Niort. Email is the quickest way to reach me; the résumé has the full details.",
    downloadCv: 'Download CV',
  },

  footerNote: 'Designed & built by Thomas Koebel',

  notFound: {
    eyebrow: '404',
    title: 'That page does not exist.',
    back: 'Back to the portfolio',
  },
}
