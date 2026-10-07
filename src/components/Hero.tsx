import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

import { ouvrirLaVideo } from "@/components/VideoPleinEcran";

import heroBgImg from "@/assets/Background-Hero-MagicVince.webp";
// Icônes du hero. Ce sont des PNG d'une seule couleur sur fond transparent :
// l'utilitaire `picto` ne garde que leur silhouette et les repeint en or
// (voir styles.css), donc leur couleur d'export n'a aucune importance.
// Jeu de pictogrammes de la rangée de formats. Les cinq fichiers forment une
// série cohérente — même graisse de trait, mêmes angles arrondis — et
// remplacent les quatre `Icone-*.png` de la première livraison, qui n'en
// comptaient pas assez pour couvrir les cinq formats. Les anciens restent dans
// `src/assets/icones/` mais ne sont plus importés nulle part.
import icoCocktail from "@/assets/icones/cocktail.webp";
import icoCloseup from "@/assets/icones/cartes.webp";
import icoSeminaires from "@/assets/icones/presentation.webp";
import icoGalas from "@/assets/icones/champagne.webp";
import icoSpectacles from "@/assets/icones/spectacle.webp";
import icoLecture from "@/assets/icones/bouton-lecture.webp";
// Pictogrammes du bandeau de preuves, sous les boutons.
import icoCalendrier from "@/assets/icones/calendrier-etoile.webp";
import icoGoogle from "@/assets/icones/logo-google.webp";
import icoEtoile from "@/assets/icones/etoile.webp";

import { VIDEO_AMBIANCE, VIDEO_CLOSE_UP } from "@/lib/medias";

// Les trois preuves qui défilent sous les boutons. Elles ont existé ici en
// rangée fixe, puis ont disparu avec la maquette qui ne les montrait pas ;
// elles reviennent sur UNE ligne qui tourne, ce qui les remet dans le hero
// sans lui coûter la hauteur de trois colonnes.
const preuves = [
  { picto: icoCalendrier, texte: "Plus de 500 événements animés" },
  { picto: icoGoogle, texte: "Une note de 5/5 sur Google" },
  { picto: icoEtoile, texte: "Plus de 10 ans d’expérience" },
];

const DUREE_PREUVE = 3600;

/**
 * Le bandeau de preuves : un filet, puis une ligne qui tourne.
 *
 * ⚠️ EN `prefers-reduced-motion`, LES TROIS SONT AFFICHÉES D'UN COUP, côte à
 * côte, et rien ne tourne. Ce n'est pas une simple politesse : un contenu qui
 * se met à jour tout seul au-delà de cinq secondes doit pouvoir être arrêté
 * (WCAG 2.2.2), et un carrousel sans commande de pause ne le peut pas. La
 * version statique EST la version accessible, pas un repli dégradé — elle
 * montre même davantage, les trois preuves au lieu d'une.
 *
 * `mode="wait"` sur l'AnimatePresence : sans lui, la preuve sortante et
 * l'entrante se superposent une demi-seconde, et comme elles n'ont pas la
 * même longueur, la ligne se dédouble puis se recentre. Avec, la sortante
 * finit avant que l'entrante commence.
 *
 * La hauteur de la ligne est FIXE (`h-6`). Les trois textes n'ont pas la même
 * longueur : sans hauteur imposée, un passage à la ligne sur l'un d'eux
 * décalerait tout le bas du hero à chaque rotation.
 */
function BandeauPreuves() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % preuves.length), DUREE_PREUVE);
    return () => clearInterval(t);
  }, [reduceMotion]);

  return (
    <div className="mt-6 md:mt-7">
      {/* Le bandeau est AU-DESSUS du filet, et le filet ferme donc le hero au
          lieu de séparer deux blocs. Les chiffres se rattachent ainsi aux
          boutons qu'ils appuient, et la rangée de formats repart sous un
          trait net. */}
      <div className="flex h-5 items-center justify-center gap-3 md:justify-start">
        {/* Le libellé annonce ce qui défile : sans lui, un chiffre qui change
            tout seul se lit comme une bannière publicitaire. */}
        <span className="type-eyebrow font-title shrink-0 text-muted-foreground">
          Le magicien Vince en quelques chiffres&nbsp;:
        </span>
        {reduceMotion ? (
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-start">
            {preuves.map((preuve) => (
              <li key={preuve.texte} className="flex items-center gap-2.5">
                <Picto dessin={preuve.picto} />
                <span className="text-[0.82rem] text-foreground/85">{preuve.texte}</span>
              </li>
            ))}
          </ul>
        ) : (
          /* `aria-live="off"` : la ligne change toute seule, sans que le
             visiteur l'ait demandé. L'annoncer à chaque rotation couperait la
             parole à un lecteur d'écran en pleine lecture du titre. Les trois
             textes restent lisibles — la rotation finit par tous les montrer. */
          <div aria-live="off" className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={preuves[index].texte}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5 whitespace-nowrap"
              >
                <Picto dessin={preuves[index].picto} />
                <span className="text-[0.82rem] text-foreground/85 min-[1460px]:text-[0.9rem]">
                  {preuves[index].texte}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Le filet, désormais SOUS les chiffres. */}
      <span aria-hidden="true" className="mt-3 block h-px w-full bg-[var(--gold)]/30" />
    </div>
  );
}

function Picto({ dessin }: { dessin: string }) {
  return (
    <span
      aria-hidden="true"
      className="picto h-4 w-4 shrink-0 text-[var(--gold)]"
      style={{ "--picto": `url(${dessin})` } as CSSProperties}
    />
  );
}

/**
 * Décide si on a le droit de télécharger la vidéo de fond.
 *
 * Renvoie `false` au premier rendu, TOUJOURS — y compris côté serveur. C'est
 * volontaire : le rendu initial ne contient donc aucune balise `<video>`, et
 * l'affiche s'affiche seule. La vidéo n'est montée qu'après hydratation, une
 * fois ces trois conditions vérifiées :
 *
 *  1. viewport ≥ 768px. En dessous, la photo de fond est déjà masquée — un
 *     `hidden md:block` ne suffirait PAS ici : la balise serait dans le DOM et
 *     le navigateur téléchargerait la vidéo quand même, invisible. Il faut ne
 *     pas la monter du tout.
 *  2. le visiteur n'a pas demandé d'économiser les données (`saveData`).
 *  3. la connexion n'est pas annoncée comme lente (2g/3g).
 *
 * Les points 2 et 3 passent par `navigator.connection`, que Safari et Firefox
 * n'implémentent pas — d'où les `?.` et le repli permissif : en l'absence
 * d'information on charge, comme n'importe quelle autre ressource du site.
 */
