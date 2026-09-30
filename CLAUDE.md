# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Site vitrine one-page de **Magic Vince**, magicien en Picardie.
Contenu, textes et commentaires de code sont en **français** — garder cette langue.

Nom de scène **Magic Vince**, artiste **Vince**, zone **Picardie**,
`contact@magicvince.com`, `06 70 01 82 41`. Ces valeurs font foi : toute
occurrence d'un autre nom d'artiste dans le code est un reste de copie à corriger.

## Avant tout : ce dépôt est né d'une copie

`~/Github/Vince` est né de la copie intégrale du site d'un autre magicien, lui-même converti du
site d'un troisième. Le code est donc arrivé entier, avec l'identité du précédent artiste
dedans.

**Cette identité a été entièrement retirée**, et il ne reste plus rien à retirer : textes, SEO,
mentions légales, coordonnées, réseaux sociaux, textes alternatifs, noms de fichiers, photos,
vidéos, avis, image de partage — et jusqu'au message du premier commit, réécrit. Le dépôt ne
nomme plus l'artiste d'origine nulle part, y compris dans cette documentation.

⚠️ Le contrôle à refaire après toute reprise de contenu ancien : chercher dans `src/`, `public/`
et les `.md` le nom civil et le nom de scène du précédent artiste. Ils ne sont volontairement pas
écrits ici — les inscrire dans la commande de vérification reviendrait à les réintroduire dans le
dépôt, c'est-à-dire à échouer au contrôle qu'on prétend faire.

