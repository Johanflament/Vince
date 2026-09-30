# Magic Vince — site vitrine

Site d'un seul tenant (one-page), rendu côté serveur, déployé en Worker
Cloudflare. **TanStack Start + React 19 + Vite + Tailwind v4 + Motion**, sous
`bun`.

## Lancer le site

```sh
cd ~/Github/Vince && bun run dev
```

Le port est **fixé à 8083** et `strictPort` est actif : si 8083 est occupé, le
démarrage échoue au lieu de glisser sur un autre port. C'est voulu — plusieurs
sites tournent en parallèle sur cette machine (8080, 8081, 8082) et une adresse
qui change d'un lancement à l'autre finit par ouvrir le site d'un autre artiste.

Sur téléphone, même réseau Wi-Fi : `http://192.168.1.154:8083`.

```sh
bun run build      # build de production (Nitro → Cloudflare Worker dans .output/)
bun run format     # Prettier --write
bun run lint       # ESLint + Prettier
npx tsc --noEmit   # vérification de types
```

## D'où vient ce code

Le dépôt est né de la copie du site d'un autre magicien, lui-même converti du
site d'un troisième. Le code est arrivé entier — **avec l'identité du précédent
artiste dedans**. Elle en a été entièrement retirée depuis.

Cette chaîne de copies a déjà coûté cher une fois : le nom du Worker Cloudflare
(`wrangler.jsonc`) avait voyagé d'un dépôt à l'autre sans être changé, et un
déploiement aurait publié un site par-dessus l'autre, à la même adresse et sans
avertissement. Il est ici réglé sur `vince` — vérifié.

## Identité du site

Le nom de scène est **Magic Vince**, l'artiste **Vince**, la zone
d'intervention la **Picardie**. Le nom et les coordonnées du précédent artiste
ont été retirés de tout le dépôt : textes, balises SEO, mentions légales, textes
alternatifs, noms de fichiers, avis, image de partage, et jusqu'au message du
premier commit.

Coordonnées en place : `contact@magicvince.com`, `06 70 01 82 41`.
Réseaux : [Facebook](https://www.facebook.com/magicvince.magicvince) et
[YouTube](https://www.youtube.com/@vincentzaragoza2415) — YouTube remplace
l'Instagram hérité de la copie.

## Ce qui reste à faire avant la mise en ligne

Rien de ce qui suit ne casse le site : il tourne parfaitement en l'état. C'est
bien le danger — seule une relecture le fait apparaître.

**Les photos.** ✅ Remplacées par celles de Vince. 22 clichés, chacun décliné en `-vignette`
(petit côté 560px) et `-large` (grand côté 1400px) dans `src/assets/photos/` ; les originaux
pleine définition sont dans `src/assets/photos-sources/`. Aucun fichier n'est recadré, le
cadrage se fait en CSS via le champ `cadrage` de chaque entrée. Sept sources sont en dessous de
1400px : leur `-large` reste à leur taille native et sera un peu mou en visionneuse. Les réglages
de cadrage ont été remis au neutre — à réétalonner à l'œil.

**Les vidéos.** Trois désormais, toutes de Vince, déclarées dans `src/lib/medias.ts` :
`VIDEO_AMBIANCE` (fond des variantes `/home-v2` et `/home-v3`, et bande animée du milieu de page),
plus les deux bandes-annonces `VIDEO_CLOSE_UP` et `VIDEO_SPECTACLE_ENFANTS`, ouvertes en plein écran
par le CTA « Voir la vidéo » de leur section.

⚠️ **L'ambiance est à réencoder avant mise en ligne** — c'est la seule des trois qui pose problème.
64 Mo pour 44 s, soit 12 Mbit/s, dix fois le débit raisonnable pour un fond muet qui télécharge en
prime une piste audio dont il ne fait rien ; et son atome `moov` est placé **après** les données,
donc le navigateur doit aller le chercher dans une seconde requête avant la première image. La
commande `ffmpeg` (`-an`, `-crf 26`, `-movflags +faststart`) est en commentaire dans
`src/lib/medias.ts`. Les deux bandes-annonces sont saines : 29 et 13 Mo, déjà en faststart.

Trancher aussi entre les trois versions du hero, puis supprimer les variantes non retenues et
réduire `ROUTES_ACCUEIL` (`src/lib/accueil.ts`) à la seule route `/`.

**⚠️ Trois boutons « Voir la vidéo » pour trois destinations.** Celui du hero descend à la bande
d'ambiance, qui n'est pas un film qu'on regarde ; ceux des deux sections ouvrent chacun une vraie
bande-annonce en plein écran. Trois commandes au libellé identique et au comportement différent :
soit renommer celui du hero, soit lui faire ouvrir l'une des deux bandes-annonces.

**La biographie.** ✅ Texte de Vince en place : récit, distinctions et deux citations.

**⚠️ TOURS OU PICARDIE — À TRANCHER.** La biographie fournie situe Vince à Tours (installation
en 2003) et au Groupement régional des Magiciens de Touraine. Tout le reste du site le situe en
**Picardie** : balise titre, description SEO, mentions légales, pied de page, bandeau de villes,
réponse de FAQ sur les déplacements. Les deux ne peuvent pas être vrais en même temps pour un
visiteur qui lit la page de haut en bas. Décider lequel corriger — la zone d'activité ou le texte
de biographie — avant toute mise en ligne.

**Les avis.** ✅ Le bloc `reviews` est désormais **vide**, et le bloc « Avis
Google » ne s'affiche donc plus du tout. Il contenait les avis réels d'un autre
artiste, dont seul le prénom du magicien avait été changé — les publier aurait
attribué à Vince des prestations qu'il n'a pas faites. Reste à y mettre ses
vrais avis, recopiés depuis sa fiche Google : le bloc réapparaîtra tout seul.

**Les mentions légales.** Adresse et numéro SIRET sont marqués « à compléter »,
et tous deux sont obligatoires pour une activité professionnelle.

**L'adresse du site.** `SITE_URL` en tête de `src/routes/__root.tsx` est le seul
endroit où vit l'adresse publique. Elle porte aujourd'hui une supposition
(`vince.johanflament69.workers.dev`), pas une URL vérifiée — à corriger au
premier déploiement, sinon la vignette de partage ira chercher son image sur un
site qui n'existe pas.

**Le formulaire de contact** n'envoie rien : il affiche « Message envoyé ! » sans
qu'aucun message ne parte. Voir `CLAUDE.md`.

## Les deux documents

[`CLAUDE.md`](CLAUDE.md) décrit l'architecture, les commandes et les pièges du
dépôt. [`HANDOFF.md`](HANDOFF.md) est le handoff détaillé du design system et
des blocs, hérité du site d'origine : exact sur la forme, à relire sur le fond.
