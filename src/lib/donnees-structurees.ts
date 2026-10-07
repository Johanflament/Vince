import { faqs } from "@/lib/faq";
import { VIDEO_CLOSE_UP, VIDEO_SPECTACLE_SCENE } from "@/lib/medias";

/**
 * LES DONNÉES STRUCTURÉES (JSON-LD) DE LA PAGE D'ACCUEIL.
 *
 * Elles sont injectées par `src/routes/__root.tsx`, dans le tableau `meta` de
 * son `head()`, via l'entrée `"script:ld+json"` que TanStack Router sait rendre
 * en `<script type="application/ld+json">` côté serveur.
 *
 * ── CE QU'IL FAUT COMPRENDRE AVANT D'Y TOUCHER ──────────────────────────────
 *
 * Un JSON-LD n'est pas de la décoration technique : c'est une SUITE
 * D'AFFIRMATIONS que Google lit comme si l'artiste les signait. Une ligne
 * ajoutée ici « parce que ça fait plus complet » est une déclaration, et une
 * déclaration fausse se paie — au mieux par la perte des résultats enrichis,
 * au pire, pour une note ou un avis, par une pratique commerciale trompeuse
 * (art. L121-2 du code de la consommation).
 *
 * D'où la règle de ce fichier : ON NE DÉCLARE QUE CE QUE LE SITE DIT DÉJÀ, et
 * qu'on peut retrouver dans le dépôt. Ce qui manque reste manquant. Les
 * absences volontaires sont listées plus bas, avec leur raison : ne pas les
 * « compléter » sans la donnée réelle.
 *
 * ── POURQUOI `Person` + `Service`, ET SURTOUT PAS `LocalBusiness` ───────────
 *
 * `LocalBusiness` est le type réflexe pour un artiste, et c'est le mauvais ici.
 * Il décrit un ÉTABLISSEMENT : un lieu où le client se rend, dont l'adresse est
 * la propriété centrale — `address` est d'ailleurs obligatoire dans les
 * consignes de Google pour ce type. Or Vince n'a pas d'établissement, et son
 * adresse postale est « à compléter » dans les mentions légales : le déclarer
 * `LocalBusiness` obligerait soit à inventer une adresse, soit à publier un
 * type amputé de sa propriété la plus importante. Les sous-types
 * `ProfessionalService` et `EntertainmentBusiness` héritent du même problème,
 * puisqu'ils héritent de `LocalBusiness`.
 *
 * `Person` est au contraire exact sur les deux plans. Sur le fond : un magicien
 * itinérant est une personne qui se déplace, pas un commerce où l'on entre. Sur
 * la forme juridique : les mentions légales déclarent « Vince — magicien,
 * entrepreneur individuel », et une entreprise individuelle n'a pas de
 * personnalité morale distincte de l'artiste. La personne EST l'entreprise.
 * Ajouter en plus un nœud `Organization` pour « Magic Vince » créerait une
 * seconde entité sans existence légale (ni SIRET, ni adresse) et diviserait les
 * signaux entre deux fiches concurrentes.
 *
 * `PerformingGroup` a été écarté pour la même raison inverse : c'est un
 * sous-type d'`Organization`, fait pour une troupe. Vince est seul en scène.
 *
 * Ce que `Person` ne sait pas porter — l'offre commerciale et la zone
 * d'intervention —, deux nœuds `Service` le portent : un par format de la page
 * (`#close-up`, `#spectacles`), chacun avec son `provider` qui renvoie à la
 * personne. `Service` n'exige aucune adresse, c'est précisément le type prévu
 * pour une prestation qui se déplace.
 *
 * ── CE QUI N'EST VOLONTAIREMENT PAS DÉCLARÉ ─────────────────────────────────
 *
 * ⚠️ AUCUN `Review` NI `aggregateRating`. Le bloc `reviews` de
 * `HomeEditorialSections.tsx` contient les avis Google réels du PRÉCÉDENT
 * artiste, dont seul le nom du magicien a été changé. Les afficher est déjà
 * discutable ; les déclarer en JSON-LD les transformerait en avis machinables,
 * attribués nominativement à des clients qui ne sont pas les siens, avec une
 * note à la clé. C'est l'interdiction la plus ferme de ce fichier, et elle
 * tient même quand les vrais avis de Vince seront en place : il faudra alors
 * les recueillir depuis leur source (Google), pas les recopier du site.
 *
 * ⚠️ PAS D'`address`, PAS DE `geo`, PAS D'`openingHoursSpecification`. L'adresse
 * n'existe pas dans le dépôt (mentions légales : « à compléter »). Les horaires
 * « Lun-Ven, 10h-19h » de la carte de contact sont une disponibilité
 * téléphonique, pas les heures d'ouverture d'un lieu.
 *
 * `image` DÉCLARE `og-vince.jpg`, et seulement depuis qu'elle montre Vince.
 * Ce fichier a longtemps été la photo de partage du précédent artiste, héritée
 * de la copie du site : la déclarer comme portrait de Vince aurait été faux au
 * sens le plus littéral. Elle a été refaite depuis un vrai cliché de lui, ce
 * qui débloque cette propriété. C'est la seule image du site à porter une URL
 * absolue — les autres passent par Vite et leur nom contient une empreinte qui
 * change à chaque build, donc aucune ne peut être déclarée ici.
 *
 * ⚠️ PAS DE PRIX. Aucun tarif ne figure sur le site, donc les `Offer` des
 * catalogues n'en portent pas. Un `priceRange` inventé, même approximatif,
 * engage l'artiste sur une somme.
 *
 * ⚠️ `areaServed` VAUT ENCORE « France », ET RIEN DE PLUS PRÉCIS — mais plus
 * pour la raison d'origine. Le dépôt se contredisait sur la géographie : le
 * titre, la description, les mentions légales, le pied de page et une réponse
 * de FAQ situaient Vince en PICARDIE, tandis que sa biographie le situait à
 * TOURS (installation en 2003, Groupement régional des Magiciens de Touraine).
 * Déclarer une région en JSON-LD, c'est en faire une affirmation lisible par
 * machine, et « France » était la seule géographie sur laquelle toutes les
 * sources s'accordaient.
 *
 * ✅ VINCE A TRANCHÉ POUR LA PICARDIE en réécrivant sa biographie. Le blocage
 * est donc levé, et c'est ce qui a fait passer à `true` la réponse de FAQ sur
 * les déplacements (`faq.ts`).
 *
 * ⚠️ MAIS « France » EST MAINTENANT UN CHOIX, PLUS UNE ABSTENTION. La question
 * a été posée — « Picardie » (ancienne région, mais le mot qu'emploie tout le
 * site), « Hauts-de-France » (la région administrative actuelle), les trois
 * départements que nomme la FAQ, ou le statu quo — et « France » a été retenu
 * sciemment. Ne pas « compléter » cette propriété en croyant qu'elle attend
 * encore un arbitrage : le gain de référencement local a été mis en balance et
 * écarté. La reposer, oui ; la trancher seul, non.
 *
 * Trois clients du bandeau restent de Touraine et du Loir-et-Cher (Crédit
 * Agricole Touraine, Aquarium de Touraine, Maison de la Magie de Blois), et la
 * liste des distinctions garde le G.R.M.T. Ce ne sont plus des contradictions :
 * un artiste installé en Picardie garde les prix et les clients d'avant.
 */

