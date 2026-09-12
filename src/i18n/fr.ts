import type { Copy } from './types'

export const fr: Copy = {
  localeName: 'Français',

  nav: {
    about: 'Profil',
    skills: 'Compétences',
    projects: 'Projets',
    experience: 'Expérience',
    education: 'Formation',
    contact: 'Contact',
  },

  hero: {
    badge: 'Ouvert aux opportunités',
    name: 'Thomas Koebel',
    statement: 'Ingénieur logiciel, je conçois des systèmes et des produits.',
    lede: "Backend, web, mobile et embarqué. Master en ingénierie logicielle à EPITECH Strasbourg, basé à Niort. J'ai cofondé Cbienlà et je fabrique mon propre matériel quand le problème le demande.",
    cta: 'Voir les projets',
    scroll: 'Défiler',
  },

  about: {
    eyebrow: '01 — Profil',
    title: 'Profil',
    body: "Je suis Thomas Koebel, ingénieur logiciel. Je travaille sur des systèmes backend, web, mobiles et cloud, de l'architecture au développement jusqu'à l'encadrement technique, avec le souci de livrer un logiciel fiable et de garder la complexité sous contrôle. J'attache de l'importance à une conception claire, à des décisions pragmatiques, et à bien comprendre le problème avant de choisir la solution.",
    languagesLabel: 'Langues',
    softSkillsLabel: 'Qualités',
    languages: ['Français — langue maternelle', 'Anglais — TOEIC 860', 'Allemand — A2'],
    softSkills: [
      'Communication',
      'Créativité',
      'Résolution de problèmes',
      'Adaptabilité',
      'Encadrement technique',
      'Pédagogie',
      'Autonomie',
      "Travail d'équipe",
      'Curiosité',
      'Pragmatisme',
      'Rigueur',
    ],
  },

  skills: {
    eyebrow: '02 — Compétences',
    title: 'Compétences techniques',
    description: 'Quatre domaines, quatre couronnes. Sélectionnez une compétence pour savoir pourquoi je la revendique.',
    levelLabel: 'À quel point je l’utilise',
    close: 'Fermer',
    groupLabels: {
      languages: 'Langages',
      web: 'Web',
      mobile: 'Mobile',
      cloud: 'Cloud & infra',
    },
    levels: {
      c: "Depuis EPITECH",
      ts: "Quotidien, depuis EPITECH",
      python: "En production, chez Nagarro et ALE",
      dart: "Quotidien, depuis Facix",
      haskell: 'Académique',
      rust: 'Bonnes bases',
      java: "Depuis la HFT Stuttgart",
      node: "Quotidien, depuis EPITECH",
      react: "Quotidien, depuis Facix",
      vue: 'En production',
      nuxt: 'En production',
      angular: "Depuis ALE",
      spring: "Depuis la HFT Stuttgart",
      'react-native': "Depuis Facix",
      flutter: "Quotidien, depuis Facix",
      aws: "Depuis Facix",
      gcp: 'En production',
      firebase: 'Quotidien',
      docker: 'En production',
      linux: 'Au quotidien',
    },
    why: {
      c: "Les langages de base du cursus EPITECH, où je les ai appris, puis ceux sur lesquels tourne tout le matériel que j'ai construit : le firmware du quadricoptère, sa radiocommande et le bras robotisé sont tous en C et C++, sans système d'exploitation. Écrire la boucle d'attitude imposait de savoir combien de temps prend chaque itération : c'est là que j'ai appris à lire ce que le compilateur produit vraiment plutôt qu'à lui faire confiance.",
      ts: "La colonne vertébrale de tous les projets web que j'ai construits, du cursus EPITECH jusqu'à aujourd'hui. Ce portfolio est en TypeScript, moteur WebGL compris, et les types y pèsent réellement : les uniforms de shader et les dispositions de buffers sont exactement ce qu'un compilateur devrait vérifier.",
      python: "Déployé en production chez Nagarro et chez ALE Enterprise : ce n'est donc pas seulement mon langage de script — j'ai fait tourner du Python au sein d'un vrai système, avec les questions d'exploitation que cela implique. Il reste ce vers quoi je me tourne quand quelque chose doit exister avant la fin de l'après-midi.",
      dart: "Arrivé avec le mobile chez Facix, c'est aujourd'hui le langage de l'application Cbienlà, écrite et maintenue quotidiennement depuis 2025. La sûreté du null et le modèle d'isolats sont les points qui m'ont demandé le plus de réflexion.",
      haskell: "Étudié à EPITECH plutôt que livré. Je le garde dans la liste parce que ce qu'il m'a appris sur les types, la totalité et les fonctions pures se retrouve dans le TypeScript que j'écris tous les jours — pas parce que je me présenterais comme développeur Haskell.",
      rust: "Projets personnels et lectures, pas de production. Le modèle d'ownership a changé ma façon de penser les durées de vie en C++, ce qui reste honnêtement l'essentiel de ce qu'il m'a apporté.",
      java: "Appris pendant mon échange Erasmus à la HFT Stuttgart, et pratiqué depuis. À l'aise pour lire et faire évoluer une base de code Java ; je voudrais un temps de montée en compétence avant d'en concevoir une de zéro.",
      node: "Avec JavaScript et TypeScript, le cœur de tout le travail web que je fais depuis EPITECH : backends, outillage et Cloud Functions. L'essentiel de ce que j'y ai appris concerne la boucle d'événements : ce qui la bloque, et l'effet que ça produit sur la latence en charge.",
      react: "Mon principal framework front-end depuis Facix, et celui avec lequel j'ai le plus construit depuis. Ce site est en React, et la sphère en est délibérément tenue à l'écart : le moteur gère sa propre boucle et ne déclenche jamais de rendu, parce que 60 images par seconde et réconciliation ne font pas bon ménage.",
      vue: "Le modèle réactif derrière le site Nuxt de Cbienlà. L'aborder après React a surtout consisté à repérer là où le framework fait le travail à votre place plutôt que de vous le demander.",
      nuxt: "Sert la partie publique de Cbienlà. Choisi précisément pour le rendu serveur : des annonces que les moteurs de recherche ne peuvent pas lire sont des annonces que personne ne trouve.",
      angular: "Mon premier framework front-end en entreprise, chez ALE Enterprise. L'injection de dépendances et RxJS ont demandé un temps d'adaptation ; c'est celui de cette liste sur lequel j'aurais le plus besoin de me remettre à jour.",
      spring: "Également issu de la HFT Stuttgart, où j'ai construit des services JVM avec. Solide sur les bases — contrôleurs, injection de dépendances, persistance — mais je n'en ai pas exploité assez longtemps en production pour avoir un avis sur son réglage fin.",
      'react-native': "Le point de départ de mon travail mobile, chez Facix. C'est ce qui me fait comprendre ce qu'un framework multiplateforme coûte réellement à la frontière du natif, et c'est précisément ce qui détermine si le choix était bon.",
      flutter: "Du mobile depuis Facix, et aujourd'hui l'application Cbienlà. J'en ai construit et livré les écrans, l'état et les intégrations plateforme, et j'ai traité les parties ingrates : liens profonds, état en arrière-plan et cycle de validation des stores.",
      aws: "Découvert chez Facix et pratiqué depuis. À l'aise pour y déployer et pour raisonner sur une facture ; je n'ai pas conçu de structure de comptes pour une équipe.",
      gcp: "Là où tourne Cbienlà, via Firebase. À l'aise avec la console, les comptes de service et le comportement des quotas — appris surtout en les heurtant.",
      firebase: "Auth, Firestore, Storage et Cloud Functions en production pour Cbienlà. Je le connais assez pour savoir ce qu'il fait mal : les requêtes entre collections, et des coûts qui croissent avec les lectures plutôt qu'avec les données.",
      docker: "Ma façon de livrer et de garder les environnements honnêtes. À l'aise pour écrire des builds multi-étapes et composer des services ; je n'ai pas exploité d'orchestrateur à grande échelle.",
      linux: "Arch sur ma machine, Debian sur les serveurs. Utiliser Arch au quotidien est la raison pour laquelle je suis à l'aise avec systemd, la séquence de démarrage et le système de fichiers — on finit par les apprendre, qu'on l'ait voulu ou non.",
    },
  },

  projects: {
    eyebrow: '03 — Projets',
    title: 'Projets',
    description: 'Quatre réalisations, chacune détaillée. Des projets personnels, et une entreprise que j’ai cofondée.',
    back: 'Tous les projets',
    roleLabel: 'Rôle',
    stackLabel: 'Technologies',
    problemLabel: 'Le problème',
    constraintsLabel: 'Contraintes',
    decisionsLabel: 'Décisions',
    retrospectiveLabel: 'Ce que je changerais',
    entries: {
      quadcopter: {
        title: 'Quadricoptère stabilisé',
        summary:
          "Création de A à Z d'un quadricoptère stabilisé — choix des composants, conception du PCB, assemblage et système de guidage interne.",
        tags: ['Projet personnel', 'Systèmes embarqués', 'Conception PCB'],
        role: 'Conception et réalisation en solo',
        problem:
          "Un quadricoptère est instable par construction : quatre actionneurs, six degrés de liberté, et aucune tendance naturelle à rester à plat. Le maintenir en vol, c'est fermer une boucle d'asservissement plus vite que la machine ne peut en sortir.",
        constraints: [
          'Chaque composant choisi et commandé séparément, aucun kit',
          'PCB sur mesure, conçu et soudé à la main',
          "Boucle d'attitude assez rapide pour corriger avant divergence",
          'Budget de masse fixé par les moteurs et les hélices choisis en premier',
        ],
        decisions: [
          {
            title: 'Concevoir la carte plutôt qu’acheter un contrôleur de vol',
            body: "Un contrôleur du commerce aurait volé plus tôt, mais l'objectif était de comprendre toute la chaîne — alimentation, mesure, actionnement, et la boucle qui les relie. Concevoir le PCB a obligé à expliciter chacune de ces décisions.",
          },
          {
            title: 'Fusionner les capteurs plutôt que d’en croire un seul',
            body: "L'accéléromètre est fiable sur la durée et bruité sur l'instant ; le gyroscope, l'inverse. Les fusionner donne une estimation d'attitude ni tremblante ni dérivante, ce dont la boucle a réellement besoin.",
          },
          {
            title: 'Régler la boucle interne avant d’en ajouter une autre',
            body: "Le maintien d'attitude devait tenir seul avant que la position ou la navigation aient un sens. Chaque boucle externe n'a été ajoutée qu'une fois celle du dessous stabilisée.",
          },
        ],
        retrospective:
          "J'instrumenterais la boucle dès le premier jour plutôt qu'au premier crash : enregistrer l'estimation d'attitude et les commandes moteur pour les relire ensuite a transformé le réglage en lecture de courbes, et je m'y suis mis trop tard.",
      },

      'drone-controller': {
        title: 'Radiocommande du drone',
        summary:
          'Une radiocommande pour le quadricoptère, conçue et imprimée en 3D — boîtier, manches, électronique et firmware.',
        tags: ['Projet personnel', 'Design industriel', 'Impression 3D', 'Systèmes embarqués'],
        role: 'Conception et réalisation en solo',
        problem:
          "Le quadricoptère avait besoin de quelque chose pour le piloter. Une radiocommande se tient pendant tout le vol : le point dur n'est pas la liaison radio, mais le fait que la forme, le toucher des manches et l'implantation décident si l'appareil est réellement pilotable.",
        constraints: [
          'Boîtier modélisé en CAO et imprimé sur une imprimante FDM',
          "Volume d'impression et adhérence des couches imposant la taille des pièces et la place des jonctions",
          'Autonomie suffisante pour une session de vol complète',
          'Latence des manches assez basse pour ne pas se sentir',
        ],
        decisions: [
          {
            title: 'Dessiner autour des mains, puis loger l’électronique',
            body: "L'angle de préhension et l'écartement des manches ont été modélisés et imprimés avant de figer l'implantation de la carte : l'intérieur devait entrer dans la forme, et non la forme grandir autour d'un PCB. Tenir une coque imprimée reste le seul moyen de découvrir qu'elle est mauvaise.",
          },
          {
            title: 'Imprimer en plusieurs pièces avec écrous prisonniers',
            body: "Une coque monobloc aurait exigé des supports en travers de la poignée et laissé un mauvais état de surface exactement là où on la tient. Découper le boîtier a placé les jonctions hors des mains et rendu chaque pièce interne démontable sans rien couper.",
          },
          {
            title: 'Émettre la position des manches à cadence fixe',
            body: "Un flux régulier de petits paquets fait d'un paquet perdu une mise à jour manquée plutôt qu'une commande perdue, et donne à l'appareil un signal clair pour détecter la coupure de liaison.",
          },
        ],
        retrospective:
          "J'ai itéré bien plus sur le boîtier que sur l'électronique, et chaque itération coûtait des heures d'impression. N'imprimer d'abord que la poignée comme pièce d'essai m'aurait amené à la bonne forme pour une fraction du filament.",
      },

      cbienla: {
        title: 'Cbienlà.fr',
        summary: "Plateforme d'annonces immobilières : application Flutter et site Nuxt.js sur Firebase.",
        tags: ['Entrepreneuriat', 'Flutter', 'Firebase', 'Nuxt.js'],
        role: 'Cofondateur et ingénieur logiciel',
        problem:
          "Une plateforme d'annonces a besoin de deux interfaces qui ne se contredisent jamais : une application mobile pour parcourir, et un site public que les moteurs de recherche peuvent lire. Les deux décrivent les mêmes biens ; la difficulté est d'avoir une seule source de vérité plutôt que deux bases de code qui divergent.",
        constraints: [
          'Deux cofondateurs : le coût de construction devait rester proche de zéro au lancement',
          "Les annonces doivent être indexables — une application seule serait invisible pour la recherche",
          'Un même modèle de données pour le site et l’application',
        ],
        decisions: [
          {
            title: 'Firebase plutôt qu’un serveur que nous administrons',
            body: "À ce stade, la ressource rare est notre temps, pas la puissance de calcul. L'authentification, le stockage et les fonctions managés ont supprimé une catégorie entière de travail — et la courbe de coût ne devient un problème qu'à un volume qui serait un bon problème à avoir.",
          },
          {
            title: 'Nuxt pour le site public, Flutter pour l’application',
            body: "Les deux surfaces ont des rôles réellement différents. Nuxt rend les annonces côté serveur pour qu'elles soient indexées et partageables ; Flutter donne une seule base de code mobile pour les deux plateformes. Séparer selon l'usage valait mieux que forcer une technologie unique.",
          },
          {
            title: 'Partir de ce qu’une tentative précédente m’avait appris',
            body: "J'avais déjà construit seul une marketplace immobilière et livré des fonctionnalités avant d'avoir compris le problème de marketplace en dessous. Cbienlà est parti du modèle d'annonce plutôt que des écrans, ce qui en découle directement.",
          },
        ],
        retrospective:
          "Le modèle de données restait dessiné autour du premier écran construit plutôt qu'autour des requêtes dont nous aurions besoin, et le remodeler ensuite a coûté plus cher que de le concevoir dès le départ.",
      },

      'robotic-arm': {
        title: 'Bras robotisé',
        summary: 'Bras robotisé motorisé, piloté depuis une application mobile.',
        tags: ['Projet personnel', 'Robotique'],
        role: 'Conception et réalisation en solo',
        problem:
          "Piloter un bras à plusieurs articulations depuis un téléphone, c'est faire partir une commande d'un écran tactile pour qu'elle arrive en mouvement coordonné sur plusieurs moteurs — via une liaison ni assez rapide ni assez fiable pour qu'on lui confie les détails.",
        constraints: [
          'Liaison sans fil à latence variable et coupures réelles',
          'Plusieurs articulations devant bouger ensemble pour être utiles',
          'Le bras doit se mettre en sécurité quand la liaison disparaît',
        ],
        decisions: [
          {
            title: 'Transmettre une intention, pas des positions moteur',
            body: "Le téléphone indique où le bras doit aller ; le firmware décide comment y aller. Le mouvement reste fluide quand les paquets arrivent en retard, et un message perdu retarde un déplacement au lieu d'en corrompre un.",
          },
          {
            title: 'Maintenir la position à la perte de liaison',
            body: "L'état sûr d'un bras qui tient quelque chose n'est pas de le lâcher. Perdre la connexion arrête les nouvelles commandes, pas le bras.",
          },
        ],
        retrospective:
          "J'avais mis la cinématique inverse dans l'application avant de la déplacer dans le firmware. Sa place était sur la carte dès le début — l'application n'aurait jamais dû décrire que la destination.",
      },
    },
  },

  experience: {
    eyebrow: '04 — Expérience',
    title: 'Expérience',
    description: 'Cinq postes depuis 2021. La sphère les dresse en colonne.',
    roles: {
      cbienla: 'Cofondateur & ingénieur logiciel',
      nagarro: 'Consultant en ingénierie logicielle',
      facix: "Responsable de l'équipe mobile",
      epitech: 'Assistant pédagogique, développement web',
      ale: 'Ingénieur QA, stage',
    },
  },

  education: {
    eyebrow: '05 — Formation',
    title: 'Formation',
    description: "Cinq années d'ingénierie logicielle, dont une à l'étranger.",
    degrees: {
      epitech: 'Master, ingénierie logicielle',
      hft: 'Technologies logicielles, échange Erasmus',
    },
  },

  contact: {
    eyebrow: '06 — Contact',
    title: 'Me contacter',
    description: 'Ouvert à des postes en CDI : backend, web, mobile ou embarqué.',
    downloadCv: 'Télécharger le CV',
  },

  captions: {
    hero: [
      'Backend, web, mobile et systèmes cloud.',
      'Basé à Niort, en France.',
      "Master en ingénierie logicielle, EPITECH Strasbourg.",
    ],
    about: ["Un point sur cette Terre est Niort, où je travaille."],
    skills: ["Quatre couronnes, une par domaine que je pratique."],
    projects: ['Chaque amas est un projet que vous pouvez ouvrir.'],
    experience: ['La colonne bat une fois par poste.'],
    education: ['Deux couches, cinq années, un échange.'],
    contact: ['La sphère se reforme — même forme, six sections plus tard.'],
  },

  footerNote: 'Portfolio conçu comme une démonstration vivante du design system KOEBELT.',

  notFound: {
    eyebrow: '404',
    title: "Cette page n'existe pas.",
    back: 'Retour au portfolio',
  },
}
