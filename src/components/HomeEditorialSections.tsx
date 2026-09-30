import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Award,
  Cake,
  ChevronDown,
  Gift,
  Martini,
  Heart,
  GraduationCap,
  Home,
  Presentation,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Visionneuse, type Photo } from "@/components/Visionneuse";
import { CtaVideo, VideoPleinEcran } from "@/components/VideoPleinEcran";
import { VIDEO_CLOSE_UP, VIDEO_SPECTACLE_SCENE } from "@/lib/medias";
// ⚠️ Les questions viennent de `lib/faq.ts` et NON d'une liste locale : le même
// texte alimente le `FAQPage` des données structurées, et Google exige qu'il
// soit identique à celui affiché. Voir l'en-tête de ce fichier.
import { faqs } from "@/lib/faq";

// ─────────────────────────────────────────────────────────────────────────────
// PHOTOS. Deux fichiers par cliché, et deux seulement :
//
//   -vignette : petit côté à 560px, c'est ce que la grille affiche ;
//   -large    : grand côté à 1400px, chargé au clic par la visionneuse.
//
// AUCUN de ces fichiers n'est recadré — ils sont seulement redimensionnés. Tout
// le cadrage se fait au navigateur, par `object-cover` et par le champ
// `cadrage` (`object-position`) de chaque entrée plus bas. C'est ce qui permet
// de recadrer une photo en changeant deux nombres, sans refabriquer un fichier.
// Les anciens `-1x1`, `-4x5` et `-16x9` rognés à la fabrication ont disparu
// avec les photos du précédent artiste : ne pas les réintroduire.
//
// Les originaux pleine définition vivent dans `src/assets/photos-sources/`.
// Ce dossier n'est importé par personne, donc Vite ne l'empaquette pas — il
// n'est là que pour pouvoir régénérer les dérivés.
// ─────────────────────────────────────────────────────────────────────────────

// Image principale des trois sections par format.
// Les deux images des sections de format. Ce sont des prises de STUDIO, à
// fond clair et sujet centré — l'inverse des photos de reportage utilisées
// partout ailleurs, et c'est ce qui rend ces deux bandes graphiques : un
// panneau noir de texte qui mord dans un champ lumineux.
import closeupImg from "@/assets/photos/studio-silhouette-large.webp";
import stageImg from "@/assets/photos/studio-eventail-envol-large.webp";
import gStudioConfettisLargeImg from "@/assets/photos/studio-eventail-confettis-large.webp";

// Galerie principale.
import gStudioBrasImg from "@/assets/photos/studio-bras-ouverts-vignette.webp";
import gStudioBrasLargeImg from "@/assets/photos/studio-bras-ouverts-large.webp";
import gGalaRireImg from "@/assets/photos/closeup-gala-rire-vignette.webp";
import gGalaRireLargeImg from "@/assets/photos/closeup-gala-rire-large.webp";
import gMariagePierreImg from "@/assets/photos/closeup-mariage-mur-pierre-vignette.webp";
import gMariagePierreLargeImg from "@/assets/photos/closeup-mariage-mur-pierre-large.webp";
import gFoulardImg from "@/assets/photos/scene-foulard-bleu-vignette.webp";
import gFoulardLargeImg from "@/assets/photos/scene-foulard-bleu-large.webp";
import gEventailImg from "@/assets/photos/studio-eventail-envol-vignette.webp";
import gEventailLargeImg from "@/assets/photos/studio-eventail-envol-large.webp";
import gTableeImg from "@/assets/photos/tablee-restaurant-groupe-vignette.webp";
import gTableeLargeImg from "@/assets/photos/tablee-restaurant-groupe-large.webp";
import gParapluieImg from "@/assets/photos/spectacle-enfants-parapluie-vignette.webp";
import gParapluieLargeImg from "@/assets/photos/spectacle-enfants-parapluie-large.webp";
import gFlammeImg from "@/assets/photos/closeup-flamme-soiree-vignette.webp";
import gFlammeLargeImg from "@/assets/photos/closeup-flamme-soiree-large.webp";
import gSilhouetteImg from "@/assets/photos/studio-silhouette-vignette.webp";
import gSilhouetteLargeImg from "@/assets/photos/studio-silhouette-large.webp";
import gBarGroupeImg from "@/assets/photos/closeup-bar-groupe-vignette.webp";
import gBarGroupeLargeImg from "@/assets/photos/closeup-bar-groupe-large.webp";
import gParticipationImg from "@/assets/photos/spectacle-enfants-participation-vignette.webp";
import gParticipationLargeImg from "@/assets/photos/spectacle-enfants-participation-large.webp";
// Portrait de la section Biographie.

// ── Les douze photos ajoutées en septembre 2026, placées en tête de galerie.
// Trois viennent d'un reportage professionnel, les neuf autres de captations
// sur le vif. Voir l'avertissement au-dessus de `gallery`.
import nCloseupCocktailRireInviteeImg from "@/assets/photos/closeup-cocktail-rire-invitee-vignette.webp";
import nCloseupCocktailRireInviteeLargeImg from "@/assets/photos/closeup-cocktail-rire-invitee-large.webp";
import nCloseupCocktailPieceMainImg from "@/assets/photos/closeup-cocktail-piece-main-vignette.webp";
import nCloseupCocktailPieceMainLargeImg from "@/assets/photos/closeup-cocktail-piece-main-large.webp";
import nCloseupTableBallesRougesImg from "@/assets/photos/closeup-table-balles-rouges-vignette.webp";
import nCloseupTableBallesRougesLargeImg from "@/assets/photos/closeup-table-balles-rouges-large.webp";
import nCloseupFlammeOmbrePorteeImg from "@/assets/photos/closeup-flamme-ombre-portee-vignette.webp";
import nCloseupFlammeOmbrePorteeLargeImg from "@/assets/photos/closeup-flamme-ombre-portee-large.webp";
import nSceneCaisseLumiereRougeImg from "@/assets/photos/scene-caisse-lumiere-rouge-vignette.webp";
import nSceneCaisseLumiereRougeLargeImg from "@/assets/photos/scene-caisse-lumiere-rouge-large.webp";
import nSceneCordeRideauxRosesImg from "@/assets/photos/scene-corde-rideaux-roses-vignette.webp";
import nSceneCordeRideauxRosesLargeImg from "@/assets/photos/scene-corde-rideaux-roses-large.webp";
import nSceneSpectatriceInviteeImg from "@/assets/photos/scene-spectatrice-invitee-vignette.webp";
import nSceneSpectatriceInviteeLargeImg from "@/assets/photos/scene-spectatrice-invitee-large.webp";
import nSpectacleEnfantFoulardRougeImg from "@/assets/photos/spectacle-enfant-foulard-rouge-vignette.webp";
import nSpectacleEnfantFoulardRougeLargeImg from "@/assets/photos/spectacle-enfant-foulard-rouge-large.webp";
import nCloseupBoitesPredictionImg from "@/assets/photos/closeup-boites-prediction-vignette.webp";
import nCloseupBoitesPredictionLargeImg from "@/assets/photos/closeup-boites-prediction-large.webp";
import nSpectacleBallonGrangeImg from "@/assets/photos/spectacle-ballon-grange-vignette.webp";
import nSpectacleBallonGrangeLargeImg from "@/assets/photos/spectacle-ballon-grange-large.webp";
import nSceneSeauMicroCasqueImg from "@/assets/photos/scene-seau-micro-casque-vignette.webp";
import nSceneSeauMicroCasqueLargeImg from "@/assets/photos/scene-seau-micro-casque-large.webp";
import nSceneConfettisMicroCasqueImg from "@/assets/photos/scene-confettis-micro-casque-vignette.webp";
import nSceneConfettisMicroCasqueLargeImg from "@/assets/photos/scene-confettis-micro-casque-large.webp";
// Ajoutée après coup, insérée au milieu de la galerie et non en tête.
import nSceneCaisseBoisApparitionImg from "@/assets/photos/scene-caisse-bois-apparition-vignette.webp";
import nSceneCaisseBoisApparitionLargeImg from "@/assets/photos/scene-caisse-bois-apparition-large.webp";

// ⚠️ Portrait de la biographie. Photographié SUR FOND NOIR, et c'est ce qui
// permet son traitement — voir le commentaire du rendu.
import bioImg from "@/assets/photos/portrait-vince-pieces-large.webp";

/**
 * ⚠️ `mise` CHOISIT LA MISE EN PAGE, et les deux ne sont pas interchangeables.
 *
 *   "pleine"  : la photo occupe la section bord à bord, le texte se pose dessus
 *               et c'est un dégradé qui lui dégage la place. Demande une photo
 *               dont le sujet tient dans une moitié et qui supporte un recadrage
 *               vertical sévère — sur un écran large, une bande de 1920x780 ne
 *               montre que 60 % de la hauteur d'un cliché en 3:2.
 *   "colonne" : deux colonnes, le texte sur fond NOIR à gauche, la photo dans
 *               une colonne à droite où elle est vue EN ENTIER dans sa hauteur.
 *               C'est la seule façon de montrer un sujet qui occupe tout le
 *               cadre du haut en bas.
 *
 * `voile` n'existe que pour "pleine" : en colonne, le texte est sur du noir et
 * n'a aucun voile à demander.
 */
type Format = {
  id: string;
  mise: "pleine" | "colonne";
  texteADroite: boolean;
  filtre: string;
  voile?: string;
  surtitre: string;
  nom: string;
  accroche: string;
  video: { src: string; titre: string };
  texte: string[];
  fiche: { label: string; valeur: string }[];
  occasions: { Icone: LucideIcon; label: string }[];
  image: string;
  alt: string;
  /** Uniquement en mise "colonne" : `object-position` de la photo, mesuré. */
  cadrage?: string;
};

