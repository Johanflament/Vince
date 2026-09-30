import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/** Ce qu'un déclencheur transmet à la visionneuse : le film, et de quoi
 *  l'annoncer à un lecteur d'écran. */
export type DemandeVideo = { src: string; titre: string; affiche?: string };

/** Nom de l'événement qui ouvre la visionneuse. Un seul endroit où il est
 *  écrit : le déclencheur et l'écouteur ne peuvent pas se désaccorder sur une
 *  faute de frappe, que rien ne signalerait à la compilation. */
const EVENEMENT_OUVRIR_VIDEO = "vince:ouvrir-video";

/** À appeler depuis N'IMPORTE QUEL bouton de la page pour ouvrir un film.
 *
 *  Passer par un événement global plutôt que par une prop : les déclencheurs
 *  sont dispersés — un par section de format — et aucun n'a de lien de parenté
 *  avec la visionneuse, qui vit dans `document.body`. Faire descendre un rappel
 *  jusqu'à eux traverserait quatre composants qui n'en ont que faire.
 *
 *  `dispatchEvent` est SYNCHRONE : l'écouteur s'exécute dans la pile d'appel du
 *  clic, donc le navigateur considère encore qu'il y a une action directe du
 *  visiteur — c'est ce qui autorise la lecture AVEC LE SON. */
export function ouvrirLaVideo(demande: DemandeVideo) {
  window.dispatchEvent(new CustomEvent<DemandeVideo>(EVENEMENT_OUVRIR_VIDEO, { detail: demande }));
}

/**
 * UN FILM EN PLEIN ÉCRAN, montée une seule fois par page.
 *
 * C'est le retour d'un plein écran retiré plus tôt, mais débarrassé de ce qui
 * l'avait fait rejeter : il n'y a plus d'agrandissement au défilement, plus de
 * carte qui grandit, plus de boîte qui passe d'`absolute` à `fixed` en animant
 * ses quatre côtés. Un panneau qui apparaît en fondu, la vidéo dedans, une croix
 * pour sortir. La mécanique tenait deux cents lignes ; elle en tient trente.
 *
 * ⚠️ RENDUE DANS `document.body` PAR UN PORTAIL, et ce n'est pas un raffinement.
 * `position: fixed` ne s'échappe pas d'un ancêtre qui crée un contexte
 * d'empilement — or la page en est pleine : chaque section de format porte un
 * `overflow-hidden`, les blocs collants en créent un d'office, et le hero est en
 * `z-10`. Rendu sur place, le panneau se retrouvait sous la page, croix
 * comprise, sans moyen de le refermer. Dans `body`, il n'a plus d'ancêtre du
 * tout. Ne pas « simplifier » en le remettant dans l'arbre de la section.
 *
 * LA BALISE `<video>` N'EXISTE QUE PENDANT L'OUVERTURE, et le `key` la remonte
 * quand on change de film. Deux raisons : les bandes-annonces pèsent 29 et
 * 13 Mo, que personne n'a à télécharger sans avoir cliqué ; et une balise
 * réutilisée d'un film à l'autre garde la position de lecture du précédent.
 */
