# Handoff — Site Magic Vince

Site vitrine one-page d'un magicien basé en Picardie.
Repo `~/Github/Vince`, connecté à Lovable — un push sur `main` resynchronise Lovable.

Ce document décrit **ce qu'est le site**. `CLAUDE.md` décrit **comment travailler dessus**
(commandes, pièges, conventions de code). Les deux se lisent ensemble.

---

## 1. Lancer et tester

```bash
cd ~/Github/Vince && bun run dev
```

Le port est **fixé à 8083** avec `strictPort` (`vite.config.ts`) : si 8083 est occupé, le
démarrage échoue au lieu de glisser sur un autre port. D'autres projets occupent 8080,
8081 et 8082 sur cette machine.

| Cible               | Adresse                       |
| ------------------- | ----------------------------- |
| Navigateur (Mac)    | `http://localhost:<port>`     |
| Mobile (même Wi-Fi) | `http://192.168.1.154:<port>` |

Le serveur écoute déjà sur toutes les interfaces (`*:<port>`) — pas besoin de `--host`.
Si l'IP a changé : `ipconfig getifaddr en0`.

```bash
cd ~/Github/Vince && bun run build      # vérifier avant tout commit
```

---

## 2. Design system

### 2.1 Palette — bleu nuit + cuivre

Valeurs relevées à la pipette sur la maquette du hero, pour que le fond de page prolonge
sans raccord la photo qui s'y fond. Tout est en `oklch`, déclaré dans `src/styles.css`.

| Token                | Valeur                 | Rôle                                                             |
| -------------------- | ---------------------- | ---------------------------------------------------------------- |
| `--background`       | `#00182e`              | Bleu nuit, fond de toute la page                                 |
| `--foreground`       | quasi-blanc bleuté     | Texte courant                                                    |
| `--card`             | bleu légèrement relevé | Fonds de cartes et de blocs                                      |
| `--gold`             | `#d9825e`              | **Le cuivre.** Icônes, titres de section, filets, script du hero |
| `--gold-soft`        | cuivre clair           | Dégradés, survols clairs                                         |
| `--primary`          | `#a35943`              | Cuivre sourd des boutons pleins                                  |
| `--accent`           | `#8d4636`              | Cuivre profond, survols et bas de dégradés                       |
| `--border`           | cuivre à **45 %**      | Tous les filets — jamais un gris                                 |
| `--muted-foreground` | bleu-gris clair        | Texte secondaire                                                 |

Trois tokens historiques survivent sous de faux noms : `--magenta`, `--teal`, `--orange`
ont été réharmonisés sur le cuivre. **Ne pas se fier à leur nom**, seulement à leur valeur.

Dégradés : `--gradient-copper` (boutons pleins, clair en haut à gauche),
`--gradient-gold` (texte en dégradé), `--gradient-stage` (fond de scène radial).
Ombres : `--shadow-glow` (halo cuivré), `--shadow-card`.

### 2.2 Typographie

Quatre familles, chargées en une requête Google Fonts dans `src/routes/__root.tsx`.

| Token            | Police                  | Portée                                     |
| ---------------- | ----------------------- | ------------------------------------------ |
| `--font-sans`    | **Source Sans 3**       | Corps de texte, labels, tout le courant    |
| `--font-display` | **Playfair Display**    | Titres de section (`font-display`)         |
| `--font-title`   | **Montserrat**          | Hero et barre de navigation **uniquement** |
| `--font-script`  | **Qwitcher Grypen 700** | Un seul mot : « l'impossible » du hero     |

Deux règles non négociables :

- **`font-size: 17px` sur `html`.** Donc `1rem = 17px`. Tout le calcul en `rem` du site
  en dépend — changer cette valeur décale tout.
- **Qwitcher Grypen n'existe qu'en 700.** L'utilitaire `font-script` force `font-weight: 700` ;
  en 400 le navigateur retombe silencieusement sur la `cursive` système et on croit que
  la police n'a pas changé. Pas de `font-style: italic` (l'écriture est déjà penchée),
  pas de `line-height` (il écrasait celui de l'appelant).

Deux utilitaires de micro-typo : `type-eyebrow` (0,72rem, 600, `letter-spacing: .18em`,
capitales) pour les sur-titres « — Mes prestations », et `type-action` (0,78rem, `.12em`)
pour les libellés de boutons.

### 2.3 Utilitaires maison (`@utility`, Tailwind v4)

- **`picto`** — les icônes fournies sont des PNG monochromes `#fd5e36`. Elles servent de
  **masque alpha** et c'est `currentColor` qui les peint : elles suivent la couleur du texte,
  survol compris, et un seul fichier sert partout. Chaque usage pose son dessin dans `--picto`.
- **`pulse-copper`** — halo cuivré qui s'écarte du bouton de lecture vidéo (8 s, faible
  amplitude, repris du site Urbain). Neutralisé hors couche sous `prefers-reduced-motion`.
