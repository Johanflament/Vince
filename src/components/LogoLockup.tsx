import { useReducedMotion } from "motion/react";

import logoAnime from "@/assets/Vince_Animated-Logo-White_loop_200x200_transparent.gif";

/**
 * Le bloc-logo : « Magic Vince » suivi de l'emblème animé.
 *
 * LE LETTRAGE. Il était en capitales espacées (« MAGIC VINCE »), ce qui le
 * faisait lire comme un titre de section de plus. Il revient à la casse mixte
 * de la maquette, en deux couleurs : « Magic » en blanc, « Vince » en or. C'est
 * le nom qui porte l'accent, pas la marque entière — et sur une barre où l'or
 * ne sert qu'aux actions, ce mot-là est la seule exception assumée.
 * L'interlettrage passe de +0.14em à −0.01em : une didone en casse mixte se
 * serre, elle ne s'espace pas.
 *
 * Reconstitué en texte plutôt qu'en image : il reste net à toute densité
 * d'écran, se redimensionne sans second fichier, et le nom de l'artiste est lu
 * par les moteurs de recherche au lieu d'être noyé dans un pixel.
 *
 * L'EMBLÈME est un GIF animé en boucle, tracé blanc sur fond transparent, le
 * même qu'au pied de page.
 *
 * ⚠️ IL NE DOIT NI SE COUPER NI REPARTIR AU DÉFILEMENT, et cela ne se joue pas
 * ici mais dans `SiteNav` : une animation GIF redémarre quand le navigateur
 * doit refabriquer la couche de composition qui la porte. C'est exactement ce
 * que produisait la barre, qui ajoutait et retirait son `backdrop-blur` selon
 * qu'on avait défilé ou non, et qui animait la bascule en `transition-all` —
 * donc le filtre avec. Le flou y est désormais permanent et seules les
 * couleurs transitionnent. Ne pas remettre le flou sous condition.
 *
 * Deux conséquences dont il faut avoir conscience :
 *
 *  1. Un GIF ne se met pas en pause. Il n'existe aucun moyen, en CSS ou en JS,
 *     d'arrêter une boucle en cours. Pour qui a demandé moins d'animations,
 *     l'emblème n'est donc pas rendu DU TOUT — c'est la seule réponse honnête.
 *     Le lettrage suffit à identifier la marque sans lui.
 *  2. Il est décoratif : `alt=""` et `aria-hidden`. Le nom est déjà écrit à
 *     côté en texte ; annoncer « logo Magic Vince » juste après « Magic Vince »
 *     ferait répéter la marque deux fois à un lecteur d'écran.
 *
 * `width`/`height` sont ceux du fichier : sans eux, la barre sursaute au
 * chargement de l'image.
 *
 * Partagé entre la barre de navigation et le pied de page, pour que le nom de
 * scène s'écrive partout de la même façon.
 */
export function LogoLockup({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="inline-flex items-center gap-2 leading-none">
      <span
        className={`font-display tracking-[-0.01em] ${
          compact ? "text-[1.45rem]" : "text-[1.85rem]"
        }`}
      >
        <span className="text-foreground">Magic</span>
        <span className="text-[var(--gold)]">Vince</span>
      </span>

      {!reduceMotion && (
        <img
          src={logoAnime}
          alt=""
          aria-hidden="true"
          width={200}
          height={200}
          /* +15 % sur les deux tailles : 32→36.8px en compact, 40→46px sinon.
             Écrit en rem exacts plutôt qu'en pas de l'échelle Tailwind, qui
             n'a rien entre 36 et 40px et aurait donc arrondi l'un des deux
             du mauvais côté. */
          className={`shrink-0 ${compact ? "h-[2.3rem] w-[2.3rem]" : "h-[2.875rem] w-[2.875rem]"}`}
        />
      )}
    </span>
  );
}
