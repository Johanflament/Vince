/**
 * Les vidéos du site, hébergées sur un bucket R2 public et référencées en URL
 * absolue — elles ne passent pas par Vite, donc pas par `src/assets/`.
 *
 * TROIS FILMS, TROIS USAGES DISTINCTS — ne pas les confondre :
 *
 *   `VIDEO_AMBIANCE`          l'ambiance. Muette, en boucle, jamais regardée
 *                             pour elle-même : c'est le fond du hero de
 *                             la page d'accueil, et RIEN D'AUTRE depuis
 *                             que la bande animée du milieu de page a été
 *                             supprimée.
 *   `VIDEO_CLOSE_UP`          la bande-annonce du close-up.
 *   `VIDEO_SPECTACLE_SCENE`    celle du spectacle de scène.
 *
 * ⚠️ Le fichier sur R2 s'appelle encore « Bande-annonce-Spectacle-Enfants » :
 * la constante a été renommée quand la section a cessé de s'adresser au seul
 * jeune public, pas le fichier. Ne pas « corriger » l'URL pour la faire
 * coïncider avec le nom de la constante — elle deviendrait fausse.
 *
 * Les deux bandes-annonces sont des FILMS QU'ON REGARDE : avec le son, avec des
 * contrôles, en plein écran, depuis le bouton de lecture posé sur la photo de
 * leur section. Elles ne doivent jamais servir de fond, et l'ambiance ne doit
 * jamais s'ouvrir en plein écran — c'est précisément la confusion qui avait fait
 * rejeter deux versions du bloc vidéo.
 *
 * Le fichier centralise ces URL pour la même raison qu'avant : elles étaient
 * déclarées deux fois, dans deux composants, avec deux valeurs différentes, dont
 * l'une pointait encore sur le teaser du précédent artiste.
 *
 * ── ÉTAT DES FICHIERS, mesuré et non supposé ────────────────────────────────
 *
 * Les deux bandes-annonces sont saines : 29,4 Mo et 13,0 Mo, servies en
 * `video/mp4` (l'extension `.m4v` de la seconde n'a donc aucune conséquence,
 * c'est le type déclaré par le serveur qui compte, pas le suffixe), et leur atome
 * `moov` est placé AVANT les données — le « faststart », ce qui permet à la
 * lecture de commencer sans attendre la fin du téléchargement.
 *
 * ⚠️ `VIDEO_AMBIANCE` N'EST PAS EN FASTSTART, et c'est le seul vrai défaut du
 * lot. Mesuré sur les trois fichiers qui se sont succédé à ce poste, celui-ci
 * compris : l'ordre des atomes est `ftyp / wide / mdat / … / moov`, donc la
 * table de lecture est à la FIN des 43 Mo. Les navigateurs s'en sortent — R2 répond aux
 * requêtes par plage (`Accept-Ranges: bytes`), donc Chrome et Safari vont
 * chercher la queue du fichier dans une seconde requête — mais cela coûte un
 * aller-retour de plus avant la première image, sur le tout premier élément que
 * le visiteur voit.
 *
 * Et 43 Mo pour 29,9 secondes font 12,1 Mbit/s. Trois fichiers différents ont
 * occupé ce poste, de 64 à 51 puis 43 Mo : à chaque fois le fichier a maigri
 * UNIQUEMENT parce qu'il était plus court, et à chaque fois le débit est
 * ressorti à 12,1 Mbit/s au dixième près. C'est une dizaine de fois ce qu'un
 * fond muet demande — c'est le débit qu'il faut reprendre, pas la durée.
 *
 * À réencoder avant mise en ligne. La commande coupe le son — un fond muet n'a
 * aucun usage d'une piste audio qu'il télécharge quand même — et remet l'index
 * en tête :
 *
 *   ffmpeg -i Home-Video-Vince-Magicien.mp4 -an -t 20 -vf "scale=1920:-2" \
 *          -c:v libx264 -crf 26 -preset slow -movflags +faststart hero-boucle.mp4
 *
 * `-movflags +faststart` n'est pas optionnel : c'est lui qui déplace `moov` en
 * tête. Le conserver aussi si l'une des bandes-annonces est un jour réencodée.
 */

const R2 = "https://pub-b32556fd6757440f8b8a2c26fe5dfba9.r2.dev";

export const VIDEO_AMBIANCE = `${R2}/Home-Video-Vince-Magicien.mp4`;

export const VIDEO_CLOSE_UP = `${R2}/Bande-annonce-close-up-Vince.mp4`;

/* L'espace du nom de fichier est encodé `%20` — il DOIT le rester. Écrit tel
   quel, l'URL est coupée à l'espace et la requête part sur un chemin tronqué. */
export const VIDEO_SPECTACLE_SCENE = `${R2}/Bande-annonce-Spectacle-Enfants%20-%20Vince.m4v`;