/*
 * ── LES COORDONNÉES ─────────────────────────────────────────────────────────
 * Recopiées depuis `ContactSection.tsx` et `SiteFooter.tsx`, où elles sont
 * écrites en dur dans le JSX. Le téléphone est en format E.164 (`+33…`), le
 * seul que schema.org attend — c'est d'ailleurs déjà la forme du `href="tel:"`
 * du site, et non le « 06 70 01 82 41 » affiché.
 */
const TELEPHONE = "+33670018241";
const EMAIL = "contact@magicvince.com";
const FACEBOOK = "https://www.facebook.com/magicvince.magicvince";
const YOUTUBE = "https://www.youtube.com/@vincentzaragoza2415";

/*
 * ── LA FAQ ──────────────────────────────────────────────────────────────────
 *
 * ⚠️ LES TEXTES NE SONT PAS RECOPIÉS ICI : ils viennent de `src/lib/faq.ts`,
 * la MÊME liste que celle qu'affiche la page. Google exige que le texte d'un
 * `FAQPage` soit IDENTIQUE à celui affiché ; une réponse retouchée d'un côté
 * et pas de l'autre ferait mentir la déclaration sans qu'aucune erreur ne le
 * signale. Ils ont vécu un temps en double — ne pas y revenir.
 *
 * ⚠️ TROIS QUESTIONS SUR SIX, et la sélection est une DONNÉE, pas un choix
 * refait ici : c'est le champ `structuree` de chaque entrée qui tranche, et
 * l'en-tête de `faq.ts` dit pourquoi chacune des trois écartées l'est — une
 * pour la contradiction géographique non résolue, deux pour des réponses que
 * Vince n'a pas encore validées. En repasser une à `true` suffit à la faire
 * entrer ici, sans rien modifier dans ce fichier.
 */
