/**
 * Les routes qui portent le hero et les sections à ancres de la page d'accueil.
 *
 * Il y en a plusieurs le temps d'arbitrer entre les fonds de hero (photo,
 * vidéo cadrée, vidéo plein cadre), et CETTE LISTE EST LE SEUL ENDROIT qui le
 * sache. La barre de navigation et le pied de page s'en servent pour deux
 * décisions qui doivent rester solidaires :
 *
 *  - les ancres. Sur une page d'accueil, `#contact` est une ancre locale ; sur
 *    les mentions légales, elle doit repasser par « / ». Une variante absente
 *    de cette liste renvoie donc son visiteur vers l'accueil au premier clic
 *    dans le menu, en perdant la variante qu'il était en train de regarder ;
 *  - l'habillage de la barre. Une page d'accueil a un hero plein écran, donc
 *    une barre transparente tant qu'on n'a pas défilé. Une variante oubliée
 *    ici reçoit le fond sombre des pages intérieures, dès le haut de page —
 *    c'est exactement ce qui est arrivé à `/home-v2`, dont la vidéo était
 *    masquée par une barre pleine.
 *
 * Quand une variante est retenue et les autres supprimées, cette liste
 * redevient un simple « / ».
 */
export const ROUTES_ACCUEIL = ["/", "/home-v2", "/home-v3"] as const;

export function estAccueil(pathname: string) {
  return (ROUTES_ACCUEIL as readonly string[]).includes(pathname);
}
