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
 *  - la réponse dit quelque chose que le site n'a pas tranché. Celle sur les
 *    déplacements énumère Amiens, la Picardie, la Somme, l'Oise et l'Aisne,
 *    alors que la biographie situe Vince à Tours et que ses références
 *    clientes sont majoritairement de Touraine. Tant que la contradiction
 *    tient, la déclarer reviendrait à choisir un camp au nom de Vince.
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
    reponse:
      "Elle s’adapte à votre événement. Le close-up accompagne un cocktail ou un dîner et se compte en heures ; le spectacle pour enfants dure de 30 à 40 minutes.",
    structuree: true,
  },
  {
    question: "Vous déplacez-vous partout en France ?",
    reponse:
      "Oui. J’interviens à Amiens et dans toute la Picardie — Beauvais, Compiègne, Saint-Quentin, Laon, Soissons — ainsi que dans la Somme, l’Oise et l’Aisne. Paris et Lille sont à une heure de train. Je me déplace partout en France et ponctuellement en Europe.",
    // ⚠️ Picardie / Tours non tranché — voir l'en-tête.
    structuree: false,
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
    question: "À partir de quel âge le spectacle convient-il ?",
    reponse:
      "Il n’y a pas d’âge pour rêver : le spectacle se suit dès trois ans, et il est écrit pour que les adultes en profitent autant que les enfants.",
    // ⚠️ À VALIDER PAR VINCE.
    structuree: false,
  },
];
