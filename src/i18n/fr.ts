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
    badge: "Disponible pour un nouveau poste",
    name: 'Thomas Koebel',
    statement: 'Ingénieur logiciel',
    lede: "Backend, web, mobile et embarqué. Diplômé d'un master en ingénierie logicielle d'EPITECH Strasbourg, installé à Niort. J'ai cofondé Facix puis Cbienlà, et quand un problème l'exige, je conçois aussi le matériel.",
    cta: 'Voir les projets',
    scroll: 'Défiler',
  },

  about: {
    eyebrow: '01 / Profil',
    title: 'Profil',
    body: "Ingénieur logiciel, je travaille surtout sur le backend, le web et le mobile, avec un pied dans l'embarqué né de mes propres projets matériels. J'ai cofondé deux entreprises, été consultant chez Nagarro et encadré des étudiants en développement web à EPITECH : j'ai vu un projet depuis la place de celui qui le conçoit, de celui qui l'implémente et de celui qui le relit. Ce qui compte pour moi : comprendre le problème avant de choisir l'outil, et garder un système assez simple pour que la personne suivante puisse encore le faire évoluer.",
    languagesLabel: 'Langues',
    softSkillsLabel: 'Qualités',
    languages: ['Français (langue maternelle)', 'Anglais (TOEIC 860)', 'Allemand (A2)'],
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
    eyebrow: '02 / Compétences',
    title: 'Compétences techniques',
    description: "Trois projets matériels menés seul, du choix des composants au firmware, et une entreprise cofondée. Chaque étude de cas détaille le problème, les contraintes, les décisions qui ont compté et ce que je ferais autrement.",
    levelLabel: 'À quel point je l’utilise',
    close: 'Fermer',
    languagesNote: "Pas un domaine en soi : tous les projets ci-dessous sont écrits dans ces langages.",
    ai: {
      label: 'À propos de l’IA',
      paragraphs: [
        'J’ai appris à programmer avant que les assistants IA ne fassent partie du métier. Pendant la quasi-totalité de mes études, ils n’existaient pas ou je ne les utilisais pas : chaque algorithme, chaque bug et chaque choix de conception, je les ai résolus moi-même. C’est de là que vient mon jugement, et je considère que c’est ce que ces années m’ont apporté de plus précieux.',
        'Depuis, je me suis volontairement formé au développement assisté par IA et au développement agentique, parce que le gain de productivité est réel. J’écris du code avec eux, de l’exploration d’une base de code inconnue à l’implémentation de fonctionnalités entières, et je suis à l’aise dans les équipes qui l’attendent.',
        'Je ne fais pas de « vibe coding ». Je ne peux pas faire confiance à du code que je ne comprends pas : rien de ce que je pousse n’échappe à ma relecture, chaque ligne est lue, comprise et assumée. Les outils me rendent plus rapide ; la responsabilité de ce qui part en production reste la mienne.',
      ],
    },
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
      bash: "Depuis EPITECH",
      sql: "En production, chez Nagarro",
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
      c: "Appris à EPITECH, où ils forment le socle du cursus, puis utilisés pour tout le matériel que j'ai construit : le firmware du quadricoptère, sa radiocommande et le bras robotisé sont écrits en C et C++, sans système d'exploitation. Une boucle d'attitude impose de maîtriser la durée de chaque itération ; c'est là que j'ai appris à lire ce que produit réellement le compilateur au lieu de lui faire confiance.",
      ts: "Le socle de tous mes projets web, d'EPITECH à aujourd'hui. Ce portfolio est écrit en TypeScript, moteur WebGL compris, et le typage y sert vraiment : les uniforms de shader et l'agencement des buffers sont précisément ce qu'un compilateur doit vérifier.",
      python: "Mis en production chez Nagarro et chez ALE Enterprise : au-delà du script, je l'ai fait tourner au sein d'un vrai système, avec les questions de déploiement et d'exploitation que cela suppose. Il reste mon premier réflexe quand un outil doit exister avant la fin de la journée.",
      bash: "Découvert avec la partie Unix du cursus EPITECH, utilisé depuis sur toutes mes machines Arch et Debian. Il relie tout le reste : scripts de build et de déploiement, entrypoints Docker, et ces petites automatisations qui évitent de retaper sans cesse les mêmes commandes.",
      sql: "Appris à la HFT Stuttgart, puis au centre de plusieurs projets chez Nagarro, où tout reposait sur le modèle de données. Mes produits récents tournent sur Firestore, et c'est justement parce que je sais ce que garantit une base relationnelle que je sais ce qu'une base documentaire ne garantit pas.",
      dart: "Adopté avec le mobile chez Facix, c'est aujourd'hui le langage de l'application Cbienlà, que j'écris et maintiens au quotidien depuis 2025. La null safety et le modèle d'isolates sont les aspects qui m'ont demandé le plus de réflexion.",
      haskell: "Étudié à EPITECH, jamais mis en production. Je le garde dans la liste pour ce qu'il m'a appris sur les types, les fonctions totales et la pureté, que je retrouve chaque jour dans mon TypeScript, et non pour me présenter comme développeur Haskell.",
      rust: "Projets personnels et lectures, sans mise en production. Son modèle d'ownership a changé ma manière de raisonner sur la durée de vie des objets en C++, et c'est pour l'instant l'essentiel de ce qu'il m'a apporté.",
      java: "Appris pendant mon échange Erasmus à la HFT Stuttgart, pratiqué depuis. Je lis et fais évoluer une base de code Java sans difficulté ; pour en concevoir une de zéro, il me faudrait un temps de remise à niveau.",
      node: "Avec JavaScript et TypeScript, le cœur de mon travail web depuis EPITECH : backends, outillage, Cloud Functions. L'essentiel de ce que j'y ai appris tient à la boucle d'événements : ce qui la bloque, et ce que cela coûte en latence sous charge.",
      react: "Mon framework front-end principal depuis Facix, et celui avec lequel j'ai le plus construit. Ce site est en React, mais la sphère reste volontairement à l'écart : le moteur gère sa propre boucle et ne déclenche jamais de rendu, car 60 images par seconde et réconciliation font mauvais ménage.",
      vue: "Le modèle réactif du site Nuxt de Cbienlà. Venant de React, l'essentiel a été de repérer ce que le framework prend en charge à ma place.",
      nuxt: "Il sert la partie publique de Cbienlà. Choisi pour le rendu côté serveur : une annonce que les moteurs de recherche ne lisent pas est une annonce que personne ne trouve.",
      angular: "Mon premier framework front-end en entreprise, chez ALE Enterprise. L'injection de dépendances et RxJS m'ont demandé un temps d'adaptation ; c'est aujourd'hui celui sur lequel j'aurais le plus besoin de me remettre à niveau.",
      spring: "Pratiqué lui aussi à la HFT Stuttgart, où j'ai développé des services JVM. Solide sur les fondamentaux (contrôleurs, injection de dépendances, persistance), mais je ne l'ai pas exploité assez longtemps en production pour avoir un avis sur son optimisation.",
      'react-native': "Mon entrée dans le mobile, chez Facix. C'est là que j'ai mesuré ce que coûte un framework multiplateforme à la frontière du natif, et c'est ce coût qui décide si le choix était le bon.",
      flutter: "Mon outil mobile depuis Facix, et aujourd'hui celui de l'application Cbienlà. J'y ai conçu et livré écrans, gestion d'état et intégrations natives, sans esquiver les parties ingrates : liens profonds, état en arrière-plan et validation sur les stores.",
      aws: "Découvert chez Facix, utilisé depuis. Je sais y déployer et anticiper ce que coûtera une architecture ; en revanche, je n'ai jamais conçu l'organisation des comptes d'une équipe.",
      gcp: "L'infrastructure de Cbienlà, via Firebase. Console, comptes de service, quotas : je les connais bien, surtout pour m'y être heurté.",
      firebase: "Auth, Firestore, Storage et Cloud Functions en production pour Cbienlà. Je le connais assez pour en voir les limites : les requêtes entre collections, et une facture qui suit le nombre de lectures plutôt que le volume de données.",
      docker: "Ma façon de livrer et de garantir des environnements identiques d'une machine à l'autre. À l'aise avec les builds multi-étapes et la composition de services ; je n'ai pas opéré d'orchestrateur à grande échelle.",
      linux: "Arch sur mon poste, Debian sur les serveurs. Utiliser Arch au quotidien m'a rendu à l'aise avec systemd, la séquence de démarrage et le système de fichiers : on finit par les apprendre, qu'on le veuille ou non.",
    },
  },

  projects: {
    eyebrow: '03 / Projets',
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
          "Un quadricoptère conçu de bout en bout : choix des composants, conception du PCB, assemblage et firmware de stabilisation.",
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
            body: "Un contrôleur du commerce aurait volé plus tôt, mais l'objectif était de comprendre toute la chaîne : alimentation, mesure, actionnement, et la boucle qui les relie. Concevoir le PCB a obligé à expliciter chacune de ces décisions.",
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
          'Une radiocommande pour le quadricoptère, conçue et imprimée en 3D : boîtier, manches, électronique et firmware.',
        tags: ['Projet personnel', 'Design industriel', 'Impression 3D', 'Systèmes embarqués'],
        role: 'Conception et réalisation en solo',
        problem:
          "Il fallait de quoi piloter le quadricoptère. Une radiocommande reste en main pendant tout le vol : la difficulté n'est pas la liaison radio, mais la forme, la sensation des manches et leur disposition, qui décident si l'appareil est réellement pilotable.",
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
        summary: "Plateforme d'annonces immobilières cofondée en 2025 : une application Flutter et un site Nuxt.js, adossés à Firebase.",
        tags: ['Entrepreneuriat', 'Flutter', 'Firebase', 'Nuxt.js'],
        role: 'Cofondateur et ingénieur logiciel',
        problem:
          "Une plateforme d'annonces a besoin de deux interfaces qui ne se contredisent jamais : une application mobile pour parcourir, et un site public que les moteurs de recherche peuvent lire. Les deux décrivent les mêmes biens ; la difficulté est d'avoir une seule source de vérité plutôt que deux bases de code qui divergent.",
        constraints: [
          'Deux cofondateurs : le coût de construction devait rester proche de zéro au lancement',
          "Les annonces doivent être indexables : une application seule serait invisible pour la recherche",
          'Un même modèle de données pour le site et l’application',
        ],
        decisions: [
          {
            title: 'Firebase plutôt qu’un serveur que nous administrons',
            body: "À ce stade, la ressource rare est notre temps, pas la puissance de calcul. L'authentification, le stockage et les fonctions managés ont supprimé une catégorie entière de travail, et leur coût ne devient un sujet qu'à un volume qui serait déjà un succès.",
          },
          {
            title: 'Nuxt pour le site public, Flutter pour l’application',
            body: "Les deux surfaces ont des rôles réellement différents. Nuxt rend les annonces côté serveur pour qu'elles soient indexées et partageables ; Flutter donne une seule base de code mobile pour les deux plateformes. Séparer selon l'usage valait mieux que forcer une technologie unique.",
          },
          {
            title: 'Régler le modèle économique avant le produit',
            body: "Avant Cbienlà, j'ai cofondé Facix, un outil de digitalisation pour les associations françaises. L'entreprise n'a jamais décollé, et la cause était le modèle économique plutôt que le logiciel. Avec Cbienlà, la façon dont l'entreprise gagne sa vie a été une question dès le premier jour, pas un sujet à traiter une fois le produit construit.",
          },
        ],
        retrospective:
          "Nous avions calqué le modèle de données sur le premier écran construit plutôt que sur les requêtes à venir, et le remanier ensuite a coûté plus cher que de bien le concevoir dès le départ.",
      },

      'robotic-arm': {
        title: 'Bras robotisé',
        summary: "Un bras robotisé piloté sans fil depuis une application mobile : le téléphone fixe la destination, le firmware calcule le mouvement.",
        tags: ['Projet personnel', 'Robotique'],
        role: 'Conception et réalisation en solo',
        problem:
          "Piloter un bras à plusieurs articulations depuis un téléphone, c'est faire partir une commande d'un écran tactile pour qu'elle arrive en mouvement coordonné sur plusieurs moteurs, via une liaison ni assez rapide ni assez fiable pour qu'on lui confie les détails.",
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
          "J'avais mis la cinématique inverse dans l'application avant de la déplacer dans le firmware. Sa place était sur la carte dès le début ; l'application n'aurait jamais dû décrire que la destination.",
      },
    },
  },

  experience: {
    eyebrow: '04 / Expérience',
    title: 'Expérience',
    description: "Cinq postes depuis 2021 : QA chez ALE Enterprise, enseignement à EPITECH, conseil chez Nagarro, et deux entreprises cofondées, Facix puis Cbienlà.",
    roles: {
      cbienla: 'Cofondateur & ingénieur logiciel',
      nagarro: 'Consultant en ingénierie logicielle',
      facix: "Cofondateur & responsable de l'équipe mobile",
      epitech: 'Assistant pédagogique, développement web',
      ale: 'Ingénieur QA, stage',
    },
  },

  education: {
    eyebrow: '05 / Formation',
    title: 'Formation',
    description: "Cinq ans à EPITECH Strasbourg, une pédagogie par projets plutôt que par cours magistraux, dont une année d'échange Erasmus à la HFT Stuttgart.",
    degrees: {
      epitech: 'Master, ingénierie logicielle',
      hft: 'Technologies logicielles, échange Erasmus',
    },
  },

  contact: {
    eyebrow: '06 / Contact',
    title: 'Me contacter',
    description: "Je cherche un poste en CDI, en backend, web, mobile ou embarqué. Le plus simple est de m'écrire directement ; le CV reprend le détail de mon parcours.",
    downloadCv: 'Télécharger le CV',
  },

  footerNote: 'Design & développement par Thomas Koebel',

  notFound: {
    eyebrow: '404',
    title: "Cette page n'existe pas.",
    back: 'Retour au portfolio',
  },
}