- `grain`, `no-scrollbar`, `bg-stage`, `shadow-glow`, `shadow-card-lg`, `text-gradient-gold`.

**Piège d'ordre de cascade :** `--font-title` est déclarée dans `@theme inline` et _pas_
redéfinie en `@utility`. La classe générée par le thème est émise **après** les utilitaires,
donc `class="type-action font-title"` bascule bien en Montserrat. Ajouter un
`@utility font-title` casserait ça.

### 2.4 Animations

`motion/react` partout. Deux motifs récurrents : `FadeIn`/`FadeInOnScroll` à l'entrée
dans le viewport (`once: true`), et le parallaxe du hero via `useScroll` + `useTransform`.

**Règle de goût, posée par l’artiste : on ne zoome pas, on éclaire.** Ni les photos ni les
pastilles ne grossissent au survol — une carte se soulève légèrement, un fond s'éclaircit,
une flèche se remplit.

> Tailwind v4 émet `-translate-y-*` sur la propriété CSS **`translate`**, pas `transform`.
> Chercher `transform: none` dans l'inspecteur est une fausse piste.

> **`overflow-clip`, jamais `overflow-hidden`, dès qu'un enfant dépasse du cadre.**
> `overflow: hidden` fait du conteneur un conteneur de DÉFILEMENT, même quand rien n'est
> visiblement défilable. Chrome y applique alors son ancrage de défilement, qui décale tout
> le contenu dès qu'un bloc grandit à l'intérieur. C'est ce qui déchirait les angles des
> anciennes cartes de formules — le dégradé descendait de 12,75 px et laissait passer la
> photo brute. `overflow: clip` découpe exactement pareil sans rien rendre défilable.
> **La même règle vaut sur `html, body`** : voir le bloc collant de la vidéo.

> **Pas de `hover:scale` sur une pastille au fond plein.** Elle est rastérisée à sa taille
> d'origine puis étirée, et ses angles arrondis ressortent crénelés. On éclaircit le fond.

> **`whileInView` + `overflow-hidden` = interblocage.** Un titre qui se dévoile derrière un
> masque commence hors de ce masque. Or `whileInView` repose sur un IntersectionObserver,
> qui mesure sa cible APRÈS découpage par les ancêtres : le texte était jugé invisible,
> l'animation ne partait jamais, et le titre ne s'affichait plus du tout. Il faut observer
> l'élément **masque** (que rien ne rogne) et transmettre l'état à l'enfant par variantes —
> c'est ce que fait `TitreRevele`.

> **Tailwind ne lit pas le code, il cherche des chaînes littérales.** Une classe assemblée
> à l'exécution (`` `md:pr-[${MARGE}]` ``) n'est jamais générée et la règle n'existe pas.
> Les valeurs arbitraires s'écrivent en toutes lettres, sans espaces.

---

## 3. Arborescence

### 3.1 Routes

| Route               | Fichier                           | Rôle                                                       |
| ------------------- | --------------------------------- | ---------------------------------------------------------- |
| `/`                 | `src/routes/index.tsx`            | **La page du site.** Tout est là                           |
| `/home-v2`          | `src/routes/home-v2.tsx`          | Variante conservée depuis Lovable. Pas liée depuis le site |
| `/mentions-legales` | `src/routes/mentions-legales.tsx` | Page légale, `noindex`                                     |
| —                   | `src/routes/__root.tsx`           | `<head>`, polices, métadonnées, `errorComponent`           |

⚠️ **Deux pages d'accueil.** Une modif dans `index.tsx` ne se répercute pas sur `/home-v2`.
`SiteNav` et `SiteFooter` sont partagés et savent qu'ils sont « à la maison » via
`pathname === "/" || pathname === "/home-v2"`.

### 3.2 Ancres de la page d'accueil

```
#top        Hero
#formules   Mes prestations (les 3 cartes) — l'ancre garde son nom d'origine
#close-up   Récit Close-up      ┐
#spectacles Récit Spectacles    ├─ FormatStories
#ateliers   Récit Ateliers      ┘
#video      Vidéo — cible du bouton « Voir la vidéo » du hero
#galerie    Galerie photo
#contact    Formulaire de contact
```

> **Ancres des sections de format, en dessous de 768px.** En une seule colonne la photo passe
> AVANT le texte : cliquer « Close-up » déposait le visiteur sur l'image, le titre restant
> 575 px plus bas. D'où `scroll-mt-[calc(6px-125vw)] md:scroll-mt-24` — la photo faisant
> 125vw de haut, l'expression suit la largeur de l'écran sans valeur à recalculer.

