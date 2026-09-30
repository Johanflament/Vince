import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

// ⚠️ CE FICHIER N'EST PAS UNE PHOTO ORDINAIRE : c'est un WebP à TRANSPARENCE,
// dont la couche alpha est la luminance du cliché d'origine et dont le RVB est
// blanc uni. Voir le commentaire du rendu avant d'y toucher.
import illustrationImg from "@/assets/photos/portrait-eventail-cartes-large.webp";

// LES DEUX MÊMES PICTOGRAMMES QUE LA RANGÉE DU HERO, et ce n'est pas une
// économie de fichiers : un visiteur voit les cartes à jouer et le rideau de
// scène en haut de page, puis les retrouve ici sur les deux cartes, puis les
// suit jusqu'aux sections. Le même signe désigne la même chose d'un bout à
// l'autre de la page — c'est ce qui fait qu'on s'y repère sans lire.
//
// ⚠️ Ce sont des MASQUES ALPHA (`mask-image`, voir l'utilitaire `picto` dans
// styles.css) : seule leur couche alpha est lue, `currentColor` les peint.
// Un fichier sans transparence donnerait un rectangle plein.
import icoCloseup from "@/assets/icones/cartes.webp";
import icoScene from "@/assets/icones/spectacle.webp";

/**
 * LES DEUX UNIVERS, et rien d'autre.
 *
 * Ce bloc a listé SEPT formats numérotés de 01 à 07, puis les a repliés dans un
 * accordéon. Il n'en présente plus que DEUX : les deux univers du site, qui
 * sont aussi les deux sections détaillées juste en dessous et les deux entrées
 * du menu. Cliquer y descend.
 *
 * ⚠️ LA LIGNE SOUS CHAQUE DESCRIPTION LISTE DES OCCASIONS, PLUS DES FORMATS.
 * Elle a d'abord énuméré les sept formats — cocktail, table à table,
 * déambulation, soirée privée, anniversaire à domicile, arbre de Noël, écoles.
 * Ce sont désormais des types d'événement, à la demande de Vince.
 *
 * Conséquence à connaître : « table à table », « déambulation » et « cocktail
 * & vin d'honneur » ne figurent plus NULLE PART sur le site. Ce sont des
 * requêtes que les gens tapent — « magicien table à table » — et la page ne
 * répond plus à aucune. Si le référencement compte, il faut les replacer
 * ailleurs, par exemple dans la fiche pratique de la section close-up.
 *
 * ⚠️ « Séminaires » et « Team Building » sont ici sous SPECTACLES DE SCÈNE,
 * alors que les pictogrammes de la section close-up, plus bas, les rangent
 * sous le CLOSE-UP. L'un des deux se trompe, et un visiteur qui descend de
 * trente centimètres le verra. À trancher.
 *
 * `description` tient en DEUX OU TROIS LIGNES et ne redit pas l'ouverture de la
 * section correspondante : elle prend l'angle pratique — ce qu'il y a à
 * prévoir, combien de temps — là où la section prend l'angle du récit. Deux
 * textes qui commencent pareil à trente centimètres d'écart se lisent comme un
 * bégaiement.
 */
const groupes = [
  {
    titre: "Close-up",
    surtitre: "Au milieu de vos invités",
    href: "#close-up",
    picto: icoCloseup,
    description:
      "Je passe d’un groupe à l’autre, cartes et pièces en main, à quelques centimètres des regards. Rien à installer : la magie se déplace avec moi.",
    occasions: ["Mariages", "Anniversaires", "Soirées privées", "Fêtes de famille"],
  },
  {
    titre: "Spectacles de scène",
    surtitre: "Face à une salle",
    href: "#spectacles",
    picto: icoScene,
    description:
      "Un spectacle de magie et d’humour de 30 minutes à 1 h 15, en version familiale dès trois ans ou tout public adulte. Un espace dégagé et une prise de courant suffisent.",
    occasions: ["Séminaires", "Team Building", "Arbres de Noël", "Écoles & centres de loisirs"],
  },
];

