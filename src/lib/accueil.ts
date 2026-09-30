/**
 * La route qui porte le hero et les sections à ancres de la page d'accueil.
 *
 * ⚠️ IL N'Y EN A PLUS QU'UNE, et cette fonction paraît donc superflue. Elle ne
 * l'est pas : la barre de navigation et le pied de page s'en servent pour deux
 * décisions qui doivent rester solidaires, et c'est de les avoir vues diverger
 * qu'est né ce fichier.
 *
 *  - LES ANCRES. Sur la page d'accueil, `#contact` est une ancre locale ; sur
 *    les mentions légales, elle doit repasser par « / ». Une page oubliée ici
 *    renvoie donc son visiteur vers l'accueil au premier clic dans le menu.
 *  - L'HABILLAGE DE LA BARRE. Une page d'accueil a un hero plein écran, donc
 *    une barre sans fond tant qu'on n'a pas défilé. Une page oubliée ici reçoit
 *    le fond sombre des pages intérieures dès le haut — c'est exactement ce qui
 *    était arrivé à l'une des variantes, dont la vidéo était masquée par une
 *    barre pleine.
 *
 * Le site a longtemps porté trois pages d'accueil concurrentes — `/`,
 * `/home-v2` et `/home-v3` — le temps d'arbitrer entre les fonds de hero.
 * L'arbitrage est fait : c'est la vidéo plein cadre sous une barre transparente
 * qui l'emporte, elle est passée sur « / », et les deux autres routes ont été
 * supprimées.
 */
export const ROUTES_ACCUEIL = ["/"] as const;

export function estAccueil(pathname: string) {
  return (ROUTES_ACCUEIL as readonly string[]).includes(pathname);
}