> **Marges d'ancrage négatives sur `#galerie` et `#contact`.** L'ancre vit sur la section,
> mais son `padding-top` puis le sur-titre séparent le point d'ancrage du titre : avec un
> `scroll-mt` positif, le titre atterrissait à 252 px du haut pour une barre de 86 px.
> `-scroll-mt-1 md:-scroll-mt-10` (galerie) et `-scroll-mt-2 md:-scroll-mt-14` (contact)
> ramènent le TITRE sous la barre — 108 à 113 px, sur mobile comme sur ordinateur.
> Toucher au `padding` de ces sections oblige à recalculer ces valeurs.

La barre de navigation liste `#close-up`, `#spectacles`, `#ateliers`, `#galerie`, `#contact`.
`#formules` n'y figure pas. **Toute section renommée casse le soulignement actif de la nav** —
les ancres sont couplées à la liste de `SiteNav.tsx`.

### 3.3 Composants

```
src/components/
  SiteNav.tsx              Barre fixe + menu mobile plein écran
  SiteFooter.tsx           CTA, coordonnées, bandeau de villes défilant, mentions
  LogoLockup.tsx           « Magic Vince » (Playfair didone), sur une seule ligne
  HomeEditorialSections.tsx  FormatStories · VideoFeature · ReviewsAndFaq · EditorialGallery
  Visionneuse.tsx          Visionneuse commune aux trois galeries (flèches, clavier, glissé)
  ContactSection.tsx       Formulaire
  Highlight.tsx            Mot surligné
  GallerySection.tsx       ⚠️ code mort — importé, jamais rendu, id="galerie" en double
```

---

## 4. Les blocs, dans l'ordre de la page

**1 · Hero** — `Hero()` dans `index.tsx`.

> **Le titre du hero est plafonné à `72vw` en dessous de 640 px.** Le contenu réclamait
> 797 px de haut pour 812 disponibles : quatorze pixels de marge. Or sur iPhone la barre
> d'adresse est **en bas**, et ces quatorze pixels y passaient — le bouton « Voir la vidéo »
> se retrouvait rogné. L'image perd une trentaine de pixels de haut (rapport 1000/562
> conservé), ce qui porte la marge à 44 px sans qu'on voie la différence. Au-delà de 640 px
> la hauteur n'a jamais manqué : on reprend le dimensionnement calé sur la maquette. Photo du magicien calée en haut à droite
> (`object-[right_top]`, `min-w-[90%]`) pour que le visage ne passe jamais derrière le menu.
> Colonne de texte en `clamp(30rem, 40vw, 44rem)` — largeur indexée sur la **largeur** de
> l'écran, jamais sur sa hauteur. Titre : un PNG (`src/assets/Titre-Hero.png`, 1000×562)
> dont le `alt` porte le texte réel — ce n'est pas décoratif. Au scroll, **la photo ne bouge pas** : seul le contenu s'enfonce et rétrécit pendant qu'un
> voile sombre se referme. Le zoom `bgScale` (1 → 1,12) et la dérive `bgY` de 4 % ont été
> retirés ensemble — la dérive ne tenait que grâce aux 6 % de débord que l'agrandissement
> lui ménageait. Sous le titre : 3 formats
> avec pictos (chapeau / rideau / agenda-étoile) puis 3 chiffres (dont « 1000+ événements »
> et la note Google, sur deux lignes comme les autres).

**2 · Bandeau défilant** — `Marquee()`. Les **formules puis les occasions puis les publics**
— Close-up, Spectacles, Ateliers, Cours de magie, Mariages, Baptêmes, Anniversaires, Galas,
Cocktails, Séminaires, Team Building, Arbres de Noël, Écoles, Mairies — pour qu'il se lise
comme une phrase même en entrant au milieu. Masqué sous 768 px.
Six copies identiques, une seule défile. **La durée doit suivre le nombre de mots**, sinon
le bandeau accélère à chaque ajout : compter 8 s par mot, soit 112 s pour les quatorze
d'aujourd'hui.
Le bandeau de **villes**, lui, est dans le pied de page — à ne pas confondre.

**3 · — Mes prestations** — `ShowsCarousel()` → `ShowsScrollRail()` → `ShowCard`.
**Trois cartes, pas de carrousel**, `grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3`.
Données dans `const shows`.

Chaque carte est une colonne : cadre photo **4/3** arrondi, puis numéro `01` suivi d'un filet
qui occupe la place restante, sur-titre cuivré, titre Playfair avec une flèche circulaire
alignée à droite, description, et tags en pastilles à fond plein. **Rien ne se pose sur la
photo** — ce qui fait disparaître d'un coup le dégradé de lisibilité, l'ombre portée et le
piège `overflow-clip` décrit plus haut.

