import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X, Phone } from "lucide-react";
import { LogoLockup } from "@/components/LogoLockup";
import { estAccueil } from "@/lib/accueil";

const links = [
  { label: "Accueil", href: "#top", inBar: true },
  { label: "Close-up", href: "#close-up", inBar: true },
  { label: "Spectacles de scène", href: "#spectacles", inBar: true },
  { label: "Biographie", href: "#biographie", inBar: true },
  { label: "Galerie", href: "#galerie", inBar: true },
  { label: "Contact", href: "#contact", inBar: true },
];

// ⚠️ CHAQUE `href` DOIT CORRESPONDRE À UN `id=` RÉELLEMENT RENDU, sinon le lien
// ne fait rien : le défilement n'a pas de cible et le soulignement ne s'allume
// jamais. Le code ne lève aucune erreur, `getElementById` renvoie juste `null`.
// Où vivent les ancres de ce menu :
//   #top          → Hero.tsx
//   #close-up     → HomeEditorialSections, tableau `formats` (id dynamique)
//   #spectacles   → idem
//   #biographie   → HomeEditorialSections, composant `Biographie`
//   #galerie      → HomeEditorialSections, composant `EditorialGallery`
//   #contact      → ContactSection.tsx
//
// « Avis » a quitté la barre au profit de « Galerie ». La section des avis
// existe toujours et garde son ancre `#avis` : elle reste atteignable par la
// colonne « Navigation » du pied de page — ne pas supprimer ce lien-là en
// croyant nettoyer.
//
// « Accueil » est REVENU dans la barre sur ordinateur, où le logo jouait seul
// ce rôle. C'est une demande explicite ; si la barre devient trop serrée sur
// les écrans moyens, c'est la première entrée à repasser en `inBar: false`.

// Les seules entrées affichées dans la barre sur ordinateur.
const barLinks = links.filter((l) => l.inBar);

// Ancres suivies par le soulignement, dédoublonnées. `#formules` (le carrousel)
// et `#galerie` n'y figurent pas : aucune entrée du menu ne les vise. C'est donc
// « Accueil » qui reste allumé du haut de page jusqu'aux formats, le carrousel
// appartenant visuellement au hero.
const trackedIds = [...new Set(links.map((l) => l.href.slice(1)))];

/**
 * ⚠️ DÉCLARÉ ICI, AU NIVEAU DU MODULE, ET SURTOUT PAS DANS `SiteNav`.
 *
 * Il y vivait, et c'est ce qui faisait redémarrer l'emblème animé du logo dès
 * qu'on défilait. Le mécanisme vaut d'être retenu, parce qu'il est invisible
 * et qu'il ne produit aucune erreur :
 *
 *   1. une fonction déclarée dans un composant a une IDENTITÉ NEUVE à chaque
 *      rendu ;
 *   2. React compare les types d'éléments par identité. Un type différent
 *      n'est pas mis à jour, il est DÉMONTÉ puis REMONTÉ ;
 *   3. remonter recrée les nœuds du DOM, donc une balise `<img>` neuve, donc
 *      un GIF qui repart de sa première image ;
 *   4. or `SiteNav` se rend à chaque pixel défilé — il suit `scrolled` et
 *      `activeId`. L'emblème redémarrait donc en continu pendant le
 *      défilement.
 *
 * Au niveau du module, l'identité est stable, React réconcilie les nœuds
 * existants et l'animation poursuit son cours. La même règle vaut pour tout
 * composant enfant : ne pas les définir dans le corps d'un autre.
 */
function NavAnchor({
  hash,
  isHome,
  children,
  ...rest
}: {
  hash: string;
  isHome: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  "aria-label"?: string;
  "aria-current"?: "true";
}) {
  return isHome ? (
    <a href={hash} {...rest}>
      {children}
    </a>
  ) : (
    // Passer par le routeur plutôt que par un `href="/#ancre"`, qui
    // rechargerait le document et perdrait la position.
    <Link to="/" hash={hash.slice(1)} {...rest}>
      {children}
    </Link>
  );
}

/**
 * `barreOpaque` force le fond sombre de la barre dès le haut de page, au lieu
 * de la laisser transparente jusqu'au premier défilement.
 *
 * C'est une prop et non une déduction depuis l'URL, parce que l'apparence de la
 * barre et la nature de la page sont DEUX CHOSES DISTINCTES, ce que le code
 * confondait jusqu'ici : une variante était bien une page d'accueil — ses ancres
 * sont locales, `#contact` ne doit pas repasser par « / » — mais elle veut une
 * barre pleine, sous laquelle sa vidéo commence. Déduire l'une de l'autre
 * obligeait à choisir entre les deux comportements.
 */