function usePeutChargerLaVideo(actif: boolean) {
  const [peut, setPeut] = useState(false);

  useEffect(() => {
    if (!actif) {
      setPeut(false);
      return;
    }
    const mql = window.matchMedia("(min-width: 768px)");
    const reseau = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const reseauCorrect = !reseau?.saveData && !/(^|-)[23]g$/.test(reseau?.effectiveType ?? "");

    const evaluer = () => setPeut(mql.matches && reseauCorrect);
    evaluer();
    mql.addEventListener("change", evaluer);
    return () => mql.removeEventListener("change", evaluer);
  }, [actif]);

  return peut;
}

// Les quatre formats annoncés sous les boutons, dans l'ordre de la maquette.
// Chacun pointe vers la section qui le développe plus bas ; « Cocktail » et
// « Galas » n'ont pas de section à eux et renvoient vers celle qui les couvre.
//
// Ils étaient CINQ : « Ateliers » a disparu d'ici avec la section qu'il visait.
// Les quatre restants ne pointent donc que vers `#close-up` et `#spectacles`,
// les deux seules sections de formats encore en page.
// LES CINQ SONT DÉSORMAIS DES PNG. « Séminaires » portait une icône lucide
// faute de dessin adéquat dans la première livraison ; `presentation.png` est
// arrivé depuis, et la rangée est enfin d'une seule main. Le rendu par masque
// alpha (`Picto`) rend d'ailleurs le mélange visible dès qu'il existe : un
// tracé lucide est vectoriel et d'une graisse constante, un masque PNG suit la
// graisse de son dessin.
//
// `champagne.png` — deux flûtes qui trinquent — pour « Galas » plutôt que le
// chapeau haut de forme d'avant : dans une rangée qui commence par une coupe de
// cocktail, le trinquement dit la soirée de gala, là où le chapeau disait le
// magicien, ce que les quatre autres disent déjà.
//
// ⚠️ Ces fichiers sont des MASQUES : seule leur couche alpha est lue, la
// couleur du fichier ne sert à rien. Un PNG sans transparence donnerait un
// rectangle plein. Les cinq ont été vérifiés (65 % à 85 % de pixels
// transparents).
const heroFormats = [
  { label: "Cocktail", picto: icoCocktail, href: "#close-up" },
  { label: "Close-up", picto: icoCloseup, href: "#close-up" },
  { label: "Séminaires", picto: icoSeminaires, href: "#close-up" },
  { label: "Galas", picto: icoGalas, href: "#spectacles" },
  { label: "Spectacles de scène", picto: icoSpectacles, href: "#spectacles" },
];

// La signature manuscrite posée à droite du hero. Elle existait en PNG
// (`Texte-Signature-...png`) ; c'est désormais du VRAI TEXTE en Caveat.
// Ce qu'on y gagne : elle reste nette à toute densité d'écran, elle se
// redimensionne sans second fichier, elle est lue par les moteurs de recherche
// et les lecteurs d'écran, et elle ne coûte plus 465 Ko.
//
// Une ligne par entrée : la maquette impose ces trois coupes-là, et un retour
// automatique les placerait ailleurs à la moindre variation de largeur.
const signatureLignes = ["La magie,", "partout où les gens", "se rencontrent."];