Toute la carte est un seul lien : la flèche n'est qu'un `span`, sinon les lecteurs d'écran
annonceraient deux liens vers la même destination.

> **L'alignement des tags se fait par `mt-auto`, pas par un `min-h` sur la description.**
> Le nombre de lignes d'un texte ne dépend pas que de sa longueur mais de l'endroit où les
> mots se coupent : trois lignes partout à 1280 px, mais 3/4/3 à 820 px, quelle que soit la
> calibration au signe près. Les cartes d'une rangée de grille faisant déjà la même hauteur,
> `h-full` sur le lien et `mt-auto` sur la liste de tags suffisent — la rangée est alignée
> par construction. Mesuré : à 1024 px les trois cartes font 581 px et leurs tags finissent
> tous à 696 px, alors même que ceux de la première passent sur deux rangs.

> **Le cadre 3/4 recadre un peu** : les sources sont des portraits 4/5, le rognage vertical
> reste léger. D'où un `cadrage` (`object-position`) par carte, calé sur la
> position du chapeau : `50% 8%` pour le close-up, `50% 12%` pour les spectacles, `50% 50%`
> pour les ateliers. C'est le seul réglage à toucher.

> **L'`<img>` doit être `absolute inset-0`, pas `h-full w-full` en flux.** Elle porte ses
> dimensions intrinsèques dans ses attributs `width`/`height` : laissée dans le flux, elle
> impose sa hauteur au conteneur et **annule son `aspect-ratio`** — le cadre rendait en
> 374x467 (le 4/5 de la photo) au lieu du 4/3 demandé.

> `min-h-[3lh]` sur la description : sans plancher, les rangées de tags se décalaient d'une
> carte à l'autre.

**4 · Récits de formats** — `FormatStories()`, une section par format via `FormatStory`.
**La photo court jusqu'au bord de la fenêtre**, à gauche pour Close-up et Ateliers, à droite
pour Spectacles. La grille n'est donc plus dans `max-w-7xl` : c'est la colonne texte qui
rattrape l'alignement par une marge extérieure `max(2.5rem,calc((100vw-80rem)/2+2.5rem))`,
posée en classe `md:` (un style inline ignorerait les points de rupture et décalerait le
texte sur mobile). Réserve connue : `100vw` compte la barre de défilement, d'où ~7 px de
décalage sur les plateformes qui la réservent, au-delà de 1360 px de large.
La photo glisse de ±20 % dans son cadre au défilement (parallaxe interne), d'où sa réserve
de hauteur de 140 % — **la réserve vaut toujours le double du décalage**, sinon le
glissement découvre le fond. L'amplitude se juge en écart de VITESSE : ±6 % donnait 5 %
d'écart (invisible), ±12 % en donnait 12 % (timide), ±20 % en donne 27 %. La course est en
outre resserrée sur les 80 % centraux de la traversée (`useTransform` sur [0.1, 0.9]).
**Plafond :** au-delà de 140 %, la photo 4/5 devient plus haute que large dans son cadre
presque carré et c'est la LARGEUR qui se rogne. Contrepartie assumée : le cadre ne montre
que 71 % de la hauteur de la photo à un instant donné, et les sujets très cadrés — le
chapeau du close-up — se coupent aux extrêmes de la course. Trois sections (`#close-up`, `#spectacles`,
`#ateliers`), grand titre Playfair cuivré, texte, tags, photo. Close-up et Spectacles
portent en plus **4 miniatures paysage** sous « Demander un devis », cliquables (lightbox
partagée). Données dans `const formats`.

> **Recadrer une photo de SECTION : le champ `descente` (−1 à +1) dans `formats`.**
> Ce n'est pas `object-position` — il serait sans effet ici. Avec la réserve de parallaxe,
> la photo 4/5 est plus large que son cadre : c'est la LARGEUR qui se rogne, pas la hauteur.
> Le cadre ne montre que 71 % de la photo et le parallaxe fait glisser cette fenêtre du haut
> vers le bas ; sur un portrait serré, la position basse coupe la tête. `descente` relève le
> bornes de cette course. **Positif** : on relève le plancher, la fenêtre reste dans le haut
> de l'image et le sujet DESCEND dans le cadre. **Négatif** : on abaisse le plafond, la
> fenêtre reste dans le bas et le sujet REMONTE, découvrant le premier plan. **0** : course
> complète. **Le prix est mécanique et identique dans les deux sens : autant de course en
> moins pour le parallaxe.** Réglages actuels : close-up **+0.55** (chapeau au 6e centile,
> yeux au 22e, il fallait les faire descendre), spectacles **0**, ateliers **−0.25** (le
> tiers haut n'est qu'un plafond de salle des fêtes ; on lui préfère les enfants attablés,
> au prix du pantin qui lévite, sorti du cadre).