const questionsFrequentes = faqs.filter((q) => q.structuree);

/*
 * ── LES DEUX BANDES-ANNONCES ────────────────────────────────────────────────
 *
 * Les URL viennent de `src/lib/medias.ts` — jamais recopiées, c'est tout
 * l'objet de ce module.
 *
 * ⚠️ LES DURÉES SONT MESURÉES, pas estimées : `ffprobe` sur les fichiers de
 * `src/assets/`, dont la taille en octets correspond exactement à celle relevée
 * sur le bucket R2 dans `medias.ts` (30 841 239 et 13 670 400 octets, soit
 * 29,4 et 13,0 Mio) — ce sont donc bien les mêmes fichiers que ceux servis.
 * Relevé : 93,93 s et 83,62 s, arrondis à la seconde. À remesurer si une
 * bande-annonce est réencodée.
 *
 * ⚠️ NI `thumbnailUrl` NI `uploadDate`, et ce sont les deux propriétés que
 * Google exige pour un résultat enrichi vidéo. Aucune des deux n'existe dans le
 * dépôt : les bandes-annonces sont ouvertes en plein écran sans affiche (le
 * champ `affiche` de `DemandeVideo` n'est pas renseigné), et rien ne date leur
 * mise en ligne. Les fabriquer serait inventer — une photo de studio n'est pas
 * une image de la vidéo, et une date de publication est une date. Ces deux
 * `VideoObject` sont donc exacts mais incomplets : ils décrivent les vidéos
 * pour les moteurs sans prétendre à la vignette dans les résultats. Compléter
 * le jour où une affiche sera produite et la date connue.
 *
 * `AMBIANCE` est absente de cette liste, volontairement : cette vidéo ne joue
 * que sur d'anciennes variantes de travail, jamais sur `/`. La déclarer
 * ici affirmerait que la page d'accueil contient une vidéo qu'elle ne contient
 * pas.
 */
const videos = [
  {
    "@type": "VideoObject",
    // Même intitulé que le `titre` passé au lecteur plein écran dans
    // `HomeEditorialSections.tsx` : c'est le nom sous lequel la vidéo est
    // annoncée au visiteur, donc celui qu'il faut déclarer.
    name: "Bande-annonce du close-up de Vince",
    description:
      "Bande-annonce du close-up : magie de proximité au milieu des invités, cartes, pièces et objets prêtés.",
    contentUrl: VIDEO_CLOSE_UP,
    encodingFormat: "video/mp4",
    duration: "PT1M34S",
    inLanguage: "fr-FR",
  },
  {
    "@type": "VideoObject",
    name: "Bande-annonce du spectacle de scène de Vince",
    description:
      "Bande-annonce du spectacle de scène : magie et humour devant une salle, public familial comme adulte.",
    contentUrl: VIDEO_SPECTACLE_SCENE,
    encodingFormat: "video/mp4",
    duration: "PT1M24S",
    inLanguage: "fr-FR",
  },
];

/** Un catalogue de formats, réduit à des noms : le site n'affiche aucun prix. */
function catalogue(nom: string, formats: Array<string>) {
  return {
    "@type": "OfferCatalog",
    name: nom,
    itemListElement: formats.map((format) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: format },
    })),
  };
}

