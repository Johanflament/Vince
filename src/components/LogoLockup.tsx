import { useReducedMotion } from "motion/react";

import logoAnime from "@/assets/Vince_Animated-Logo-White_loop_200x200_transparent.gif";

/**
 * LE BLOC-LOGO : l'emblème, un filet, puis « Vince le Magicien » et la
 * signature « Vincent Zaragoza ».
 *
 * ── CE QUI LE TIENT, ET POURQUOI CHAQUE CHOIX ───────────────────────────────
 *
 * L'EMBLÈME EST À GAUCHE. Il suivait le nom, ce qui le faisait lire comme un
 * ornement ajouté après coup. Un bloc-logo se lit marque puis nom, dans cet
 * ordre : l'emblème ouvre, le lettrage suit.
 *
 * LE FILET VERTICAL entre les deux n'est pas un ornement de plus : c'est
 * exactement le séparateur qui distingue déjà les cinq formats du hero
 * (`w-px self-stretch`), repris ici en doré. C'est lui qui fait de deux
 * éléments posés côte à côte un ensemble tenu.
 *
 * DEUX REGISTRES DANS LE NOM. « Vince » en romain doré, « le Magicien » en
 * italique et en retrait : le nom porte, le métier accompagne. Au même niveau,
 * l'ensemble faisait enseigne ; séparés, ils font signature. L'italique de
 * Playfair est déjà la respiration du titre du hero, où « l'humour / ma
 * signature » s'y met — le bloc parle donc la même langue que la page.
 *
 * LA SIGNATURE reprend `type-eyebrow`, la fonte et l'espacement des sur-titres
 * de sections. Ce n'est donc pas une ligne de plus mais le même objet
 * typographique qu'on retrouve partout ailleurs.
 *
 * ⚠️ ELLE N'EST PAS DÉCORATIVE. « Vincent Zaragoza » est la seule occurrence du
 * nom civil de l'artiste sur le site, et c'est ce qui relie la marque à la
 * personne pour un moteur de recherche comme pour un client qui reçoit un
 * devis. Ne pas la passer en `aria-hidden`.
 *
 * ── LES CONTRAINTES DE LARGEUR, MESURÉES ────────────────────────────────────
 *
 * ⚠️ LE CORPS EST PLUS PETIT QU'AVANT, ET CE N'EST PAS UN CHOIX ESTHÉTIQUE.
 * « Vince le Magicien » est 51 % plus large que « MagicVince » à corps égal —
 * mesuré sur les chasses réelles de Playfair Display, pas estimé. À 1.85rem le
 * bloc passait de 205 à 282px, or la barre de navigation déborde dès 1024px :
 * son code note qu'elle n'y tenait déjà qu'à quatre pixels près, six entrées de
 * menu et un bouton d'appel à l'action se partageant 976px. Ne pas remonter ces
 * corps sans refaire l'addition de la barre.
 *
 * ⚠️ L'EMBLÈME EST CALÉ SUR LA HAUTEUR DU BLOC DE TEXTE, pas sur le corps du
 * nom. Il suivait le corps, dans un rapport d'environ 1,55 — ce qui valait
 * quand le bloc n'avait qu'une ligne. Depuis que la signature s'ajoute en
 * dessous, ce rapport le laissait plus court que le texte qu'il accompagne, et
 * il paraissait tombé au milieu. Hauteurs additionnées ligne à ligne (nom en
 * `leading-none`, 4px de `mt-1`, signature à 1,2 d'interligne) : 32,0px en
 * compact, 35,4 au-delà de 768px, 38,7 au-delà de 1460. Les valeurs retenues
 * les rattrapent à moins de 1,5px près.
 *
 * ── L'EMBLÈME ANIMÉ ─────────────────────────────────────────────────────────
 *
 * ⚠️ IL NE DOIT NI SE COUPER NI REPARTIR AU DÉFILEMENT, et cela ne se joue pas
 * ici mais dans `SiteNav` : une animation GIF redémarre quand le navigateur
 * doit refabriquer la couche de composition qui la porte. Le fond de la barre
 * vit donc dans un calque séparé dont seule l'opacité varie, et l'emblème n'est
 * pas dedans. Ne pas remettre de `backdrop-blur` sur le `<header>`.
 *
 * Un GIF ne se met pas en pause : il n'existe aucun moyen, en CSS ou en JS,
 * d'arrêter une boucle en cours. Pour qui a demandé moins d'animations,
 * l'emblème n'est donc pas rendu DU TOUT — c'est la seule réponse honnête. Le
 * filet part avec lui, sinon le bloc s'ouvrirait sur un trait sans rien devant.
 *
 * `width`/`height` sont ceux du fichier : sans eux, la barre sursaute au
 * chargement de l'image.
 *
 * Utilisé aux trois emplacements de la barre de navigation — bureau, barre
 * mobile, tiroir — et nulle part ailleurs : le pied de page a son propre
 * traitement de l'emblème, volontairement différent.
 */
export function LogoLockup({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="inline-flex items-center gap-2.5">
      {!reduceMotion && (
        <>
          <img
            src={logoAnime}
            alt=""
            aria-hidden="true"
            width={200}
            height={200}
            className={`shrink-0 ${
              compact
                ? "h-8 w-8"
                : "h-[2.3rem] w-[2.3rem] min-[1460px]:h-[2.45rem] min-[1460px]:w-[2.45rem]"
            }`}
          />
          {/* Le filet ne fait pas toute la hauteur du bloc : un peu plus court,
              il respire au lieu de trancher. */}
          <span
            aria-hidden="true"
            className={`w-px shrink-0 bg-[var(--gold)]/40 ${compact ? "h-7" : "h-8 min-[1460px]:h-9"}`}
          />
        </>
      )}

      <span className="flex flex-col leading-none">
        <span
          className={`font-display tracking-[-0.01em] ${
            compact ? "text-[1.15rem]" : "text-[1.3rem] min-[1460px]:text-[1.45rem]"
          }`}
        >
          <span className="text-[var(--gold)]">Vince</span>{" "}
          <span className="font-normal italic text-foreground/85">le Magicien</span>
        </span>

        {/* `truncate` n'est pas une précaution inutile : sur la barre mobile, le
            bloc est centré entre deux boutons de 44px et dispose donc de la
            largeur de l'écran moins 88px. À 320px, il ne reste que 232px pour
            un bloc qui en mesure environ 190 — ça passe, mais sans marge. Si le
            nom s'allonge un jour, il sera coupé proprement plutôt que de
            pousser les boutons hors du cadre. */}
        <span
          className={`type-eyebrow font-title mt-1 truncate text-muted-foreground ${
            compact ? "text-[0.5rem]" : "text-[0.55rem] min-[1460px]:text-[0.6rem]"
          }`}
        >
          Vincent Zaragoza
        </span>
      </span>
    </span>
  );
}