> **Recadrer une miniature :** chaque entrée a un champ `cadrage`, qui est la valeur CSS
> `object-position` (`"50% 35%"`). Le recadrage se fait au rendu, pas au build — changer
> ces deux nombres suffit, aucune image à retoucher. Le champ vaut aussi pour la galerie
> principale.

**Les trois galeries partagent une seule visionneuse** — `src/components/Visionneuse.tsx`.
Flèches, touches ← → et Échap, glissé au doigt, compteur, légende reprise du `alt`,
précharge des deux voisines, verrouillage du défilement de la page, défilement circulaire.
Chaque appelant garde son propre index : les miniatures d'une section font le tour de leurs
quatre photos, la galerie principale des vingt. Le type `Photo` (`src`, `grand`, `alt`,
`cadrage?`) est le contrat commun.

**5 · Vidéo** — `VideoFeature()`, ancre `#video`. **La carte s'ouvre au défilement** : elle
part **exactement à la largeur du contenu** des autres sections, sur 65 % de haut, coins
arrondis à 30 px, et s'étire jusqu'à occuper tout l'écran.
Cette largeur de départ est **recalculée à chaque redimensionnement** : elle ne correspond à
aucun pourcentage fixe — 93 % de la fenêtre à 1280 px, 80 % à 1600 px — la part des
gouttières diminuant à mesure que l'écran s'élargit. Vérifié : la carte démarre à 155→1430
sur un écran de 1600, soit les bornes exactes du conteneur `max-w-7xl`. La section fait `180svh` et ne contient qu'un bloc **collant** d'une hauteur
d'écran : c'est ce défilement « à vide » qui sert de course à l'animation — sans cette
réserve, la carte n'aurait nulle part où grandir. L'expansion est consommée sur les 55
premiers pour cent, le reste laisse la vidéo pleine. Mesuré à 1280x900 : 785x414 → 1265x900.

> ⚠️ **`overflow-x: clip` sur `html, body`, JAMAIS `hidden`.** `overflow: hidden` fait de la
> page un conteneur de défilement, ce qui **neutralise `position: sticky`** pour tout ce
> qu'elle contient. La règle était bornée à ≤767px : la vidéo ne collait donc pas du tout sur
> téléphone — elle traversait l'écran au lieu de rester en place, son bord haut descendant à
> −357px, et l'agrandissement semblait arriver trop tard. `clip` découpe pareil sans rendre
> quoi que ce soit défilable, et la règle vaut désormais à toutes les largeurs.

> ⚠️ **`h-dvh` sur le bloc collant, pas `h-svh`.** `svh` est la hauteur barre d'URL VISIBLE,
> donc la plus petite : dès qu'elle se rétracte, une boîte en `svh` laisse une centaine de
> pixels de page à découvert et la vidéo n'atteint jamais le plein écran. La SECTION reste
> en `svh`, sinon la longueur de la page sauterait à chaque apparition de la barre.

> ⚠️ **Ne pas poser d'état React depuis l'écouteur de défilement.** La largeur de départ y
> était un `useState` : chaque évènement demandait un rendu, chaque rendu reconstruisait les
> trois interpolations, et la chaîne finissait par ne plus suivre — carte figée à sa taille
> de départ sur grand écran alors que les évènements arrivaient et que la progression se
> calculait juste. Une `useMotionValue` se met à jour sans rendu.

> **La progression est calculée à la main, pas par `useScroll`.** Visant cette section,
> `useScroll` restait bloqué à 0 — style figé sur les valeurs de départ alors que le
> défilement et le collage fonctionnaient. Un écouteur de `scroll` qui pose `-top / course`
> dans un `useMotionValue` tient en trois lignes et se contrôle à la lecture.

> ⚠️ **Le bloc collant est un contexte d'empilement — élever son `z-index` pendant le plein
> écran.** `position: sticky` en crée un d'office, quel que soit son `z-index`. Tout ce
> qu'il contient est donc empilé À L'INTÉRIEUR de lui : la boîte du plein écran avait beau
> être en `position: fixed` avec `z-index: 80`, elle restait prisonnière d'un conteneur à
> `z-index: auto`, et le bloc du hero — en `z-10`, donc au-dessus de `auto` quel que soit
> l'ordre du document — lui passait devant. La vidéo s'ouvrait **sous la page**, croix
> comprise, sans moyen de la refermer.
> Le bloc collant passe donc à `z-index: 90` quand `monte` est vrai (au-dessus du menu, qui
> est à 50), et revient à `auto` au repos — sinon la vidéo agrandie par le défilement
> recouvrirait le menu.
> **Comment le détecter :** vérifier `position`, taille et présence de la croix ne suffit
> pas — tout cela était correct. Il faut interroger `document.elementFromPoint()` au centre
> de l'écran et sur la croix, et contrôler que l'élément au sommet est bien la vidéo.

