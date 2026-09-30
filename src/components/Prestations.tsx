import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import illustrationImg from "@/assets/photos/studio-bras-ouverts-large.webp";

/**
 * Deux groupes, une numérotation CONTINUE de 01 à 07.
 *
 * Elle ne repart pas à 01 au second groupe, et c'est le point de la liste :
 * les sept formats sont une seule offre lue d'un bout à l'autre, pas deux
 * catalogues côte à côte. Le titre de gauche dit la même chose — « deux
 * univers, un même magicien ».
 *
 * Le numéro est calculé au rendu à partir de la position, jamais écrit à la
 * main : insérer une ligne renumérote tout seul.
 *
 * `description` tient en UNE ligne, et c'est une contrainte de mise en page
 * autant que d'écriture : au-delà, la ligne passe sur deux lignes, la hauteur
 * des rangées devient irrégulière et la colonne de numéros perd son rythme.
 * Elle dit une situation concrète — où, avec qui, à quel moment — pas un
 * argument de vente ; le titre fait déjà ce travail.
 */
const groupes = [
  {
    titre: "Close-up",
    surtitre: "Les formats",
    href: "#close-up",
    lignes: [
      {
        titre: "Cocktail & vin d’honneur",
        description: "Je circule parmi vos invités, un verre à la main comme eux.",
        tags: ["mariage", "entreprise"],
      },
      {
        titre: "Table à table",
        description: "Un tour par table, entre deux plats, sans jamais couper le repas.",
        tags: ["repas", "gala"],
      },
      {
        titre: "Déambulation",
        description: "Debout et en mouvement, là où les gens s’arrêtent pour se parler.",
        tags: ["salon", "inauguration"],
      },
      {
        titre: "Soirée privée",
        description: "Un salon, quelques amis, et deux heures qui passent trop vite.",
        tags: ["anniversaire"],
      },
    ],
  },
  {
    titre: "Spectacles enfants",
    surtitre: "Sur scène",
    href: "#spectacles",
    lignes: [
      {
        titre: "Anniversaire à domicile",
        description: "Chez vous, dans le salon, les enfants assis par terre au premier rang.",
        tags: ["3–10 ans"],
      },
      {
        titre: "Arbre de Noël",
        description: "Un spectacle pour tous les âges, entre le goûter et la distribution.",
        tags: ["CSE", "mairies"],
      },
      {
        titre: "Écoles & centres de loisirs",
        description: "Un format calibré pour une classe, ou pour toute une école réunie.",
        tags: ["scolaire"],
      },
    ],
  },
];

/**
 * La liste des prestations, en deux groupes numérotés.
 *
 * Elle remplace un carrousel de trois cartes illustrées : sept formats tiennent
 * dans la hauteur où trois cartes tenaient, et on les compare d'un coup d'œil
 * au lieu de faire défiler.
 *
 * ⚠️ LE TITRE DE GAUCHE RESTE pendant que la liste défile (`position: sticky`).
 * Il ne tient que si aucun ancêtre n'a d'`overflow` autre que `visible` —
 * c'est déjà la raison pour laquelle `html, body` sont en `overflow-x: clip` et
 * non `hidden` (voir styles.css). Ne pas poser d'`overflow-hidden` sur cette
 * section ni sur ce qui la contient.
 *
 * Il y avait ici une vignette qui suivait le curseur au survol de chaque ligne.
 * Retirée : l'effet demandait une photo par format — sept images chargées pour
 * un bloc qui est d'abord une liste — il ne fonctionnait ni au clavier ni au
 * doigt, et il attirait l'œil sur le mouvement plutôt que sur les intitulés.
 * Une seule photo fixe dans la colonne de gauche dit la même chose sans rien
 * de tout cela.
 */
