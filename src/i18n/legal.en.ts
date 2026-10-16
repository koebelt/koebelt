import type { Copy } from './types'

/**
 * Legal notice, privacy policy and terms of use (/legal, /privacy, /terms).
 * The general part covers every app and library published under the koebelt
 * name; each project adds its own section. Keep fr.ts's version in step.
 */
export const legalEn: Copy['legal'] = {
  updatedLabel: 'Last updated',
  productsLabel: 'By project',

  notice: {
    title: 'Legal notice',
    intro: 'Who publishes and who hosts koebelt.com, as French law requires (article 6 of the LCEN).',
    sections: [
      {
        title: 'Publisher',
        paragraphs: ['Thomas Koebel, who is also the director of publication.', 'Contact: contact@koebelt.com.'],
      },
      {
        title: 'Host',
        paragraphs: ['Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United States. Phone: +1 888 993 5273. cloudflare.com.'],
      },
      {
        title: 'Content and software',
        paragraphs: [
          'The text and images on this site are © Thomas Koebel. The software published under the koebelt name is under its own licence, the MIT licence unless a project says otherwise; see the terms of use.',
        ],
      },
      {
        title: 'Personal data',
        paragraphs: ['How this site and the koebelt projects handle personal data is described in the privacy policy.'],
      },
    ],
  },

  privacy: {
    title: 'Privacy',
    intro:
      'This policy covers this website and the apps and libraries published by Thomas Koebel under the koebelt name, on koebelt.com and github.com/koebelt. The first part applies to all of them; each project then says what it handles. Products I co-founded with others and that appear on this site, such as Cbienlà and Facix, are not covered: they have their own policies.',
    sections: [
      {
        title: 'Who is responsible',
        paragraphs: [
          'Thomas Koebel is responsible for the processing described here (the data controller, in GDPR terms). For anything about your data, write to contact@koebelt.com.',
        ],
      },
      {
        title: 'What koebelt projects collect',
        paragraphs: [
          'Unless a project’s section below says otherwise, a koebelt project has no account, no analytics, no advertising and no tracking, and sends nothing to me. If a project ever needs personal data, its section will say what, why, on what legal basis and for how long, before that version is published.',
        ],
      },
      {
        title: 'This website',
        paragraphs: [
          'koebelt.com uses no cookies and no analytics. Your language choice is kept in your browser’s local storage and never leaves it.',
          'The site is hosted by Cloudflare, which processes technical data such as your IP address to deliver the pages and protect them from attacks. Legal basis: the legitimate interest in running a working, secure site (GDPR article 6(1)(f)). Cloudflare keeps these logs for a limited time, under its privacy policy.',
        ],
      },
      {
        title: 'When you write to me',
        paragraphs: [
          'I use your email address and message only to answer you. Legal basis: the legitimate interest in replying, or the steps you ask for before an agreement (article 6(1)(f) and (b)). I keep the exchange while it is useful and delete it at the latest three years after our last contact, sooner if you ask.',
        ],
      },
      {
        title: 'Outside the EU',
        paragraphs: [
          'Cloudflare, GitHub and Apple are companies based in the United States. The data they process for the services named on this page can be transferred there, under the safeguards described in their privacy policies.',
        ],
      },
      {
        title: 'Your rights',
        paragraphs: [
          'You can ask to see, correct or delete personal data about you, to limit its use or to object to it, by writing to contact@koebelt.com; I answer within a month. You can also complain to the CNIL, the French data protection authority (cnil.fr).',
        ],
      },
      {
        title: 'Changes',
        paragraphs: ['If this policy changes, the date at the top changes with it, and a project that starts handling personal data updates its section first.'],
      },
    ],
    products: [
      {
        name: 'koebelt dash',
        sections: [
          {
            title: 'In the app',
            paragraphs: ['Nothing you do in the app is sent to me. It has no account and no analytics.'],
            list: [
              'On your phone or computer only: your settings, the devices you paired and their pairing keys, sequences, screen layouts, recordings and the map tiles you have viewed. Uninstalling the app removes them on iPhone, iPad and Android; on a computer they stay in the app’s folder until you delete it.',
              'Your devices: the app talks to the machines you connect, over Wi-Fi, Bluetooth, USB or radio. That traffic goes between the app and them, not to me.',
              'Maps: to show the map, the app downloads tiles from the provider chosen in Settings, OpenStreetMap or OpenTopoMap by default, or your own. Like any website, that server sees your IP address and which area of the map is asked for, under its own privacy policy. Choosing None in Settings turns this off.',
              'Updates: the versions downloaded from GitHub ask GitHub for the latest release when they start and once a day, so GitHub sees your IP address, under its privacy statement. You can turn this off in Settings > Updates. The App Store and TestFlight versions do not do this; Apple updates them.',
              'Exports and sharing: recordings, logs and videos leave the app only when you export or share them, to where you choose.',
              'Permissions: Bluetooth and the local network are used to find and connect your devices, motion sensors for tilt control when you choose it, and files for import and export. Nothing else.',
            ],
          },
          {
            title: 'Apple and Google',
            paragraphs: [
              'If you install the app from the App Store, TestFlight or later Google Play, they handle the download under their own policies. If you allowed your phone to share analytics with app developers, Apple gives me anonymous crash reports and usage counts, which I use only to fix problems (legitimate interest, article 6(1)(f)); Apple keeps them in App Store Connect under its terms.',
            ],
          },
        ],
      },
      {
        name: 'koebelt/link',
        sections: [
          {
            title: 'The libraries',
            paragraphs: [
              'The Arduino, Python, Rust and ROS 2 libraries run on your own hardware and send data only to the app they are connected to. They contact no server and send nothing to me.',
            ],
          },
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of use',
    intro:
      'These terms apply to this website and to the apps and libraries published by Thomas Koebel under the koebelt name, on koebelt.com and github.com/koebelt. The first part applies to all of them; each project can add its own rules. Products I co-founded with others, such as Cbienlà and Facix, have their own terms. Using a koebelt project or this site means you accept these terms.',
    sections: [
      {
        title: 'Publisher',
        paragraphs: ['Thomas Koebel, contact@koebelt.com. Details are in the legal notice.'],
      },
      {
        title: 'Free and open source',
        paragraphs: [
          'The koebelt projects are free. Unless a project says otherwise, they are published under the MIT licence: you may use, copy, change and share them, including in your own projects, as long as the licence notice is kept. Each project’s source and licence are in its repository on github.com/koebelt.',
        ],
      },
      {
        title: 'No warranty',
        paragraphs: [
          'As the MIT licence says, the software is provided "as is", without warranty of any kind. To the extent the law allows, I am not liable for damage, injury or loss resulting from its use. This does not limit any right the law gives you and that cannot be excluded.',
        ],
      },
      {
        title: 'Other services',
        paragraphs: ['Services a project relies on, such as GitHub, the App Store or Google Play, are subject to their own terms.'],
      },
      {
        title: 'Name and logo',
        paragraphs: [
          'The koebelt name and logos identify the official projects. The licence covers the code, not them: a modified version you distribute should use another name.',
        ],
      },
      {
        title: 'Paid products',
        paragraphs: ['No koebelt project is sold today. If one ever is, it will come with its own terms of sale.'],
      },
      {
        title: 'This website',
        paragraphs: ['The text and images on koebelt.com are © Thomas Koebel. You may quote them with a link back.'],
      },
      {
        title: 'Changes and law',
        paragraphs: [
          'These terms may change; the date at the top shows the current version. They are governed by French law, without affecting the consumer protection of the country where you live. If something goes wrong, write to contact@koebelt.com first; I will try to sort it out with you.',
        ],
      },
    ],
    products: [
      {
        name: 'koebelt dash and koebelt/link',
        sections: [
          {
            title: 'What they are',
            paragraphs: [
              'koebelt dash and the koebelt/link libraries are tools for watching and controlling drones, rovers, robot arms, rockets and test benches that you build yourself.',
            ],
          },
          {
            title: 'Your machines, your responsibility',
            paragraphs: ['You are responsible for the machines you build and operate, and for how you use the software with them.'],
            list: [
              'Test with the propellers off, or the motors disconnected, before anything else.',
              'Keep a way to stop the machine that does not depend on the app: its own failsafe, an RC transmitter or a kill switch.',
              'Follow the rules where you operate. In France and the EU, drones fall under the DGAC and EASA rules (registration, training, where and how high you may fly).',
              'Respect other people’s safety and privacy, including with a camera on board.',
            ],
          },
          {
            title: 'Not for critical use',
            paragraphs: [
              'They are tools for makers. They are not designed, tested or certified for safety-critical systems, commercial aviation, or anything where a failure could put people at risk. STOP and the failsafe depend on your firmware, your hardware and the link, and can fail if any of them does.',
            ],
          },
          {
            title: 'Maps',
            paragraphs: [
              'Map tiles come from OpenStreetMap or OpenTopoMap under their own terms, which allow light personal use; for heavier use, set your own tile provider in Settings.',
            ],
          },
        ],
      },
    ],
  },
}