> **On anime largeur et hauteur, jamais `scale`.** Une transformation étirerait l'image au
> lieu de découvrir du cadre, et poserait un conteneur de référence qui casserait le
> `position: fixed` du plein écran au clic. Hauteur en `%` et non en `svh` : le parent
> collant fait déjà une hauteur d'écran. Le bouton « Voir la vidéo » du hero
> **n'y fait plus défiler** : il ouvre le plein écran et lance la lecture, sur place.
> Le hero et ce bloc vivant dans deux fichiers sans lien de parenté, le bouton annonce son clic
> sur `window` (`vince:ouvrir-video`) et `VideoFeature` l'écoute. `dispatchEvent` étant
> **synchrone**, le gestionnaire s'exécute dans la pile d'appel du clic : le navigateur voit
> encore une action directe du visiteur, ce qui autorise le son. Le lien reste une ancre pour
> garder un comportement utile sans script.
> L'agrandissement en deux temps est réservé au cas où la vidéo est déjà à l'écran ; appelée
> depuis le hero, elle s'ouvre directement en plein écran — sinon l'animation partirait de
> deux mille pixels plus bas. Teaser hébergé sur Cloudflare R2, pleine largeur,
> autoplay muet, lecture/pause pilotées par `IntersectionObserver`. Hauteur plafonnée à
> `min(56.25vw, calc(100svh - 7.5rem))` : sur 4 des 6 résolutions courantes un 16:9 pleine
> largeur ne tient pas sous la barre fixe de 102 px, on accepte ≤ 12 % de rognage pour
> garantir que la vidéo est vue en entier. Bouton blanc + cuivré avec `pulse-copper`.

> **Plein écran de la vidéo.** Le clic sur « Voir la vidéo avec le son » détache la boîte
> du flux (`absolute` → `fixed`), l'étire jusqu'aux bords et **relance la vidéo depuis le
> début** (`currentTime = 0`) : en sourdine elle n'était qu'une boucle d'ambiance, reprendre
> en cours ferait entrer au milieu d'un tour. C'est **le même élément `<video>`** du début à
> la fin — jamais démonté, jamais reparenté — donc aucun rechargement : le fichier est déjà
> là et le redémarrage est instantané. Un second élément monté à l'ouverture retéléchargerait
> le flux et afficherait un cadre noir le temps de se remplir.
> Trois points à ne pas défaire : l'ouverture se fait en **deux temps** (pose instantanée
> sur le cadre, puis étirement à l'image suivante), sans quoi l'animation partirait des
> coordonnées de la section pour arriver dans celles de la fenêtre et traverserait l'écran
> de biais ; les quatre côtés sont **toujours** pilotés par motion, y compris au repos, car
> motion laisse ses valeurs en style inline et une classe `inset-0` se ferait recouvrir ;
> le retour dans le flux est commandé par une **minuterie**, pas par `onAnimationComplete`,
> qui se déclenche aussi sur l'étape instantanée de l'ouverture.
> Le son n'est rétabli que dans le gestionnaire du clic : un navigateur ne l'accorde qu'à
> une action directe du visiteur.

**6 · Avis & FAQ** — `ReviewsAndFaq()`. Trois **vrais** avis Google. Les cinq étoiles et la
signature « Prénom N. · animation, événement » tiennent **sur une même ligne, au-dessus de
la citation** : elles disent la même chose, les séparer par le texte obligeait à faire deux
fois le trajet. `quote` est un tableau de paragraphes. À côté, la FAQ, qui sert aussi à
équilibrer la hauteur des deux colonnes.

> **Règle des trois lignes :** au-delà de trois lignes, un avis est tronqué et un bouton
> « Lire plus » apparaît (composant `Citation`). Le plafond est posé en unités `lh` — donc
> en vraies lignes, quelle que soit la largeur de colonne ou la taille de police — et on y
> ajoute l'espace inter-paragraphes, sans quoi la troisième ligne était tranchée en deux.
> Le plafond s'applique **par défaut** : c'est de l'état tronqué que la mesure du
> débordement doit partir, sinon aucun débordement n'est jamais détecté.

**7 · Galerie** — `EditorialGallery()`, `#galerie`, sur-titre « — En images ». 24 tuiles — 23 photos
et **une boucle vidéo verticale** (`TuileVideo`) en deuxième rangée, muette, en lecture
seulement quand elle est à l'écran, `preload="none"`. Elle s'ouvre en lecteur sonore dans la
visionneuse, qui accepte un champ `video` optionnel.