const formats: Format[] = [
  {
    id: "close-up",
    // MISE PLEINE. Elle convient ici parce que le sujet est une silhouette
    // centrée sur 33-66 % de la largeur et que le recadrage vertical d'une
    // bande pleine largeur ne lui prend rien d'essentiel.
    mise: "pleine",
    // Texte À DROITE : mesuré sur la photo, le sujet occupe le centre
    // (33-66 % de la largeur) et son bras tendu pointe vers la gauche. La
    // bande la plus vide est la droite — écart-type de luminance de 14 contre
    // 28 à gauche. Le panneau de texte s'y pose donc sans rien avaler de la
    // silhouette, qui est tout l'intérêt de l'image.
    texteADroite: true,
    // La photo est DÉJÀ en niveaux de gris à la source (saturation moyenne
    // mesurée à 1,3 sur 255) : `grayscale` n'y change rien et sert de garde-fou
    // si elle était un jour remplacée par une photo couleur.
    filtre: "grayscale contrast-[1.12]",
    // Voile long : le sujet est au centre et la bande la plus vide est à
    // droite, là où vit le texte. Le dégradé peut donc s'étirer sans rien
    // manger de la silhouette.
    voile: "from-background from-30% via-background/80 via-65% to-transparent",
    // ⚠️ TROIS NIVEAUX, dans cet ordre de poids : `nom` domine, `accroche` le
    // commente, `surtitre` le situe. Voir le commentaire de `FormatStory`, qui
    // explique pourquoi la hiérarchie a été inversée.
    //
    // `surtitre` ne redit PAS le nom : « En close-up » au-dessus d'un titre
    // « Close-up » aurait fait bégayer la section. Il apporte le synonyme que
    // le public emploie de son côté, et que les moteurs de recherche indexent.
    surtitre: "Magie de proximité",
    // `nom` est exactement le mot du menu : un visiteur qui clique « Close-up »
    // doit le retrouver à l'arrivée, en grand, sans quoi il se demande s'il est
    // au bon endroit. C'est aussi lui qui donne son sujet à la section pour les
    // moteurs de recherche.
    nom: "Close-up",
    accroche: "Tout se joue dans vos mains.",
    video: { src: VIDEO_CLOSE_UP, titre: "Bande-annonce du close-up de Vince" },
    // DEUX PARAGRAPHES, DEUX PUBLICS : le privé puis l'entreprise. Le texte
    // fourni par Vince sépare nettement les deux — « Soirée privée » d'un
    // côté, « Pour une soirée d'entreprise réussie » de l'autre — et c'est
    // une vraie distinction commerciale : on ne cherche pas la même chose pour
    // un mariage et pour un vernissage. Les fondre en un seul paragraphe
    // aurait fait passer l'un des deux visiteurs à côté de sa réponse.
    //
    // À LA PREMIÈRE PERSONNE, contrairement au texte reçu qui parle de Vince
    // à la troisième (« Son spectacle garantit… »). Tout le site est au « je »
    // sauf la biographie ; un magicien qui se décrit à la troisième personne
    // au milieu de ses propres pages sonne comme une plaquette.
    //
    // « à quelques centimètres de vos yeux » revient DEUX FOIS dans le texte
    // fourni, une fois par public. Gardé une seule fois : à deux paragraphes
    // d'intervalle, la formule se remarque et donne l'impression d'un copier-
    // coller entre deux fiches.
    //
    // La personnalisation — thème, couleurs, produit à mettre en avant — est
    // passée dans la FICHE plutôt qu'en fin de paragraphe, où elle se serait
    // perdue. C'est le même parti que la sculpture de ballons côté spectacles.
    texte: [
      "Mariage, anniversaire, soirée entre amis : je passe d'un groupe à l'autre et la magie se joue à quelques centimètres de vos yeux. Cartes, pièces, montres ou objets que vous me prêtez — de l'humour, de la surprise, et un souvenir dont vos invités reparleront le lendemain.",
      "En entreprise — gala, vernissage, inauguration, séminaire ou simple repas — la même magie devient un moment clé de votre événement : interactive, rythmée, et assez proche pour que chacun y participe au lieu d'y assister.",
    ],
    // ⚠️ FICHE PRATIQUE — chaque valeur est reprise d'une réponse de la FAQ
    // plus bas dans la page, jamais inventée. Durée, matériel et
    // personnalisation y sont déjà affirmés ; les répéter ici les met sous les
    // yeux au moment où la question se pose, et surtout les deux endroits
    // doivent rester d'accord. Modifier l'un, c'est modifier l'autre.
    // La fiche a porté un temps deux lignes « Particuliers » et « Entreprises »
    // qui énuméraient les occasions par public. Retirées : elles redisaient les
    // pictogrammes trente lignes plus bas, où « Mariages », « Anniversaires »,
    // « Séminaires » et « Team building » figurent déjà en icônes — les mêmes
    // mots à dix centimètres d'intervalle. Ce sont donc les pictogrammes qui
    // gardent ce rôle, et la fiche qui reste factuelle.
    fiche: [
      { label: "Durée", valeur: "Le temps de votre cocktail et/ou de votre dîner" },
      // Même ordre que la fiche des spectacles — durée, public, sur place, en
      // plus — pour que les deux se comparent ligne à ligne.
      { label: "Public", valeur: "Particuliers, entreprises, écoles" },
      { label: "Sur place", valeur: "Entièrement autonome, j’amène mon matériel." },
      { label: "En plus", valeur: "Sculpture de ballons, sur demande" },
    ],
    occasions: [
      // ⚠️ CES QUATRE OCCASIONS DOIVENT RESTER D'ACCORD AVEC LES TAGS DE LA
      // CARTE « Close-up » DANS `Prestations.tsx`. Elles ne l'étaient plus :
      // la carte annonçait mariages, anniversaires, soirées privées et fêtes
      // de famille, tandis qu'on lisait ici « Team building » et
      // « Séminaires » — lesquels sont passés aux spectacles de scène. Un
      // visiteur qui descend de trente centimètres voyait les deux.
      { Icone: Heart, label: "Mariages" },
      { Icone: Cake, label: "Anniversaires" },
      { Icone: Martini, label: "Soirées privées" },
      { Icone: Home, label: "Fêtes de famille" },
    ],
    image: closeupImg,
    alt: "Vince en contre-jour, réduit à sa silhouette, le bras tendu vers le côté",
  },
  {
    id: "spectacles",
    // ⚠️ MISE COLONNE, et c'est une nécessité mesurée, pas un choix d'habillage.
    //
    // Le sujet occupe x 11 %→85 % et y 3 %→100 % : il touche le haut et le bas
    // du cadre. En bande pleine largeur, `object-cover` doit recadrer dans la
    // HAUTEUR — sur un écran de 1920 pour une section de 780px, il n'en restait
    // que 61 %, `scale-110` compris : la tête et les pieds étaient coupés.
    //
    // En colonne de droite, la boîte est plus haute que large par rapport à la
    // photo, donc le recadrage passe dans la LARGEUR et la hauteur est vue en
    // entier. C'est la seule mise en page qui montre ce cliché.
    mise: "colonne",
    // Texte À GAUCHE : la droite est plus vide encore (écart-type 9) mais la
    // section précédente y a déjà son texte, et deux panneaux du même côté
    // font perdre à la page son alternance. À gauche, le panneau ne recouvre
    // que le guéridon et le seau, pas le magicien ni les confettis.
    texteADroite: false,
    // ⚠️ COULEURS CONSERVÉES sur cette section, contrairement à l'autre : le
    // violet du studio fait partie de la photo. Filtre léger seulement — un
    // cran de saturation en moins pour qu'il ne hurle pas à côté de l'or, un
    // cran de contraste en plus pour détacher les confettis.
    filtre: "saturate-[0.85] contrast-[1.06]",
    // ⚠️ PAS DE `voile` : en colonne, le texte est sur du noir franc. Le voile
    // précédent — un dégradé qui s'éteignait à 66 % pour ne pas noyer la
    // silhouette — n'a plus d'objet, et c'est tout l'intérêt de la colonne : on
    // n'arbitre plus entre la lisibilité du texte et la visibilité du sujet,
    // puisqu'ils n'occupent plus le même pixel.
    //
    // ⚠️ CADRAGE CALCULÉ, à ne pas retoucher à l'œil. La boîte est en 6/5
    // (1,2) et la photo en 3:2 (1,5006) : `object-cover` montre donc toute la
    // hauteur et rogne 20,0 % de la largeur. Avec `object-position: 45%`, la
    // fenêtre visible va de 9,0 % à 89,0 % de la photo — le sujet tenant de
    // 11 % à 85 %, il reste 2 points d'air à sa gauche et 4 à sa droite.
    // En dessous de 25 % ou au-dessus de 55 %, on lui coupe un bras.
    cadrage: "object-[45%_50%]",
    // ⚠️ « SPECTACLES DE SCÈNE » ET NON « SPECTACLES ENFANTS ». La section ne
    // s'adresse plus au seul jeune public : le même spectacle se joue devant
    // une salle d'adultes — gala, soirée d'entreprise — comme devant des
    // familles. L'ancien nom fermait la porte à la moitié des demandes avant
    // même qu'on lise le texte, et il contredisait le hero, qui annonce déjà
    // « Galas » en pointant vers cette section.
    surtitre: "Sur scène",
    nom: "Spectacles de scène",
    // L'accroche a d'abord dit « Cinquante minutes, et personne ne s'ennuie »
    // — fausse d'un quart d'heure — puis « Pour les petits, et pas seulement
    // pour eux », qui partait encore des enfants pour concéder les adultes.
    // Elle met maintenant les deux publics sur le même plan.
    accroche: "Les adultes rient autant que les enfants.",
    video: {
      src: VIDEO_SPECTACLE_SCENE,
      titre: "Bande-annonce du spectacle de scène de Vince",
    },
    // Texte fourni par Vince, resserré en deux paragraphes.
    //
    // Ce qui en a été RETIRÉ, et pourquoi : « Il saura s'adapter à votre
    // événement suivant le lieu et l'âge de vos enfants » — c'est déjà ce que
    // dit le choix entre scène et salon, juste au-dessus. Et « arbres de Noël,
    // anniversaires, goûters » : les pictogrammes des occasions, trente lignes
    // plus bas, énumèrent exactement cela ; l'écrire aussi en toutes lettres
    // faisait lire la même liste deux fois dans la même colonne.
    //
    // La sculpture de ballons est passée dans la FICHE et non dans le texte :
    // c'est une prestation en plus, pas une description du spectacle, et noyée
    // en fin de paragraphe elle se serait perdue.
    texte: [
      "Un spectacle de magie et d’humour qui se joue devant une salle : arbre de Noël, gala, soirée d’entreprise ou anniversaire. Le public y monte sur scène autant qu’il applaudit.",
      "En version familiale, la baguette, le chapeau et le lapin sont de rigueur, et l’on suit dès trois ans. En version adulte, l’humour et la complicité prennent le pas. Le format s’ajuste au lieu comme à la salle.",
    ],
    fiche: [
      { label: "Durée", valeur: "De 30 minutes à 1 h 15 (personnalisable)" },
      { label: "Public", valeur: "Familial dès trois ans, ou tout public adulte" },
      { label: "Sur place", valeur: "Un espace dégagé et une prise de courant" },
      { label: "En plus", valeur: "Sculpture de ballons, sur demande" },
    ],
    occasions: [
      // ⚠️ DEUX OCCASIONS FAMILIALES, DEUX POUR ADULTES, et c'est délibéré :
      // les quatre pictogrammes sont la première chose qu'on lit dans cette
      // colonne, et quatre contextes d'enfants auraient contredit le titre.
      // « Centres de loisirs » a cédé la place aux galas — il reste couvert par
      // la liste des prestations, plus haut.
      // ⚠️ Idem, d'accord avec les tags de la carte « Spectacles de scène ».
      // « Séminaires » et « Team building » sont ICI et non au close-up : ce
      // sont des prestations sur scène, devant une assemblée.
      { Icone: Presentation, label: "Séminaires" },
      { Icone: Users, label: "Team building" },
      { Icone: Gift, label: "Arbres de Noël" },
      { Icone: GraduationCap, label: "Écoles" },
    ],
    image: stageImg,
    alt: "Vince en studio, éventail noir à la main, bras levé sous une pluie de confettis dans une lumière violette",
  },
];