/**
 * Le hero de la page d'accueil. Il n'y a plus qu'une page d'accueil.
 *
 * ⚠️ UN SEUL MODE DÉSORMAIS : la vidéo en plein cadre, bord à bord, qui passe
 * SOUS une barre de navigation sans fond.
 *
 * Ce composant a porté une prop `fond` à trois valeurs — `"photo"`, `"video"`
 * et `"video-plein"` — le temps d'arbitrer entre trois pages d'accueil
 * concurrentes, `/`, `/home-v2` et `/home-v3`. L'arbitrage est fait : c'est
 * l'ancienne v3 qui l'emporte, les deux autres routes ont été supprimées, et
 * la prop avec elles. Elle n'aurait plus décrit qu'un choix qui ne se pose
 * plus, avec deux branches que personne n'emprunte.
 *
 * Ce qui a disparu avec elle, pour mémoire :
 *   - `"photo"`      : la photo en fond, sans vidéo du tout ;
 *   - `"video"`      : la vidéo commençant SOUS une barre opaque, d'où un
 *                      décalage haut calé sur la hauteur de la barre.
 *
 * ⚠️ LA PHOTO, ELLE, RESTE — et ne pas la confondre avec le mode `"photo"`
 * supprimé. Elle est montée sous la vidéo et tient trois rôles : repli si la
 * lecture échoue, fond pour les écrans étroits et les connexions limitées, où
 * l'on refuse de télécharger 43 Mo, et fond pour `prefers-reduced-motion`.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // SORTIE AU SCROLL : UN FONDU, ET RIEN D'AUTRE.
  //
  // Le contenu perdait aussi 6 % de taille (`scale` de 1 à 0.94) et s'enfonçait
  // de 120px pendant la sortie. Les deux sont retirés : il ne reste que
  // l'opacité, plus le voile sombre qui se referme sur la photo — deux fondus,
  // aucun mouvement.
  //
  // ⚠️ NE PAS REMETTRE DE `scale` NI DE `y` ICI. Ce hero a déjà perdu, pour la
  // même raison, le zoom de sa photo de fond (`scale` de 1 à 1.12) et la dérive
  // verticale de 4 % qui en dépendait — la dérive ne pouvait exister que parce
  // que l'agrandissement lui ménageait du débord. Il ne reste plus rien qui
  // bouge au défilement, et c'est voulu.
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const veil = useTransform(scrollYProgress, [0, 0.9], [0, 0.7]);
  const reduceMotion = useReducedMotion();
  // Conservé comme constante plutôt que supprimé partout : il nomme l'intention
  // aux six endroits qui s'en servent, et c'est lui qu'il faudrait repasser à
  // `false` pour revenir à un hero en photo seule.
  const estVideo = true;
  const peutCharger = usePeutChargerLaVideo(!reduceMotion);
  const [videoPrete, setVideoPrete] = useState(false);
  // La vidéo a renoncé : réseau coupé, format refusé, fichier absent. C'est ce
  // qui rend la photo de repli à nouveau visible — sans cet état, un échec
  // laisserait un hero noir, puisque la photo est masquée dès qu'on attend une
  // vidéo (voir plus bas).
  const [videoEchouee, setVideoEchouee] = useState(false);
  // Vrai dans la dernière seconde de la boucle. Pilote le fondu qui masque le
  // saut de la fin vers le début.
  const [finDeBoucle, setFinDeBoucle] = useState(false);

  // ── LA PHOTO S'EFFACE QUAND UNE VIDÉO EST ATTENDUE ────────────────────────
  //
  // Évite l'enchaînement « photo, puis vidéo » : les deux n'ont pas le même
  // cadrage ni le même instant, et la bascule se voyait comme une saute. Le
  // temps de la mise en mémoire tampon, on montre le noir du fond de page —
  // qui est la couleur du hero de toute façon — et la vidéo y apparaît en
  // fondu.
  //
  // ⚠️ LA CONDITION REPOSE SUR `estVideo`, PAS SUR `peutCharger`, et c'est
  // tout l'enjeu. `peutCharger` est décidé par un effet, donc FAUX au rendu
  // serveur : bâti dessus, le serveur émettait une photo prioritaire et son
  // `<link rel="preload">` sur les variantes vidéo comme sur la photo. Le
  // mettait donc à télécharger la photo en priorité avant même d'avoir lu le
  // moindre octet de vidéo. Corrigé côté client seulement, le mal était déjà
  // fait — la balise est dans le HTML initial.
  //
  // `estVideo` vient de la prop `fond` : le serveur la connaît. La photo part
  // donc masquée dès le premier octet servi, et le preload n'est jamais émis
  // sur les variantes vidéo.
  //
  // `hydrate` rattrape le seul cas où ce pari est mauvais : un client qui ne
  // peut PAS charger la vidéo — écran étroit, mode économie de données, réseau
  // lent. On ne l'apprend qu'après l'hydratation ; la photo redevient alors
  // visible. Elle reste à `false` au premier rendu client comme au rendu
  // serveur, donc les deux HTML coïncident et React ne signale aucun écart.
  const [hydrate, setHydrate] = useState(false);
  useEffect(() => setHydrate(true), []);
  const attendLaVideo = estVideo && !videoEchouee && (!hydrate || peutCharger);

  // Plein cadre : le média couvre toute la section, bord à bord.
  //
  // Le cadrage par défaut cale le média sur la HAUTEUR et l'aligne à droite
  // (`h-full w-auto`), parce que la photo de la maquette perd son sujet dès
  // qu'on la recadre. Une vidéo n'a pas cette contrainte : on peut la faire
  // déborder des deux côtés sans rien perdre d'essentiel, et elle occupe alors
  // vraiment toute la largeur.
  // Le média couvre toute la section, bord à bord. Il existait un second
  // cadrage, calé sur la HAUTEUR et aligné à droite, pour le mode photo seule :
  // la photo de la maquette perd son sujet dès qu'on la recadre. Une vidéo n'a
  // pas cette contrainte, on peut la faire déborder des deux côtés sans rien
  // perdre d'essentiel.
  //
  // ⚠️ LA PHOTO DE REPLI GARDE L'ANCIEN CADRAGE, et il ne faut pas les
  // réunifier : quand elle s'affiche seule — écran étroit, connexion limitée,
  // animations réduites — elle a de nouveau besoin d'être vue en entier.
  const cadrageMedia = "absolute inset-0 h-full w-full object-cover object-center";
  const cadragePhoto =
    "absolute inset-y-0 right-0 h-full w-auto min-w-[90%] max-w-none object-cover object-[right_top]";

  return (
    // La réserve en haut vaut à TOUTES les tailles, pas seulement sur mobile.
    // La barre de navigation est en `position: fixed` : elle ne prend aucune
    // place dans le flux, elle se pose par-dessus. Tant que la section faisait
    // exactement une hauteur d'écran (`h-svh`) avec son contenu centré, un
    // contenu plus haut que l'espace disponible remontait sous la barre — le
    // surtitre venait se caler à la hauteur du logo. Le padding garantit que le
    // contenu commence toujours SOUS la barre, et `items-center` ne centre plus
    // que dans ce qui reste.
    //
    // Et min-h plutôt que h : à hauteur fixe, un contenu plus haut que l'écran
    // débordait et le overflow-hidden tranchait les chiffres du bas. La section
    // peut désormais s'étirer quand son contenu l'exige, et la page défile.
    <section
      id="top"
      ref={ref}
      /* `min-h-svh` sans surcharge : `md:min-h-[660px]` ne s'ajoutait pas au
         plancher d'une hauteur d'écran, il le REMPLAÇAIT. Au-delà de 768px le
         hero ne faisait donc plus que la hauteur de son contenu, et le bandeau
         défilant de la section suivante apparaissait en bas de la fenêtre. */
      /* ⚠️ `items-end` ET NON `items-center` : le contenu se cale EN BAS de
         l'écran, pas au milieu.
         Centré, il flottait sur les écrans hauts — sur un 1080 il reste
         environ 250px de jeu une fois les marges déduites, dont la moitié
         passait sous le bloc. Aligné en bas, tout ce jeu passe au-dessus et le
         hero s'appuie sur le bas de la fenêtre.
         Le changement ne se voit QUE là où il y a du jeu : dès que le contenu
         remplit la hauteur disponible — un portable, une fenêtre courte — les
         deux alignements donnent le même résultat.
         `pb-24` au-delà de 768px et non `pb-12` : c'est la « légère marge »
         qui empêche le bloc de toucher le bord, et elle doit dégager
         l'indicateur de défilement, qui vit en `absolute` entre 28 et 72px du
         bas. À 48px, les libellés de formats seraient tombés dessus. */
      className="hero-section relative flex min-h-svh w-full items-end overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24"
    >
      {/* Média de fond — écarté sur mobile : le cadrage y est trop serré pour
          rester lisible, le bloc de texte se pose sur le fond nu.

          `top-20 lg:top-24` en variante « sous le menu » : ce sont EXACTEMENT
          les hauteurs de la barre de navigation (`h-20` en dessous de 1024px,
          `h-24` au-dessus, voir SiteNav). Les deux valeurs doivent rester
          synchronisées — un décalage laisserait soit une bande de fond nu sous
          la barre, soit un bout de vidéo qui repasse dessous.

          Le média part donc du bas de la barre et descend jusqu'au bas de la
          section : il n'est plus « toute hauteur » de la fenêtre, mais bien
          toute hauteur de ce qui reste une fois la barre posée. */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 hidden md:block"
      >
        {/* Un seul niveau désormais. Il y en avait deux parce que l'entrée et la
            sortie au scroll animaient toutes deux le `scale` et se seraient
            disputé la propriété sur un même élément. Le scroll n'y touchant
            plus, le calque intermédiaire n'a plus lieu d'être. */}
        <div className="absolute inset-0">
          <img
            src={heroBgImg}
            alt="Vince, magicien en Picardie, en costume avec une flamme dans les mains"
            width={1672}
            height={941}
            /* ⚠️ `fetchPriority` N'EST PLUS « high » QUAND UNE VIDÉO EST
               ATTENDUE, et ce n'est pas un réglage de confort. React émet
               automatiquement un `<link rel="preload" as="image">` dans le
               `<head>` pour toute image marquée prioritaire — vérifié dans le
               HTML servi. Sur une page à fond vidéo, ce preload faisait donc
               télécharger la photo EN PRIORITÉ, avant et contre la vidéo qui
               allait la recouvrir : deux fichiers en concurrence pour la même
               bande passante, et c'est le gros des deux qui perdait.
               Sur `/`, où la photo EST le fond, elle reste prioritaire — c'est
               l'image LCP. La condition porte sur `estVideo`, connu du serveur,
               et non sur `attendLaVideo` qui dépend de l'hydratation : c'est le
               HTML SERVI qui porte la balise de preload, la corriger après coup
               n'annule rien. */
            {...(estVideo
              ? // ⚠️ NI `fetchPriority` NI `loading="eager"` sur les variantes
                // vidéo. React précharge toute image rendue en chargement
                // immédiat dès qu'elle porte un `fetchPriority`, MÊME à
                // « auto » — vérifié dans le HTML servi, la balise
                // `<link rel="preload" as="image" fetchPriority="auto">` y
                // était encore après le passage de « high » à « auto ».
                // Les deux attributs retirés, il ne reste rien à précharger et
                // la photo n'est demandée que si le repli en a besoin.
                { loading: "lazy" as const }
              : { fetchPriority: "high" as const, loading: "eager" as const })}
            style={{ opacity: attendLaVideo ? 0 : 1 }}
            /* La photo est calée sur la HAUTEUR, pas sur la largeur, et alignée
               à droite. Sa largeur suit son format d'origine (`w-auto`).

               Avant, elle remplissait la section en `object-cover` : sur une
               fenêtre plus large que son 16/9, elle était agrandie jusqu'à
               couvrir toute la largeur, ce qui débordait en hauteur et rognait
               le magicien par le bas — on le voyait donc moins en grand écran
               qu'en écran étroit, exactement l'inverse de ce qu'on attend.

               Calée sur la hauteur, elle est toujours montrée en entier. Quand
               la fenêtre est plus large que la photo, il reste du vide à gauche
               — et c'est sans conséquence : le bord gauche de la photo est
               EXACTEMENT le fond de page (#0c0c0c des deux côtés, relevé au
               pixel sur la maquette), et le voile dégradé le recouvre à cet
               endroit à plus de 90 %. Le raccord est donc invisible.

               C'est ce raccord qui impose de changer la photo du hero en même
               temps que la charte : l'ancienne avait un bord gauche bleu nuit,
               accordé au fond bleu d'alors. Sur le noir, ce bord se serait vu
               comme une bande.

               `max-w-none` est indispensable : la préflight de Tailwind impose
               `max-width: 100%` aux images, ce qui écraserait la largeur
               calculée et ramènerait le problème.

               `min-w-[90%]` ramène le magicien vers la gauche sur grand écran.
               Calée sur la seule hauteur, la photo était plaquée contre le bord
               droit et laissait tout le vide à gauche : le magicien partait trop
               à droite. Ce plancher de largeur l'élargit juste assez pour qu'il
               revienne, au prix d'un léger rognage par le bas — invisible, c'est
               le sol. On ne peut PAS obtenir le même effet en décalant la photo
               vers la gauche : son bord droit n'est pas bleu nuit mais la salle
               éclairée, et le raccord avec le fond se verrait aussitôt.
               En dessous, quand la largeur calculée dépasse déjà les 90 %, le
               plancher ne s'applique pas et rien ne change — c'est le cadrage
               des écrans étroits, qui convient tel quel. */
            className={`${cadragePhoto} transition-opacity duration-700`}
          />

          {/* LA VIDÉO, par-dessus l'image.
              L'image reste montée en dessous et joue trois rôles à la fois :
              affiche le temps que la vidéo se charge, repli si la lecture
              échoue, et fond définitif pour qui a demandé moins d'animations.
              C'est aussi ce qui permet de ne rien changer au cadrage : la vidéo
              reprend exactement les mêmes classes de positionnement.

              `muted` n'est pas une préférence mais une CONDITION : aucun
              navigateur n'autorise la lecture automatique d'une vidéo sonore.
              Le fichier a d'ailleurs une piste audio dont un fond n'a aucun
              usage — elle est à retirer au réencodage.

              `playsInline` empêche iOS de basculer en lecteur plein écran.

              L'opacité passe à 1 sur `canPlay` et non au montage : sans ça, on
              verrait un rectangle noir recouvrir l'affiche pendant toute la
              mise en mémoire tampon. */}
          {peutCharger && !videoEchouee && (
            <video
              src={VIDEO_AMBIANCE}
              /* ⚠️ PAS DE `poster`. Il valait la photo de fond : le navigateur
                 la peignait donc pendant toute la mise en mémoire tampon, ce
                 qui ramenait par la fenêtre l'enchaînement « photo puis vidéo »
                 que le masquage de l'image vient d'écarter. Sans affiche, le
                 cadre reste au noir du fond de page jusqu'à la première image
                 — c'est la couleur du hero, cela ne se remarque pas. */
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              onCanPlay={() => setVideoPrete(true)}
              /* ── LE FONDU DE FIN DE BOUCLE ──────────────────────────────
                 `loop` recommence la vidéo d'un seul coup : la dernière image
                 laisse place à la première sans transition, et la coupure se
                 voit d'autant plus que ce plan est un fond continu.

                 On atténue donc l'image sur la dernière seconde, et le retour
                 au début se fait à l'écran noir. Au redémarrage, `reste`
                 repasse à trente secondes, la condition tombe d'elle-même et
                 l'image revient en fondu. Aucun minuteur à tenir, aucun état à
                 remettre à zéro : la position de lecture suffit.

                 ⚠️ `loop` EST CONSERVÉ, et le fondu ne fait que l'habiller. La
                 tentation est de retirer `loop` pour piloter le redémarrage à
                 la main sur `ended` — mais alors un `timeupdate` manqué arrête
                 la vidéo pour de bon. Ici, si le fondu rate, il ne reste qu'une
                 coupure un peu sèche.

                 UNE SEULE BALISE, et non deux qui se croiseraient. Un vrai
                 fondu enchaîné demanderait un second lecteur lisant le même
                 fichier avec un décalage : deux décodeurs, et le risque que le
                 navigateur retélécharge 43 Mo au lieu de les relire du cache.
                 Pour un fond d'ambiance, la traversée du noir suffit.

                 0,9 s de seuil pour 600 ms de transition : `timeupdate` ne se
                 déclenche que quatre fois par seconde environ, il faut donc de
                 la marge pour que le fondu soit terminé avant le saut. */
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (!v.duration) return;
                setFinDeBoucle(v.duration - v.currentTime < 0.9);
              }}
              onError={() => setVideoEchouee(true)}
              style={{ opacity: videoPrete && !finDeBoucle ? 1 : 0 }}
              className={`${cadrageMedia} transition-opacity duration-[600ms]`}
            />
          )}
        </div>
      </motion.div>

      {/* Voile qui se referme sur la photo au scroll, et fait la jonction avec
          le bandeau sombre de la section suivante. */}
      <motion.div
        style={{ opacity: veil }}
        className="absolute inset-0 bg-background pointer-events-none"
      />

      {/* Voile du haut : il assure la lisibilité de la barre de navigation, qui
          est transparente tant qu'on n'a pas défilé et se pose donc directement
          sur le média.

          RETIRÉ en variante « sous le menu » : la barre y est opaque, elle n'a
          besoin d'aucune aide, et le voile ne ferait qu'assombrir le haut de la
          vidéo juste sous elle — exactement l'endroit qu'on vient de dégager.

          Il est ALLÉGÉ en plein cadre — 45 % au lieu de 70 % — parce que c'est
          justement là qu'on veut voir la vidéo passer sous le menu. Il n'est pas
          supprimé pour autant : la vidéo a des passages très clairs (la fumée
          derrière le magicien), et sans voile les libellés blancs du menu y
          disparaissent. Si le voile doit encore baisser, il faudra vérifier le
          contraste des libellés sur l'image la plus claire de la boucle, pas sur
          la première. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/45 via-background/15 to-transparent" />

      {/* Voile latéral. Le cadrage de la photo ne laisse pas partout assez de
          place à gauche du magicien : sur une fenêtre 1280x800, le sujet commence
          à 479px alors que la colonne de texte en occupe 480. Plutôt que de
          rétrécir la colonne — ce qui cassait les rangées de formats et de
          chiffres — on assume le recouvrement et on assombrit ce côté.
          Le dégradé est le plus dense à gauche, là où vit le texte, et s'éteint
          avant le visage. Il disparaît sur les très grands écrans, où la photo
          laisse naturellement la place. */}
      <div className="absolute inset-y-0 left-0 w-[92%] lg:w-[78%] min-[1460px]:w-[58%] hidden md:block bg-gradient-to-r from-background via-background/90 lg:via-background/85 to-transparent pointer-events-none" />

      {/* mt-* compense la hauteur du menu fixe (h-24) : sans ça, le bloc est centré
          sur la fenêtre entière et paraît trop haut sous la barre de navigation.
          Sur mobile, c'est le pt-24 de la section qui s'en charge. */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 origin-left will-change-transform"
      >
        {/* Sur mobile, le bloc occupe toute la largeur et tout y est centré : sans
            photo, plus rien ne justifie de le caler à gauche.

            À partir de md, il reprend sa géométrie liée à la photo. Il n'est pas
            enfermé dans le conteneur centré du site : il part du bord de l'écran
            et s'élargit avec la résolution, borné par la position du canapé.
            La photo est en object-cover / object-right, donc son bord gauche est à
            43,66 % de sa largeur rendue, et cette largeur vaut max(largeur écran,
            1,7768 x hauteur). D'où les deux termes du min() : le premier vaut sur
            les écrans plus larges que le 16/9 de la photo, le second sur les plus
            étroits, où la photo déborde à gauche. On retire 5,5rem pour le padding
            et une marge de sécurité de 32px avec le canapé.

            Ces règles vivent dans une feuille plutôt qu'en style inline : un style
            inline ne connaît pas les points de rupture, et l'emporterait sur toute
            classe cherchant à le neutraliser sur mobile. */}
        <div className="hero-block">
          {/* Surtitre. Le filet d'or est à GAUCHE du texte, sur la même ligne —
              il était dessous jusqu'ici. Ce n'est pas une bordure du paragraphe
              mais un élément autonome : il garde sa longueur quel que soit le
              texte, et la garde même si le texte revient à la ligne.

              Le texte est BLANC et le filet SEUL est doré : relevé #ffffff pour
              l'un et #deb780 pour l'autre sur la maquette. C'est l'inverse de
              ce que faisait la version précédente. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-4 md:justify-start md:gap-5"
          >
            <span
              aria-hidden="true"
              className="block h-0.5 w-10 shrink-0 bg-[var(--gold)] sm:w-[4.5rem]"
            />
            <p className="type-eyebrow font-title tracking-[0.22em] text-foreground/90">
              Magicien en Picardie
            </p>
          </motion.div>

          {/* LE TITRE EST DU TEXTE, plus une image.

              Il était jusqu'ici un PNG (`Titre-Hero.png`) portant un lettrage
              dessiné. Ce que le passage au texte change, au-delà du visuel :
              le h1 contient enfin des mots que Google indexe et qu'un lecteur
              d'écran énonce, il reste net à toute densité d'écran, il se
              redimensionne sans plafond de définition, et le hero ne sursaute
              plus au chargement puisqu'il n'y a plus d'image à attendre.

              Les quatre lignes sont posées à la main, pas laissées au retour
              automatique : la coupe fait partie du dessin. « La magie / est un
              art, » en romain blanc pose le constat, « l'humour / ma signature. »
              en italique dorée y répond — c'est le basculement de graisse ET de
              couleur qui fait la phrase, pas la taille.

              L'apostrophe est une vraie apostrophe typographique (U+2019) et
              non une quote droite. */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hero-titre mt-6 text-center text-foreground md:mt-7 md:text-left"
          >
            <span className="block">La magie</span>
            <span className="block">est un art,</span>
            <span className="block italic text-[var(--gold)]">l’humour</span>
            <span className="block italic text-[var(--gold)]">ma signature.</span>
          </motion.h1>

          {/* Sous-titre. `max-w` plutôt qu'un <br> forcé : la phrase se
              répartit d'elle-même, et sur un téléphone elle se recoupe au lieu
              de garder une coupe pensée pour un grand écran.

              ⚠️ ELLE TIENT SUR UNE SEULE LIGNE SUR GRAND ÉCRAN, ET DE JUSTESSE.
              53 caractères contre 89 à la version précédente : mesurée sur les
              chasses réelles de Montserrat, elle fait 503px au corps maximum de
              la `clamp` (1,2rem) pour 528 disponibles — 24px de marge, soit
              4,6 %. La mesure est prise en graisse 400 alors que le rendu est
              en 300, donc la marge réelle est un peu plus large.

              Conséquence : trois ou quatre caractères de plus la font repasser
              à deux lignes, et la seconde n'aurait qu'un mot. Toute retouche de
              cette phrase, du corps ou de `max-w` se vérifie à la mesure. */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-[33rem] text-center font-title text-[clamp(1rem,1.15vw,1.2rem)] font-light leading-relaxed text-foreground/90 md:mx-0 md:mt-7 md:text-left"
          >
            Créons ensemble l’impossible pour vivre l’impensable.
          </motion.p>

          {/* Les deux appels à l'action.

              `rounded-md` et non `rounded-full` : la maquette a renoncé aux
              pastilles de la charte précédente pour des rectangles à peine
              adoucis. Et le bouton plein est un APLAT d'or à texte noir, là où
              l'ancien était un aplat foncé à texte clair — c'est l'inversion la
              plus visible du changement de charte.

              Empilés en pleine largeur sous 640px : côte à côte ils n'y
              tiennent pas, et à leur largeur naturelle ils formaient un
              escalier de deux boutons inégaux. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-9 md:justify-start"
          >
            <a
              href="#formules"
              className="group inline-flex min-h-[3.375rem] items-center justify-center gap-4 rounded-md bg-[var(--gold)] px-7 text-primary-foreground transition-colors hover:bg-[var(--gold-soft)] sm:justify-between"
            >
              <span className="type-action font-title text-[0.72rem] min-[1460px]:text-[0.8rem]">
                Voir mes prestations
              </span>
              <ArrowRight
                size={18}
                className="shrink-0 transition-transform group-hover:translate-x-1"
              />
            </a>

            {/* ⚠️ UN BOUTON, PLUS UNE ANCRE. Il visait `#video`, la bande
                d'ambiance animée qui vivait au milieu de la page ; cette
                section a été supprimée et l'ancre ne menait donc plus nulle
                part — un lien mort qui n'aurait produit aucune erreur, juste un
                clic sans effet.

                Il ouvre maintenant la BANDE-ANNONCE DU CLOSE-UP en plein
                écran, ce que son libellé a toujours promis et que l'ancre ne
                tenait pas : elle descendait vers une boucle muette sans début
                ni fin, qu'on ne « regarde » pas.

                Le close-up plutôt que le spectacle de scène, parce que c'est le
                cœur de l'activité et le premier format de la page. À changer en
                une ligne si Vince préfère l'autre.

                L'icône de lecture est déjà cerclée dans le PNG fourni : pas de
                bordure supplémentaire, elle ferait un double rond. */}
            <button
              type="button"
              onClick={() =>
                ouvrirLaVideo({
                  src: VIDEO_CLOSE_UP,
                  titre: "Bande-annonce du close-up de Vince",
                })
              }
              className="group inline-flex min-h-[3.375rem] items-center justify-center gap-3.5 rounded-md border border-white/45 px-5 text-foreground transition-colors hover:border-white hover:bg-white/5 sm:justify-start"
            >
              <span
                className="picto h-8 w-8 shrink-0 text-foreground"
                style={{ "--picto": `url(${icoLecture})` } as CSSProperties}
              />
              <span className="type-action font-title text-[0.72rem] min-[1460px]:text-[0.8rem]">
                Voir la vidéo
              </span>
            </button>
          </motion.div>

          <BandeauPreuves />

          {/* Les quatre formats, SOUS les boutons — ils étaient au-dessus.

              LES PICTOGRAMMES SONT DORÉS, LES LIBELLÉS BLANCS — les deux
              étaient blancs, d'après un relevé #ffffff sur la maquette, et l'or
              n'arrivait qu'au survol.

              C'est un écart assumé à la règle « l'or ne sert qu'à ce qui appelle
              une action » : la rangée EST cliquable, chaque format descendant
              vers sa section, et le doré la signale désormais au repos au lieu
              d'attendre la souris — ce qui ne se voit pas au doigt. Les libellés
              restent blancs : tout dorer aurait fait de la rangée un second
              appel à l'action, concurrent des deux boutons juste au-dessus.

              Au survol les pictogrammes passent en `--gold-soft`, exactement la
              couleur de survol des boutons dorés du site. Ne pas y mettre une
              teinte inventée : la charte n'a que ces deux ors.

              ⚠️ LA RANGÉE NE DOIT JAMAIS SE CASSER au-dessus de 640px, et c'est
              tout l'enjeu de sa mise en page.

              Elle était en `flex-wrap` avec des colonnes à leur largeur
              naturelle (`w-auto`). Les quatre libellés n'ayant pas du tout la
              même longueur — « GALAS » fait 5 signes, « SPECTACLES DE SCÈNE » en
              fait 18, soit ~135px une fois interlettré — la rangée réclamait
              plus que la largeur de `.hero-block` dès que la fenêtre passait
              sous ~1280px. La colonne faisant 480px à cette taille, le
              quatrième format partait seul à la ligne, sous un séparateur
              orphelin.

              La réponse tient en trois réglages qui vont ensemble :

              1. `flex-nowrap` — la rangée ne PEUT plus se casser. C'est la
                 garantie, tout le reste n'est que confort.
              2. `justify-between` + un `gap` plancher — les écarts se
                 répartissent tout seuls dans la place restante, au lieu d'être
                 des marges fixes qui poussent la rangée au-delà de la colonne.
                 Les libellés gardent donc leur largeur naturelle, chacun sur
                 UNE ligne, comme sur la maquette.
              3. `min-w-0` sur chaque format — soupape de sécurité. Sans lui, un
                 élément flex refuse de passer sous la largeur de son contenu et
                 déborderait. Avec lui, s'il vient vraiment à manquer de la
                 place, c'est le libellé le plus long qui rétrécit et revient à
                 la ligne (« SPECTACLES / ENFANTS ») — ce qui reste lisible, là
                 où une rangée cassée ne l'était pas.

              Ne pas remplacer ça par des colonnes égales (`flex-1`) : ça règle
              aussi la casse, mais « SPECTACLES DE SCÈNE » passe alors sur deux
              lignes à TOUTES les tailles, y compris là où la place ne manque
              pas.

              Sous 640px, une grille à deux colonnes : deux rangées pleines et
              stables, et les séparateurs disparaissent — ils tomberaient au
              milieu d'un retour à la ligne. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            /* `max-w` : LE réglage qui empêche la rangée de s'étaler.

               `justify-between` répartit la place restante entre les éléments.
               Tant que la rangée pouvait occuper toute la colonne — jusqu'à
               704px sur un grand écran — cette place restante grandissait avec
               l'écran et les pictos s'éloignaient les uns des autres : ~195px
               d'entraxe mesurés sur un 1793px, contre ~170px sur la maquette.
               Le plafond fige la largeur de la rangée, donc l'entraxe, donc le
               dessin. Il ne mord évidemment que là où la colonne est plus large
               que lui, c'est-à-dire au-dessus de 1600px environ. */
            className="mt-6 grid max-w-[40rem] grid-cols-2 gap-y-8 sm:flex sm:flex-nowrap sm:items-stretch sm:justify-between sm:gap-x-2 sm:gap-y-0 md:mt-8 lg:gap-x-2.5 min-[1460px]:gap-x-3"
          >
            {heroFormats.map((format, i) => (
              <Fragment key={format.label}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden w-px shrink-0 self-stretch bg-white/25 sm:block"
                  />
                )}
                <a
                  href={format.href}
                  className="group flex flex-col items-center gap-3 text-center sm:min-w-0"
                >
                  {/* Boîte carrée + mask-size:contain : les dessins n'ont pas le
                      même format (le chapeau est large et bas, la flûte haute et
                      étroite) et gardent ainsi leurs proportions, optiquement
                      équilibrés comme sur la maquette. */}
                  {/* Plus de branche `format.Icone` : les cinq formats ont
                      désormais leur PNG, la solution de repli en icône lucide
                      n'a plus d'objet. */}
                  <span
                    className="picto h-9 w-9 shrink-0 text-[var(--gold)] transition-colors group-hover:text-[var(--gold-soft)] min-[1460px]:h-11 min-[1460px]:w-11"
                    style={{ "--picto": `url(${format.picto})` } as CSSProperties}
                  />
                  {/* `min-h` de deux lignes à partir de 640px : entre 768 et
                      1280px la colonne est bloquée à son plancher de 480px et
                      « SPECTACLES DE SCÈNE » y passe sur deux lignes. Sans cette
                      réserve, ce seul format devenait plus haut que les trois
                      autres et la rangée changeait de hauteur en traversant
                      1280px. Avec elle, les quatre icônes restent sur la même
                      ligne et la rangée garde la même hauteur à toute taille.

                      0.66rem seulement à partir de 1600px, et non 1460 : entre
                      les deux, la colonne n'a pas encore assez grandi pour
                      absorber des libellés plus gros. */}
                  <span className="type-eyebrow font-title text-[0.6rem] leading-tight tracking-[0.16em] text-foreground/85 transition-colors group-hover:text-foreground sm:min-h-[2.5em] min-[1600px]:text-[0.66rem]">
                    {format.label}
                  </span>
                </a>
              </Fragment>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* LA SIGNATURE MANUSCRITE, à droite du magicien.

          ABSENTE DE LA v3, et c'est la seule différence de contenu entre les
          trois variantes — toutes les autres ne portent que sur le fond. En
          plein écran, la vidéo occupe aussi la moitié droite et le magicien s'y
          déplace : le texte manuscrit se posait dessus au lieu de se poser à
          côté de lui, et changeait de lisibilité à chaque image.

          C'était un PNG de 465 Ko (`Texte-Signature-...png`) ; c'est désormais
          du texte en Caveat, avec son paraphe dessiné en SVG juste dessous.

          Deux niveaux imbriqués comme ailleurs dans ce hero : l'extérieur suit
          l'opacité pilotée par le scroll, l'intérieur gère l'entrée retardée.
          La rotation est posée en classe et non en `style` de `motion`, sinon
          elle entrerait en conflit avec la translation de l'entrée — les deux
          écrivent la même propriété `transform`.

          Masquée sous 1024px : en dessous, la photo n'a plus de place libre à
          droite et la signature viendrait se poser sur le magicien.

          `pointer-events-none` : c'est un ornement, il ne doit pas intercepter
          un clic destiné à ce qu'il y a derrière. */}
      <motion.div
        style={{ opacity }}
        className={`pointer-events-none absolute right-[3.4%] top-[34%] z-10 w-[14vw] min-w-[11rem] max-w-[15.5rem] ${"hidden"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="-rotate-[4.2deg]"
        >
          {/* Les trois coupes sont posées à la main : elles font partie du
              dessin, et un retour automatique les placerait ailleurs à la
              moindre variation de largeur. */}
          <p className="font-script text-[clamp(1.3rem,2.05vw,2rem)] leading-[1.28] text-foreground">
            {signatureLignes.map((ligne) => (
              <span key={ligne} className="block">
                {ligne}
              </span>
            ))}
          </p>
          {/* Le paraphe. Décalé à droite et non centré : sur la maquette il
              souligne la fin de la dernière ligne, pas le bloc entier. */}
          <svg
            viewBox="0 0 108 34"
            fill="none"
            aria-hidden="true"
            className="ml-[26%] mt-1 h-auto w-[48%]"
          >
            <path
              d="M2 23 C 26 33, 72 31, 106 3"
              stroke="var(--gold)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Indicateur de scroll : un filet vertical puis une flèche, comme sur la
          maquette — c'était un simple chevron. Trois niveaux imbriqués parce que
          trois animations se superposent sans pouvoir cohabiter sur un même
          élément : le conteneur suit l'opacité pilotée par le scroll (l'indice
          disparaît dès qu'on a compris), le second gère l'entrée retardée, le
          dernier la respiration en boucle. */}
      <motion.div
        style={{ opacity }}
        className="hero-indicateur pointer-events-none absolute inset-x-0 bottom-7 z-10 hidden justify-center sm:flex"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <a
            href="#formules"
            aria-label="Faire défiler vers les spectacles"
            className="pointer-events-auto block p-2 text-white/55 transition-colors hover:text-foreground"
          >
            <motion.span
              className="flex flex-col items-center gap-2"
              animate={reduceMotion ? undefined : { y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span aria-hidden="true" className="block h-9 w-px bg-current" />
              <ArrowDown size={15} strokeWidth={1.5} />
            </motion.span>
          </a>
        </motion.div>
      </motion.div>

      <style>{`
          /* LE TITRE.

             Ces règles vivent ici plutôt qu'en classes Tailwind parce qu'une
             feuille sans \`@layer\` passe devant n'importe quelle règle de
             couche — c'est déjà la mécanique de \`.hero-block\` plus bas. Elles
             remplacent l'utilitaire \`font-display\`, volontairement PAS appliqué
             à ce titre : il impose \`letter-spacing: 0\` et surtout
             \`text-wrap: balance\`, qui redécouperait les quatre lignes posées à
             la main juste en dessous.

             Pas de \`text-wrap: nowrap\` pour autant : les coupes viennent des
             \`<span className="block">\`, et si une ligne ne tient pas sur un
             téléphone très étroit il vaut mieux qu'elle revienne à la ligne
             plutôt qu'elle déborde — \`overflow-x: clip\` la trancherait sans
             prévenir.

             Taille : 5.4vw reproduit la maquette (90px de corps pour 1672px de
             large). Le plancher de 2.6rem garde le titre lisible sur un
             téléphone ; le plafond de 5.75rem l'empêche de crier sur un 27
             pouces — au-delà, la page ne compose plus, elle hurle.

             Le terme \`7.4vh\` est le troisième larron, et il ne sert que les
             écrans COURTS. Il valait 8.4vh avant que le bandeau de preuves ne
             s'intercale entre les boutons et les pictogrammes : celui-ci prend
             une soixantaine de pixels, et c'est le titre — de loin le plus gros
             poste de hauteur — qui les rend. Sur un portable dont la fenêtre ne fait que ~705px
             de haut une fois le dock et le chrome du navigateur déduits, le
             hero réclamait ~740px : les libellés sous les pictos passaient
             sous le bord de l'écran, invisibles sans défiler. Le titre étant
             de loin le plus gros poste de hauteur (quatre lignes), c'est lui
             qu'on borne. Sur un écran haut, \`5.4vw\` reste toujours le plus
             petit des trois et \`8.4vh\` ne change rien.

             Interligne 0.9 : la maquette pose ses quatre lignes à 80px pour 90px
             de corps. En dessous de 0.88 les jambages de « magie » touchent les
             hampes de « est un art, ». */
          .hero-titre {
            font-family: var(--font-display);
            font-weight: 400;
            font-size: clamp(2.6rem, min(5.4vw, 7.4vh), 5.75rem);
            line-height: 0.9;
            letter-spacing: -0.015em;
          }

          /* ÉCRANS COURTS. Sur un portable, entre la barre de menus, le chrome
             du navigateur et le dock, il ne reste souvent que 700 à 760px de
             hauteur utile. Le titre rétréci par le terme \`vh\` ci-dessus ne
             suffit pas seul : on reprend aussi sur les marges du haut et du bas.

             6.5rem de réserve haute : la barre de navigation est \`fixed\` et
             haute de 6rem (h-24), il faut donc au moins ça pour que le surtitre
             ne passe pas dessous. 0.5rem de respiration, pas plus.

             Et l'indicateur de défilement disparaît : il vit en \`absolute\` à
             1.75rem du bas, il viendrait se poser sur les libellés une fois la
             marge basse réduite. Sur un écran aussi court, la page déborde de
             toute façon visiblement — l'invitation à défiler ne manque à
             personne. */
          @media (min-width: 768px) and (max-height: 860px) {
            .hero-section {
              padding-top: 6.5rem;
              /* 2.5rem et non 1.5 : depuis que le contenu est aligné EN BAS,
                 c'est cette valeur seule qui le décolle du bord de la fenêtre.
                 L'indicateur de défilement étant masqué ici, il n'y a rien
                 d'autre à dégager — 40px suffisent à aérer sans reprendre de la
                 hauteur à un écran qui en manque déjà. */
              padding-bottom: 2.5rem;
            }
            .hero-indicateur {
              display: none;
            }
          }

          /* Mobile : pleine largeur, tout centré. À partir de 768px, tout le
             contenu part du même axe que le logo dans le conteneur du site. */
          .hero-block { width: 100%; }

          @media (min-width: 768px) {
            .hero-block {
              /* Largeur fonction de la SEULE largeur de fenêtre.
                 Elle dépendait auparavant aussi de la hauteur, par un terme qui
                 mesurait la place laissée libre à gauche du magicien. Effet
                 pervers : sur une fenêtre large mais haute, ce terme rétrécissait
                 la colonne — 480px à 1440px de large contre 496px à 1280 — et
                 tout le contenu paraissait rapetisser alors que l'écran
                 grandissait. Le voile dégradé rendant le recouvrement de la photo
                 lisible, ce calcul n'a plus lieu d'être.

                 30rem = 480px : le plancher, largeur minimale où les quatre
                 formats tiennent sur une seule ligne avec leurs séparateurs.
                 44rem = 704px : le plafond, au-delà duquel la colonne viendrait
                 chercher le magicien sur les très grands écrans. */
              width: clamp(30rem, 40vw, 44rem);
            }
          }
        `}</style>
    </section>
  );
}