> **Le clip est servi réencodé** : le clip vertical 720×1280, **450 Ko**
> au lieu des 4,6 Mo de l'original (`VID_20241212002045.mp4`, resté sur le bucket), soit
> 12,7 Mbit/s de capture téléphone brute. À 608×1080 la même qualité pesait 516 Ko : c'est
> la flamme qui coûte cher, pas la définition.

> **Clé de grille par INDEX, pas par `src`.** La tuile animée réutilise comme affiche une
> photo déjà présente : deux entrées partageaient la même clé et React rendait une tuile de
> trop, la vidéo apparaissant en double. 20 carrés, 8 affichés dès le départ
> (deux rangées), CTA « Voir plus de photos » **sous** la deuxième rangée. L'ordre du tableau
> `gallery` est délibéré : les photos les plus parlantes occupent les deux premières rangées,
> les plus fragiles referment la série.

**8 · Contact** — `ContactSection()`, `#contact`, sur-titre « — Rencontrons-nous ». Le menu
déroulant « Format souhaité » reprend les trois formules dans l'ordre du site, plus
« Je ne sais pas encore » — le cas le plus fréquent d'une première prise de contact.

**9 · Pied de page** — `SiteFooter()`. Bloc CTA, colonne **01 Navigation** (Close-up,
Spectacles, Ateliers & initiation, Galerie — Accueil, Mes formules et Contact en sont
volontairement absents, déjà couverts par « Retour en haut » et par la colonne 02),
rôle « Magicien en Picardie, France »,
`06 70 01 82 41` / `contact@magicvince.com`, bandeau de villes défilant
(Amiens, Beauvais, Compiègne, Saint-Quentin, Laon, Soissons, Senlis, Chantilly,
Abbeville, Creil, Lille, Paris, Toute la France), mentions légales.
Deux réseaux dans `.footer-socials` : **Facebook** et **YouTube** (ce dernier remplace
l'Instagram du site d'origine).

---

## 5. Thème et wording

### 5.1 La voix

**Les textes de l'artiste sont à la première personne** — repris et polis à partir de ses
propres écrits sur son site précédent. « je vous propose », « mes secrets », « laissez-moi
vous transporter ». C'est lui qui parle.

**Les textes de service sont à la troisième personne** : mentions légales, RGPD,
introduction du pied de page (« Vince anime vos événements… »).

Registre : sobre, sensoriel, jamais bonimenteur. On décrit ce que le public **ressent**,
pas ce que le magicien réussit.

### 5.2 Formules consacrées

Ces tournures viennent de l'artiste, les réutiliser plutôt qu'en inventer :

> « toucher des yeux l'impossible » · « de table en table, au plus proche de vos convives,
> le lien se tisse » · « ouvrez bien les yeux » · « il n'y a pas d'âge pour rêver » ·
> « entre la scène et le close-up » · « un monde d'illusion » · « devenez magicien » ·
> « quelques-uns de mes secrets »

### 5.3 Conventions d'écriture

- Sur-titres de section : tiret cadratin + minuscule capitalisée — `— Mes prestations`,
  `— En images`, `— Rencontrons-nous`. Exception : `.footer-eyebrow` dessine son filet en
  `::before`, donc son texte s'écrit **sans** tiret.
- Apostrophes **typographiques** (`’`) dans les textes de contenu.
- Les trois formats s'appellent **Close-up**, **Spectacles**, **Ateliers & initiations**.
  « Ateliers & Initiations » en toutes lettres ne tient pas dans la nav à 768 px — le titre
  a été raccourci pour cette raison, ne pas le rallonger.
- « ÉCOLES » est saisi **en capitales** dans les tags : la mise en majuscules par CSS fait
  sauter l'accent du É selon le navigateur.
- Identité : **Magic Vince** est le nom de scène, **Vince** l'artiste. Les deux se
  confondant, le lockup tient sur une seule ligne. Zone : **Picardie** (Somme, Oise, Aisne).
- Contact, partout : `06 70 01 82 41` · `contact@magicvince.com`.

---

## 6. Images

`src/assets/photos/` contient les dérivés servis (≈ 15 Mo) :

| Suffixe                  | Dimensions            | Usage                                                                                    |
| ------------------------ | --------------------- | ---------------------------------------------------------------------------------------- |
| `-4x5`                   | 1600 × 2000           | Cartes de formules, illustrations de récits                                              |
| `-1x1`                   | 576 × 576             | Galerie                                                                                  |
| `-vignette`              | 520–576 px petit côté | Miniatures de section et photos récentes de la galerie (non rognées, recadrées au rendu) |
| `-large`                 | 1400 px grand côté    | Lightbox                                                                                 |
| `flamme-mur-pierre-16x9` | 1920 × 1080           | Poster vidéo                                                                             |

