import { useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUp, Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { estAccueil } from "@/lib/accueil";
import logoAnime from "@/assets/Vince_Animated-Logo-White_loop_200x200_transparent.gif";
import fondCtaImg from "@/assets/photos/salle-spectacle-vide-large.webp";
import portraitImg from "@/assets/photos/studio-bras-ouverts-large.webp";

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Zone d'intervention, de la plus proche à la plus lointaine.
const villes = [
  "Amiens",
  "Beauvais",
  "Compiègne",
  "Saint-Quentin",
  "Laon",
  "Soissons",
  "Senlis",
  "Chantilly",
  "Abbeville",
  "Creil",
  "Lille",
  "Paris",
];

// Même ordre que la barre de navigation, PLUS « Avis » : cette entrée a quitté
// la barre au profit de « Galerie », et le pied de page est désormais le seul
// endroit d'où l'on atteint la section des avis. Ne pas l'y supprimer.
const navigation = [
  { label: "Close-up", hash: "#close-up" },
  { label: "Spectacles de scène", hash: "#spectacles" },
  { label: "Biographie", hash: "#biographie" },
  { label: "Galerie", hash: "#galerie" },
  { label: "Avis", hash: "#avis" },
];

function EmblemeAnime() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <img
      src={logoAnime}
      alt=""
      aria-hidden="true"
      width={200}
      height={200}
      loading="lazy"
      className="h-16 w-16 shrink-0 md:h-20 md:w-20"
    />
  );
}

/**
 * ⚠️ AU NIVEAU DU MODULE, et pas dans `SiteFooter` — même raison que le
 * `NavAnchor` de la barre de navigation, où le défaut a été découvert.
 *
 * Une fonction déclarée dans un composant a une identité neuve à chaque
 * rendu ; React n'y voit pas le même type d'élément, démonte le sous-arbre et
 * le remonte. Les nœuds du DOM sont recréés, et une balise `<img>` neuve
 * repart de la première image de son GIF. Ici cela concerne l'emblème animé
 * du bas de page.
 */