export function SiteNav({ barreOpaque = false }: { barreOpaque?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState(trackedIds[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Les ancres du menu ne valent que sur une page d'accueil, seule à porter les
  // sections qu'elles visent. Ailleurs — les mentions légales — elles doivent
  // repasser par « / ».
  //
  // Le test passe par `estAccueil` et non par `pathname === "/"` : les
  // variantes de travail sont aussi des pages d'accueil. Écrit en dur, il
  // renvoyait le visiteur d'une variante vers `/` au premier clic dans le menu,
  // lui faisant perdre la variante qu'il regardait.
  const isHome = estAccueil(pathname);

  // Trois raisons d'avoir un fond sombre, et une seule variable pour les trois :
  // la page a défilé, ce n'est pas un accueil (donc pas de hero plein écran),
  // ou l'appelant l'a demandé.
  const barrePleine = barreOpaque || scrolled || !isHome;

  // Panneau ouvert : Échap le referme, et la page cesse de défiler derrière lui —
  // sans quoi le geste de défilement passe au travers et le fond bouge.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 20);

      // Section active = la dernière dont le haut est passé sous le menu.
      // Un simple parcours plutôt qu'un IntersectionObserver : les sections ne
      // se touchent pas toutes (le bandeau défilant n'a pas d'ancre), et un
      // observateur laisserait des trous où plus aucun lien ne serait souligné.
      const line = window.scrollY + 140;
      let current = trackedIds[0];
      for (const id of trackedIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= line) current = id;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Toutes les entrées du menu visent des sections de l'accueil.
  //
  // Sur l'accueil, une ancre nue suffit : le navigateur fait défiler la page.
  // Ailleurs — les mentions légales — il faut d'abord revenir à l'accueil. Un
  // simple `href="/#contact"` y parvient mais recharge tout le document, et la
  // position de l'ancre se perd pendant que la page s'hydrate et que ses images
  // se chargent : on atterrit n'importe où, le plus souvent en haut. Le routeur,
  // lui, navigue sans rechargement et fait défiler jusqu'à l'ancre une fois la
  // page prête.
  // `NavAnchor` est déclaré AU NIVEAU DU MODULE, plus dans ce composant.
  // Voir le commentaire au-dessus de sa définition : c'est ce qui empêche le
  // logo de repartir de zéro à chaque pixel défilé.

  const textColor = "var(--foreground)";

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        /* Le `<header>` lui-même n'a PLUS NI FOND NI FLOU NI FILET : il n'est
           plus qu'un cadre de positionnement. Tout l'habillage est passé dans
           le calque ci-dessous. */
        className="fixed inset-x-0 top-0 z-50"
        style={{ color: textColor }}
      >
        {/* ── LE FOND DE LA BARRE, calque à part et piloté en OPACITÉ ───────
            En haut d'une page d'accueil il n'y a RIEN : ni couleur, ni filet,
            ni flou. Les liens flottent directement sur le hero. Le fond
            n'apparaît qu'au défilement.

            ⚠️ POURQUOI UN CALQUE SÉPARÉ PLUTÔT QU'UN FLOU CONDITIONNEL SUR LE
            HEADER. Le flou était posé en permanence sur la barre elle-même,
            précisément pour ne jamais le créer ni le détruire : créer ou
            supprimer un `backdrop-filter` refabrique la couche de composition,
            et une animation GIF portée par cette couche REPART DE ZÉRO — c'est
            le défaut qui a demandé deux corrections avant d'être compris.

            Mais un flou permanent FLOUTE EN PERMANENCE. En haut de page, la
            barre n'avait pas de couleur de fond et paraissait pourtant posée
            sur le hero : ce qu'on voyait était la bande floutée de la photo
            derrière elle.

            Le calque règle les deux d'un coup. Il garde son `backdrop-blur-xl`
            en permanence — donc sa couche n'est jamais refabriquée — et c'est
            son OPACITÉ qui varie : à zéro, un flou ne se voit pas. Et surtout
            le logo n'est plus dedans mais à côté, si bien que même une
            recomposition de ce calque ne pourrait plus l'atteindre.

            ⚠️ NE PAS REMETTRE `backdrop-blur` NI `background` SUR LE HEADER. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 border-b backdrop-blur-xl transition-[opacity,background-color] duration-500"
          style={{
            opacity: barrePleine ? 1 : 0,
            // Opaque et non translucide quand l'appelant l'a demandé : sur
            // une variante la vidéo commençait PILE sous la barre, il ne devait donc
            // rien s'en deviner au travers, sinon la limite entre les deux se
            // brouille. Au défilement en revanche, le 70 % translucide reste :
            // c'est lui qui laisse le contenu affleurer derrière la barre.
            backgroundColor: barreOpaque
              ? "var(--background)"
              : "color-mix(in oklab, var(--background) 70%, transparent)",
            borderColor: "var(--border)",
          }}
        />

        {/* Le contenu passe AU-DESSUS du calque de fond : sans `relative`, il
            se retrouve dans le même plan qu'un frère en `absolute` déclaré
            avant lui, donc dessous. */}
        <div className="relative">
          {/* ── Ordinateur ── */}
          <div className="hidden lg:flex max-w-7xl mx-auto px-6 min-[1460px]:px-10 h-24 items-center gap-4 min-[1460px]:gap-6">
            <NavAnchor isHome={isHome} hash="#top" aria-label="Accueil" className="group shrink-0">
              <LogoLockup />
            </NavAnchor>

            {/* mx-auto de part et d'autre : le menu se centre dans l'espace restant
            entre le logo et le bouton, quelle que soit leur largeur. */}
            {/* Espacement resserré entre 1024 et 1280px, et libellés d'un cran plus
            petits sur la même plage. Six entrées plus le bouton de devis, c'est
            ~980px de contenu pour 976px disponibles à 1024 : la barre débordait
            de quelques pixels et le menu montait sur le logo. Les deux réglages
            ensemble rendent une quarantaine de pixels. Au-dessus de 1280 la
            place ne manque plus et l'espacement reprend son ampleur. */}
            <nav className="mx-auto flex shrink-0 items-center gap-3 xl:gap-8 min-[1460px]:gap-10">
              {barLinks.map((l) => {
                const isActive = l.href.slice(1) === activeId;
                return (
                  <NavAnchor
                    isHome={isHome}
                    key={l.label}
                    hash={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className="type-action font-title text-[0.64rem] xl:text-[0.7rem] min-[1460px]:text-[0.78rem] whitespace-nowrap transition-colors duration-700 relative group py-2"
                    style={{ color: textColor }}
                  >
                    {l.label}
                    {/* Souligné en permanence sur la section courante, au survol
                    partout ailleurs — même trait, même transition. */}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 bg-[var(--gold)] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </NavAnchor>
                );
              })}
            </nav>

            <NavAnchor
              isHome={isHome}
              hash="#contact"
              className="type-action font-title text-[0.7rem] min-[1460px]:text-[0.78rem] whitespace-nowrap shrink-0 rounded-full px-5 min-[1460px]:px-7 py-3.5 text-foreground transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-copper)" }}
            >
              Demander un devis
            </NavAnchor>
          </div>

          {/* ── Mobile et tablette ── Trois places : le menu à gauche, le logo seul au
          centre, l'appel à droite. Le logo est centré sur la barre elle-même, et
          non entre les deux boutons : il reste donc au milieu de l'écran même si
          l'un des deux change de largeur. */}
          <div className="lg:hidden relative flex h-20 items-center justify-center px-5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={drawerOpen}
              className="absolute left-4 grid h-11 w-11 place-items-center rounded-full transition-colors"
              style={{ color: "var(--gold)" }}
            >
              <Menu size={26} />
            </button>

            <NavAnchor isHome={isHome} hash="#top" aria-label="Accueil">
              <LogoLockup compact />
            </NavAnchor>

            <a
              href="tel:+33670018241"
              aria-label="Appeler Vince au 06 70 01 82 41"
              className="absolute right-4 grid h-11 w-11 place-items-center rounded-full transition-colors"
              style={{ color: "var(--gold)" }}
            >
              <Phone size={22} />
            </a>
          </div>
        </div>
      </motion.header>

      {/* Panneau de navigation mobile. Il n'en existait aucun : sous 1024px, la
          page n'offrait qu'un bouton de contact, sans aucun accès aux sections.

          Il vit DEHORS du <header>, et non dedans. Un ancêtre qui porte un
          `transform` ou un `backdrop-filter` devient le référentiel de tout
          descendant en `position: fixed`. Or la barre prend `backdrop-blur` dès
          qu'on a défilé : le panneau se retrouvait alors enfermé dans ses 80px,
          en haut de l'écran, au lieu de couvrir la hauteur depuis la droite —
          et seulement après avoir défilé, puisque le flou n'est appliqué qu'à
          ce moment-là. */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
              className="lg:hidden fixed inset-0 z-[60]"
              /* Voile neutre : la valeur précédente tirait vers le violet
                 (C 0.02 H 280), reste de la charte bleue. Sur une page sans
                 aucune teinte, un scrim coloré se remarque. */
              style={{ background: "oklch(0.1 0 0 / 0.6)", backdropFilter: "blur(2px)" }}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Menu mobile"
              className="lg:hidden fixed top-0 right-0 bottom-0 z-[70] flex w-[78vw] max-w-[320px] flex-col border-l border-border bg-background px-8 py-10 overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fermer le menu"
                className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:text-[var(--gold)]"
              >
                <X size={24} />
              </button>

              <span className="self-start">
                <LogoLockup />
              </span>
              <span className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--gold)]">
                Magicien en Picardie
              </span>

              <ul className="mt-10 flex flex-col gap-6">
                {links
                  .filter((l) => l.href !== "#contact")
                  .map((l) => (
                    <li key={l.label}>
                      <NavAnchor
                        isHome={isHome}
                        hash={l.href}
                        onClick={() => setDrawerOpen(false)}
                        className="block text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-[var(--gold)]"
                      >
                        {l.label}
                      </NavAnchor>
                    </li>
                  ))}
              </ul>

              <NavAnchor
                isHome={isHome}
                hash="#contact"
                onClick={() => setDrawerOpen(false)}
                className="mt-10 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground"
                style={{ background: "var(--magenta)" }}
              >
                Me contacter
                <ArrowRight size={15} />
              </NavAnchor>

              <a
                href="tel:+33621915981"
                className="mt-5 inline-flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-[var(--gold)]"
              >
                <Phone size={15} />
                06.21.91.59.81
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