Vignettes des cartes fournies par le client : `src/assets/Vignette-close-up.jpg`,
`Vignette-Scene.jpg`, `Vignette-Ateliers.jpg` (1600 × 2000).

> **`src/assets/album/` est hors dépôt, définitivement** (`.gitignore`). C'est l'ATELIER :
> on y dépose les fichiers bruts sortis de l'appareil ou du téléphone, et on en fabrique les
> dérivés de `src/assets/photos/`, seuls importés par le site. Le commiter l'inscrirait à
> jamais dans l'historique git, y compris après retrait. **Corollaire : ces originaux
> n'existent que sur la machine de Johan** — les sauvegarder ailleurs ne regarde pas git.
> `package-lock.json` est ignoré pour la même raison de principe : `bun.lock` fait foi.

> **Outillage :** `sips` et **`ffmpeg`** sont disponibles sur cette machine — pas d'encodeur WebP/AVIF,
> pas d'ImageMagick, pas de sharp. `sips --cropOffset` est **silencieusement inopérant** ;
> pour un recadrage type `cover`, rééchantillonner puis `-c HAUTEUR LARGEUR` (hauteur d'abord).

> **Piège Lovable :** les fichiers `*.asset.json` sont des **pointeurs** que seul le bac à
> sable Lovable sait résoudre. Ils donnent un 404 en local. Copier le vrai fichier dans
> `src/assets/` et l'importer normalement.

---

## 7. Toujours en attente

**Bloquant avant mise en ligne**

1. **Mentions légales incomplètes** — adresse postale et **SIRET** marqués « à compléter »
   (trois occurrences dans `mentions-legales.tsx`). Obligatoires pour une activité
   professionnelle.
2. **`og:image` / `twitter:image`** pointent encore sur une capture de prévisualisation
   Lovable — `__root.tsx:91-92`. C'est l'image qui s'affiche quand on partage le lien.
3. **`scene-vide-jeux-lumiere`** — le kakémono à droite du cadre porte le nom, l'email et
   deux numéros de téléphone d'une autre structure. La vignette le coupe (`cadrage`
   `40% 50%`), mais la visionneuse montre l'image entière.

**À valider par Vince**

4. Les deux réponses de FAQ rédigées par défaut (matériel/scène, âge du public).
5. « À vos baguettes ! » (cours particuliers) n'a aucune section sur le site — à créer ou
   à abandonner.
6. **Le teaser est sombre, et c'est le film qui l'est** — vérifié image par image, ce n'est
   pas un défaut d'affichage. Tourné dans un bar en lumière basse : à 20 s la scène reste
   lisible, vers 40 s elle est presque noire. L'affiche du bloc
   (`flamme-mur-pierre-16x9.jpg`) est beaucoup plus claire, d'où un contraste net au
   démarrage. Un étalonnage plus clair servirait le site.
7. **`joker-decor-graffe`** — la source ne fait que 641 × 428 px. La vignette tient, mais
   l'agrandissement plein écran est un rééchantillonnage ×2,2 et se voit.
8. La reprise de lecture de la vidéo au retour dans le champ est codée mais n'a pas pu être
   vérifiée automatiquement.

**Dette technique**

9. **Code mort** : `GallerySection.tsx` (importé dans les deux routes, jamais rendu, et
   porte un `id="galerie"` en doublon), plus `FormatSections()`, `About()`, `Testimonials()`
   et `CTA()` dans `index.tsx` — quatre fonctions que rien n'appelle.
10. Les faux témoignages de démonstration subsistent dans `const testimonials`
    (`index.tsx`) — non rendus, mais à supprimer.
11. Erreur `tsc` préexistante dans `__root.tsx:131` (typage de `errorComponent`), et
    **11 fichiers** hors format Prettier — antérieurs à ces travaux.
12. Le fichier de logo hérité du précédent artiste a été supprimé : aucun fichier ne
    l'importait, le lockup étant reconstitué en texte.
13. L'original du clip vertical (4,6 Mo) reste sur le bucket R2 alors que plus rien ne le
    référence — il est gardé comme source.

**Réglé depuis la première version de ce document** : `src/assets/album/` et
`package-lock.json` sont exclus du dépôt par décision explicite ; le clip vertical est
servi réencodé à 450 Ko.

⚠️ **Ce document décrit le site d'origine dont celui-ci est la copie.** L'identité y a été
remplacée par celle de Magic Vince, mais tout ce qui touche au contenu — photos, vidéos,
avis, textes de présentation — reste à relire : voir `README.md`.