/**
 * ── DEUX COLONNES : la photo à gauche, tout le reste à droite ───────────────
 *
 * Le bloc a connu trois états : un carrousel de trois cartes illustrées, une
 * liste de sept formats à côté d'un titre collant, puis un accordéon. Chacun
 * butait sur la même chose — le contenu de droite était si haut qu'il imposait
 * sa loi à la photo de gauche, réduite à une vignette sous un titre épinglé.
 *
 * En ramenant la droite à un titre et deux cartes, la colonne de gauche est
 * enfin libre : la photo y fait toute la hauteur du bloc, environ 830px, contre
 * 450 dans la version précédente.
 *
 * ⚠️ PLUS DE TITRE COLLANT, et c'est une conséquence, pas un oubli. Le titre
 * était épinglé parce qu'on parcourait 1 260px de liste et qu'on perdait le fil.
 * Le bloc tient maintenant dans un écran : il n'y a plus rien à parcourir.
 *
 * ⚠️ LES CARTES SONT DES LIENS D'ANCRE, pas des panneaux dépliants. Un
 * accordéon aurait remis ici le détail que les deux sections donnent déjà en
 * dessous ; le clic y descend au lieu de le dupliquer. D'où le `<a>` et la
 * flèche, et non un `<button>` avec `aria-expanded`.
 */