function Ancre({
  hash,
  isHome,
  className,
  children,
}: {
  hash: string;
  isHome: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return isHome ? (
    <a href={hash} className={className}>
      {children}
    </a>
  ) : (
    // Passer par le routeur plutôt que par un `href="/#ancre"`, qui
    // rechargerait le document et perdrait la position.
    <Link to="/" hash={hash.slice(1)} className={className}>
      {children}
    </Link>
  );
}

/**
 * LE PIED DE PAGE, reconstruit.
 *
 * L'ancien tenait sur 190 lignes de CSS dans une balise `<style>` locale —
 * une trentaine de classes `.footer-*` qui redéclaraient à la main ce que les
 * utilitaires font déjà, plus un bandeau de villes défilant en boucle et un
 * hook `useIsMobile` dupliqué depuis `src/hooks/`. Tout est réécrit en
 * utilitaires : mêmes points de rupture que le reste du site, mêmes tokens,
 * et plus de feuille parallèle à maintenir.
 *
 * Trois étages, du plus engageant au plus administratif :
 *
 *  1. L'APPEL À L'ACTION. Il était une bande de plus ; il devient le sujet du
 *     pied de page. Grande typographie, deux actions — un devis, et le
 *     téléphone pour qui préfère parler. Le téléphone n'est pas un lien de
 *     second rang : sur un site d'artiste, beaucoup de demandes se décident
 *     par un appel.
 *  2. LA GRILLE. Identité, navigation, contact, zone. Quatre colonnes sur
 *     grand écran qui se replient en deux puis une.
 *  3. LE BANDEAU LÉGAL, une ligne.
 *
 * Le bandeau de villes défilant a disparu : il occupait toute une bande pour
 * répéter une information que la colonne « Zone » donne mieux, sans animation
 * perpétuelle ni copies du contenu pour couvrir la largeur.
 */
export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Les ancres ne valent que sur une page d'accueil, seule à porter les
  // sections qu'elles visent. Même liste que le menu, et pour la même raison :
  // sans elle, un clic depuis une variante ramènerait le visiteur sur « / » et
  // lui ferait perdre la variante qu'il regardait.
  const isHome = estAccueil(pathname);

  // `Ancre` est déclarée au niveau du module — voir le commentaire au-dessus
  // de sa définition. Déclarée ici, elle remonterait tout le pied de page à
  // chaque rendu, emblème animé compris.

  return (
    <footer className="relative overflow-hidden border-t border-[var(--gold)]/20 bg-card">
      {/* Halo doré très sourd, ancré en haut à gauche de l'appel à l'action.
          Seule concession décorative du bloc : il empêche le pied de page
          d'être un aplat gris de plus sous une page qui en compte déjà. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 -top-52 h-[38rem] w-[38rem] rounded-full opacity-[0.09]"
        style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
      />

      {/* ── 1. L'appel à l'action, en vedette ────────────────────────────
          Il porte le pied de page, donc il en prend la place : le titre monte
          au même corps que ceux des sections, et la respiration passe à
          py-24/py-32. Un pied de page « cossu » ne l'est pas par ses
          ornements mais par ce qu'il accorde d'espace à ce qui compte. */}
      <section className="relative overflow-hidden border-b border-border">
        {/* LA PHOTO qui habille le bloc. Pas une vignette posée à côté du
            texte : une image de fond, sur laquelle le titre se pose.

            Le choix du cliché n'est pas décoratif — une salle montée et vide,
            juste avant l'ouverture. C'est littéralement ce que dit le titre
            au-dessus : une salle qui attend qu'on y invite la magie. Un
            portrait à cet endroit aurait parlé du magicien ; celle-ci parle
            de l'événement du visiteur.

            `grayscale` pour la même raison que les bandes de format : la
            charte n'a qu'une couleur, et une photo colorée en aurait introduit
            une seconde juste sous le bouton doré.

            Deux voiles superposés, et il en faut deux : l'aplat à 65 % garantit
            un plancher de contraste partout — le texte reste lisible même sur
            les zones claires de la photo — et le dégradé par-dessus épaissit
            le côté du titre sans éteindre le côté droit, où la photo doit
            rester lisible. Un seul voile assez opaque pour le texte aurait
            effacé l'image qu'on cherche justement à montrer — à 80 %, la photo
            tombait à 15 de luminance moyenne et on ne voyait plus rien.
            Vérifié au calcul : sur le pixel le plus clair de la moitié gauche,
            le blanc du titre reste à 16:1. */}
        <img
          src={fondCtaImg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-background/65" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          {/* ⚠️ 8fr/4fr ET NON 7fr/5fr, et c'est le titre qui l'a imposé.
              Mesuré sur les chasses réelles de Playfair Display 400 (fichier
              téléchargé, table `hmtx`, 1000 unités par em) : « prochain
              événement. » fait 683px à 72px de corps. La colonne de titre en
              valait 672 — il débordait de 11px, donc il serait passé sur trois
              lignes. En 8fr/4fr elle monte à 768px et la coupe tient.
              L'ancienne accroche, « Invitez la magie à / votre événement. »,
              tenait en 561px par ligne : elle ne posait pas la question.

              La colonne de droite n'y perd rien : ses deux boutons mesurent
              255 et 211px, soit 482 avec l'écartement — ils ne tenaient DÉJÀ
              pas sur une ligne dans les 480px que 5fr leur donnait. Ils
              s'empilent de la même façon dans 384. */}
          <FadeIn className="grid items-end gap-12 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
            <div>
              <p className="type-eyebrow font-title text-[var(--gold)]">
                Close-up &amp; spectacles
              </p>
              <h2 className="mt-6 font-display text-5xl leading-[1.02] md:text-7xl">
                Parlons de votre
                <br />
                <em className="font-normal not-italic text-[var(--gold)]">prochain événement.</em>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:justify-end">
              <Ancre
                isHome={isHome}
                hash="#contact"
                className="group inline-flex min-h-[3.75rem] items-center gap-3 rounded-md bg-[var(--gold)] px-9 text-primary-foreground transition-colors hover:bg-[var(--gold-soft)]"
              >
                <span className="type-action font-title text-[0.78rem]">Demander un devis</span>
                <ArrowRight
                  size={18}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Ancre>
              <a
                href="tel:+33670018241"
                className="group inline-flex min-h-[3.75rem] items-center gap-3 rounded-md border border-white/25 px-8 text-foreground transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                <Phone size={17} className="shrink-0" aria-hidden="true" />
                <span className="type-action font-title text-[0.78rem]">06 70 01 82 41</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. Quatre colonnes séparées par des filets ────────────────────
          La photo de profil ronde a disparu. Une pastille est un code de
          réseau social : dans un pied de page, elle rapetissait l'artiste au
          lieu de l'installer, et le cadrage serré ne rendait service ni à la
          photo ni au bloc.

          À la place, une DÉCLARATION en Playfair, au même corps que les
          paragraphes des sections. C'est ce qui donne son assise au bloc :
          une phrase tenue, pas une vignette.

          Les filets VERTICAUX entre colonnes ne sont pas décoratifs : sans
          eux, quatre colonnes de texte gris flottent côte à côte sans qu'on
          sache où l'une finit. Ils n'apparaissent qu'à partir de 1024px, où
          les colonnes sont effectivement côte à côte. */}
      <section className="relative">
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,2fr))] lg:gap-0 lg:divide-x lg:divide-border">
            {/* La colonne d'identité prend les DEUX colonnes sous 1024px :
                le portrait et la phrase se lisent côte à côte, et une demi-
                largeur ne suffirait à aucun des deux. */}
            <FadeIn className="sm:col-span-2 lg:col-span-1 lg:pr-14">
              <div className="flex items-start gap-6">
                {/* PORTRAIT. Rectangulaire et en 3/4 — plus de pastille ronde,
                    et plus de photo en fond de section non plus.

                    En `background-image` et non en `<img>`, et ce n'est pas un
                    caprice : le visage est à 49 % / 22 % de la photo (mesuré,
                    pas estimé), il faut donc zoomer ET décaler verticalement.
                    Or avec `object-fit: cover`, une source 3/2 dans un cadre
                    3/4 tient exactement en hauteur et déborde en largeur —
                    seul l'axe qui déborde répond à `object-position`, le
                    réglage vertical n'aurait donc aucun effet et on obtiendrait
                    le magicien en pied dans une bande étroite.

                    `background-size: 380%` fait déborder les deux axes ; à
                    cette échelle la tête occupe environ 46 % de la hauteur du
                    cadre, ce qui est un vrai portrait. La position verticale à
                    0 % pose le visage juste au-dessus du centre, là où l'œil
                    l'attend.

                    `role="img"` + `aria-label` compensent l'absence d'`alt`
                    sur un fond CSS : sans eux, la photo n'existe pas pour un
                    lecteur d'écran. */}
                <div
                  role="img"
                  aria-label="Portrait de Vince, magicien"
                  className="aspect-[3/4] w-28 shrink-0 rounded-lg border border-[var(--gold)]/25 md:w-36"
                  style={{
                    backgroundImage: `url(${portraitImg})`,
                    backgroundSize: "380%",
                    backgroundPosition: "49% 0%",
                  }}
                />
                <p className="max-w-sm font-display text-xl leading-snug text-foreground/90 md:text-2xl">
                  {/* ⚠️ MÊME PHRASE QUE L'OUVERTURE DU BLOC « Mes prestations »
                      (`Prestations.tsx`), coupée en deux pour que la seconde
                      moitié passe en doré. La reprise est voulue — le pied de
                      page referme sur la promesse de l'ouverture — mais elle
                      n'est partagée par AUCUNE constante : modifier l'une sans
                      l'autre fait dire deux choses différentes à la même page,
                      et rien ne le signalerait. */}
                  Sur scène ou à quelques centimètres,{" "}
                  <em className="font-normal not-italic text-[var(--gold)]">
                    le lendemain vous vous en souviendrez encore…
                  </em>
                </p>
              </div>

              <div className="mt-9 flex gap-3">
                <a
                  href="https://www.facebook.com/magicvince.magicvince"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Magic Vince sur Facebook"
                  className="grid h-11 w-11 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
                >
                  <Facebook size={17} />
                </a>
                <a
                  href="https://www.youtube.com/@vincentzaragoza2415"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Magic Vince sur YouTube"
                  className="grid h-11 w-11 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
                >
                  <Youtube size={17} />
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.08} className="lg:px-10">
              <p className="type-eyebrow font-title text-foreground">Explorer</p>
              <ul className="mt-7 space-y-4">
                {navigation.map((entree) => (
                  <li key={entree.hash}>
                    <Ancre
                      isHome={isHome}
                      hash={entree.hash}
                      className="text-sm text-muted-foreground transition-colors hover:text-[var(--gold)]"
                    >
                      {entree.label}
                    </Ancre>
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.16} className="lg:px-10">
              <p className="type-eyebrow font-title text-foreground">Me joindre</p>
              <ul className="mt-7 space-y-4 text-sm">
                <li>
                  <a
                    href="tel:+33670018241"
                    className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-[var(--gold)]"
                  >
                    <Phone size={15} className="shrink-0" aria-hidden="true" />
                    06 70 01 82 41
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@magicvince.com"
                    className="inline-flex items-start gap-2.5 break-all text-muted-foreground transition-colors hover:text-[var(--gold)]"
                  >
                    <Mail size={15} className="mt-1 shrink-0" aria-hidden="true" />
                    contact@magicvince.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin size={15} className="mt-1 shrink-0" aria-hidden="true" />
                  Picardie · Hauts-de-France
                </li>
              </ul>
            </FadeIn>

            {/* Zone d'intervention en texte courant plutôt qu'en liste : ce
                sont des mots-clés pour le référencement local autant qu'une
                information, et douze puces auraient fait une colonne deux
                fois plus haute que ses voisines. */}
            <FadeIn delay={0.24} className="lg:pl-10">
              <p className="type-eyebrow font-title text-foreground">Zone d’intervention</p>
              <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
                {villes.join(" · ")}
                <span className="mt-2 block text-foreground/70">et partout en France.</span>
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 3. L'emblème, au centre entre deux filets ─────────────────────
          Un séparateur qui dit quelque chose plutôt qu'un trait de plus : les
          deux filets se rejoignent sur la marque, et ferment la grille avant
          le bandeau légal.

          `flex-1` sur les filets et non une largeur fixe : ils se partagent
          ce qui reste de part et d'autre de l'emblème, donc le montage tient
          à toutes les largeurs sans calcul.

          C'est bien la variante `_loop_`, qui TOURNE EN CONTINU : celle de la
          barre de navigation est la `_once_`, qui se fige après un tour. Les
          deux fichiers ne diffèrent que par le bloc NETSCAPE2.0 (19 octets) —
          voir LogoLockup.tsx. Ne pas les unifier.

          Aucun réglage ne met un GIF en pause. Comme dans le logo, il n'est
          donc PAS RENDU pour qui a demandé moins d'animations — les deux
          filets se rejoignent alors simplement, ce qui reste un séparateur
          valable. */}
      <div className="relative mx-auto flex max-w-7xl items-center gap-6 px-6 md:gap-10 md:px-10">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <EmblemeAnime />
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      {/* ── 4. Le bandeau légal ───────────────────────────────────────────── */}
      <div className="relative">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-7 text-xs text-muted-foreground md:flex-row md:justify-between md:px-10">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} Magic Vince</span>
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <Link to="/mentions-legales" className="transition-colors hover:text-[var(--gold)]">
              Mentions légales
            </Link>
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            {/* Le traitement des données a sa section dans les mentions légales
                plutôt qu'une page à part : le site n'ayant ni cookie ni traceur,
                il n'y avait pas de quoi remplir deux pages. */}
            <Link
              to="/mentions-legales"
              hash="donnees-personnelles"
              className="transition-colors hover:text-[var(--gold)]"
            >
              Politique de confidentialité
            </Link>
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <span>
              Réalisation :{" "}
              <a
                href="https://instagram.com/johanflament"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--gold)]"
              >
                Johan FLAMENT
              </a>
            </span>
          </p>

          <Ancre
            isHome={isHome}
            hash="#top"
            className="group inline-flex items-center gap-2 transition-colors hover:text-[var(--gold)]"
          >
            Retour en haut
            <ArrowUp
              size={14}
              className="shrink-0 transition-transform group-hover:-translate-y-0.5"
            />
          </Ancre>
        </div>
      </div>
    </footer>
  );
}