// ── BIOGRAPHIE ──────────────────────────────────────────────────────────────
// Texte fourni par Vince. Réagencé en trois paragraphes — origines, formation
// et palmarès, spécialisation — et non dans l'ordre reçu : le récit d'origine
// intercalait un paragraphe commercial (« il vous garantit de transformer
// votre événement ») entre deux paragraphes biographiques. Cet argument-là est
// déjà porté par les sections de formats juste au-dessus ; le répéter ici
// affaiblissait les deux.
const recitBio = [
  "Vince, magicien illusionniste passionné depuis son enfance, fait son apparition à Tours en 2003 pour s’y installer définitivement. Cet artiste de talent sait se distinguer par son côté dynamique, alliant parfaitement la magie à l’humour, pour ainsi laisser un souvenir magique à tous ceux qui croiseront sa route…",
  "Il se professionnalise dans son art à l’âge de 20 ans, se perfectionne en intégrant le Groupement régional des Magiciens de Touraine (G.R.M.T) et rejoint la Fédération Française des Artistes Prestidigitateurs la même année. Aimant les défis, il participe à des concours qu’il remporte successivement en 2009, 2011 et 2012.",
  "Au fil des années, Vincent se spécialise dans le close-up, pour faire vivre l’instant magique au plus près des spectateurs. Aujourd’hui, fort de son expérience, il se déplace dans toute la France et au-delà des frontières, sur scène, en cocktail ou en close-up.",
];

const distinctions = [
  "1er prix Les Gobelets d’or 2009",
  "1er prix concours G.R.M.T 2011",
  "1er prix concours G.R.M.T 2012",
  "Membre de la F.F.A.P. — Fédération Française des Artistes Prestidigitateurs",
  "Club régional des magiciens de Touraine (G.R.M.T)",
];

// Deux citations, volontairement laissées telles quelles — ponctuation
// comprise. Ce sont des paroles rapportées : les recomposer, c'est les
// réécrire. La seconde est en anglais et le reste.
const citationsBio = [
  { texte: "« EXCEPTIONNEL ….. un vrai moment de rêve »" },
  { texte: "« Delightful and a memorable experience. »" },
];

/**
 * LES AVIS — VIDES, ET C'EST VOLONTAIRE.
 *
 * ⚠️ NE RIEN ÉCRIRE ICI QUI NE SOIT UN VRAI AVIS DE VINCE. Ce tableau a
 * contenu trois témoignages repris du site d'un autre artiste, dont seul le
 * prénom avait été changé. Publier l'avis d'un client qu'on n'a pas eu est une
 * pratique commerciale trompeuse, sanctionnée comme telle — et c'est vérifiable
 * en une recherche, puisque les originaux sont en ligne chez Google.
 *
 * Tant que ce tableau est vide, le bloc « Avis Google » NE S'AFFICHE PAS : la
 * section ne montre plus que les questions fréquentes. Il n'y a donc ni trou,
 * ni encart « à compléter » visible par un visiteur. Ajouter une entrée suffit
 * à le faire réapparaître, sans rien d'autre à rebrancher.
 *
 * Le jour où les vrais avis arrivent, les recopier depuis la fiche Google de
 * Vince, mot pour mot et avec le prénom tel qu'il y figure. C'est aussi ce qui
 * rendra possible un `aggregateRating` dans les données structurées — lequel
 * devra être alimenté depuis Google, jamais depuis ce fichier.
 */
type Avis = {
  quote: string[];
  author: string;
  animation: string;
  evenement: string;
};

const reviews: Avis[] = [];

// Vingt-quatre tuiles — vingt-trois photos et une boucle vidéo en tête — soit
// six rangées pleines de quatre sur ordinateur :
// les deux premières sont affichées d'emblée, les quatre autres au clic. Un
// multiple de quatre évite une dernière rangée bancale, à deux ou trois images.
//
// L'ORDRE EST DÉLIBÉRÉ. Les huit photos ajoutées n'ont pas été mises à la
// queue : elles y seraient restées invisibles derrière « Voir plus de photos ».
// Les plus parlantes — la carte enflammée au dîner, le cocktail au château, le
// ballon du mariage, la scène en noir et blanc — sont remontées dans les deux
// premières rangées, en alternance avec les anciennes, et les plus fragiles
// (le Joker, la lévitation au musée) referment la série.
//
// Les trois photos de cocktail de mariage manquent volontairement à l'appel :
// des visages d'invités y sont parfaitement reconnaissables et leur diffusion
// n'est pas confirmée. Leurs fichiers existent, il suffit de les ajouter ici.
const gallery: Photo[] = [
  // ⚠️ L'ORDRE N'EST PAS LIBRE : chaque position reçoit une forme de tuile
  // connue (voir `MOTIF_TUILES`), et la photo doit s'y prêter.
  //
  //   positions 0, 1, 2 de chaque motif → tuiles CARRÉES → portraits ;
  //   positions 3, 4, 5                 → tuiles 2:1     → paysages, JAMAIS un
  //                                        portrait, qui s'y ferait couper la
  //                                        tête et les jambes.
  //
  // Vérification : 9 portraits pour 12 tuiles carrées sur les quatre motifs,
  // 15 paysages pour 12 bandes. Les trois carrés en trop (motif 4) reçoivent
  // des paysages, ce qui ne coûte qu'un rognage latéral.
  //
  // ⚠️ LES DOUZE PHOTOS AJOUTÉES EN SEPTEMBRE 2026 OUVRENT LA GALERIE, mais
  // pas exactement douze d'affilée : elles comptent SEPT portraits alors que
  // les deux premiers motifs n'offrent que six carrés. La douzième — la caisse
  // en lumière rouge — est donc descendue en tête du motif 3, sur le grand
  // carré, et une photo existante en paysage (la tablée) remonte prendre sa
  // place sur la dernière bande du motif 2. Toutes les nouvelles sont ainsi
  // dans les treize premières, et aucune n'est déformée.
  //
  // ⚠️ DEUX RÉSERVES AVANT MISE EN LIGNE, à lever avec Vince :
  //
  //  1. DROITS PHOTO. Trois de ces clichés — le cocktail avec l'invitée qui
  //     rit, la pièce au creux de la main, la table aux balles rouges —
  //     viennent d'un reportage professionnel signé, et le nom du photographe
  //     figurait dans leur fichier d'origine. Leur publication en ligne
  //     suppose une cession de droits.
  //  2. DROIT À L'IMAGE. Plusieurs montrent des visages parfaitement
  //     reconnaissables, dont celui d'un enfant appelé sur scène. C'est la même
  //     réserve qui tient trois photos de cocktail de mariage hors de cette
  //     liste, plus bas : leur diffusion n'était pas confirmée.

  // ── Motif 1 — l'aperçu : ce qu'on voit sans déplier ───────────
  {
    src: nCloseupTableBallesRougesImg,
    grand: nCloseupTableBallesRougesLargeImg,
    alt: "Vince penché vers une invitée, deux balles rouges posées sur la table, devant un rideau rouge",
  },
  {
    src: nSpectacleEnfantFoulardRougeImg,
    grand: nSpectacleEnfantFoulardRougeLargeImg,
    alt: "Un enfant appelé sur scène déploie un grand foulard rouge devant Vince",
  },
  {
    src: nSceneConfettisMicroCasqueImg,
    grand: nSceneConfettisMicroCasqueLargeImg,
    alt: "Vince, micro-casque sur la tête, lâche une pluie de confettis sous les rideaux bleus",
  },
  {
    src: nCloseupCocktailRireInviteeImg,
    grand: nCloseupCocktailRireInviteeLargeImg,
    alt: "Une invitée éclate de rire pendant un tour de close-up, au milieu d’un cocktail",
  },
  {
    src: nCloseupCocktailPieceMainImg,
    grand: nCloseupCocktailPieceMainLargeImg,
    alt: "Vince montre une pièce au creux de sa main à un invité, pendant un cocktail",
  },
  {
    src: nSceneSpectatriceInviteeImg,
    grand: nSceneSpectatriceInviteeLargeImg,
    alt: "Une spectatrice invitée sur scène tend la main vers la table de Vince",
  },

  // ── Motif 2 ───────────────────────────────────────────────────
  {
    src: nCloseupFlammeOmbrePorteeImg,
    grand: nCloseupFlammeOmbrePorteeLargeImg,
    alt: "Une flamme dans la main de Vince projette son ombre en grand sur le mur derrière lui",
  },
  {
    src: nSceneCordeRideauxRosesImg,
    grand: nSceneCordeRideauxRosesLargeImg,
    alt: "Vince tend une corde entre ses mains, seul en scène devant des rideaux roses",
  },
  {
    src: nSceneSeauMicroCasqueImg,
    grand: nSceneSeauMicroCasqueLargeImg,
    alt: "Vince, micro-casque sur la tête, au-dessus d’un seau métallique posé sur un tabouret",
  },
  {
    src: nCloseupBoitesPredictionImg,
    grand: nCloseupBoitesPredictionLargeImg,
    alt: "Une spectatrice tient une carte devant trois boîtes de prédiction empilées",
  },
  {
    src: nSpectacleBallonGrangeImg,
    grand: nSpectacleBallonGrangeLargeImg,
    alt: "Vince présente un ballon blanc à des enfants, dans une grange",
  },
  {
    src: gTableeImg,
    grand: gTableeLargeImg,
    alt: "Une grande tablée de restaurant, une vingtaine de convives bras levés en fin de prestation",
  },

  // ── Motif 3 ───────────────────────────────────────────────────────────
  {
    // ⚠️ INSÉRÉE ICI, AU MILIEU, ET PAS AILLEURS. Ajouter une photo décale
    // toutes les suivantes d'un rang, donc CHANGE LEUR FORME DE TUILE : un
    // portrait qui tenait sur un carré se retrouve sur une bande 2:1, tête et
    // jambes coupées. Les trois portraits qui suivaient ont donc été
    // redistribués — deux restent sur les carrés de ce motif, le troisième
    // descend sur le grand carré du motif 4. Revérifier les 25 positions
    // avant de déplacer quoi que ce soit ici.
    src: nSceneCaisseBoisApparitionImg,
    grand: nSceneCaisseBoisApparitionLargeImg,
    alt: "Vince soulève le couvercle d’une caisse en bois sur scène, des panneaux en suspension au-dessus",
  },
  {
    src: nSceneCaisseLumiereRougeImg,
    grand: nSceneCaisseLumiereRougeLargeImg,
    alt: "Vince ouvre une caisse en bois sur une scène baignée de lumière rouge",
  },
  {
    src: gFlammeImg,
    grand: gFlammeLargeImg,
    alt: "Une flamme jaillit entre les mains de Vince pendant une soirée, un invité la fixe de tout près",
  },
  {
    src: gGalaRireImg,
    grand: gGalaRireLargeImg,
    alt: "Vince présente une carte à une tablée de gala, un convive éclate de rire à côté de lui",
  },
  {
    src: gMariagePierreImg,
    grand: gMariagePierreLargeImg,
    alt: "Close-up dans une salle aux murs de pierre, Vince entouré des invités d’un mariage",
  },
  {
    cadrage: "50% 100%",
    src: gFoulardImg,
    grand: gFoulardLargeImg,
    alt: "Vince sur la scène d’un théâtre, un foulard bleu entre les mains, entre ses deux guéridons",
  },

  // ── Motif 4 ───────────────────────────────────────────────────────────
  {
    src: gParticipationImg,
    grand: gParticipationLargeImg,
    alt: "Une enfant appelée sur scène tend la main vers Vince, devant un public d’enfants",
  },
  {
    src: gStudioBrasImg,
    grand: gStudioBrasLargeImg,
    alt: "Vince en studio, bras grands ouverts derrière un guéridon, sur fond clair",
  },
  {
    src: gBarGroupeImg,
    grand: gBarGroupeLargeImg,
    alt: "Vince présente un tour à un groupe de jeunes debout, dans la salle d’un bar",
  },
  {
    src: gParapluieImg,
    grand: gParapluieLargeImg,
    alt: "Vince ouvre un parapluie multicolore sur scène, une petite fille à côté de lui face au public",
  },
  {
    src: gSilhouetteImg,
    grand: gSilhouetteLargeImg,
    alt: "Vince en contre-jour, réduit à sa silhouette, le bras tendu vers le côté",
  },
  {
    src: gEventailImg,
    grand: gEventailLargeImg,
    alt: "Vince en studio, éventail noir à la main, sous une pluie de confettis et une lumière violette",
  },
];