export function Prestations() {
  // Numérotation continue d'un groupe à l'autre.
  let compteur = 0;
  const groupesNumerotes = groupes.map((groupe) => ({
    ...groupe,
    lignes: groupe.lignes.map((ligne) => ({ ...ligne, numero: ++compteur })),
  }));

  return (
    <section id="formules" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* ── Colonne de gauche, qui reste ──────────────────────────────────
            `self-start` est indispensable : sans lui, la colonne d'une grille
            s'étire sur toute la hauteur de la rangée, et un bloc collant qui
            fait déjà la hauteur de son conteneur n'a nulle part où coller. */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="type-eyebrow font-title text-[var(--gold)]"
          >
            I — Mes prestations
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-5 font-display text-4xl leading-[1.04] md:text-5xl"
          >
            Deux univers,
            <br />
            <em className="font-normal not-italic text-[var(--gold)]">un même magicien.</em>
          </motion.h2>
          <p className="mt-6 max-w-sm text-lg font-light leading-relaxed text-muted-foreground">
            À quelques centimètres de vos invités ou face à une salle entière, c’est la même envie :
            que l’on reparle de votre soirée le lendemain.
          </p>

          {/* Photo d'illustration. En 4/3 et non en portrait : la colonne est
              collante, donc elle doit tenir dans la fenêtre EN ENTIER, titre
              compris. Un 4/5 la faisait dépasser sur un écran de 800px de haut
              et le collage n'avait plus lieu — le bloc se remettait à défiler
              comme n'importe quel autre. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 hidden aspect-[4/3] max-w-md overflow-hidden rounded-2xl lg:block"
          >
            <img
              src={illustrationImg}
              alt="Vince en studio, bras grands ouverts derrière un guéridon, sur fond clair"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        {/* ── Colonne de droite, la liste ─────────────────────────────────── */}
        <div>
          {groupesNumerotes.map((groupe, iGroupe) => (
            <div key={groupe.titre} className={iGroupe > 0 ? "mt-20" : ""}>
              {/* En-tête de groupe. C'est lui qui marque la coupure entre les
                  deux univers, donc il pèse : un vrai titre en Playfair, pas
                  le libellé en petites capitales qu'il était — à cette taille,
                  il se lisait comme une étiquette de plus au milieu des lignes
                  et la séparation ne se voyait pas. Le filet qui le suit tient
                  toute la largeur restante et ferme la rupture. */}
              <div className="flex items-baseline gap-5">
                <div className="shrink-0">
                  <p className="type-eyebrow font-title text-muted-foreground">{groupe.surtitre}</p>
                  <h3 className="mt-2 font-display text-3xl text-[var(--gold)] md:text-4xl">
                    {groupe.titre}
                  </h3>
                </div>
                <span aria-hidden="true" className="h-px flex-1 bg-[var(--gold)]/35" />
              </div>

              <ul className="mt-8 border-t border-border">
                {groupe.lignes.map((ligne) => (
                  <li key={ligne.titre}>
                    {/* Toute la ligne est le lien : la cible de clic fait sa
                        hauteur entière, et non les quelques pixels du titre.
                        La flèche n'est donc qu'un `span` décoratif — en faire
                        un second lien vers la même destination la ferait
                        annoncer deux fois par un lecteur d'écran. */}
                    <a
                      href={groupe.href}
                      className="group flex items-start gap-5 border-b border-border py-6 transition-colors hover:bg-white/[0.03] md:gap-8"
                    >
                      <span className="type-action font-title w-7 shrink-0 pt-1.5 tabular-nums text-[var(--gold)]">
                        {String(ligne.numero).padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-2xl leading-tight transition-colors group-hover:text-[var(--gold)]">
                          {ligne.titre}
                        </span>
                        <span className="mt-2 block text-sm font-light leading-relaxed text-muted-foreground">
                          {ligne.description}
                        </span>
                        <span className="mt-3 flex flex-wrap gap-2">
                          {ligne.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm border border-border px-2.5 py-1 text-[0.7rem] text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className="shrink-0 self-center text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                      >
                        <ArrowRight size={20} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
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
            {/* « Le détail des formules » et non « Toutes les formules » : le
                lien descend vers les sections qui développent chaque format,
                il n'ouvre pas une page de catalogue — il n'y en a pas. Un
                libellé qui promet une page inexistante est une déception à
                retardement. */}
            <a
              href="#close-up"
              className="type-action font-title inline-flex items-center gap-1.5 border-b border-[var(--gold)]/50 pb-1 text-[0.72rem] text-foreground transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Le détail des formules
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