export function Prestations() {
  return (
    <section id="formules" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
        {/* ── LA PHOTO ────────────────────────────────────────────────────
            Elle n'a ni cadre, ni coins arrondis, ni recadrage : le magicien
            émerge du noir de la page. Le cliché est pris sur fond noir en
            studio et il est rigoureusement en noir et blanc — écart entre
            canaux R/V/B mesuré à 0, ce qui est la condition de ce qui suit.

            ⚠️ SA TRANSPARENCE EST CUITE DANS LE FICHIER, elle ne vient pas du
            CSS : la couche alpha est la luminance du cliché, relevée de 45 %
            (le sujet sortait à 35 sur 255 de médiane, presque invisible sur du
            noir ; il est à 49), et le RVB est blanc uni. Sur un noir et blanc
            les deux sont équivalents — un pixel gris à 40 % vaut du blanc à
            40 % d'opacité — mais celle-ci ne dépend d'aucun mode de fusion.

            C'est ce qui la distingue du portrait de la biographie, qui emploie
            `mix-blend-mode: screen`. Ce mode était impossible ici : la colonne
            a longtemps été en `position: sticky`, ce qui crée un contexte
            d'empilement, et un contexte d'empilement isole le mélange — on
            aurait obtenu un rectangle noir, sans aucune erreur pour le dire.

            ⚠️ NE PAS RÉENCODER CE FICHIER COMME UNE PHOTO ORDINAIRE : un simple
            redimensionnement lui rendrait son fond noir opaque.

            `-ml-10` la fait déborder jusqu'au bord du rembourrage de page. Un
            débordement n'est possible que parce que ses bords sont transparents,
            il se verrait sur une image encadrée.

            ⚠️ `max-h-[42rem]` EST CE QUI TIENT LA HAUTEUR DU BLOC. C'est la
            photo qui commande : à pleine largeur de colonne elle ferait 913px
            et imposerait cette hauteur à toute la rangée, quelle que soit la
            taille de la colonne de droite. Plafonnée à 672px, elle passe sous
            celle-ci et c'est le contenu qui décide. Remonter cette valeur
            rallonge le bloc d'autant, sans rien montrer de plus.

            Masquée sous 1024px : à cette largeur les colonnes s'empilent, et
            800px de photo repousseraient tout le contenu sous la ligne de
            flottaison. */}
        <div className="relative hidden lg:-ml-10 lg:block">
          {/* Halo doré derrière le sujet. Il passe sous une image transparente
              à 87 %, donc il s'affiche presque en entier : 9 % suffisent à
              donner de la profondeur, au-delà on voit une tache. Il s'éteint
              avant les bords, sans quoi il redessinerait un rectangle. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 top-1/4"
            style={{
              background:
                "radial-gradient(52% 40% at 50% 55%, color-mix(in oklab, var(--gold) 9%, transparent), transparent 70%)",
            }}
          />
          <img
            src={illustrationImg}
            alt="Vince de profil dans le noir, un éventail de cartes levé devant lui"
            width={622}
            height={1200}
            loading="lazy"
            className="relative mx-auto h-auto max-h-[42rem] w-auto"
          />
        </div>

        {/* ── LE TITRE, LA DESCRIPTION, LES DEUX CARTES ──────────────────── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="type-eyebrow font-title text-[var(--gold)]">I — Mes prestations</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.04] md:text-5xl">
              Deux univers,
              <br />
              <em className="font-normal not-italic text-[var(--gold)]">un même magicien.</em>
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
              À quelques centimètres de vos invités ou face à une salle entière, c’est la même envie
              : que l’on reparle de votre soirée le lendemain.
            </p>
          </motion.div>

          <div className="mt-8 space-y-3">
            {groupes.map((groupe, i) => (
              <motion.a
                key={groupe.titre}
                href={groupe.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                /* Toute la carte est le lien : la cible de clic fait sa surface
                   entière, et non les quelques pixels du titre. La flèche n'est
                   donc qu'un `span` décoratif — en faire un second lien vers la
                   même destination la ferait annoncer deux fois par un lecteur
                   d'écran. */
                className="group block rounded-xl border border-border p-6 transition-colors hover:border-[var(--gold)]/45 hover:bg-white/[0.03] md:p-7"
              >
                {/* ⚠️ LE PICTOGRAMME A REMPLACÉ LE NUMÉRO. La numérotation
                    venait de la liste de sept formats, où elle disait « une
                    seule offre lue d'un bout à l'autre » ; sur deux cartes,
                    « 01 » et « 02 » ne comptent plus rien et occupaient la
                    place où l'œil cherche l'identité de la carte.
                    ⚠️ L'ICÔNE FAIT EXACTEMENT LA HAUTEUR DU BLOC DE TEXTE, et
                    c'est ce qui l'aligne. Elle était centrée dessus, à 40 puis
                    48px : son haut tombait alors SOUS le sur-titre et son bas
                    AU-DESSUS de la ligne du titre — elle ne s'alignait donc sur
                    ni l'un ni l'autre et paraissait flotter entre les deux.

                    Hauteurs additionnées : sur-titre 13,8px (0.72rem à 1,2
                    d'interligne) + 8px de `mt-2` + titre 37,5px en dessous de
                    768px, 45 au-dessus. Soit 59,3 et 66,8 — d'où 3.7rem et
                    4.2rem, et `items-start` pour que les deux hauts coïncident.
                    Les deux bords de l'icône tombent ainsi pile sur le haut du
                    sur-titre et le bas du titre.

                    ⚠️ Changer le corps du titre casse cet alignement en
                    silence : refaire l'addition. */}
                <div className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="picto h-[3.7rem] w-[3.7rem] shrink-0 text-[var(--gold)] transition-colors group-hover:text-[var(--gold-soft)] md:h-[4.2rem] md:w-[4.2rem]"
                    style={{ "--picto": `url(${groupe.picto})` } as CSSProperties}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="type-eyebrow font-title block text-muted-foreground">
                      {groupe.surtitre}
                    </span>
                    <span className="mt-2 block font-display text-3xl leading-tight transition-colors group-hover:text-[var(--gold)] md:text-4xl">
                      {groupe.titre}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 self-center text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                  >
                    <ArrowRight size={20} />
                  </span>
                </div>

                <p className="mt-4 max-w-xl text-[0.95rem] font-light leading-relaxed text-muted-foreground">
                  {groupe.description}
                </p>

                {/* Les formats en une seule ligne, séparés par des puces. Ils
                    étaient sept entrées détaillées ; ils ne sont plus que les
                    mots-clés que les gens cherchent. Le point médian est
                    `aria-hidden` : sans cela, un lecteur d'écran annonce
                    « point » entre chaque format. */}
                <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.78rem] text-muted-foreground/75">
                  {groupe.occasions.map((f, j) => (
                    <span key={f} className="flex items-center gap-2.5">
                      {j > 0 && (
                        <span aria-hidden="true" className="text-[var(--gold)]/50">
                          ·
                        </span>
                      )}
                      {f}
                    </span>
                  ))}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