/**
 * Le graphe JSON-LD de la page d'accueil.
 *
 * `siteUrl`, `titre` et `description` sont PASSÉS EN PARAMÈTRES et non recopiés
 * ici : ils vivent en tête de `__root.tsx`, où `SITE_URL` est documenté comme le
 * seul endroit à corriger le jour d'un vrai nom de domaine. Les dupliquer ici
 * aurait créé un second endroit à ne pas oublier — et le graphe entier repose
 * sur cette adresse, puisqu'elle sert d'identifiant à chacun de ses nœuds.
 *
 * ⚠️ LA MÊME MISE EN GARDE QUE POUR OPEN GRAPH VAUT ICI : tant que `SITE_URL`
 * est une supposition, ce graphe décrit un site à une adresse qui n'existe
 * peut-être pas. Rien ne le signalera.
 *
 * UN SEUL GRAPHE ET NON PLUSIEURS BLOCS : les nœuds se référencent par `@id`
 * (`#vince`, `#site`), ce qui évite de répéter la personne dans chaque service
 * et dit à Google que c'est bien la MÊME entité partout. Écrits en scripts
 * séparés, les nœuds resteraient liés, mais un `@id` par bloc devient vite une
 * occasion de se tromper d'ancre.
 */
export function donneesStructureesAccueil({
  siteUrl,
  titre,
  description,
}: {
  siteUrl: string;
  titre: string;
  description: string;
}) {
  const accueil = `${siteUrl}/`;
  const idPersonne = `${accueil}#vince`;
  const idSite = `${accueil}#site`;

  // La zone d'intervention, partagée par les deux services. Voir la mise en
  // garde en tête de fichier : « France » est la seule géographie sur laquelle
  // le dépôt ne se contredit pas.
  const zone = { "@type": "Country", name: "France" };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": idPersonne,
        name: "Vince",
        // Le nom de scène. C'est sous celui-ci que le public cherche, et c'est
        // lui que porte `og:site_name` — mais l'artiste, lui, s'appelle Vince.
        alternateName: "Magic Vince",
        jobTitle: "Magicien",
        description:
          "Magicien illusionniste professionnel : close-up au milieu des invités et spectacle de magie pour enfants sur scène.",
        url: accueil,
        image: `${siteUrl}/og-vince.jpg`,
        email: EMAIL,
        telephone: TELEPHONE,
        // `sameAs` sert à relier la fiche du site aux comptes officiels. Les
        // deux seuls du dépôt, et aucun autre : un profil supposé relierait la
        // fiche à quelqu'un d'autre.
        sameAs: [FACEBOOK, YOUTUBE],
        knowsAbout: [
          "Close-up",
          "Magie de proximité",
          "Spectacle de magie sur scène",
          "Sculpture de ballons",
        ],
        // Repris mot pour mot de la liste `distinctions` de la biographie.
        // Trois concours, trois années : c'est ce que le texte fourni par
        // Vince affirme, rien de plus.
        award: [
          "1er prix Les Gobelets d’or 2009",
          "1er prix concours G.R.M.T 2011",
          "1er prix concours G.R.M.T 2012",
        ],
        // ⚠️ Les deux affiliations de la biographie. Le G.R.M.T est un
        // groupement de TOURAINE : cette ligne est donc, en creux, la trace de
        // la contradiction géographique du dépôt. Elle est conservée parce
        // qu'elle relate une affiliation, pas une zone d'intervention — et
        // parce que c'est Vince qui l'affirme dans sa propre biographie. Pas
        // d'`url` sur ces deux organisations : le dépôt n'en donne aucune.
        memberOf: [
          {
            "@type": "Organization",
            name: "Fédération Française des Artistes Prestidigitateurs",
            alternateName: "F.F.A.P.",
          },
          {
            "@type": "Organization",
            name: "Groupement régional des Magiciens de Touraine",
            alternateName: "G.R.M.T",
          },
        ],
      },

      {
        "@type": "WebSite",
        "@id": idSite,
        url: accueil,
        name: "Magic Vince",
        inLanguage: "fr-FR",
        publisher: { "@id": idPersonne },
        // Pas de `potentialAction: SearchAction` : le site n'a pas de moteur de
        // recherche interne. En déclarer un ferait promettre à Google une URL
        // de recherche qui répondrait 404.
      },

      {
        /*
         * ⚠️ DEUX TYPES SUR LE MÊME NŒUD, et c'est voulu : c'est la page
         * d'accueil (`WebPage`) ET elle porte une foire aux questions
         * (`FAQPage`). Déclarer le `FAQPage` sur un nœud séparé aurait demandé
         * une seconde URL pour l'identifier, alors qu'il n'y en a qu'une — le
         * site tient sur une page.
         *
         * À savoir avant d'en attendre quelque chose : depuis 2023, Google
         * réserve l'AFFICHAGE des questions dans ses résultats aux sites
         * institutionnels et de santé. Ce balisage ne fera donc pas apparaître
         * d'accordéon dans la page de résultats ; il reste utile pour la
         * compréhension du site par les moteurs et les assistants, et c'est à
         * ce titre seul qu'il est là.
         */
        "@type": ["WebPage", "FAQPage"],
        "@id": `${accueil}#accueil`,
        url: accueil,
        name: titre,
        // Même texte que la balise `<meta name="description">`, pour la même
        // raison qu'ailleurs : deux descriptions divergentes du même objet
        // n'aident personne.
        description,
        inLanguage: "fr-FR",
        isPartOf: { "@id": idSite },
        // `about` et non `mainEntity` : `mainEntity` est déjà pris par les
        // questions, que le type `FAQPage` y attend.
        about: { "@id": idPersonne },
        mainEntity: questionsFrequentes.map(({ question, reponse }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: reponse },
        })),
        video: videos,
      },

      {
        "@type": "Service",
        "@id": `${accueil}#close-up`,
        // L'ancre existe réellement : c'est l'`id` de la section de format.
        url: `${accueil}#close-up`,
        name: "Close-up",
        // Le synonyme que le public emploie, et déjà le sur-titre de la section.
        alternateName: "Magie de proximité",
        serviceType: "Magicien close-up",
        description:
          "Magie à quelques centimètres des spectateurs, d’un groupe à l’autre : cartes, pièces, montres et objets prêtés par les invités, le temps d’un cocktail ou d’un dîner.",
        provider: { "@id": idPersonne },
        areaServed: zone,
        // Reprise de la ligne « Public » de la fiche pratique de la section.
        audience: { "@type": "Audience", audienceType: "Particuliers, entreprises, écoles" },
        hasOfferCatalog: catalogue("Les formats du close-up", [
          "Cocktail & vin d’honneur",
          "Table à table",
          "Déambulation",
          "Soirée privée",
        ]),
      },

      {
        "@type": "Service",
        "@id": `${accueil}#spectacles`,
        url: `${accueil}#spectacles`,
        name: "Spectacles de scène",
        serviceType: "Spectacle de magie sur scène",
        description:
          "Spectacle de magie et d’humour sur scène, de 30 minutes à 1 h 15 : version familiale dès cinq ans, ou version tout public adulte.",
        provider: { "@id": idPersonne },
        areaServed: zone,
        // ⚠️ `suggestedMinAge` EST UNE DÉCLARATION, pas une estimation : il doit
        // valoir exactement l'âge écrit sur la page, qui l'affirme à trois
        // endroits — « à partir de l'âge de 5 ans » dans le texte de la
        // section, « Familial dès cinq ans » dans sa fiche, et une réponse de
        // la FAQ. Le site a dit trois pendant un temps ; Vince a tranché pour
        // cinq et les quatre endroits ont été alignés le même jour.
        //
        // Pas de `suggestedMaxAge` : le site dit l'inverse d'une borne haute,
        // puisque le même spectacle existe en version tout public adulte.
        audience: { "@type": "PeopleAudience", suggestedMinAge: 5 },
        hasOfferCatalog: catalogue("Les formats du spectacle", [
          "Anniversaire à domicile",
          "Arbre de Noël",
          "Écoles & centres de loisirs",
        ]),
      },
    ],
  };
}