Restent deux héritages à traiter, qui ne sont pas des mentions mais du contenu :
`public/og-vince.jpg` (l'image de partage) et les avis du bloc `reviews`, dont seul le nom du
magicien a été changé — voir `README.md`.

**Rien de tout cela ne casse le site** — c'est le danger. [`README.md`](README.md) tient la liste
de ce qui reste à remplacer avant toute mise en ligne ; la mettre à jour au fur et à mesure.

Trois points déjà réglés, à ne pas défaire :

- `wrangler.jsonc` porte `"name": "vince"`. Ce nom est l'adresse du Worker **et** une clé :
  déployer sous un nom déjà pris écrase le Worker qui le porte. C'est exactement ainsi qu'un
  nom de Worker a voyagé d'un dépôt à l'autre et a failli publier un site par-dessus un autre.
- `SITE_URL` en tête de `src/routes/__root.tsx` est le seul endroit où vit l'adresse publique
  (balises Open Graph). Elle porte aujourd'hui une **supposition** (`vince.johanflament69.workers.dev`),
  pas une URL vérifiée — à corriger au premier déploiement.
- L'adresse postale des mentions légales reste « à compléter » : celle qui figurait là
  appartenait à un artiste encore antérieur. Ne jamais la réintroduire.

## Les deux documents hérités

[`HANDOFF.md`](HANDOFF.md) décrit le site d'origine, pas celui-ci. Il reste exact sur ce qui est
commun (design system, blocs, pièges connus) et faux sur tout ce qui touche au contenu, aux
textes et aux photos. Le réécrire au fur et à mesure que ce site prend son identité propre.
`roadmap.md` et `.lovable/plan/` datent de la refonte des sections sous le hero.

## À rappeler à l'utilisateur en début de session

Ouvrir la session en redonnant, sans qu'il ait à le demander, les deux adresses de test :

```bash
cd ~/Github/Vince && bun run dev
```

- **Navigateur (Mac)** : `http://localhost:8083`
- **Mobile (même Wi-Fi)** : `http://192.168.1.154:8083` — vérifier l'IP avec `ipconfig getifaddr en0`

Le port est **fixé à 8083** avec `strictPort` (`vite.config.ts`) : si 8083 est pris, le démarrage
**échoue** au lieu de glisser sur 8084. C'est voulu — plusieurs sites de magiciens tournent en
parallèle sur cette machine (8080, 8081, 8082) et une adresse mouvante finit par ouvrir le
site d'un autre artiste. Le serveur écoute déjà sur toutes les interfaces, `--host` est inutile.

C'est l'utilisateur qui ouvre le navigateur — ne pas lancer de preview à sa place sans qu'il le demande.

## Commandes

```bash
bun run dev        # serveur de dev (Vite, http://localhost:8083)
bun run build      # build de production (Nitro → Cloudflare Worker dans .output/)
bun run preview    # sert le build de production
bun run format     # Prettier --write
bun run lint       # ESLint (Prettier inclus via eslint-plugin-prettier)
npx tsc --noEmit   # vérification de types (aucun script npm dédié)
```

**Aucune suite de tests** : la vérification se fait par `tsc --noEmit` + `lint` + rendu dans le
navigateur (desktop _et_ mobile — plusieurs sections ont un comportement conditionné aux petits écrans).

État actuel du dépôt : `tsc --noEmit` passe, `bun run build` passe, et `bun run lint` sort
**0 erreur** et 7 avertissements (`react-refresh/only-export-components`, une dépendance de
`useEffect`) qui sont le bruit de fond connu. Les 318 erreurs Prettier héritées de la copie ont
été résorbées par un `bun run format` global — le relancer avant de lire une sortie de lint,
sinon un vrai problème se noie dans le bruit.

`bun` est le gestionnaire du projet (`bun.lock`, pas de `package-lock.json`).

## Contraintes de plateforme

- **Projet connecté à Lovable** (voir `AGENTS.md`) : ne jamais réécrire l'historique poussé
  (force-push, rebase/amend/squash de commits déjà publiés) — cela casse l'historique côté Lovable.
  Les commits poussés sur la branche connectée resynchronisent l'éditeur : garder la branche fonctionnelle.
  Pas de remote git pour l'instant, une seule branche `main`.
- **`vite.config.ts`** délègue tout à `@lovable.dev/vite-tanstack-config`, qui inclut déjà
  tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, `componentTagger`, l'alias `@`, etc.
  Ne pas rajouter ces plugins à la main : l'app casse avec des plugins dupliqués. Seuls la
  redirection de l'entrée serveur et le bloc `server` (port/host) y sont surchargés.
- **`bunfig.toml`** impose un garde-fou supply-chain (`minimumReleaseAge = 24h`). Les exceptions
  sont listées explicitement — demander à l'utilisateur avant d'en ajouter une.
- **`wrangler.jsonc`** ne contient volontairement que `name` : le reste (main, assets,
  compatibility_date, nodejs_compat) est généré au build dans `.output/server/wrangler.json`.

## Architecture

**TanStack Start (SSR) + React 19 + Vite 8 + Tailwind v4 + Motion**, déployé en Worker Cloudflare.

### Chaîne d'entrée serveur (infrastructure, ne pas supprimer)

`src/server.ts` → `src/start.ts` → `src/lib/error-capture.ts` / `error-page.ts`.
Ces fichiers existent pour rattraper les erreurs SSR : `start.ts` pose un middleware serveur, et
`server.ts` enveloppe l'entrée `@tanstack/react-start/server-entry` parce que h3 transforme les
exceptions en 500 JSON `{"unhandled":true}` qu'un simple try/catch ne voit jamais.
`src/lib/lovable-error-reporting.ts` remonte en plus les erreurs client à l'éditeur Lovable.
`src/router.tsx` crée le router avec un `QueryClient` en contexte.

### Routage

Routage par fichiers dans `src/routes/` (conventions dans `src/routes/README.md`).
`src/routeTree.gen.ts` est **généré** — ne pas l'éditer. Pas de `src/pages/`, pas de `app/layout.tsx`.
Trois routes : `/` (`index.tsx`), `/home-v2` (variante de travail, `noindex, nofollow`) et
`/mentions-legales`. `__root.tsx` est le seul layout :
shell HTML (`<html lang="fr">`), balises `head` (SEO, favicons, Google Fonts) et boundaries 404 / erreur.

### Composition de la page

`Home()` dans `src/routes/index.tsx` n'assemble que sept blocs :

```
SiteNav · Hero · Marquee · Prestations · HomeEditorialSections · ContactSection · SiteFooter
```

`index.tsx` contenait aussi 400 lignes de code mort héritées de la version précédente
(`FormatSections`, `About`, `Testimonials`, `CTA`, leurs données et leurs faux témoignages).
Elles ont été supprimées avec les photos qu'elles importaient. `formatSections` redéfinissait au
passage les identifiants `close-up` et `spectacles` avec d'autres textes que ceux affichés :
éditer un texte là ne changeait rien à l'écran. Ne pas réintroduire de composant non monté.

Le gros du contenu éditorial (formats, vidéo, avis, FAQ, galerie) est dans
`src/components/HomeEditorialSections.tsx` (~1400 lignes). `Visionneuse.tsx` est la visionneuse
photo/vidéo commune aux trois galeries. `LogoLockup.tsx` reconstitue le bloc-logo en texte
(Playfair) plutôt qu'en image, et est partagé entre la barre et le pied de page.

### Les trois pages d'accueil

| Route      | Fichier                  | Barre de navigation    | Fond du hero                                                     |
| ---------- | ------------------------ | ---------------------- | ---------------------------------------------------------------- |
| `/`        | `src/routes/index.tsx`   | transparente au repos  | photo, calée sur la hauteur, alignée à droite                    |
| `/home-v2` | `src/routes/home-v2.tsx` | **opaque dès le haut** | vidéo plein cadre, **commençant sous la barre**                  |
| `/home-v3` | `src/routes/home-v3.tsx` | transparente au repos  | vidéo plein cadre, du haut de la fenêtre ; **signature masquée** |

Les deux variantes sont en `noindex, nofollow`.

⚠️ **Deux props, et rien d'autre, séparent ces trois pages : `fond` sur le hero et `barreOpaque`
sur le menu.** Le hero vit dans `src/components/Hero.tsx` ; `Marquee` est
exportés depuis `index.tsx` et importés par les variantes. Ne jamais dupliquer un bloc pour faire
diverger deux pages : le site d'origine dont ce dépôt est issu avait deux accueils parallèles, et
toute correction devait y être faite deux fois — quand elle n'était pas oubliée sur l'une.
Quand une variante est retenue, reporter ses deux props sur `/`, **supprimer les autres fichiers**
et réduire `ROUTES_ACCUEIL` à `["/"]`.

⚠️ **Ne pas reconfondre « être une page d'accueil » et « avoir une barre transparente ».**
`SiteNav` et `SiteFooter` testaient `pathname === "/"` en dur pour les deux à la fois, ce qui
donnait à `/home-v2` la barre opaque des pages intérieures _et_ des liens de menu qui renvoyaient
le visiteur sur `/`. Désormais :

- `estAccueil(pathname)` (`src/lib/accueil.ts`) décide des **ancres** — `#contact` est locale sur
  une page d'accueil, elle doit repasser par `/` ailleurs. **Toute nouvelle variante doit y être
  déclarée**, sinon elle éjecte son visiteur au premier clic dans le menu.
- la prop `barreOpaque` décide de l'**habillage**, indépendamment de l'URL. `/home-v2` s'en sert
  pour garder une barre pleine tout en restant une page d'accueil.

La v3 masque la **signature manuscrite** : en plein écran la vidéo occupe aussi la moitié droite
et le magicien s'y déplace, si bien que le texte se posait sur lui au lieu de se poser à côté.
C'est la seule différence de CONTENU entre les trois variantes ; toutes les autres ne portent que
sur le fond. Son voile du haut reste le voile allégé (45 % contre 70 %), la barre y étant
transparente : le baisser encore demande de juger sur l'image la plus CLAIRE de la boucle, pas
sur la première.

En `barreOpaque`, le fond de la barre est complètement opaque et non translucide à 70 % : la vidéo
y commence pile sous elle, il ne doit rien s'en deviner au travers.

Le décalage du média (`top-20 lg:top-24` dans `Hero.tsx`) reprend **exactement** les hauteurs de
la barre (`h-20` sous 1024px, `h-24` au-dessus). Les deux valeurs sont à tenir synchronisées : un
écart laisse soit une bande de fond nu, soit un bout de vidéo qui repasse sous la barre.

### Les blocs refaits sur maquette

**`Prestations.tsx`** (`#formules`) — sept formats en deux groupes, numérotés en continu de 01 à
07 : c'est une seule offre lue d'un bout à l'autre, pas deux catalogues. Les numéros sont calculés
au rendu, jamais écrits à la main, et chaque `description` tient sur UNE ligne — au-delà, la
hauteur des rangées devient irrégulière et la colonne de numéros perd son rythme. Le titre de
gauche est `sticky` : aucun `overflow` autre que `visible` sur ses ancêtres, c'est déjà pourquoi
`html, body` sont en `overflow-x: clip`. Sa photo d'illustration est en 4/3 et non en portrait,
pour que la colonne collante tienne entière dans une fenêtre de 800px de haut. Ce bloc remplace
un carrousel de trois cartes, supprimé ; une vignette suivait aussi le curseur au survol, retirée
à son tour — sept images chargées pour une liste, inopérante au clavier et au doigt.

**Les sections par format** (`FormatStories`) sont des bandes PLEINE LARGEUR : la photo occupe
toute la section et le texte se pose dessus, sur un dégradé qui va du fond opaque côté texte
jusqu'à transparent de l'autre. Le dégradé n'est pas décoratif, c'est ce qui rend le texte lisible
sur une photo dont on ne maîtrise pas le contraste local — ne pas le remplacer par un voile
uniforme. Deux dégradés selon l'orientation : horizontal au-dessus de 1024px, vertical depuis le
bas en dessous. ⚠️ **Les deux directions sont écrites en entier** (`bg-gradient-to-l` /
`bg-gradient-to-r`), jamais composées : Tailwind ne génère que les classes qu'il LIT dans les
sources, et une classe assemblée à l'exécution n'existe pas dans la feuille compilée. Le piège a
déjà coûté un dégradé manquant, sans la moindre erreur — juste du texte blanc sur du clair.
Leurs deux photos sont des prises de STUDIO à fond clair, choisies pour ça : un panneau noir de
texte qui mord dans un champ lumineux.

⚠️ **Trois réglages sont des propriétés de la PHOTO, pas de la position dans la page** — ils
vivent donc dans les données de chaque format, jamais déduits du rang :

- `texteADroite` : de quel côté se pose le panneau, selon où se tient le sujet.
- `filtre` : close-up en `grayscale` (sa source est déjà grise, saturation 1,3 — c'est un
  garde-fou), spectacles en **couleurs conservées** avec un filtre léger, le violet du studio
  faisant partie de la photo.
- `voile` : la portée du dégradé. Celui du close-up s'étire jusqu'à 65 %, le sujet étant au
  centre et la place libre à droite. Celui des spectacles s'éteint à **66 %** parce que le sujet
  y est centré à 54 % et court jusqu'au bord droit : un voile long l'aurait noyé. Au bord du
  texte (46 %) il pèse encore ~70 %, ce qui laisse le blanc à 13:1 et l'or des intitulés à 5,5:1.
  **Le raccourcir davantage fait passer les petits libellés sous le seuil de lisibilité.**
  Chaque section porte, dans l'ordre : le **nom du format** dans le filet (le mot exact du menu,
  pour qu'un visiteur arrivant de la barre le retrouve, et pour donner son sujet à la section),
  une **accroche** en H2 qui n'est pas le nom du format, **deux paragraphes** dont le premier fait
  chapeau, et une **fiche pratique** en `<dl>` (durée / public / sur place).
  ⚠️ **Les valeurs de la fiche sont reprises de réponses de la FAQ** plus bas dans la page — durée,
  matériel, personnalisation et âge y sont déjà affirmés. Rien n'y est inventé, et les deux endroits
  doivent rester d'accord : modifier l'un, c'est modifier l'autre.
  Chaque section porte aussi quatre occasions en pictogrammes lucide (`occasions`), quatre au maximum :
  au-delà, la rangée casse dans une colonne qui ne fait que 46 % de la page.

**`ReviewsAndFaq`** (`#avis`) se détache par la LUMINANCE et non par la teinte : `--card`
(#161616) sur le fond de page (#0c0c0c), plus deux filets dorés très pâles. La charte n'a qu'une
couleur d'accent et elle est réservée aux actions ; teinter ce fond vers le brun ou le bleu ferait
en plus virer l'or au vert par contraste simultané. Les avis sont en trois colonnes (accordé à
leur nombre), la FAQ en dessous en `columns-2` — et non en grille : le contenu d'un `<details>`
change de hauteur à l'ouverture, ce qui dans une grille pousserait toute la rangée.

**`Biographie`** (`#biographie`) porte le vrai texte de Vince, à la troisième personne — exception
assumée dans un site qui parle au « je ». Récit, distinctions et citations sont trois constantes
séparées en tête de fichier.

**`LogoLockup`** mêle un lettrage en casse mixte (« Magic » blanc, « Vince » or) et un emblème
GIF animé. ⚠️ Un GIF ne se met pas en pause : pour `prefers-reduced-motion`, l'emblème **n'est pas
rendu du tout**, c'est la seule réponse possible.

Elles n'en comptent plus que DEUX, close-up et
spectacles enfants : « Ateliers & initiations » a été retirée, avec son lien dans le pied de page.
Leurs bandeaux de quatre miniatures ont été retirés aussi, ainsi que la visionneuse qui allait
avec — la galerie en bas de page reste le seul endroit où l'on agrandit une photo.

**Hiérarchie des sections de format.** ⚠️ Trois niveaux, dans cet ordre de poids : `nom` domine
(60px, c'est le mot du menu — « Close-up », « Spectacles enfants »), `accroche` le commente (24px),
`surtitre` le situe dans le filet. **C'était l'inverse** : le nom tenait dans le filet en petites
capitales de 11px et l'accroche occupait 60px de Playfair, soit un rapport de 1 à 5,5 EN FAVEUR DE
LA PHRASE — la section la plus visible de la page ne disait donc pas de quoi elle parlait. Le
`surtitre` ne redit jamais le nom (« Magie de proximité », « Spectacle jeune public») : il apporte
le synonyme que le public emploie, et que les moteurs indexent.

**⚠️ DEUX MISES EN PAGE DE SECTION, et `mise` choisit.** Elles ne sont pas interchangeables.

`mise: "pleine"` (close-up) : photo bord à bord, texte par-dessus, dégradé qui lui dégage la
place. Demande un sujet qui tient dans une moitié et qui supporte un recadrage vertical sévère.

`mise: "colonne"` (spectacles enfants) : texte sur fond **noir** à gauche, photo dans une colonne
à droite. C'est une nécessité mesurée, pas un choix d'habillage — le sujet de cette photo occupe
x 11 %→85 % et **y 3 %→100 %**, il touche le haut et le bas du cadre. En bande pleine largeur,
`object-cover` recadre dans la hauteur : il n'en restait que 61 % sur un 1920, tête et pieds
coupés. Le calcul qui ferme le débat : une photo 3:2 ne remplit la hauteur d'une section de 780px
qu'à partir de 1170px de large, soit une fenêtre de 2340px pour une demi-colonne. D'où une boîte
à **proportion bornée** (`aspect-[6/5]`) centrée dans sa colonne, et non une photo étirée.

- **Grille 46/54**, pas 50/50 : bornée à 52rem et poussée à droite, la photo laissait 184px de
  noir entre elle et le texte sur un 1920. 46/54 la ramène 205px plus à gauche. La colonne de
  texte tombe à 475px d'utile — la rangée des deux boutons en mesure 425, elle tient encore.
  **Ne pas descendre sous 44 % sans refaire cette addition.**
- **`object-[45%_50%]` est calculé.** Boîte 1,2 contre photo 1,5006 : toute la hauteur est
  visible, 20,0 % de la largeur est rogné. La fenêtre va de 9,0 % à 89,0 % du cliché, laissant
  2 points d'air à gauche du sujet et 4 à droite. Hors de 25 %–55 %, on lui coupe un bras.
- **Pas de parallaxe ici.** La bande pleine largeur en a une, permise par son `scale-110` ; la
  colonne cale sur la hauteur et n'a donc aucune réserve verticale à découvrir.
- **Le fondu gauche ne couvre que 30 % de la boîte.** Le sujet en occupe 2,5 %→95 % ; plus long,
  il le mangerait. Ces 30 % tombent sur le guéridon et le seau, rien d'autre.
- Le rembourrage gauche, `max(1.5rem, (100vw - 80rem)/2 + 2.5rem)`, reproduit exactement le bord
  intérieur d'un `max-w-7xl px-10`. Le texte tombe sur la même verticale que les autres sections
  sans être dans ce conteneur. Vérifié : 560px de colonne de 1280 à 2560, 448 à 1024.

**`PanneauFormat`** porte le texte des deux mises en page. Extrait précisément pour qu'elles ne
divergent pas — il a déjà reçu plusieurs ajustements.

**Les pictogrammes du hero** sont cinq PNG (`cocktail`, `cartes`, `presentation`, `champagne`,
`spectacle`) rendus en **masques alpha** : seule leur couche alpha est lue, `currentColor` les
peint. ⚠️ Un PNG sans transparence donnerait un rectangle plein. Le repli en icône lucide pour
« Séminaires » a disparu avec l'arrivée de `presentation.png` ; les `Icone-*.png` de la première
livraison restent sur le disque mais ne sont plus importés.

**Les vidéos : une ambiance et deux bandes-annonces.** Ne pas les confondre — c'est la confusion
qui avait fait rejeter deux versions du bloc vidéo.

**`VideoFeature`** (`#video`) est une **bande d'illustration animée**, pas un lecteur : ni bouton,
ni contrôles, ni plein écran. Ce plan n'a ni début ni fin — c'est une ambiance — et deux versions
ont échoué avant d'en tirer les conséquences : un bouton de lecture promettait un film qui
n'existe pas, des contrôles invitaient à chercher une progression absente. `prefers-reduced-motion`
reçoit l'affiche fixe, équivalent exact. Le fichier n'est demandé qu'à l'approche de la section,
via un `IntersectionObserver` à 400px de marge. Le bouton « Voir la vidéo » du hero reste une
simple ancre vers cette section.

**`VideoPleinEcran`** (`src/components/VideoPleinEcran.tsx`) est le plein écran, lui, et il ne sert
QU'AUX DEUX BANDES-ANNONCES — celles-ci sont de vrais films, avec un début, une fin et du son.
Chaque section de format porte un `CtaVideo` « Voir la vidéo » à côté de « Demander un devis », qui
ouvre la sienne. Trois points à ne pas défaire :

- **Le panneau est rendu dans `document.body` par un portail.** `position: fixed` ne s'échappe pas
  d'un ancêtre qui crée un contexte d'empilement, et la page en est pleine (chaque section de
  format a un `overflow-hidden`, les blocs collants en créent un d'office, le hero est en `z-10`).
  Rendu sur place, le panneau passait SOUS la page, croix comprise, sans moyen de le refermer.
- **La balise `<video>` n'existe que pendant l'ouverture**, et son `key` la remonte au changement
  de film : 29 et 13 Mo que personne n'a à télécharger sans avoir cliqué, et pas de position de
  lecture héritée du film précédent.
- **Le déclenchement passe par un événement `window`** et non par une prop : les déclencheurs sont
  dispersés et n'ont aucun lien de parenté avec la visionneuse, qui vit dans `body`. `dispatchEvent`
  est synchrone, donc le navigateur voit encore une action directe du visiteur — c'est ce qui
  autorise **le son**. Un repli remet la sourdine et relance si la promesse est rejetée.

Le CTA a remplacé un bouton de lecture qui flottait au milieu de la moitié libre de la photo. Ce
placement dépendait de l'image — il fallait mesurer, pour chaque photo, que le rond ne tombe pas
sur le sujet et que le libellé garde 4,5:1 sur les pixels du dessous (celle des spectacles n'offrait
que 4,7) — et il n'existait pas sous 1024px, où le texte remplit la section : il fallait un second
déclencheur dans le flux, et deux rendus à tenir d'accord. L'utilitaire `pulse-copper` de
`styles.css` était son halo ; il reste défini et **inutilisé**.

**La galerie** (`EditorialGallery`) est une **mosaïque à motif de six tuiles** (`MOTIF_TUILES`),
le plus petit cycle qui remplisse exactement la grille à 4 et à 2 colonnes. ⚠️ L'ordre des photos
n'est pas libre : les positions 0-1-2 tombent sur des tuiles carrées, les positions 3-4-5 sur des
tuiles 2:1 — y placer un portrait lui coupe la tête. Et `APERCU` doit rester un multiple de six,
sinon l'aperçu s'arrête au milieu d'un motif et laisse des trous. Ne pas passer la grille en
`grid-auto-flow: dense` : les trous se combleraient, mais l'ordre à l'écran ne serait plus celui
du DOM et les flèches de la visionneuse sauteraient d'une photo à l'autre sans logique visible.

**`SiteFooter.tsx`** a été reconstruit en utilitaires Tailwind : il portait 190 lignes de CSS
dans une `<style>` locale (une trentaine de classes `.footer-*` qui redéclaraient à la main ce que
les utilitaires font déjà) et un `useIsMobile` dupliqué depuis `src/hooks/`. Trois étages : l'appel
à l'action « Invitez la magie à votre événement » — qui est maintenant le sujet du pied de page et
non une bande de plus —, une grille identité / navigation / contact / zone, puis un bandeau légal.
Le bandeau de villes défilant a disparu : il occupait toute une bande, avec une animation
perpétuelle et six copies du contenu pour couvrir la largeur, pour répéter ce que la colonne
« Zone » dit mieux.

Son bloc d'identité ne porte ni le lettrage « Magic Vince » — l'emblème du bas s'en charge — ni
de photo : une pastille ronde est un code de réseau social, elle rapetissait l'artiste au lieu de
l'installer. À la place, une **déclaration en Playfair** qui donne son assise au bloc, et quatre
colonnes **séparées par des filets verticaux** (`lg:divide-x`) — sans eux, quatre colonnes de
texte gris flottent sans qu'on sache où l'une finit.

Sa colonne d'identité porte un **portrait rectangulaire en 3/4** à côté de la phrase d'accroche
— ni pastille ronde, ni photo de fond. Il est en `background-image` parce que le visage est à
49 % / 22 % de la source (mesuré) : il faut zoomer **et** décaler verticalement, or avec
`object-fit` une source 3/2 dans un cadre 3/4 tient exactement en hauteur et seul l'axe qui
déborde répond à `object-position`. `background-size: 380%` fait déborder les deux axes ; la tête
occupe alors ~46 % du cadre. `role="img"` + `aria-label` compensent l'absence d'`alt`.

Son bloc d'appel à l'action est **habillé d'une photo de fond** — une salle montée et vide, ce
que le titre dit littéralement. Deux voiles superposés : un aplat `bg-background/65` qui donne un
plancher de contraste partout, et un dégradé par-dessus qui épaissit le côté du titre sans
éteindre le côté droit, où la photo doit rester visible. Un seul voile assez opaque pour le texte
effaçait l'image ; vérifié au calcul, le blanc du titre reste à 16:1 sur le pixel le plus clair.

⚠️ **NE JAMAIS DÉCLARER UN COMPOSANT DANS LE CORPS D'UN AUTRE.** C'est la règle que ce dépôt a
apprise à ses dépens, et le symptôme était indirect : l'emblème GIF du logo redémarrait à chaque
pixel défilé. Le mécanisme, qui ne produit aucune erreur — une fonction déclarée dans un composant
a une identité neuve à chaque rendu ; React compare les types d'éléments par identité, un type
différent n'est pas mis à jour mais **démonté puis remonté** ; remonter recrée les nœuds du DOM,
donc une `<img>` neuve, donc un GIF qui repart de sa première image. Or `SiteNav` se rend à chaque
pixel défilé (`scrolled`, `activeId`). `NavAnchor` et l'`Ancre` du pied de page sont donc déclarés
au niveau du module, avec `isHome` en prop.

Au passage, le `backdrop-blur` de la barre a longtemps été **permanent** et `transition-all`
remplacé par `transition-colors`, pour la même raison : créer ou détruire un `backdrop-filter`
refabrique la couche de composition, ce qui produit le même symptôme.

⚠️ **Mais un flou permanent floute en permanence.** En haut de page la barre n'avait aucune
couleur de fond et paraissait pourtant posée sur le hero : ce qu'on voyait était la bande de photo
floutée derrière elle. Le fond de la barre vit donc désormais dans un **calque séparé**
(`absolute inset-0`, frère du contenu et non son parent), qui garde son `backdrop-blur-xl` en
permanence — sa couche n'est jamais refabriquée — et dont seule l'**opacité** varie : à zéro, un
flou ne se voit pas. Le logo n'étant plus à l'intérieur de ce calque, même une recomposition ne
pourrait plus l'atteindre.

⚠️ **Ne jamais remettre `backdrop-blur` ni `background` sur le `<header>` lui-même** : il n'est
plus qu'un cadre de positionnement. Et le contenu a besoin de son `relative`, sans quoi il repasse
sous un frère `absolute` déclaré avant lui.

Le pied de page porte aussi l'**emblème animé au centre, entre deux filets** qui se partagent la place
restante (`flex-1`, pas de largeur fixe). Comme dans le logo, il n'est pas rendu en
`prefers-reduced-motion` — un GIF ne se met pas en pause ; les deux filets se rejoignent alors, ce
qui reste un séparateur valable. Sa colonne « Navigation » suit la barre **plus « Avis »** : cette
entrée a quitté le menu au profit de « Galerie », et le pied de page est désormais le seul chemin
vers la section des avis.

**`ContactSection.tsx`** — les trois cartes (email, téléphone, zone) sont en rangée AU-DESSUS du
formulaire, qui occupe toute la largeur. Les quatre champs courts passent sur quatre colonnes à
partir de 1024px : en deux colonnes, un champ « Prénom » s'étalait sur 560px.

### Le hero

Calé sur une maquette, et **entièrement en texte** : le titre et la signature manuscrite étaient
deux PNG (`Titre-Hero.png`, `Texte-Signature-…png`), ils sont maintenant composés en Playfair et
en Caveat. Ne pas les repasser en image — le `h1` porte le référencement de la page.

- Les quatre coupes du titre et les trois de la signature sont posées **à la main** dans le JSX :
  elles font partie du dessin. `.hero-titre` annule d'ailleurs `text-wrap: balance`, que
  l'utilitaire `font-display` impose et qui déplacerait les mots.
- `.hero-titre` et `.hero-block` vivent dans une `<style>` locale, **hors `@layer`**, pour passer
  devant les utilitaires Tailwind. C'est voulu, ne pas les convertir en classes.
- L'or n'est utilisé que pour ce qui appelle une action : filet du surtitre, deux lignes en
  italique du titre, bouton plein, paraphe de la signature. Icônes et libellés de format sont
  **blancs** ; c'est le survol qui les passe en or.
- La signature est masquée sous 1024px (elle se poserait sur le magicien) et la photo de fond
  sous 768px (cadrage trop serré).
- Un **bandeau de preuves** s'intercale entre les boutons et la rangée de pictogrammes : un filet,
  puis une ligne qui tourne toutes les 3,6 s entre trois arguments (500 événements, 5/5 Google,
  10 ans). ⚠️ En `prefers-reduced-motion`, les trois s'affichent **côte à côte et rien ne tourne** :
  un contenu qui se met à jour seul au-delà de 5 s doit pouvoir être arrêté (WCAG 2.2.2) et un
  carrousel sans commande de pause ne le peut pas. La version statique est la version accessible,
  pas un repli dégradé. La hauteur de la ligne est fixe, sans quoi un texte plus long décalerait
  tout le bas du hero à chaque rotation.
- Ce bandeau prend ~60px, et le hero est contraint en hauteur : c'est le terme `vh` du titre qui
  les rend (8.4vh → 7.4vh). **Tout ajout dans le hero se paie sur la taille du titre** — refaire
  le calcul avant d'insérer quoi que ce soit.
- La vidéo de fond (`fond="video"` ou `"video-plein"`) n'est **jamais rendue côté serveur** : `usePeutChargerLaVideo`
  part à `false` et n'autorise le montage qu'après hydratation, si le viewport fait ≥ 768px et si
  la connexion n'est ni `saveData` ni 2g/3g. Un `hidden md:block` ne suffirait pas — la balise
  serait dans le DOM et le fichier téléchargé quand même. L'image reste montée dessous et sert à
  la fois d'affiche, de repli et de fond pour `prefers-reduced-motion`.

### Ancres et navigation

La page est une one-page à ancres, et **les `id=` sont répartis sur trois fichiers** :

| Ancre         | Où vit le `id=`                                           | Dans le menu ?        |
| ------------- | --------------------------------------------------------- | --------------------- |
| `#top`        | `src/components/Hero.tsx`                                 | Accueil               |
| `#close-up`   | `HomeEditorialSections`, tableau `formats` (id dynamique) | Close-up              |
| `#spectacles` | idem                                                      | Spectacles enfants    |
| `#biographie` | `HomeEditorialSections`, composant `Biographie`           | Biographie            |
| `#avis`       | `HomeEditorialSections`, composant `ReviewsAndFaq`        | — (pied de page seul) |
| `#contact`    | `src/components/ContactSection.tsx`                       | Contact               |
| `#formules`   | `src/components/Prestations.tsx`                          | —                     |
| `#ateliers`   | `HomeEditorialSections`, tableau `formats`                | — (pied de page)      |
| `#video`      | `HomeEditorialSections`, `VideoFeature`                   | —                     |
| `#galerie`    | `HomeEditorialSections`, `EditorialGallery`               | Galerie               |

⚠️ **Un `href` du menu sans `id=` correspondant ne lève AUCUNE erreur** : `getElementById`
renvoie `null`, le lien ne fait rien et le soulignement ne s'allume jamais. C'est le seul
risque réel quand on touche à `links` — vérifier la colonne de droite avant d'ajouter une entrée.
« Ateliers & initiation » et « Galerie » ont quitté la barre (six entrées plus le bouton de devis
la remplissent) mais restent atteignables par la colonne « Navigation » du pied de page.

`SiteNav` dérive `trackedIds` de sa liste `links` et souligne la section active en comparant
`window.scrollY + 140` aux `id` du DOM (pas d'IntersectionObserver : certaines sections ne se
touchent pas). **Renommer ou supprimer un `id=` casse silencieusement le soulignement du menu et
les liens du pied de page** — vérifier `links` dans `SiteNav.tsx` et les `SectionLink` de
`SiteFooter.tsx`.

### Le formulaire de contact n'envoie rien

`ContactSection.tsx` : `onSubmit` fait `e.preventDefault()` puis `setSent(true)` — il affiche
« Message envoyé ! » sans qu'aucun message ne parte. Il n'y a **pas de backend et pas de repli
`mailto`**. Les seuls contacts réels de la page sont les liens `mailto:contact@magicvince.com`
et `tel:+33670018241`. À traiter avant la mise en ligne.

### Design system

Tout est dans `src/styles.css` (Tailwind v4, config en CSS, pas de `tailwind.config.js`) :

- Palette **noir & blanc + or champagne**, trois valeurs relevées au pixel sur la maquette du
  hero : fond `#0c0c0c`, or `#deb780`, texte `#ffffff`. Tout le reste en est dérivé. Les neutres
  sont à **chroma 0** — ne pas les teinter, un gris coloré verdit l'or par contraste simultané.
  Tokens en `oklch` sous `:root`, exposés à Tailwind via `@theme inline`. Tokens maison en plus
  des tokens shadcn : `--gold`, `--gold-soft`, `--magenta` (or profond), `--teal` (or clair),
  `--orange`, `--gradient-gold`, `--gradient-copper`, `--gradient-stage`, `--shadow-glow`,
  `--shadow-card`. Utiliser ces tokens plutôt que des couleurs en dur.
  ⚠️ `--magenta` et `--teal` ne désignent ni magenta ni turquoise : noms hérités, ce sont des ors.
  ⚠️ `--primary-foreground` est **noir** : il ne sert que de couleur de texte _sur_ l'or
  (`bg-[var(--gold)] text-primary-foreground`). Le repasser en clair rend les CTA illisibles (1.6:1).
  `#0c0c0c` est aussi en dur dans le `theme-color` de `__root.tsx` et dans `public/favicon.svg` —
  trois endroits à tenir synchronisés.
- Quatre familles, chargées dans `__root.tsx` : Playfair Display (`--font-display`, titres, avec
  son italique pour les deux lignes dorées du hero), Montserrat (`--font-title`, hero, barre de
  nav, libellés), Source Sans 3 (`--font-sans`), Caveat (`--font-script`, la signature manuscrite
  du hero). N'appeler que des graisses **réellement chargées** dans le lien Google Fonts : une
  graisse absente ne lève aucune erreur, le navigateur retombe en silence sur une fonte système.
- Utilitaires personnalisés via `@utility` : `font-display`, `font-script`, `picto`, `type-eyebrow`,
  `type-action`, `text-gradient-gold`, `bg-stage`, `shadow-glow`, `shadow-card-lg`, `pulse-copper`,
  `no-scrollbar`, `grain`. Pas d'`@utility font-title` : passer par `var(--font-title)`.
- `html, body` utilisent **`overflow-x: clip`, jamais `hidden`** : `hidden` ferait de la page un
  conteneur de défilement et neutraliserait le `position: sticky` dont dépend l'agrandissement
  de la vidéo au scroll.

### Composants UI

`src/components/ui/` = shadcn/ui (style `new-york`, `components.json`), généré — la quasi-totalité
n'est pas utilisée par le site. Icônes : `lucide-react`. Animations : `motion` (import depuis
`motion/react`), avec `useReducedMotion` respecté.

### Assets

Images dans `src/assets/`, **importées directement** (`import img from "@/assets/x.jpg"`) pour que
Vite les empaquette et les serve avec un nom haché.

⚠️ Un upload fait depuis l'éditeur Lovable ne dépose pas le fichier : il écrit un pointeur
`*.asset.json` dont l'`url` (`/__l5e/assets-v1/…`) n'est résolue que dans le bac à sable Lovable.
En dev local comme en production Cloudflare, une telle image renvoie un 404. Si un `*.asset.json`
réapparaît, rapatrier le vrai fichier depuis les originaux et le remplacer par un import normal.
Vérification : `grep -rn "__l5e" src/` doit rester vide.

**Les photos sont celles de Vince** et suivent une convention à DEUX fichiers, et deux seulement :

| Suffixe     | Taille            | Usage                             |
| ----------- | ----------------- | --------------------------------- |
| `-vignette` | petit côté 560px  | ce que la grille affiche          |
| `-large`    | grand côté 1400px | chargé au clic par la visionneuse |

⚠️ **TOUT EST EN `.webp`** — plus un seul `.jpg` ni `.png` n'est importé, et le build n'en sert
aucun (vérifiable : `ls .output/public/assets/ | grep -E '\.(jpg|png)$'` doit rester vide). Les
25 dérivés photo ont été réencodés **depuis `photos-sources/`, pas depuis les JPEG** : transcoder
du JPEG vers WebP empile deux compressions avec pertes et fait ressortir les artefacts de la
première. Les dimensions en pixels sont inchangées, seul le codec a changé. Les JPEG dérivés ont
été supprimés puisqu'ils se régénèrent depuis les sources ; les PNG d'origine, eux, sont
CONSERVÉS — leur conversion n'est pas réversible (voir ci-dessous).

⚠️ **Les pictogrammes de `icones/` sont des MASQUES ALPHA** (`mask-image`, voir l'utilitaire
`picto` dans styles.css) : le navigateur ne lit que leur couche alpha, `currentColor` les peint.
Leurs pixels colorés ne servaient donc à rien. À la conversion, le RVB a été aplati en blanc uni
et seul l'alpha conservé, en WebP sans perte — d'où −70 % environ. C'est ce qui rend l'opération
IRRÉVERSIBLE : le `.webp` ne contient plus les couleurs d'origine. Ne pas supprimer les `.png`.
Cela vaut aussi pour `logo-google.png`, dont les quatre couleurs ne s'affichaient déjà pas — il
est rendu en or comme les autres.

Gains mesurés, au total **5 555 Ko → 1 512 Ko (−72,8 %)**. Le plus gros à lui seul :
`Background-Hero-MagicVince`, une photographie livrée en PNG, **1 463 Ko → 43 Ko (−97 %)**. Cet
écart n'est pas une perte de qualité mais un contenant inadapté : PSNR mesuré à 44,8 dB entre les
deux, écart maximal de 19 sur 255 sur un seul canal — invisible. C'est l'image LCP du hero.

⚠️ **L'ORIENTATION EXIF EST UN PIÈGE SILENCIEUX** si ces dérivés sont un jour régénérés. Un
navigateur redresse un JPEG d'après son étiquette EXIF ; une bibliothèque d'images, non — et le
WebP produit ne rembarque pas l'étiquette. Une photo prise à la verticale sort donc **couchée d'un
quart de tour**, et si on la redimensionne vers les dimensions de l'ancien dérivé — qui étaient les
bonnes — elle sort **en plus écrasée**. Avec `sharp`, l'appel qui corrige cela est `.rotate()` sans
argument, avant le `resize`. Une seule source du lot est concernée, `closeup-flamme-soiree`
(orientation 6), ce qui rend l'oubli d'autant plus facile : les 24 autres semblaient parfaites.
Contrôle : le rapport largeur/hauteur de chaque `.webp` doit égaler celui de sa source **une fois
redressée**.

Pas de repli `<picture>` avec une source JPEG : WebP est reconnu par tous les navigateurs depuis
Safari 14 (2020). Un repli coûterait deux fichiers par image pour un parc qui n'existe plus.

⚠️ **Aucun de ces fichiers n'est recadré, seulement redimensionné.** Tout le cadrage se fait au
navigateur, par `object-cover` et par le champ `cadrage` (`object-position`) de chaque entrée.
Recadrer une photo = changer deux nombres, jamais refabriquer un fichier. Les anciens `-1x1`,
`-4x5` et `-16x9` rognés à la fabrication ont disparu : ne pas les réintroduire.

Les originaux pleine définition sont dans **`src/assets/photos-sources/`** (52 Mo). Ce dossier
n'est importé par personne, donc Vite ne l'empaquette pas — il n'est là que pour régénérer les
dérivés. Sept sources sont en dessous de 1400px et leur `-large` est donc à leur taille native ;
elles sont un peu molles en visionneuse.

⚠️ Les valeurs de `cadrage` et de `descente` ont été **remises au neutre** avec ce changement de
photos : les précédentes étaient mesurées au centile sur des clichés qui n'existent plus. À
réétalonner en regardant les sections.

Favicons et icônes iOS/Android sont dans `public/` (servis à la racine, déclarés dans `__root.tsx`).
Les vidéos sont référencées en URL absolue depuis **`src/lib/medias.ts`** — trois constantes pour
trois rôles : `VIDEO_AMBIANCE` (fond des variantes et bande du milieu de page), `VIDEO_CLOSE_UP` et
`VIDEO_SPECTACLE_ENFANTS` (les bandes-annonces du plein écran). Elles étaient déclarées deux fois
avec deux valeurs différentes, si bien que le fond montrait Vince et que le bouton montrait
quelqu'un d'autre.

⚠️ **`VIDEO_AMBIANCE` n'est pas en faststart** : l'ordre de ses atomes est `ftyp / wide / mdat / …
/ moov`, la table de lecture est à la fin des 64 Mo. Les navigateurs s'en sortent — R2 répond aux
requêtes par plage — mais cela coûte un aller-retour de plus avant la première image, sur le tout
premier élément que le visiteur voit ; et 64 Mo pour 44 s font 12 Mbit/s, dix fois trop pour un
fond muet. Commande `ffmpeg` en commentaire dans le fichier. Les deux bandes-annonces, elles, sont
saines et déjà en faststart (vérifié sur leurs premiers kilo-octets). L'extension `.m4v` de celle
des spectacles est sans conséquence : R2 la sert en `video/mp4`, et c'est le type déclaré par le
serveur qui compte. L'espace de son nom de fichier doit rester encodé `%20`.

## Référencement — données structurées

Le JSON-LD vit dans **`src/lib/donnees-structurees.ts`** et n'est injecté que **sur `/`**, via
l'entrée `"script:ld+json"` du `head()` de `__root.tsx`. ⚠️ Le `head()` de la racine s'applique à
TOUTES les routes : sans la garde sur `matches`, un graphe identifié par l'URL de l'accueil
affirmerait sur `/mentions-legales` que cette page *est* l'accueil. Même garde pour le canonique
et la balise `robots`. Vérifié sur le worker construit : `/` en porte un, les trois autres routes
zéro, et leur `noindex` reste intact.

**Type retenu : `Person`, pas `LocalBusiness`.** `LocalBusiness` décrit un établissement où le
client se rend et dont `address` est la propriété centrale — Vince n'en a pas, et son adresse est
« à compléter ». `ProfessionalService` et `EntertainmentBusiness` en héritent, donc du même
problème. Le graphe est `Person` + `WebSite` + `WebPage`/`FAQPage` + deux `Service` (c'est
`Service` qui porte `areaServed`, `Person` ne l'accepte pas).

⚠️ **Ce qui n'est PAS déclaré, et pourquoi il ne faut pas l'ajouter à la légère** : aucun
`Review` ni `aggregateRating` (le tableau `reviews` est vide, voir son commentaire), aucune
`address`/`geo`/`openingHours`, aucun prix. `image` déclare bien `og-vince.jpg`, mais seulement depuis
que ce fichier montre Vince. `areaServed` vaut **« France »** et rien de plus précis : c'est
la seule géographie sur laquelle tout le dépôt s'accorde, la contradiction Picardie / Tours
n'étant pas tranchée.

⚠️ **Le canonique est RELATIF (`href="/"`)**, délibérément. `SITE_URL` est une supposition — et
elle est fausse : `https://vince.johanflament69.workers.dev` répond **404**, aucun worker n'y est
déployé. Un canonique absolu vers une adresse morte est l'erreur la plus coûteuse du
référencement, elle fait disparaître le site des résultats. Open Graph n'a pas le choix d'être
absolu ; le canonique, si. **Corriger `SITE_URL` avant la mise en ligne** : tous les `@id` du
graphe en dépendent.

**`public/robots.txt`** : `Allow: /`. ⚠️ Ne JAMAIS y ajouter de `Disallow` pour `/home-v2`,
`/home-v3` ou `/mentions-legales` — un `Disallow` empêche Google de *lire* leur `noindex`, et
l'URL peut alors rester indexée sans titre. Pas de `sitemap.xml` : une seule URL indexable,
atteinte dès la racine.

**⚠️ `src/lib/faq.ts` est la SOURCE UNIQUE des questions fréquentes.** Le même texte alimente la
section affichée et le `FAQPage`, et Google exige qu'ils soient identiques au mot près : une
réponse retouchée d'un seul côté ferait mentir la déclaration sans qu'aucun outil ne s'en
aperçoive. Le champ `structuree` décide lesquelles partent dans le JSON-LD — trois sur six
aujourd'hui, les autres étant soit non validées par Vince, soit prises dans la contradiction
géographique. Ne pas recopier ces textes ailleurs.

## Conventions

- Prettier : `printWidth: 100`, double quotes, point-virgules, trailing commas.
- Alias `@/*` → `src/*`.
- ESLint interdit d'importer `server-only` (convention Next.js) : utiliser `*.server.ts` ou
  `@tanstack/react-start/server-only`. `@typescript-eslint/no-unused-vars` est désactivé — ce n'est
  donc pas le lint qui signalera un import ou un composant devenu inutile.
- Les commentaires en français dans ce dépôt expliquent surtout des **pièges** (pourquoi
  `overflow-x: clip`, pourquoi le Worker est nommé en dur, pourquoi le port est figé, pourquoi le
  logo est du texte). Les lire avant de « simplifier » le code concerné.
