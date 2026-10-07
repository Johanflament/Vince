/**
 * LES QUESTIONS FRÉQUENTES — SOURCE UNIQUE.
 *
 * ⚠️ POURQUOI CE FICHIER EXISTE. Ces textes sont lus à DEUX endroits : la
 * section « Questions fréquentes » de la page, et le `FAQPage` des données
 * structurées (`donnees-structurees.ts`). Google exige que le texte déclaré
 * soit IDENTIQUE au texte affiché — une réponse retouchée d'un côté et pas de
 * l'autre fait mentir la déclaration, et rien dans la compilation, le lint ou
 * le rendu ne le signalerait.
 *
 * Ils ont vécu un temps en double, recopiés à la main dans les deux fichiers.
 * Ne pas y revenir : si un composant a besoin d'une variante, qu'il la dérive
 * de cette liste, il ne la recopie pas.
 *
 * `structuree` DÉCIDE CE QUI PART DANS LE JSON-LD, et la page les affiche
 * toutes. Deux raisons, distinctes, de mettre `false` :
 *
 *  - la réponse n'est pas validée. Les deux dernières portaient la mention
 *    « À VALIDER PAR VINCE » : un contenu non confirmé peut s'afficher sur une
 *    page, il n'a rien à faire dans une déclaration lue par un moteur ;
 *  - la réponse dit quelque chose que le site n'a pas tranché. C'était le cas
 *    de celle sur les déplacements, qui énumère Amiens, la Picardie, la Somme,
 *    l'Oise et l'Aisne pendant que la biographie situait Vince à TOURS : la
 *    déclarer aurait été choisir un camp au nom de Vince. Il a tranché pour la
 *    Picardie en réécrivant sa biographie, et elle est donc passée à `true`.
 *    Ce motif-ci ne s'applique plus à aucune réponse ; il est gardé parce que
 *    c'est un motif récurrent sur ce site, pas un incident clos.
 *
 * Repasser l'une d'elles à `true` la fait entrer dans le JSON-LD sans rien
 * d'autre à modifier.
 */
export type QuestionFrequente = {
  question: string;
  reponse: string;
  /** Reprise dans le `FAQPage` des données structurées. */
  structuree: boolean;
};

export const faqs: QuestionFrequente[] = [
  {
    question: "Quelle est la durée d’une prestation ?",
    // ⚠️ CETTE RÉPONSE NE DONNE PLUS DE CHIFFRE, et c'est le texte de Vince.
    // Elle disait « se compte en heures » et « de 30 minutes à 1 h 15 » ; les
    // deux fiches pratiques des sections portent donc seules l'information
    // chiffrée — « De 30 minutes à 1 h 15 (personnalisable) » côté scène, « Le
    // temps de votre cocktail et/ou de votre dîner » côté close-up. Elles ne
    // sont plus la reprise d'une réponse de FAQ, elles sont la source.
    //
    // Conséquence à connaître : la question porte sur la durée et la réponse
    // déclarée dans le `FAQPage` n'en donne aucune. Google l'affichera telle
    // quelle en résultat enrichi.
    reponse:
      "Elle s’adapte à votre événement, le close-up accompagne votre soirée ou dîner tout au long de la soirée. Le spectacle est en fonction de votre demande et du format choisi.",
    structuree: true,
  },
  {
    question: "Vous déplacez-vous partout en France ?",
    reponse:
      "Oui. J’interviens à Amiens et dans toute la Picardie — Beauvais, Compiègne, Saint-Quentin, Laon, Soissons — ainsi que dans la Somme, l’Oise et l’Aisne. Paris et Lille sont à une heure de train. Je me déplace partout en France et ponctuellement en Europe.",
    // ✅ Débloquée. Elle est restée hors du JSON-LD tant que la biographie
    // situait Vince à Tours ; cette biographie dit maintenant « Il s'installe
    // en Picardie », donc plus rien dans le dépôt ne contredit cette réponse.
    structuree: true,
  },
  {
    question: "Combien de temps à l’avance faut-il réserver ?",
    reponse:
      "Le plus tôt possible pour les samedis et les périodes de fêtes. Une demande de dernière minute reste toujours possible selon mes disponibilités : n’hésitez pas à me l’envoyer.",
    structuree: true,
  },
  {
    question: "La prestation peut-elle être personnalisée ?",
    reponse:
      "Oui, et c’est ce que je préfère. Le format, le rythme et certains effets s’adaptent au public, au lieu et au fil conducteur de votre événement.",
    structuree: true,
  },
  {
    question: "Faut-il prévoir une scène ou du matériel ?",
    reponse:
      "Le close-up ne demande rien : il se déplace avec vous, à table comme en déambulation. Pour un spectacle, un espace dégagé et une prise de courant suffisent. J’apporte la sonorisation et les accessoires.",
    // ⚠️ À VALIDER PAR VINCE.
    structuree: false,
  },
  {
    question: "Le spectacle est-il réservé aux enfants ?",
    reponse:
      // ⚠️ « CINQ ANS » DOIT RESTER D'ACCORD avec trois autres endroits : le
      // texte et la fiche de la section « Spectacles de scène »
      // (`HomeEditorialSections.tsx`) et le `Service` des données structurées.
      // Le site disait « trois ans » ; Vince a tranché pour cinq.
      "Non. Il existe en version familiale, qui se suit dès cinq ans, et en version tout public adulte pour un gala ou une soirée d’entreprise. Dans les deux cas, l’humour s’adresse à tout le monde.",
    // ⚠️ À VALIDER PAR VINCE.
    structuree: false,
  },
];