export function HomeEditorialSections() {
  return (
    <>
      {/* La visionneuse plein écran, montée UNE FOIS pour toute la page. Elle ne
          rend rien tant qu'on n'a pas cliqué ; les boutons de lecture des
          sections la réveillent par un événement global, et non par une prop —
          voir `VideoPleinEcran`. */}
      <VideoPleinEcran />
      <FormatStories />
      {/* La biographie se place entre la vidéo et les avis, pour suivre l'ordre
          du menu : Close-up, Spectacles de scène, Biographie, Galerie, Contact. */}
      <Biographie />
      <ReviewsAndFaq />
      <EditorialGallery />
    </>
  );
}

function FormatStories() {
  return (
    // Plus d'espacement entre les sections ni de rembourrage autour : elles
    // sont pleine largeur et se touchent, chacune portant sa propre hauteur.
    // Un `space-y` aurait fait apparaître une bande de fond entre deux photos.
    <div className="border-t border-border/70">
      {formats.map((format) =>
        format.mise === "colonne" ? (
          <FormatColonne key={format.id} format={format} />
        ) : (
          <FormatStory key={format.id} format={format} />
        ),
      )}
    </div>
  );
}

/** Un sur-titre précédé d'un filet qui se trace à l'entrée dans le champ.
 *  Il remplace le tiret cadratin, qui n'était qu'un caractère inerte. */
