import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/** Une photo telle que l'attendent toutes les galeries du site.
 *
 *  `src` est la vignette affichée dans la grille, `grand` le fichier chargé
 *  seulement à l'ouverture de la visionneuse. `cadrage` est la valeur CSS
 *  `object-position` de la vignette — elle ne concerne QUE la grille : la
 *  visionneuse montre l'image entière et n'a donc rien à recadrer.
 */
export type Photo = {
  src: string;
  grand: string;
  alt: string;
  cadrage?: string;
  /** Renseigné pour une tuile animée : la visionneuse joue alors la vidéo au
   *  lieu d'agrandir une image. `src` et `grand` restent exigés — ils servent
   *  d'affiche, et de repli si la lecture échoue. */
  video?: string;
};

type Props = {
  photos: Photo[];
  /** Index de la photo ouverte, ou `null` quand la visionneuse est fermée. */
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
};

/** Visionneuse commune à la galerie principale et aux bandeaux de miniatures.
 *
 *  Une seule et même implémentation pour les trois : ouvrir une photo donne
 *  partout le même geste — flèches, clavier, glissé au doigt — et corriger un
 *  détail le corrige partout. Chaque appelant garde son propre index : il ne
 *  peut y avoir qu'une visionneuse ouverte à la fois, mais deux galeries
 *  distinctes ne partagent pas leur position.
 *
 *  Le défilement est CIRCULAIRE : après la dernière photo on revient à la
 *  première. Sur des séries de quatre à vingt images, buter sur une flèche
 *  éteinte ressemble à une panne ; le compteur en bas dit déjà où l'on est.
 */
export function Visionneuse({ photos, index, onIndex, onClose }: Props) {
  const reduceMotion = useReducedMotion();
  const ouverte = index !== null;
  const nombre = photos.length;

  const aller = useCallback(
    (pas: number) => {
      if (index === null || nombre === 0) return;
      onIndex((index + pas + nombre) % nombre);
    },
    [index, nombre, onIndex],
  );

  // Clavier : Échap ferme, les flèches naviguent. Posé sur `window` et non sur
  // le panneau, sinon il faudrait d'abord lui donner le focus pour que les
  // touches répondent.
  useEffect(() => {
    if (!ouverte) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") aller(1);
      else if (e.key === "ArrowLeft") aller(-1);
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [ouverte, aller, onClose]);

  // La page continuait de défiler derrière le panneau : au retour, on avait
  // changé d'endroit sans l'avoir voulu.
  useEffect(() => {
    if (!ouverte) return;
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = avant;
    };
  }, [ouverte]);

  // Les deux voisines sont demandées au réseau pendant qu'on regarde l'image
  // courante : sans cela, chaque flèche ouvrait sur un cadre vide le temps du
  // téléchargement.
  useEffect(() => {
    if (index === null || nombre < 2) return;
    for (const pas of [1, -1]) {
      const voisine = photos[(index + pas + nombre) % nombre];
      // On ne précharge pas une vidéo : ce serait plusieurs mégaoctets tirés
      // pour une voisine que le visiteur n'ouvrira peut-être jamais.
      if (voisine.video) continue;
      const image = new Image();
      image.src = voisine.grand;
    }
  }, [index, nombre, photos]);

  const photo = index === null ? null : photos[index];

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-background/95 p-5 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photos"
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-border text-[var(--gold)] transition-colors hover:border-[var(--gold)]"
          >
            <X size={20} />
          </button>

          {/* Les flèches ne s'affichent pas pour une photo seule : il n'y a
              nulle part où aller. */}
          {nombre > 1 && (
            <>
              <Fleche cote="gauche" onClick={() => aller(-1)} />
              <Fleche cote="droite" onClick={() => aller(1)} />
            </>
          )}

          {/* `key` sur l'index : c'est lui qui fait rejouer le fondu à chaque
              changement de photo. Sans clé, React réutiliserait le même nœud et
              l'image changerait sèchement.

              Le glissé au doigt double les flèches, qui sont petites sur
              mobile. 60px de course ou un geste vif suffisent à basculer ;
              en dessous, l'image revient en place. */}
          {/* Une tuile animée s'ouvre en lecteur, pas en image agrandie. Le son
              est rendu ici — contrairement à la grille, où la boucle est muette
              par nécessité : aucun navigateur n'autorise une lecture sonore que
              le visiteur n'a pas demandée. */}
          {photo.video ? (
            <motion.video
              key={index}
              src={photo.video}
              poster={photo.grand}
              autoPlay
              loop
              playsInline
              controls
              aria-label={photo.alt}
              className="max-h-[82vh] max-w-[92vw] object-contain"
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <motion.img
              key={index}
              src={photo.grand}
              alt={photo.alt}
              className="max-h-[82vh] max-w-[92vw] cursor-grab touch-pan-y object-contain active:cursor-grabbing"
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              drag={nombre > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -450) aller(1);
                else if (info.offset.x > 60 || info.velocity.x > 450) aller(-1);
              }}
              onClick={(event) => event.stopPropagation()}
            />
          )}

          {/* Légende et compteur. La légende reprend le `alt` : il décrit déjà
              la photo, le dédoubler dans un champ « titre » aurait créé deux
              textes à maintenir pour la même image. */}
          <div
            className="mt-5 flex max-w-[92vw] flex-col items-center gap-2 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="max-w-2xl text-sm font-light leading-snug text-muted-foreground">
              {photo.alt}
            </p>
            {nombre > 1 && (
              <p className="type-eyebrow text-[var(--gold)]">
                {(index ?? 0) + 1} / {nombre}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Flèche de navigation. Collée aux bords sur ordinateur, ramenée vers
 *  l'intérieur sur mobile où les coins de l'écran sont hors de portée du
 *  pouce. `stopPropagation` : sans lui, le clic traverserait jusqu'au fond du
 *  panneau, qui referme la visionneuse. */
function Fleche({ cote, onClick }: { cote: "gauche" | "droite"; onClick: () => void }) {
  const gauche = cote === "gauche";
  return (
    <button
      type="button"
      aria-label={gauche ? "Photo précédente" : "Photo suivante"}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/60 text-[var(--gold)] backdrop-blur transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-primary-foreground md:h-14 md:w-14 ${
        gauche ? "left-3 md:left-7" : "right-3 md:right-7"
      }`}
    >
      {gauche ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
    </button>
  );
}
