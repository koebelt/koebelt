import type { Copy } from './types'

/** Mentions légales, confidentialité et conditions d’utilisation. Suit legal.en.ts. */
export const legalFr: Copy['legal'] = {
  updatedLabel: 'Mise à jour le',
  productsLabel: 'Par projet',

  notice: {
    title: 'Mentions légales',
    intro: 'Qui édite et qui héberge koebelt.com, comme l’exige l’article 6 de la loi pour la confiance dans l’économie numérique (LCEN).',
    sections: [
      {
        title: 'Éditeur',
        paragraphs: ['Thomas Koebel, également directeur de la publication.', 'Contact : contact@koebelt.com.'],
      },
      {
        title: 'Hébergeur',
        paragraphs: ['Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis. Téléphone : +1 888 993 5273. cloudflare.com.'],
      },
      {
        title: 'Contenus et logiciels',
        paragraphs: [
          'Les textes et images de ce site sont © Thomas Koebel. Les logiciels publiés sous le nom koebelt relèvent de leur propre licence, la licence MIT sauf mention contraire du projet ; voir les conditions d’utilisation.',
        ],
      },
      {
        title: 'Données personnelles',
        paragraphs: ['La manière dont ce site et les projets koebelt traitent les données personnelles est décrite dans la politique de confidentialité.'],
      },
    ],
  },

  privacy: {
    title: 'Confidentialité',
    intro:
      'Cette politique couvre ce site et les applications et bibliothèques publiées par Thomas Koebel sous le nom koebelt, sur koebelt.com et github.com/koebelt. La première partie s’applique à tous ; chaque projet précise ensuite ce qu’il traite. Les produits cofondés avec d’autres et présentés sur ce site, comme Cbienlà et Facix, ne sont pas couverts : ils ont leur propre politique.',
    sections: [
      {
        title: 'Responsable',
        paragraphs: [
          'Thomas Koebel est responsable des traitements décrits ici (responsable de traitement au sens du RGPD). Pour toute question sur vos données : contact@koebelt.com.',
        ],
      },
      {
        title: 'Ce que collectent les projets koebelt',
        paragraphs: [
          'Sauf indication contraire dans la section d’un projet ci-dessous, un projet koebelt n’a ni compte, ni statistiques, ni publicité, ni pistage, et ne m’envoie rien. Si un projet a un jour besoin de données personnelles, sa section précisera lesquelles, pourquoi, sur quelle base légale et pour combien de temps, avant la publication de cette version.',
        ],
      },
      {
        title: 'Ce site',
        paragraphs: [
          'koebelt.com n’utilise ni cookies ni statistiques. Votre choix de langue est conservé dans le stockage local de votre navigateur et n’en sort pas.',
          'Le site est hébergé par Cloudflare, qui traite des données techniques comme votre adresse IP pour servir les pages et les protéger des attaques. Base légale : l’intérêt légitime à faire fonctionner un site sûr (article 6.1.f du RGPD). Cloudflare conserve ces journaux pour une durée limitée, selon sa politique de confidentialité.',
        ],
      },
      {
        title: 'Quand vous m’écrivez',
        paragraphs: [
          'J’utilise votre adresse et votre message uniquement pour vous répondre. Base légale : l’intérêt légitime à vous répondre, ou les démarches que vous demandez avant un accord (articles 6.1.f et 6.1.b). Je conserve l’échange tant qu’il est utile et le supprime au plus tard trois ans après notre dernier contact, plus tôt si vous le demandez.',
        ],
      },
      {
        title: 'Hors de l’UE',
        paragraphs: [
          'Cloudflare, GitHub et Apple sont des sociétés établies aux États-Unis. Les données qu’elles traitent pour les services cités sur cette page peuvent y être transférées, avec les garanties décrites dans leurs politiques de confidentialité.',
        ],
      },
      {
        title: 'Vos droits',
        paragraphs: [
          'Vous pouvez demander à consulter, corriger ou supprimer les données vous concernant, à en limiter l’utilisation ou vous y opposer, en écrivant à contact@koebelt.com ; je réponds sous un mois. Vous pouvez aussi saisir la CNIL (cnil.fr).',
        ],
      },
      {
        title: 'Modifications',
        paragraphs: ['Si cette politique change, la date en haut change avec elle, et un projet qui se met à traiter des données personnelles met d’abord sa section à jour.'],
      },
    ],
    products: [
      {
        name: 'koebelt dash',
        sections: [
          {
            title: 'Dans l’application',
            paragraphs: ['Rien de ce que vous faites dans l’application ne m’est envoyé. Elle n’a ni compte ni statistiques.'],
            list: [
              'Uniquement sur votre téléphone ou votre ordinateur : vos réglages, les appareils appairés et leurs clés d’appairage, les séquences, les dispositions d’écran, les enregistrements et les tuiles de carte déjà affichées. Désinstaller l’application les supprime sur iPhone, iPad et Android ; sur ordinateur, ils restent dans le dossier de l’application jusqu’à ce que vous le supprimiez.',
              'Vos appareils : l’application échange avec les machines que vous connectez, en Wi-Fi, Bluetooth, USB ou radio. Ces échanges restent entre l’application et elles, sans passer par moi.',
              'Cartes : pour afficher la carte, l’application télécharge des tuiles auprès du fournisseur choisi dans les Réglages, OpenStreetMap ou OpenTopoMap par défaut, ou le vôtre. Comme pour tout site web, ce serveur voit votre adresse IP et la zone demandée, selon sa propre politique de confidentialité. Choisir Aucune dans les Réglages désactive ces téléchargements.',
              'Mises à jour : les versions téléchargées sur GitHub demandent à GitHub la dernière version au lancement et une fois par jour ; GitHub voit donc votre adresse IP, selon sa déclaration de confidentialité. Vous pouvez le désactiver dans Réglages > Mises à jour. Les versions App Store et TestFlight ne le font pas : Apple les met à jour.',
              'Exports et partages : enregistrements, journaux et vidéos ne quittent l’application que lorsque vous les exportez ou les partagez, vers la destination de votre choix.',
              'Autorisations : le Bluetooth et le réseau local servent à trouver et connecter vos appareils, les capteurs de mouvement au pilotage par inclinaison si vous le choisissez, et les fichiers aux imports et exports. Rien d’autre.',
            ],
          },
          {
            title: 'Apple et Google',
            paragraphs: [
              'Si vous installez l’application depuis l’App Store, TestFlight ou plus tard Google Play, ils gèrent le téléchargement selon leurs propres règles. Si vous avez autorisé votre téléphone à partager des statistiques avec les développeurs, Apple me fournit des rapports de plantage et des comptages d’utilisation anonymes, que j’utilise uniquement pour corriger des problèmes (intérêt légitime, article 6.1.f) ; Apple les conserve dans App Store Connect selon ses conditions.',
            ],
          },
        ],
      },
      {
        name: 'koebelt/link',
        sections: [
          {
            title: 'Les bibliothèques',
            paragraphs: [
              'Les bibliothèques Arduino, Python, Rust et ROS 2 fonctionnent sur votre propre matériel et n’envoient de données qu’à l’application à laquelle elles sont connectées. Elles ne contactent aucun serveur et ne m’envoient rien.',
            ],
          },
        ],
      },
    ],
  },

  terms: {
    title: 'Conditions d’utilisation',
    intro:
      'Ces conditions s’appliquent à ce site et aux applications et bibliothèques publiées par Thomas Koebel sous le nom koebelt, sur koebelt.com et github.com/koebelt. La première partie s’applique à tous ; chaque projet peut ajouter ses propres règles. Les produits cofondés avec d’autres, comme Cbienlà et Facix, ont leurs propres conditions. Utiliser un projet koebelt ou ce site vaut acceptation de ces conditions.',
    sections: [
      {
        title: 'Éditeur',
        paragraphs: ['Thomas Koebel, contact@koebelt.com. Les détails figurent dans les mentions légales.'],
      },
      {
        title: 'Gratuit et open source',
        paragraphs: [
          'Les projets koebelt sont gratuits. Sauf mention contraire d’un projet, ils sont publiés sous licence MIT : vous pouvez les utiliser, les copier, les modifier et les partager, y compris dans vos propres projets, à condition de conserver la mention de licence. Le code source et la licence de chaque projet sont dans son dépôt sur github.com/koebelt.',
        ],
      },
      {
        title: 'Absence de garantie',
        paragraphs: [
          'Comme le prévoit la licence MIT, le logiciel est fourni « tel quel », sans garantie d’aucune sorte. Dans la mesure permise par la loi, je ne suis pas responsable des dommages, blessures ou pertes résultant de son utilisation. Cela ne limite aucun droit que la loi vous accorde et qui ne peut être exclu.',
        ],
      },
      {
        title: 'Autres services',
        paragraphs: ['Les services sur lesquels s’appuie un projet, comme GitHub, l’App Store ou Google Play, sont soumis à leurs propres conditions.'],
      },
      {
        title: 'Nom et logos',
        paragraphs: [
          'Le nom et les logos koebelt identifient les projets officiels. La licence couvre le code, pas eux : une version modifiée que vous diffusez doit porter un autre nom.',
        ],
      },
      {
        title: 'Produits payants',
        paragraphs: ['Aucun projet koebelt n’est vendu aujourd’hui. Si l’un l’est un jour, il aura ses propres conditions générales de vente.'],
      },
      {
        title: 'Ce site',
        paragraphs: ['Les textes et images de koebelt.com sont © Thomas Koebel. Vous pouvez les citer avec un lien vers le site.'],
      },
      {
        title: 'Modifications et droit applicable',
        paragraphs: [
          'Ces conditions peuvent évoluer ; la date en haut indique la version en vigueur. Elles sont régies par le droit français, sans préjudice des protections accordées aux consommateurs par leur pays de résidence. En cas de problème, écrivez d’abord à contact@koebelt.com ; je chercherai une solution avec vous.',
        ],
      },
    ],
    products: [
      {
        name: 'koebelt dash et koebelt/link',
        sections: [
          {
            title: 'De quoi il s’agit',
            paragraphs: [
              'koebelt dash et les bibliothèques koebelt/link sont des outils pour suivre et piloter les drones, rovers, bras robotisés, fusées et bancs d’essai que vous construisez vous-même.',
            ],
          },
          {
            title: 'Vos machines, votre responsabilité',
            paragraphs: ['Vous êtes responsable des machines que vous construisez et utilisez, et de l’usage que vous faites du logiciel avec elles.'],
            list: [
              'Faites vos essais hélices retirées, ou moteurs débranchés, avant toute chose.',
              'Gardez un moyen d’arrêter la machine qui ne dépende pas de l’application : son propre failsafe, une radiocommande ou un coupe-circuit.',
              'Respectez les règles du lieu où vous opérez. En France et dans l’UE, les drones relèvent des règles de la DGAC et de l’EASA (enregistrement, formation, zones et hauteurs de vol).',
              'Respectez la sécurité et la vie privée des autres, y compris avec une caméra embarquée.',
            ],
          },
          {
            title: 'Pas pour un usage critique',
            paragraphs: [
              'Ce sont des outils pour makers. Ils ne sont ni conçus, ni testés, ni certifiés pour des systèmes critiques, l’aviation commerciale, ou tout usage où une défaillance pourrait mettre des personnes en danger. STOP et le failsafe dépendent de votre firmware, de votre matériel et de la liaison, et peuvent échouer si l’un d’eux échoue.',
            ],
          },
          {
            title: 'Cartes',
            paragraphs: [
              'Les tuiles de carte proviennent d’OpenStreetMap ou d’OpenTopoMap selon leurs propres conditions, qui autorisent un usage personnel modéré ; pour un usage plus intensif, indiquez votre propre fournisseur dans les Réglages.',
            ],
          },
        ],
      },
    ],
  },
}