function Filet({
  children,
  versLaGauche = false,
}: {
  children: React.ReactNode;
  versLaGauche?: boolean;
}) {
  return (
    <p
      className={`type-eyebrow flex items-center gap-3 text-[var(--gold)] ${versLaGauche ? "md:flex-row-reverse" : ""}`}
    >
      <motion.span
        aria-hidden="true"
        className={`h-px w-8 bg-[var(--gold)] ${versLaGauche ? "origin-right" : "origin-left"}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
      {children}
    </p>
  );
}

/** Titre qui monte de sous sa propre ligne de base au lieu d'apparaître en
 *  fondu. Le fondu était le réglage par défaut de toute la page ; ce dévoilement
 *  derrière un masque donne au titre le poids qu'un grand Playfair mérite.
 *
 *  `pb-[0.18em] -mb-[0.18em]` : le masque, c'est `overflow-hidden` sur le
 *  conteneur — sans cette réserve il tranchait les jambages du « p » de
 *  « Close-up ». La marge négative reprend l'espace pour ne rien décaler. */
function TitreRevele({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    /* C'est le span EXTÉRIEUR qui déclenche, et le span intérieur qui bouge.
       Les deux rôles ne peuvent pas être tenus par le même élément.
       `whileInView` repose sur un IntersectionObserver, et un observateur mesure
       sa cible APRÈS découpage par les ancêtres qui la rognent. Or le texte
       commence à 115 % vers le bas, donc entièrement hors du masque
       `overflow-hidden` : l'observateur le jugeait invisible, l'animation ne
       partait jamais, et le titre restait caché pour toujours — il était caché
       parce qu'il n'avait pas bougé, et il ne bougeait pas parce qu'il était
       jugé caché.
       En observant le masque, qui n'est lui-même rogné par personne, et en
       transmettant l'état par variantes, la boucle est rompue. */
    <motion.span
      className={`block overflow-hidden pb-[0.18em] -mb-[0.18em] ${className}`}
      initial="cachee"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span
        className="block"
        variants={{
          cachee: { y: reduceMotion ? 0 : "115%" },
          visible: { y: 0 },
        }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * UNE SECTION DE FORMAT EN DEUX COLONNES : texte sur fond noir à gauche, photo
 * ramenée entièrement à droite.
 *
 * ── POURQUOI ELLE EXISTE ────────────────────────────────────────────────────
 *
 * La bande pleine largeur ne sait pas montrer un sujet qui occupe tout le cadre
 * dans la hauteur. `object-cover` doit bien recadrer quelque part, et dans une
 * bande de 1920 par 780 il recadre dans la hauteur : il ne restait que 61 % du
 * cliché des spectacles, `scale-110` comprise. Tête et pieds coupés, et le sujet
 * paraissait « beaucoup trop zoomé » — il l'était.
 *
 * Le calcul qui ferme le débat : une photo en 3:2 ne remplit la hauteur d'une
 * section de 780px qu'à partir de 1170px de large. Dans une demi-colonne, cela
 * demanderait une fenêtre de 2340px. En dessous — c'est-à-dire partout — une
 * photo en `object-cover` calée sur la hauteur se fait rogner de 45 % à 60 % en
 * largeur, ce qui tranche le sujet en deux. D'où la boîte à PROPORTION BORNÉE
 * ci-dessous, centrée dans sa colonne, plutôt qu'une photo étirée sur toute la
 * hauteur de la section.
 *
 * ── LA GÉOMÉTRIE, mesurée ───────────────────────────────────────────────────
 *
 * Boîte en 6/5 (1,2) pour une photo en 1,5006 : `object-cover` cale donc sur la
 * HAUTEUR — toute la hauteur du cliché est visible, ce qui était le but — et
 * rogne 20,0 % de la largeur, prélevés sur les marges vides. Voir `cadrage` dans
 * les données pour le détail de la fenêtre retenue.
 *
 * Le rembourrage gauche reproduit la gouttière du site :
 * `max(1.5rem, (100vw - 80rem)/2 + 2.5rem)` est exactement le bord intérieur
 * d'un conteneur `max-w-7xl px-10`. Le texte tombe donc sur la même verticale
 * que toutes les autres sections, alors qu'il n'est plus DANS ce conteneur.
 * Vérifié : la colonne de texte mesure 560px de 1280px de fenêtre à 2560, et se
 * resserre à 448 à 1024 — elle ne s'étire jamais.
 *
 * ── CE QU'IL NE FAUT PAS DÉFAIRE ────────────────────────────────────────────
 *
 * ⚠️ PAS DE PARALLAXE ICI. La bande pleine largeur en a une, permise par son
 * `scale-110` : il y a de la réserve hors cadre à découvrir. Ici la photo cale
 * sur la hauteur, donc il n'y a AUCUNE réserve verticale — un glissement de
 * quelques pour cent ferait apparaître une bande de noir en haut ou en bas.
 *
 * ⚠️ LE DÉGRADÉ GAUCHE NE COUVRE QUE 30 % DE LA BOÎTE. Ce n'est pas de la
 * timidité : le sujet occupe 2,5 %→95 % de la largeur de la boîte, un fondu plus
 * long le mangerait. Ces 30 % tombent sur le guéridon et le seau — relevé au
 * balayage, la zone x 11-30 % de la photo ne contient rien au-dessus de 54 % de
 * hauteur —, donc ils font disparaître le mobilier dans le noir et laissent le
 * magicien intact.
 */
function FormatColonne({ format }: { format: Format }) {
  return (
    <section
      id={format.id}
      /* `grain` : un dégradé pur sur un aplat de studio montre des bandes de
         quantification, le bruit les casse. */
      /* ⚠️ 46/54 ET NON 50/50, et les deux bornes du réglage ont été essayées.
         La bande pleine largeur d'avant faisait commencer la photo au bord
         gauche de la fenêtre ; une grille en deux moitiés, avec la photo bornée
         à 52rem et poussée à droite, la faisait commencer à 1088px sur un écran
         de 1920 — 184px de noir séparaient alors le texte de la photo, et
         celle-ci se lisait comme collée au bord. 46/54 la ramène à 883px, soit
         205px plus à gauche, sans repasser sous le texte.
         C'est la colonne de texte qui paie : 475px d'utile au lieu de 552. Elle
         reste au-dessus de ce dont elle a besoin — la rangée des deux boutons
         mesure 425px et tient donc encore sur une ligne, à 50px près. Ne pas
         descendre le texte plus bas que 44 % sans refaire cette vérification. */
      className="grain relative scroll-mt-24 overflow-clip lg:grid lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:items-center"
    >
      {/* ── PHOTO, PETITS ÉCRANS : une bande en haut ────────────────────────
          En 3:2, la proportion native du fichier : aucun recadrage du tout, et
          donc le sujet entier. Sur un téléphone il n'y a pas deux colonnes à
          partager, la question du recadrage ne se pose plus. Le fondu du bas la
          raccorde au texte qui suit. */}
      <div className="relative aspect-[3/2] w-full lg:hidden">
        <img
          src={format.image}
          alt={format.alt}
          loading="lazy"
          className={`h-full w-full object-cover ${format.filtre}`}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent"
        />
      </div>

      {/* ── TEXTE ──────────────────────────────────────────────────────────
          Premier dans le DOM et second à l'écran serait une erreur : il est
          premier dans les deux. C'est la colonne de droite que la grille place
          après lui, et l'ordre de lecture au clavier suit l'ordre du document. */}
      <div className="relative z-10 px-6 py-16 pl-[max(1.5rem,calc((100vw-80rem)/2+2.5rem))] md:px-10 md:py-20 md:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-12">
        {/* Borné à 34rem : sans cela, la colonne de texte suivrait la moitié de
            l'écran et les lignes atteindraient 1100 signes sur un 2560. */}
        <div className="lg:max-w-[34rem]">
          <PanneauFormat format={format} aDroite={false} />
        </div>
      </div>

      {/* ── PHOTO, GRANDS ÉCRANS : la colonne de droite ─────────────────────
          `max-w-[60rem]` : la borne ne sert plus qu'aux très grands écrans. Sans
          elle, la photo mesurerait 1152px de haut sur un 2560 — plus que la
          fenêtre, et la section deviendrait impossible à voir d'un coup d'œil.
          À 960px de large elle plafonne à 800px de haut. En dessous de 1780px
          de fenêtre la borne ne joue pas : la photo remplit sa colonne. */}
      <div className="hidden h-full items-center justify-end lg:flex">
        {/* ⚠️ LA PHOTO EST COLLANTE, et deux conditions le permettent.
            D'abord la section est en `overflow-clip` et non `overflow-hidden` :
            `hidden` crée un conteneur de défilement, par rapport auquel le
            collage se mesure — la photo serait restée sagement en place sans
            qu'aucune erreur ne le signale. `clip` rogne sans créer de conteneur.
            Ensuite ce parent en `h-full` lui donne la hauteur de la rangée :
            sans lui, la boîte serait à elle-même son propre cadre et n'aurait
            aucune course.

            `top-28` = les 96px de la barre de navigation plus un peu d'air.

            La course vaut « hauteur de la section moins hauteur de la photo »,
            c'est-à-dire l'écart entre la colonne de texte et la colonne
            d'image : environ 90px sur un écran de 1920, davantage à mesure que
            la fenêtre se resserre et que le texte s'allonge. C'est court, et
            c'est la conséquence assumée du choix de ne pas rallonger les
            sections : l'effet se voit sans étirer la page. */}
        <div className="relative aspect-[6/5] w-full max-w-[60rem] lg:sticky lg:top-28">
          <img
            src={format.image}
            alt={format.alt}
            loading="lazy"
            className={`h-full w-full object-cover ${format.cadrage ?? ""} ${format.filtre}`}
          />

          {/* ── FONDU DU BORD GAUCHE, le raccord avec le noir de la colonne ──
              Sans lui, une arête verticale franche sépare un studio clair d'un
              fond noir.

              ⚠️ SEPT PALIERS, ET UNE COURBE EN S. Il n'en avait que trois
              (`from` / `via-55%` / `to`) sur 30 % de la boîte, et cela se
              voyait : l'opacité tombait de 100 % à 55 % sur la première moitié
              puis de 55 % à 0 sur la seconde, avec un coude au milieu, et elle
              atteignait zéro PILE là où le magicien commence. D'où une chute
              rapide, un pli visible, puis une reprise brutale de la
              luminosité — « un peu trop brutal », et c'était exact.

              La courbe ci-dessous démarre doucement (12 points sur les 8
              premiers pour cent), creuse au milieu (24 points au plus fort) et
              se pose en douceur. Aucun palier ne saute de plus d'un quart.

              ⚠️ LES POSITIONS SONT MESURÉES SUR LA PHOTO, pas choisies. Relevé
              par tranches de 5 % de la boîte : de 0 à 30 %, le fond est un
              studio uniforme à 176 de gris et les seuls pixels sombres — le
              guéridon et le seau — vivent sous 54 % de hauteur. LE MAGICIEN NE
              COMMENCE QU'À 30 % (le sommet du sombre y passe de 54 % à 22 %,
              puis à 3 % vers 52 %). Les trente premiers pour cent sont donc de
              la plage libre, et c'est exactement ce que le fondu occupe à
              pleine force.

              Il s'éteint à 46 % et non à 30 % : s'arrêter au bord du sujet,
              c'est y créer la marche qu'on cherche à supprimer. À 30 % il ne
              pèse plus que 22 %, à 38 % plus que 8 % — un voile qui s'efface
              sur son bras tendu, pas un masque. Ne pas le raccourcir sous 40 %.

              Écrit en style EN LIGNE et non en classes : sept paliers en
              `color-mix` ne s'expriment pas avec `from`/`via`/`to`, qui n'en
              acceptent que trois. Le `color-mix` garde la teinte du fond
              constante et ne fait varier que l'alpha, ce qui évite le gris
              laiteux d'une interpolation vers `transparent`. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-[46%]"
            style={{
              backgroundImage:
                "linear-gradient(to right," +
                " var(--background) 0%," +
                " color-mix(in oklab, var(--background) 88%, transparent) 8%," +
                " color-mix(in oklab, var(--background) 68%, transparent) 15%," +
                " color-mix(in oklab, var(--background) 44%, transparent) 22%," +
                " color-mix(in oklab, var(--background) 22%, transparent) 30%," +
                " color-mix(in oklab, var(--background) 8%, transparent) 38%," +
                " transparent 100%)",
            }}
          />

          {/* Fondus HAUT et BAS, volontairement courts et partiels.
              Le sommet du sujet est à 3 % de la hauteur du cadre : un fondu
              généreux lui noircirait la main levée. 5 % à 70 % d'opacité en
              haut suffit à effacer l'arête sans l'atteindre vraiment ; en bas on
              peut aller à 12 %, il n'y a que le sol. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[5%] bg-gradient-to-b from-background/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-background to-transparent"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * LE PANNEAU DE TEXTE d'une section de format, commun aux DEUX mises en page.
 *
 * Extrait parce qu'il est rigoureusement le même en bande pleine largeur et en
 * colonne : seul l'habillage autour change. Recopié dans les deux, il aurait
 * divergé au premier ajustement — et il en a déjà reçu plusieurs.
 *
 * `aDroite` ne sert qu'à retourner le filet, dont le trait part du côté du bord
 * le plus proche.
 */
function PanneauFormat({ format, aDroite }: { format: Format; aDroite: boolean }) {
  return (
    <>
      <Filet versLaGauche={aDroite}>{format.surtitre}</Filet>

      {/* LE NOM DU FORMAT EN GRAND, l'accroche en dessous et en petit.
        C'était l'inverse : le nom tenait dans le filet en petites
        capitales de 11px et l'accroche occupait 60px de Playfair. Le
        rapport de corps était de 1 à 5,5 EN FAVEUR DE LA PHRASE — si bien
        que la section la plus visible de la page ne disait pas de quoi
        elle parlait. Le nom passe donc à 60px, l'accroche à 24 : le
        rapport s'inverse, à 2,5 cette fois. */}
      <h2 className="mt-4 font-display text-5xl leading-[0.98] md:text-6xl">
        <TitreRevele>{format.nom}</TitreRevele>
      </h2>

      {/* L'accroche. En Playfair comme le titre et non en Inter : elle en est
        le prolongement, pas le début du corps de texte — le paragraphe qui
        suit, lui, est bien en Inter. Une graisse légère et un gris à 85 %
        la tiennent sous le titre sans la réduire à une légende. */}
      <p className="mt-4 max-w-xl font-display text-xl font-light leading-snug text-foreground/85 md:text-2xl">
        {format.accroche}
      </p>

      {/* Le premier paragraphe est le chapeau : plus gros, plus contrasté.
        Sans cette différence, deux paragraphes de même graisse se lisent
        comme un pavé et on n'entre nulle part. */}
      <div className="mt-6 max-w-xl space-y-4">
        {format.texte.map((paragraphe, i) => (
          <p
            key={paragraphe.slice(0, 40)}
            className={
              i === 0
                ? "text-lg font-light leading-relaxed text-foreground/90"
                : "text-base font-light leading-relaxed text-muted-foreground"
            }
          >
            {paragraphe}
          </p>
        ))}
      </div>

      {/* LA FICHE PRATIQUE. Les trois questions qui viennent juste après
        « est-ce que ça me plaît ? » : combien de temps, pour qui, et
        qu'est-ce que j'ai à prévoir. Elles avaient leur réponse dans la
        FAQ, tout en bas — c'est-à-dire trop loin du moment où on se les
        pose.

        En liste de définitions (`dl`) et non en tableau ni en `div` :
        ce sont littéralement des couples terme/définition, et c'est ce
        qu'un lecteur d'écran annoncera. */}
      {/* ⚠️ `w-24` EST CALIBRÉ SUR LE PLUS LONG INTITULÉ DES DEUX FORMATS,
          la liste étant partagée. Mesuré sur les chasses de Source Sans 3 600
          à 11,52px avec l'interlettrage de 0,18em : « SUR PLACE » fait 84,7px,
          « EN PLUS » 64,5, « PUBLIC » 56,6, « DURÉE » 49,5. Les 96px suffisent
          à tous, avec 11px de marge au plus long.

          La colonne est passée un temps à `w-32`, le temps que le close-up
          porte « PARTICULIERS » (115px) et « ENTREPRISES » (104px) : des mots
          UNIQUES, donc incapables de passer à la ligne comme « Sur place » le
          fait, et qui auraient débordé dans la colonne des valeurs. Ces deux
          lignes ont été retirées depuis, et la colonne est revenue avec :
          128px laissaient 43px de vide avant chaque valeur.

          Remesurer avant d'introduire un intitulé d'un seul tenant plus long
          que « Sur place ». */}
      <dl className="mt-8 max-w-xl divide-y divide-border border-y border-border">
        {format.fiche.map(({ label, valeur }) => (
          <div key={label} className="flex flex-wrap items-baseline gap-x-5 gap-y-1 py-3">
            <dt className="type-eyebrow font-title w-24 shrink-0 text-[var(--gold)]">{label}</dt>
            <dd className="text-sm text-foreground/85">{valeur}</dd>
          </div>
        ))}
      </dl>

      {/* Les occasions. Deux colonnes et non une rangée de quatre : dans
        une colonne qui fait 46 % de la page, quatre pictogrammes côte à
        côte réduisaient « Centres de loisirs » à trois lignes de un mot. */}
      <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5">
        {format.occasions.map(({ Icone, label }) => (
          <li key={label} className="flex items-center gap-3">
            <Icone
              size={26}
              strokeWidth={1.25}
              className="shrink-0 text-[var(--gold)]"
              aria-hidden="true"
            />
            <span className="type-action font-title text-[0.7rem] text-foreground/90">{label}</span>
          </li>
        ))}
      </ul>

      {/* Les deux actions de la section, dans une rangée qui se replie.
        `flex-wrap` n'est pas une précaution de principe. Calculé sur les
        chasses de la fonte : « Demander un devis » fait 228px, « Voir la
        vidéo » 183px, l'écartement 16 — 425px de rangée. La colonne fait
        46 % du contenu, soit 552px au-delà de 1280px de fenêtre, mais
        seulement 434 à 1024px. Il reste donc NEUF PIXELS de marge à la
        largeur de bascule, moins que l'imprécision du calcul : les deux
        boutons y passent l'un sous l'autre plutôt que de déborder, et
        c'est très bien ainsi. Ne pas allonger ces libellés sans refaire
        l'addition. */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <a
          href="#contact"
          className="group inline-flex min-h-[3.25rem] items-center gap-3 rounded-md bg-[var(--gold)] px-7 text-primary-foreground transition-colors hover:bg-[var(--gold-soft)]"
        >
          <span className="type-action font-title text-[0.72rem]">Demander un devis</span>
          <ArrowRight
            size={17}
            className="shrink-0 transition-transform group-hover:translate-x-1"
          />
        </a>

        <CtaVideo demande={format.video} />
      </div>
    </>
  );
}

/**
 * UNE SECTION DE FORMAT : photo pleine largeur, texte par-dessus.
 *
 * La version précédente posait la photo dans un cadre à côté du texte, en deux
 * colonnes qui alternaient. Ici la photo occupe toute la section, bord à bord,
 * et c'est un dégradé qui lui prend la place nécessaire pour que le texte se
 * lise dessus.
 *
 * LE DÉGRADÉ N'EST PAS UNE DÉCORATION, c'est ce qui rend le texte lisible sur
 * une photo dont on ne maîtrise ni la luminosité ni le contraste locaux. Il va
 * du fond OPAQUE côté texte jusqu'à transparent de l'autre — ne pas le
 * remplacer par un voile uniforme, qui grisait toute la photo pour n'aider le
 * texte nulle part en particulier.
 *
 * Deux dégradés et non un seul, selon l'orientation :
 *   - au-dessus de 1024px, HORIZONTAL, parce que le texte occupe une moitié ;
 *   - en dessous, VERTICAL depuis le bas, parce que le texte passe sous la
 *     photo dans la hauteur et qu'un dégradé latéral n'y couvrirait rien.
 *
 * L'alternance gauche/droite d'une section à l'autre est conservée : elle
 * évite que deux bandes pleine largeur successives se lisent comme un seul
 * bloc. Elle inverse le dégradé en même temps que la colonne, sans quoi le
 * texte se retrouverait sur la partie claire.
 */
function FormatStory({ format }: { format: (typeof formats)[number] }) {
  // Le côté du texte est une propriété de la PHOTO, pas de la position dans la
  // page : il dépend de l'endroit où le sujet se tient. Le déduire du rang
  // faisait basculer le panneau sur le magicien dès qu'on réordonnait les
  // sections, sans que rien ne le signale.
  const texteADroite = format.texteADroite;
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallaxe léger : la photo glisse de 8 % pendant que la section traverse
  // l'écran. `scale-110` lui donne la réserve — sans elle, le glissement
  // découvrirait une bande de fond nu en haut ou en bas.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      id={format.id}
      ref={sectionRef}
      /* `grain` ajoute un bruit très léger par-dessus la section. Sur des
          aplats de gris studio étirés en pleine largeur, un dégradé pur montre
          des bandes de quantification ; le grain les casse. C'est aussi ce qui
          empêche ces deux bandes de paraître lisses au point d'en être
          synthétiques. */
      /* ⚠️ `overflow-clip` ET SURTOUT PAS `overflow-hidden`. La photo est
          désormais COLLANTE, et `position: sticky` se mesure par rapport au
          plus proche conteneur de défilement : `overflow: hidden` en crée un,
          si bien que la photo serait restée sagement à sa place sans que rien
          ne le signale. `overflow: clip` rogne le débordement de la photo
          agrandie SANS créer de conteneur de défilement, donc le collage
          remonte jusqu'à la fenêtre. C'est exactement la raison pour laquelle
          `html, body` sont en `overflow-x: clip` dans styles.css.

          `grain` ajoute un bruit très léger par-dessus la section. Sur des
          aplats de gris studio étirés en pleine largeur, un dégradé pur montre
          des bandes de quantification ; le grain les casse. */
      className="grain relative flex min-h-[38rem] items-end overflow-clip scroll-mt-24 md:min-h-[44rem] lg:items-center"
    >
      {/* ── LE FOND COLLANT ─────────────────────────────────────────────────
          Il fait une hauteur de fenêtre et s'épingle en haut pendant que le
          texte, remonté par-dessus, continue de défiler. La course du collage
          vaut « hauteur de la section moins hauteur de la fenêtre » : elle est
          donc nulle sur un grand écran, où le texte tient dans une fenêtre, et
          de deux à trois cents pixels sur un portable, où la fenêtre est plus
          basse que le contenu. C'est le prix de la contrainte « on n'allonge
          pas les sections » : l'effet apparaît là où il y a de la course, et
          se contente d'être invisible ailleurs — jamais cassé, juste absent.

          `pointer-events-none` : ce bloc couvre toute la fenêtre pendant qu'il
          est épinglé. Sans cela il intercepterait les clics destinés au texte
          qui passe par-dessus. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-svh max-h-full overflow-hidden">
          <motion.img
            src={format.image}
            alt={format.alt}
            loading="lazy"
            style={reduceMotion ? undefined : { y }}
            /* `grayscale` : la photo des spectacles est FORTEMENT violette
              (saturation moyenne mesurée à 120 sur 255), celle du close-up est
              déjà grise (1,3). Côte à côte et en pleine largeur, l'une aurait
              introduit une seconde couleur dans une charte qui n'en a qu'une.

              `contrast-[1.12]` : ces deux prises sont des studios à fond clair.
              Un cran de contraste creuse les noirs, ce qui fait de la
              silhouette une forme franche au lieu d'un gris moyen. */
            className={`absolute inset-0 h-full w-full scale-110 object-cover ${format.filtre}`}
          />

          {/* Dégradé des grands écrans, horizontal.
            ⚠️ LES DEUX CLASSES SONT ÉCRITES EN ENTIER, jamais composées.
            `bg-gradient-to-${sens}` paraît plus court mais Tailwind ne génère
            que les classes qu'il LIT dans les sources : une classe assemblée à
            l'exécution n'existe pas dans la feuille compilée. Le dégradé de la
            section à texte à droite manquait donc complètement, et son texte se
            posait à nu sur la photo. Aucune erreur nulle part — juste du blanc
            sur du clair. */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 hidden lg:block ${
              texteADroite ? "bg-gradient-to-l" : "bg-gradient-to-r"
            } ${format.voile}`}
          />

          {/* Fondu du bord OPPOSÉ. Ces deux photos ont un fond clair qui monte à
            169 de luminance : sans lui, la bande se terminait par une arête
            franche entre le gris clair de la photo et le noir de la page. */}
          <div
            aria-hidden="true"
            className={`absolute inset-y-0 hidden w-[12%] lg:block ${
              texteADroite
                ? "left-0 bg-gradient-to-r from-background to-transparent"
                : "right-0 bg-gradient-to-l from-background to-transparent"
            }`}
          />

          {/* Dégradé des petits écrans, vertical. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/30 lg:hidden"
          />
        </div>
      </div>

      {/* Le texte, exactement où il était : la section a retrouvé sa hauteur
          d'origine (le contenu, au moins 38rem, 44 au-delà de 768px) et son
          alignement. Le bloc collant vit dans un cadre absolu, donc hors du
          flux : il n'ajoute rien à la hauteur et ne déplace pas ce texte d'un
          pixel. Une première version l'avait remonté par une marge négative
          sous un bloc d'une hauteur de fenêtre — la section devenait alors
          haute d'au moins un écran et le texte démarrait tout en bas. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className={`lg:w-[46%] ${texteADroite ? "lg:ml-auto" : ""}`}>
          <PanneauFormat format={format} aDroite={texteADroite} />
        </div>
      </div>
    </section>
  );
}

/**
 * BIOGRAPHIE — trois blocs : le récit, les distinctions, deux citations.
 *
 * Le texte est celui fourni par Vince, à la TROISIÈME personne. Le reste du
 * site parle à la première (« je vous propose », « mes secrets ») ; la
 * biographie fait exception, comme les mentions légales, parce qu'un parcours
 * raconté par son propre auteur au « je » sonne faux dès qu'il énumère ses
 * prix. Ne pas « harmoniser » la voix ici.
 *
 * ⚠️ CE TEXTE SITUE VINCE À TOURS ET EN TOURAINE (installation en 2003,
 * Groupement régional des Magiciens de Touraine), alors que tout le reste du
 * site — SEO, mentions légales, pied de page, bandeau de villes — le situe en
 * PICARDIE. L'un des deux est faux et il faut trancher : un visiteur qui lit
 * « magicien en Picardie » en haut de page et « installé à Tours » au milieu
 * ne croit plus ni l'un ni l'autre. Voir README.md.
 */
function Biographie() {
  return (
    <section id="biographie" className="scroll-mt-24 border-b border-border py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* ── Colonne de gauche : le portrait, puis les citations ──────── */}
          <div>
            {/* ── LE PORTRAIT SANS CADRE ──────────────────────────────────
                Il était dans une carte arrondie avec une ombre portée. Il n'a
                plus ni cadre, ni coins, ni ombre : il ÉMERGE DE LA PAGE.

                ⚠️ CE QUI REND CELA POSSIBLE EST DANS LE FICHIER, PAS DANS LE CSS.

                `mix-blend-screen` donne, pour chaque pixel, 1 − (1 − photo) ×
                (1 − fond) : là où la photo vaut ZÉRO, le résultat EST le fond,
                au bit près. Le noir devient donc littéralement transparent, et
                le raccord ne se voit pas parce qu'il n'existe pas.

                Mais « zéro » doit être zéro. La photo sortait du studio avec
                des noirs à 1 ou 2 sur 255 — invisibles à l'œil nu sur l'image,
                et pourtant suffisants : en mode écran sur un fond à 12, un
                pixel à 1 rend 13, un pixel à 4 rend 16. Sur toute la surface,
                ce delta de 1 à 4 dessinait un rectangle légèrement plus clair
                que la page. Le fichier est donc réencodé avec une courbe qui
                écrase tout ce qui est sous 5 : 85 % de ses pixels valent
                maintenant exactement 0, et l'écart au fond y est de 0,00.

                ⚠️ NE PAS RÉENCODER CETTE PHOTO SANS REFAIRE CET ÉCRASEMENT.
                Un simple redimensionnement fera revenir le rectangle, sans que
                rien ne le signale ailleurs qu'à l'œil.

                Le haut est recadré de 15 % et le bas de 8 % : relevé par bandes,
                la photo n'avait AUCUN pixel au-dessus de 25 avant y = 20 % ni
                après y = 85 %. C'était du noir payé au poids du fichier et de
                la hauteur de page.

                Deux choses à ne pas faire :
                 - remettre `overflow-hidden` + `rounded` : il n'y a plus de
                   bord à arrondir, et le coin trancherait dans du vide ;
                 - donner un fond opaque et clair à un ancêtre proche. Le
                   mélange se fait avec ce qui est DESSOUS dans le même contexte
                   d'empilement ; sur du clair, le sujet disparaîtrait.

                Sur un navigateur sans `mix-blend-mode` — il n'en reste pas —
                l'image s'afficherait telle quelle : un rectangle noir sur un
                fond noir. La dégradation est invisible. */}
            {/* ⚠️ IL DÉBORDE DE SA COLONNE, VERS LE HAUT ET SUR LES CÔTÉS, et
                ce n'est possible que parce que ses bords sont transparents : un
                débordement se verrait aussitôt sur une image encadrée.

                `-mt-12` le fait monter de 48px au-dessus de la ligne où
                démarre « Biographie », dans la colonne d'en face. Les 48px ne
                sont pas 48px de sujet : le recadrage laisse environ 5 % de noir
                au-dessus des pièces, soit une trentaine de pixels invisibles à
                cette taille. Le sommet visible dépasse donc le mot d'une
                quinzaine de pixels — « très légèrement », ce qui était la
                demande. Il remonte dans le `py-28` de la section, largement
                assez profond pour l'absorber.

                `w-[115%]` avec `-ml-[7.5%]` l'élargit de part et d'autre. Vers
                la droite il prend 35px sur les 64 de gouttière, il ne touche
                donc pas la colonne de texte ; vers la gauche il mord sur le
                rembourrage de page, sans jamais sortir de la fenêtre.

                Tout est en `lg:` : en dessous, les deux colonnes sont empilées,
                le portrait n'a plus de titre à dépasser et déborderait dans le
                vide. */}
            <div className="relative lg:-ml-[7.5%] lg:-mt-12 lg:w-[115%]">
              {/* Halo doré derrière le sujet, très faible. Il ne se lit pas
                  comme une lumière mais comme une profondeur, et c'est ce qui
                  raccroche un noir et blanc à une charte dorée. 9 % seulement :
                  le halo passe SOUS une image dont 85 % est transparente, donc
                  il s'affiche presque en entier — au-delà, on voit une tache
                  et non une profondeur. Il s'éteint bien avant les bords, sans
                  quoi il redessinerait le rectangle qu'on vient d'effacer. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(46% 34% at 50% 40%, color-mix(in oklab, var(--gold) 9%, transparent), transparent 70%)",
                }}
              />
              <img
                src={bioImg}
                alt="Vince en costume sombre, surgissant du noir, trois pièces en suspension au-dessus de ses mains ouvertes"
                width={1212}
                height={1400}
                loading="lazy"
                className="relative w-full mix-blend-screen"
              />
            </div>

            {/* Les deux citations sous le portrait plutôt qu'au fil du récit :
                elles n'appartiennent pas à Vince, ce sont des voix extérieures.
                Les intercaler dans sa biographie aurait brouillé qui parle. */}
            <div className="mt-8 space-y-5">
              {citationsBio.map((citation) => (
                <blockquote
                  key={citation.texte}
                  className="border-l-2 border-[var(--gold)] pl-5 font-display text-xl leading-snug text-foreground/90"
                >
                  {citation.texte}
                </blockquote>
              ))}
            </div>
          </div>

          {/* ── Colonne de droite : le récit, puis les distinctions ──────── */}
          <div>
            <SectionTitle title="Biographie" />

            <div className="mt-10 space-y-6 text-lg font-light leading-relaxed text-muted-foreground">
              {recitBio.map((paragraphe) => (
                <p key={paragraphe.slice(0, 40)}>{paragraphe}</p>
              ))}
            </div>

            {/* Les distinctions en liste et non en prose : cinq lignes dont
                trois commencent par « 1er prix », c'est un palmarès. Noyées
                dans un paragraphe, on n'en retenait aucune. Le filet doré à
                gauche les rattache visuellement aux citations d'en face. */}
            <div className="mt-12 rounded-2xl border border-border bg-card/40 p-7">
              <p className="type-eyebrow font-title text-[var(--gold)]">
                Distinctions & affiliations
              </p>
              <ul className="mt-6 space-y-3.5">
                {distinctions.map((ligne) => (
                  <li key={ligne} className="flex items-start gap-3.5">
                    <Award
                      size={17}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 text-[var(--gold)]"
                      aria-hidden="true"
                    />
                    <span className="text-[0.95rem] leading-relaxed text-foreground/85">
                      {ligne}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * AVIS + FAQ, sur un fond distinct du reste de la page.
 *
 * LE FOND. La charte n'a qu'une couleur, l'or, et elle est réservée aux
 * actions : impossible d'y prendre une teinte pour marquer une section sans
 * lui faire dire « clique ici ». Le contraste se fait donc en LUMINANCE, pas
 * en teinte — `--card` (#161616) sur le fond de page (#0c0c0c), soit quatre
 * points de luminance. C'est peu à l'œil nu et c'est assez : la bande se
 * détache, sans qu'on puisse la prendre pour une autre charte. Deux filets
 * dorés très pâles ferment le bloc en haut et en bas.
 *
 * Ne pas « renforcer » ce fond en le teintant vers le brun ou le bleu : un
 * gris coloré posé à côté de l'or le fait virer au vert par contraste
 * simultané, et c'est exactement ce que la charte évite en tenant tous ses
 * neutres à chroma zéro (voir styles.css).
 *
 * LA STRUCTURE. Les deux blocs étaient côte à côte, moitié-moitié : trois avis
 * empilés à gauche, sept questions à droite, et deux colonnes qui n'avaient ni
 * la même longueur ni le même rythme de lecture. Ils sont maintenant l'un
 * SOUS l'autre, chacun sur toute la largeur et avec la mise en page que son
 * contenu appelle — trois avis en trois colonnes, les questions en deux.
 */
function ReviewsAndFaq() {
  return (
    // `id="avis"` : la section existait mais n'était atteignable par aucun lien.
    // `scroll-mt` compense la barre de navigation, qui est `fixed` et viendrait
    // sinon recouvrir le titre à l'arrivée sur l'ancre.
    <section
      id="avis"
      className="scroll-mt-24 border-y border-[var(--gold)]/20 bg-card py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Les avis, en autant de colonnes qu'il y en a ────────────────
            `md:grid-cols-3` est accordé aux trois avis actuels. En ajouter un
            quatrième laisserait une colonne seule sur la deuxième rangée :
            passer alors en `lg:grid-cols-4`, ou en garder trois et choisir. */}
        {reviews.length > 0 && (
          <>
            <SectionTitle title="Avis Google" />
            <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
              {reviews.map((review) => (
                <div
                  key={review.author}
                  className="rounded-2xl border border-border bg-background/40 p-7"
                >
                  <Citation review={review} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Les questions, sous les avis ───────────────────────────────
            Deux colonnes de `<details>` et non une seule longue liste : à
            six questions sur toute la largeur, chaque ligne faisait 1200px
            pour quatre mots, et le chevron se retrouvait à un demi-mètre de
            sa question.

            ⚠️ DEUX COLONNES RÉELLES, ET SURTOUT PAS `columns-2`.
            Les colonnes CSS RÉÉQUILIBRENT leur contenu : elles répartissent le
            flux pour que les colonnes restent de hauteur comparable. Or un
            `<details>` grandit à l'ouverture — le moteur recalculait donc la
            répartition à chaque clic et les questions CHANGEAIENT DE COLONNE,
            sautant de gauche à droite sous le curseur. `break-inside-avoid`
            n'y pouvait rien : il empêche de couper un élément en deux, pas de
            le déplacer.

            Ici la répartition est décidée une fois pour toutes, à la moitié de
            la liste, et chaque colonne est un bloc indépendant. Ouvrir une
            question ne pousse plus que ce qui la suit DANS SA COLONNE. Rien ne
            bouge latéralement, jamais.

            L'ancien commentaire écartait `grid` pour une autre raison, et elle
            était juste : une grille où chaque question est une cellule pousse
            toute sa rangée. Le piège était de conclure qu'il fallait des
            colonnes CSS — il fallait une grille de DEUX COLONNES, chacune
            contenant sa pile. */}
        {/* `mt-20` seulement s'il y a des avis au-dessus : sans eux, cette marge
            ouvrirait la section sur quatre-vingts pixels de vide. */}
        <div className={reviews.length > 0 ? "mt-20" : ""}>
          <SectionTitle title="Questions fréquentes" />
          <div className="mt-6 grid items-start gap-x-14 md:grid-cols-2">
            {[
              faqs.slice(0, Math.ceil(faqs.length / 2)),
              faqs.slice(Math.ceil(faqs.length / 2)),
            ].map((colonne, i) => (
              <div key={i}>
                {colonne.map((faq) => (
                  <details key={faq.question} className="group border-b border-border py-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-5 text-sm font-normal transition-colors hover:text-[var(--gold)] md:gap-6 md:text-lg">
                      {faq.question}
                      {/* Trois réglages pour ramener les questions sur UNE ligne en téléphone,
                      car aucun ne suffisait seul : la taille passe de 19 à 15px, la graisse
                      de 500 à 400, et l'écart au chevron de 25 à 13px. La plus longue
                      mesurait 369px pour 280px disponibles. */}
                      <ChevronDown
                        className="shrink-0 text-[var(--gold)] transition-transform group-open:rotate-180"
                        size={17}
                      />
                    </summary>
                    <p className="max-w-xl pb-6 text-base font-light leading-[1.7] text-muted-foreground">
                      {faq.reponse}
                    </p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Un avis Google, tronqué à trois lignes au-delà desquelles un bouton
 *  « Lire plus » prend le relais.
 *
 *  La règle est posée en lignes et non en signes : c'est la hauteur qui gêne,
 *  et elle dépend de la largeur de la colonne autant que du texte. D'où
 *  `max-h-[3lh]` — l'unité CSS `lh` vaut une hauteur de ligne de CET élément,
 *  donc le plafond suit tout seul le passage de `text-base` à `text-lg` en
 *  md, sans qu'aucune valeur ne soit à recalculer.
 *
 *  Le dégradé de disparition est fait au masque plutôt qu'avec un calque en
 *  dégradé : le fond de la section est semi-transparent (`bg-card/25`), un
 *  calque opaque y aurait laissé une bande plus claire.
 */
function Citation({ review }: { review: (typeof reviews)[number] }) {
  const corps = useRef<HTMLQuoteElement>(null);
  const [deborde, setDeborde] = useState(false);
  const [deplie, setDeplie] = useState(false);

  // Le plafond s'applique TANT QU'ON N'A PAS DÉPLIÉ, et non « seulement si ça
  // déborde » : sans plafond, `scrollHeight` vaut toujours `clientHeight` et
  // aucun débordement n'est jamais détecté — l'avis reste entier et le bouton
  // n'apparaît pas. C'est de l'état tronqué que la mesure doit partir.
  //
  // Et elle ne vaut QUE de cet état : déplié, les deux hauteurs sont de nouveau
  // égales par construction, et le bouton disparaîtrait au premier
  // redimensionnement, refermant l'avis sous les yeux du lecteur.
  const tronque = !deplie;

  useEffect(() => {
    const element = corps.current;
    if (!element || !tronque) return;
    const mesurer = () => setDeborde(element.scrollHeight - element.clientHeight > 2);
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(element);
    return () => observateur.disconnect();
  }, [tronque]);

  return (
    <figure className="border-l border-[var(--gold)] py-1 pl-6">
      {/* Étoiles et signature sur une seule ligne, au-dessus de la citation.
          La note et l'auteur disent la même chose — « quelqu'un de réel a mis
          cinq étoiles » — et les séparer par le texte obligeait à faire deux
          fois le trajet pour rassembler l'information.

          `flex-wrap` : en colonne étroite, « Prénom N. · Close-up, Communion »
          passe sous les étoiles plutôt que de déborder.

          La légende est en tête de `figure`, ce que la spécification autorise
          au même titre qu'en pied. */}
      <figcaption className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="flex gap-1 text-[var(--gold)]" aria-label="5 étoiles sur 5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={13} className="fill-current" />
          ))}
        </span>
        <span className="type-eyebrow text-foreground/90">
          {review.author}
          <span className="text-muted-foreground">
            {" "}
            · {review.animation}, {review.evenement}
          </span>
        </span>
      </figcaption>

      {/* Corps ramené de text-3xl à text-lg : à 51px, trois avis occupaient la
          hauteur d'un écran et se lisaient comme des titres, pas comme des
          témoignages. Le Playfair italique est conservé, c'est lui qui les
          distingue du reste de la page. */}
      <blockquote
        ref={corps}
        className={`font-display space-y-3 text-base italic leading-[1.6] md:text-lg ${tronque ? "overflow-hidden" : ""}`}
        style={{
          // Trois lignes PLEINES, et non « une hauteur de trois lignes ».
          // `space-y-3` pose 0.75rem entre les paragraphes : sans les ajouter au
          // plafond, cet espace se prenait sur le texte et la troisième ligne
          // était tranchée en deux dans le sens de la hauteur — on aurait cru à
          // un défaut d'affichage plutôt qu'à une coupe voulue.
          maxHeight: tronque ? `calc(3lh + ${(review.quote.length - 1) * 0.75}rem)` : undefined,
          ...(tronque && deborde
            ? {
                maskImage: "linear-gradient(to bottom, #000 78%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent)",
              }
            : {}),
        }}
      >
        {review.quote.map((paragraphe, i) => (
          <p key={i}>
            {i === 0 ? "« " : null}
            {paragraphe}
            {i === review.quote.length - 1 ? " »" : null}
          </p>
        ))}
      </blockquote>

      {/* Pas de `type-action` ici : cet utilitaire met en capitales et écarte
          les lettres, ce qui donnait à « LIRE PLUS » le poids d'un appel à
          l'action principal. Ce n'est qu'une commande de lecture — écrite
          normalement, et plus petite que le texte qu'elle prolonge. */}
      {deborde && (
        <button
          type="button"
          onClick={() => setDeplie((valeur) => !valeur)}
          aria-expanded={deplie}
          className="mt-3 text-xs font-medium text-[var(--gold)] underline underline-offset-4 transition-colors hover:text-[var(--gold-soft)]"
        >
          {deplie ? "Réduire" : "Lire plus"}
        </button>
      )}
    </figure>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-5">
      {/* Deux crans plus petit sur téléphone. À 38px, « Questions fréquentes »
          occupait 366px sur 375 : le filet qui le suit n'avait plus un pixel où
          s'inscrire et le titre touchait les deux bords. À 32px il en restait
          encore zéro — 305px de titre plus l'écart dépassaient les 324
          disponibles. À 26px, le filet retrouve une soixantaine de pixels.
          Ces deux titres ne sont pas des titres de section pleine largeur mais
          des en-têtes de colonne, accompagnés d'un filet : une taille plus
          mesurée leur va mieux qu'aux autres. */}
      <h2 className="shrink-0 font-display text-2xl leading-tight text-[var(--gold)] md:text-4xl">
        {title}
      </h2>
      <span className="h-px flex-1 bg-[var(--gold)]/25" />
    </div>
  );
}

/** Une tuile de galerie qui joue une boucle au lieu d'afficher une image fixe.
 *
 *  Muette et sans contrôles : à cette taille, c'est une image qui bouge. Le son
 *  et la barre de lecture n'apparaissent qu'à l'ouverture de la visionneuse.
 *
 *  La lecture est SUSPENDUE hors champ. Sans cela, la boucle tournerait pendant
 *  toute la visite — trois secondes rejouées indéfiniment, à décoder en
 *  permanence, pour une tuile que personne ne regarde. Sur mobile, cela se paie
 *  en batterie autant qu'en données.
 */
function TuileVideo({ photo }: { photo: Photo }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion) return;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) video.play().catch(() => {});
        else if (!video.paused) video.pause();
      },
      { threshold: 0.2 },
    );
    observateur.observe(video);
    return () => observateur.disconnect();
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      src={photo.video}
      poster={photo.src}
      muted
      loop
      playsInline
      // `preload="none"` : rien n'est téléchargé tant que la tuile n'est pas
      // arrivée à l'écran. L'affiche tient la place d'ici là.
      preload="none"
      aria-label={photo.alt}
      className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80"
    />
  );
}

/**
 * LE MOTIF DE LA MOSAÏQUE, six tuiles qui se répètent.
 *
 * Six et pas un autre nombre : c'est le plus petit cycle qui remplisse
 * EXACTEMENT la grille aux deux points de rupture, sans trou ni tuile
 * orpheline.
 *
 *   4 colonnes (≥768px)          2 colonnes (mobile)
 *   ┌───────┬───┬───┐            ┌───────┐
 *   │       │ 1 │ 2 │            │       │
 *   │   0   ├───┴───┤            │   0   │
 *   │       │   3   │            │       │
 *   ├───────┼───────┤            ├───┬───┤
 *   │   4   │   5   │            │ 1 │ 2 │
 *   └───────┴───────┘            ├───┴───┤
 *                                │   3   │
 *   0 → 4 cases, 1+2 → 2,        ├───┬───┤
 *   3+4+5 → 6. Total 12 = 4×3.   │ 4 │ 5 │
 *                                └───┴───┘
 *                                Total 10 = 2×5.
 *
 * Seules les positions 4 et 5 changent de comportement : larges sur ordinateur,
 * carrées sur téléphone, où trois bandeaux pleine largeur d'affilée auraient
 * alourdi la descente.
 *
 * ⚠️ NE PAS PASSER LA GRILLE EN `grid-auto-flow: dense`. Le navigateur
 * comblerait bien les trous tout seul, mais en réordonnant les tuiles : l'ordre
 * à l'écran ne serait plus celui du DOM, et les flèches de la visionneuse
 * passeraient à une photo qui n'est pas celle d'à côté.
 *
 * Les rapports d'image portent la hauteur des rangées. La grande tuile est
 * carrée elle aussi : sans rapport imposé, les deux rangées qu'elle occupe
 * n'auraient aucune hauteur et s'effondreraient.
 */
const MOTIF_TUILES = [
  "col-span-2 row-span-2 aspect-square",
  "aspect-square",
  "aspect-square",
  "col-span-2 aspect-[2/1]",
  "aspect-square md:col-span-2 md:aspect-[2/1]",
  "aspect-square md:col-span-2 md:aspect-[2/1]",
];

function EditorialGallery() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  // UN MOTIF ENTIER, soit six tuiles. C'était huit tant que la grille était
  // uniforme ; avec la mosaïque, huit coupait le motif en plein milieu et
  // laissait deux trous en bas de l'aperçu. Toute autre valeur qu'un multiple
  // de six rouvrira ces trous.
  const APERCU = 6;
  const visible = expanded ? gallery : gallery.slice(0, APERCU);
  const restantes = gallery.length - APERCU;
  const ctaRef = useRef<HTMLDivElement>(null);

  // En repliant, la page perd quatre rangées de vignettes D'UN COUP, et elles
  // disparaissent AU-DESSUS du point où l'on se trouve : le navigateur garde la
  // même position de défilement, qui ne correspond plus à rien, et on se
  // retrouve projeté quelque part sous la galerie.
  //
  // On ramène donc le bouton sous les yeux après le repli. `requestAnimationFrame`
  // attend que React ait retiré les rangées : mesurer avant donnerait l'ancienne
  // position, celle-là même qui vient de devenir fausse.
  //
  // Rien au dépliement : les rangées s'ajoutent en dessous, la vue ne bouge pas.
  const replierOuDeplier = () => {
    const onReplie = expanded;
    setExpanded(!expanded);
    if (onReplie) {
      requestAnimationFrame(() =>
        ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
      );
    }
  };

  return (
    <section
      id="galerie"
      /* Marge d'ancrage NÉGATIVE, et c'est voulu.
         L'ancre vit sur la section, mais entre le haut de la section et le titre
         s'intercalent son `padding-top` (85px, 119px en md) puis le sur-titre et
         sa marge (~31px). Avec un `scroll-mt-24` positif, cliquer « Galerie »
         déposait le titre à 252px du haut de la fenêtre pour une barre de menu
         de 86px : les deux tiers de l'écran étaient vides.
         La marge négative rattrape ce décalage pour que le TITRE arrive sous la
         barre, et non le sur-titre. Calcul : 110 (barre + respiration) − padding
         − sur-titre, soit ≈ −6px en mobile et ≈ −40px au-delà de 768px. */
      className="-scroll-mt-1 md:-scroll-mt-10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div>
          <Filet>En images</Filet>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[1.04] md:text-7xl">
            <TitreRevele>Des moments magiques,</TitreRevele>
            <TitreRevele>
              <em className="font-normal text-[var(--gold)]">tout simplement.</em>
            </TitreRevele>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {visible.map((photo, index) => (
            /* Clé par INDEX et non par `src`. La tuile animée réutilise comme
               affiche une photo déjà présente dans la galerie : deux entrées
               partageaient donc la même clé, et React rendait neuf tuiles au
               lieu de huit, la vidéo apparaissant en double.
               La liste est figée — ni tri, ni insertion, ni suppression à
               l'exécution — l'index y est donc une clé stable et unique. */
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className={`group relative overflow-hidden bg-card ${MOTIF_TUILES[index % MOTIF_TUILES.length]}`}
              aria-label={`Agrandir : ${photo.alt}`}
            >
              {/* `objectPosition` n'existe que pour les photos non rognées à la
                  fabrication ; pour un carré déjà cadré, « 50% 50% » ne change
                  rien. Un seul rendu sert donc aux deux générations. */}
              {photo.video ? (
                <TuileVideo photo={photo} />
              ) : (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  style={{ objectPosition: photo.cadrage ?? "50% 50%" }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
              )}
              <span className="absolute inset-0 border border-transparent transition-colors group-hover:border-[var(--gold)]/60" />
            </button>
          ))}
        </div>

        {/* Le bouton suit la grille au lieu de la surplomber : c'est après avoir
            parcouru les deux rangées qu'on se demande s'il y en a d'autres, pas
            avant de les avoir vues. Le compte restant évite d'avoir à cliquer
            pour savoir ce qu'on y gagne. */}
        <div ref={ctaRef} className="mt-10 flex justify-center md:mt-12">
          <Button
            variant="outline"
            onClick={replierOuDeplier}
            className="type-action h-auto rounded-none border-[var(--gold)] px-7 py-3.5 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-primary-foreground"
          >
            {expanded ? "Réduire la galerie" : `Voir ${restantes} photos de plus`}
          </Button>
        </div>
      </div>

      {/* La visionneuse parcourt les VINGT photos, pas seulement les huit
          affichées : une fois le panneau ouvert, buter sur la huitième et
          revenir à la première alors qu'il en reste douze donnerait la galerie
          pour terminée.

          Passer au-delà de l'aperçu déplie la grille au passage, pour qu'à la
          fermeture on retrouve derrière soi la photo que l'on regardait, et non
          une grille qui s'arrête avant elle. */}
      <Visionneuse
        photos={gallery}
        index={active}
        onIndex={(suivant) => {
          setActive(suivant);
          if (suivant >= APERCU) setExpanded(true);
        }}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