export function VideoPleinEcran() {
  const [demande, setDemande] = useState<DemandeVideo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fermer = useCallback(() => setDemande(null), []);

  useEffect(() => {
    const surDemande = (e: Event) => setDemande((e as CustomEvent<DemandeVideo>).detail);
    window.addEventListener(EVENEMENT_OUVRIR_VIDEO, surDemande);
    return () => window.removeEventListener(EVENEMENT_OUVRIR_VIDEO, surDemande);
  }, []);

  // Échap ferme, et la page cesse de défiler derrière le panneau : sans cela, la
  // molette fait glisser la page sous la vidéo et on ressort ailleurs qu'on n'est
  // entré.
  useEffect(() => {
    if (!demande) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", touche);
    return () => {
      document.body.style.overflow = avant;
      window.removeEventListener("keydown", touche);
    };
  }, [demande, fermer]);

  // LECTURE AVEC LE SON, et le repli s'il est refusé.
  //
  // `autoPlay` seul ne suffirait pas : un navigateur n'accorde le son qu'à une
  // vidéo dont la lecture découle d'une action du visiteur. Ici elle en découle
  // bien — la balise est montée par un clic — mais l'ouverture passe par un rendu
  // React, donc l'appel n'est plus dans la pile du clic. Chrome et Safari s'en
  // contentent (l'activation « collante » du document suffit) ; Firefox en
  // configuration stricte peut refuser.
  //
  // D'où le repli : si la promesse est rejetée, on remet la sourdine et on
  // relance. Le visiteur voit alors un film qui démarre sans son, avec les
  // contrôles natifs pour le rétablir — ce qui vaut mieux qu'un cadre noir.
  //
  // `demande?.src` en dépendance et non `demande` : l'effet doit se rejouer quand
  // on change de film, pas quand l'objet est recréé à l'identique.
  useEffect(() => {
    if (!demande) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [demande?.src, demande]);

  // Rien pendant le rendu serveur : `document` n'y existe pas, et un portail n'a
  // de sens qu'une fois le document là.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {demande && (
        <motion.div
          /* `z-[100]` passe au-dessus de tout ce que la page déclare — la barre
             de navigation est à 50, son tiroir mobile et la visionneuse de
             photos à 70. */
          className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          /* Le clic SUR LE FOND ferme, pas le clic sur la vidéo : d'où le
             `stopPropagation` sur celle-ci, sans quoi toucher la barre de
             progression refermerait le panneau. */
          onClick={fermer}
          role="dialog"
          aria-modal="true"
          aria-label={demande.titre}
        >
          <motion.video
            key={demande.src}
            ref={videoRef}
            src={demande.src}
            poster={demande.affiche}
            controls
            playsInline
            preload="auto"
            onClick={(e) => e.stopPropagation()}
            /* `object-contain` et non `cover` : on vient ici pour voir le cadre
               entier, le rogner n'aurait aucun sens. `max-h-full` borne la
               hauteur pour que les contrôles natifs restent dans l'écran. */
            className="max-h-full w-full max-w-6xl bg-black object-contain"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer la vidéo"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-[var(--gold)]/40 bg-background/70 text-[var(--gold)] backdrop-blur transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-primary-foreground md:right-6 md:top-6"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/**
 * LE CTA « VOIR LA VIDÉO », posé à côté de « Demander un devis ».
 *
 * Il remplace un bouton de lecture qui flottait au milieu de la moitié libre de
 * la photo, avec son halo pulsant. Ce placement posait deux problèmes que la
 * rangée de boutons règle d'elle-même :
 *
 *  1. IL DÉPENDAIT DE LA PHOTO. Centré à 25 % ou à 75 % selon le côté du texte,
 *     il fallait mesurer, pour chaque image, que le rond ne tombe pas sur le
 *     sujet et que le blanc du libellé garde 4,5:1 sur les pixels qui passent
 *     dessous — celle des spectacles, claire et en couleurs, n'offrait que 4,7.
 *     Changer une photo redemandait toute la vérification.
 *  2. IL N'EXISTAIT PAS EN DESSOUS DE 1024px, où le texte remplit la section et
 *     ne laisse aucune zone d'image libre. Il fallait donc un second
 *     déclencheur, dans le flux du texte, et deux rendus à tenir d'accord.
 *
 * Dans la rangée d'actions, il n'y a plus qu'un exemplaire, il se lit à toutes
 * les largeurs, et il est là où l'on cherche une action.
 *
 * SECONDAIRE ET NON PRIMAIRE : bordure dorée et fond transparent, contre l'or
 * plein de « Demander un devis ». Les deux sont des actions, mais une seule est
 * celle qui fait vivre l'artiste — deux boutons pleins côte à côte se seraient
 * neutralisés.
 *
 * Plus de halo `pulse-copper` : il servait à faire repérer un bouton perdu au
 * milieu d'une image. Dans une rangée d'actions, il n'a plus rien à signaler et
 * ferait clignoter un bouton secondaire à côté du principal. L'utilitaire reste
 * défini dans styles.css, inutilisé.
 */
export function CtaVideo({ demande }: { demande: DemandeVideo }) {
  return (
    <button
      type="button"
      onClick={() => ouvrirLaVideo(demande)}
      aria-label={`Voir la vidéo — ${demande.titre}`}
      /* `min-h-[3.25rem]` : exactement la hauteur du bouton doré voisin. Sans
         elle, deux boutons de rembourrages différents ne s'alignent pas, et la
         rangée se voit de travers. */
      className="group inline-flex min-h-[3.25rem] items-center gap-3 rounded-md border border-[var(--gold)]/45 px-6 text-foreground transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
    >
      {/* Triangle dessiné à la main plutôt que l'icône `Play` de lucide :
          celle-ci est tracée au trait et non pleine, et un triangle creux à
          cette taille se lit comme un curseur. `translate-x` au survol reprend
          le geste des flèches du reste du site. */}
      <svg
        viewBox="0 0 24 24"
        className="h-[0.95rem] w-[0.95rem] shrink-0 fill-current transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
      <span className="type-action font-title text-[0.72rem]">Voir la vidéo</span>
    </button>
  );
}
