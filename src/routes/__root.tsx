import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { donneesStructureesAccueil } from "../lib/donnees-structurees";
import { reportLovableError } from "../lib/lovable-error-reporting";

// Adresse publique du site. Les balises Open Graph exigent des URL ABSOLUES :
// Facebook, WhatsApp et LinkedIn lisent la page depuis leurs propres serveurs
// et n'ont aucun moyen de résoudre un « /og-vince.jpg ». D'où cette constante
// — LE seul endroit à modifier le jour où un vrai nom de domaine remplacera
// l'adresse workers.dev. L'oublier ne casse rien de visible sur le site : la
// vignette de partage cesse simplement de s'afficher, et personne ne s'en
// aperçoit avant qu'un lien soit envoyé.
// PAS ENCORE DÉPLOYÉ : cette adresse est une supposition, pas une URL vérifiée.
// La corriger au premier déploiement, sinon la vignette de partage de ce site
// ira chercher son image sur un site qui n'existe pas.
const SITE_URL = "https://vince.johanflament69.workers.dev";

// Description reprise par Google sous le titre, et par les messageries sous la
// vignette. Autour de 155 caractères : au-delà, la fin est coupée.
//
// ⚠️ ELLE ANNONÇAIT DES « ateliers d'initiation » QUI N'EXISTENT PLUS : la
// section correspondante a été retirée de la page, et l'option a même disparu
// du menu déroulant du formulaire de contact. Une description qui promet une
// prestation absente du site fait arriver le visiteur sur une page qui ne
// répond pas à ce qu'il a lu dans les résultats de recherche — et c'est la
// première chose que mesure Google. Les deux formats réellement présentés sont
// le close-up et le spectacle de scène ; elle ne dit plus que ceux-là.
//
// ⚠️ « en Picardie » EST CONSERVÉ EN L'ÉTAT. Ce n'est pas une validation : le
// dépôt se contredit (la biographie situe Vince à Tours, voir README.md) et la
// question n'est pas tranchée. Corriger cette ligne dans un sens ou dans
// l'autre serait la trancher ici, au milieu du <head>. Elle reste donc alignée
// sur le reste du site en attendant l'arbitrage.
const DESCRIPTION =
  "Vince, magicien en Picardie : close-up et spectacles de scène, pour un public familial comme adulte, à Amiens, Beauvais et alentour.";
const TITRE = "Magic Vince — Magicien en Picardie";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            /* `hover:bg-secondary` et non `hover:bg-accent` : depuis le passage
               à la charte or, `--accent` est un or profond, sur lequel le
               `text-foreground` blanc de ce lien ne tenait plus que 3.4:1.
               `--secondary` est un gris neutre, le blanc y reste à 14:1. */
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  /**
   * ⚠️ CE `head()` S'APPLIQUE À TOUTES LES ROUTES, la racine étant l'ancêtre de
   * chacune. C'est ce qui rend ses balises communes utiles — et ce qui interdit
   * d'y mettre telle quelle une balise qui ne vaut que pour l'accueil.
   *
   * Trois de ces balises ne valent QUE pour l'accueil, et se tromperaient
   * ailleurs :
   *   - le JSON-LD, dont chaque nœud est identifié par l'URL de l'accueil : sur
   *     `/mentions-legales`, il affirmerait que cette page est la page
   *     d'accueil du site ;
   *   - le lien canonique, qui désignerait `/` comme la version de référence de
   *     toute autre page — c'est-à-dire demanderait leur désindexation au
   *     profit de l'accueil ;
   *   - la balise `robots`, qui remettrait en indexation les trois pages
   *     justement placées en `noindex`. Elle ne gagnerait pas (voir plus bas,
   *     la route la plus spécifique l'emporte), mais compter là-dessus pour une
   *     désindexation est une mauvaise idée.
   *
   * D'où `matches` : il contient toute la chaîne des routes actives, de la
   * racine à la feuille. Le `routeId` de la dernière dit donc où l'on est.
   * Comparer un `routeId` et non un chemin : c'est un identifiant de fichier de
   * route, insensible au réglage des barres obliques finales.
   *
   * ⚠️ `feuille` EST ANNOTÉE `string`, et l'annotation n'est pas décorative :
   * `matches` est typé depuis la route qui porte le `head()`, c'est-à-dire la
   * racine, dont le `routeId` ne peut valoir que `"__root__"`. Sans
   * l'élargissement, TypeScript refuse la comparaison à `"/"` en signalant deux
   * littéraux sans recouvrement — alors qu'à l'exécution le tableau contient
   * bien les routes enfants.
   */
  head: ({ matches }) => {
    const feuille: string | undefined = matches[matches.length - 1]?.routeId;
    const estAccueil = feuille === "/";

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        // Teinte la barre du navigateur sur mobile du fond du site. À tenir
        // synchronisé avec `--background` dans styles.css : il n'y a pas moyen
        // d'y mettre une variable CSS, c'est une valeur en dur des deux côtés.
        { name: "theme-color", content: "#0c0c0c" },
        { title: TITRE },
        { name: "description", content: DESCRIPTION },
        { name: "author", content: "Vince" },
        { property: "og:site_name", content: "Magic Vince" },
        { property: "og:locale", content: "fr_FR" },
        { property: "og:title", content: TITRE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:url", content: SITE_URL },
        // ⚠️ CETTE IMAGE A ÉTÉ REFAITE. C'était encore la photo de partage du
        // précédent artiste, héritée de la copie du site : chaque partage sur
        // un réseau montrait le portrait de quelqu'un d'autre, et le texte
        // alternatif décrivait une carte enflammée qui n'y était même pas.
        // Elle est désormais fabriquée depuis `studio-bras-ouverts.jpg`, une
        // vraie photo de Vince, recadrée en 1200 × 630 avec 88 pixels d'air
        // au-dessus de la tête — le cadrage a été calculé, pas visé à l'œil :
        // le sujet occupe 93 % de la hauteur d'origine et la fenêtre n'en
        // garde que 79 %, il fallait donc choisir ce qu'on perd, et c'est le
        // bas du guéridon.
        //
        // ⚠️ SEUL FICHIER DU SITE À RESTER EN JPEG, et volontairement : tout le
        // reste est passé en WebP, mais plusieurs robots d'aperçu social ne
        // lisent toujours pas le WebP pour `og:image` et n'afficheraient alors
        // aucune vignette.
        //
        // 1200 × 630 est le format qu'attendent Facebook et LinkedIn ; en
        // dessous de 600 de large, ils replient le lien sur une vignette carrée
        // minuscule au lieu de la grande carte.
        { property: "og:image", content: `${SITE_URL}/og-vince.jpg` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:image:alt",
          content: "Vince, magicien, bras grands ouverts derrière son guéridon sur fond clair",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITRE },
        { name: "twitter:description", content: DESCRIPTION },
        { name: "twitter:image", content: `${SITE_URL}/og-vince.jpg` },

        // ── CE QUI NE VAUT QUE POUR L'ACCUEIL ──────────────────────────────
        // Voir le commentaire de `head()` : ces entrées se tromperaient sur les
        // trois autres routes. `...[]` plutôt qu'un `undefined` glissé dans le
        // tableau : TanStack rendrait une balise vide.
        ...(estAccueil
          ? [
              // `index, follow` est déjà le comportement par défaut de Google et
              // ne sert qu'à le rendre explicite. Ce qui s'ajoute vraiment, c'est
              // `max-image-preview:large` : sans lui, Google se limite à une
              // vignette dans ses résultats et dans Discover. Sur le site d'un
              // artiste, dont l'argument est visuel, c'est la différence entre une
              // image qu'on regarde et un timbre-poste. Aucune affirmation là-
              // dedans : c'est une autorisation, pas une donnée.
              { name: "robots", content: "index, follow, max-image-preview:large" },
              // LE JSON-LD. Une entrée `"script:ld+json"` dans le tableau `meta`
              // n'est pas un détournement : TanStack Router la reconnaît et la
              // rend en `<script type="application/ld+json">` dans le <head>,
              // côté serveur, en échappant `&`, `<` et `>` en séquences
              // `\uXXXX` — valides en JSON, donc sans altérer les données.
              // Le contenu, ses choix de types et surtout ses absences
              // volontaires sont documentés dans `src/lib/donnees-structurees.ts`.
              {
                "script:ld+json": donneesStructureesAccueil({
                  siteUrl: SITE_URL,
                  titre: TITRE,
                  description: DESCRIPTION,
                }),
              },
            ]
          : []),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        // Icônes servies depuis public/, donc à la racine du site : le « M » de
        // Magic en didone sur le bleu nuit, avec l'étincelle du logo. Pas de .ico
        // — tous les navigateurs encore en service acceptent le PNG, et macOS n'a
        // pas d'outil pour en produire un.
        //
        // Le SVG d'abord : les navigateurs qui le gèrent l'utilisent et l'icône
        // reste nette à n'importe quelle densité d'écran. Les PNG restent le
        // recours pour les autres, et pour iOS qui ignore le SVG.
        //
        // Le 32 n'est PAS une simple réduction des autres : à cette taille les
        // déliés d'une didone disparaissent et le M devenait illisible. Il est
        // décliné d'un dessin à part, plus gras et plus serré dans son carré.
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon-512.png" },
        // Sans coins arrondis, contrairement aux autres : iOS applique son propre
        // masque par-dessus, et une icône déjà arrondie s'y retrouve rognée.
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          // Contraste éditorial : Playfair Display signe les titres tandis que
          // Source Sans 3 garde les textes et les actions directs et accessibles.
          // Montserrat et Allura n'interviennent qu'en haut de page : la
          // géométrique porte le titre du hero et la barre de navigation, le
          // script ne peint que « l'impossible ».
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Caveat:wght@400;500&display=swap",
        },

        // ── LE LIEN CANONIQUE, sur l'accueil seulement ─────────────────────
        //
        // Il dit à Google quelle adresse est LA bonne quand plusieurs y mènent —
        // et plusieurs y mèneront : un lien avec `?fbclid=…` collé par Facebook,
        // l'adresse workers.dev le temps de la mise au point, puis le vrai nom de
        // domaine. Sans lui, ces variantes se concurrencent comme autant de pages
        // distinctes portant le même contenu.
        //
        // ⚠️ RELATIF (« / ») ET NON ABSOLU, contrairement à `og:url` juste
        // au-dessus, et c'est une précaution délibérée. Google accepte les deux
        // formes et résout le relatif contre l'adresse réellement servie : le lien
        // est donc juste à toutes les adresses, aujourd'hui comme après un
        // changement de domaine. Un canonique ABSOLU vers une adresse fausse est
        // au contraire l'erreur la plus coûteuse du référencement — il demande à
        // Google d'indexer une page qui n'existe pas, et le site entier disparaît
        // des résultats. Or `SITE_URL` est aujourd'hui une supposition. Open Graph
        // n'a pas le choix (Facebook lit depuis ses serveurs et ne peut pas
        // résoudre un chemin relatif) ; ici on l'a, donc on le prend.
        ...(estAccueil ? [{ rel: "canonical", href: "/" }] : []),
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
