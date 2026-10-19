import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/** Réception du formulaire de contact, et envoi de la demande à Vince.
 *
 *  ── POURQUOI RESEND ET NON CLOUDFLARE EMAIL SENDING ────────────────────────
 *
 *  Le site de Madgyc, bâti sur le même socle, envoie par la liaison `send_email`
 *  de Cloudflare. Ici c'est impossible : le tableau de bord répond « Email
 *  Sending is currently only available with the Workers Paid plan », et ce
 *  compte est sur Workers Free. Le service est gratuit À L'USAGE — un envoi vers
 *  une adresse de destination vérifiée ne consomme aucun quota — mais l'accès au
 *  produit demande l'abonnement à 5 $/mois, pour un formulaire qui recevra
 *  quelques messages par mois.
 *
 *  Si ce compte passe un jour à Workers Paid, la bascule ne touche que la
 *  fonction `envoyer` ci-dessous : tout le reste du fichier est indépendant du
 *  transporteur.
 *
 *  ── LE DOMAINE D'ENVOI EST LA RACINE, ET C'EST UN POINT DÉLICAT ────────────
 *
 *  `contact@magicvince.com` est une BOÎTE IONOS : les MX de la racine pointent
 *  vers `mx00/mx01.ionos.fr` et doivent y rester. Vérifier le domaine d'envoi à
 *  la racine est donc la manœuvre risquée du dossier.
 *
 *  Elle est passée parce que RESEND N'Y POSE NI MX NI SPF. Sa méthode actuelle
 *  n'écrit que trois enregistrements, tous inoffensifs ici :
 *
 *    TXT   resend._domainkey   la clé DKIM — sélecteur distinct de `s1-ionos`
 *                              et `s2-ionos`, les trois cohabitent
 *    CNAME rsend               rsend-euw1.forge.rmta.net — chemin de retour
 *    CNAME send                send.forge.rmta.net — hôte d'envoi
 *
 *  Le chemin de retour des rebonds passe par un CNAME, pas par un MX sur le
 *  domaine : c'est ce qui rend la racine utilisable. Relevé après coup sur les
 *  serveurs autoritaires : MX IONOS intacts, un seul SPF, celui d'IONOS.
 *
 *  ⚠️ NE JAMAIS ACTIVER « Enable Receiving » CHEZ RESEND. C'est ce bouton, et
 *  lui seul, qui poserait des MX sur la racine — et la boîte de Vince cesserait
 *  de recevoir. Le site n'a aucun besoin de recevoir du courrier.
 *
 *  Un sous-domaine `send.magicvince.com` a été essayé d'abord, par prudence. Il
 *  donnait des noms absurdes (`send.send.magicvince.com`) pour une protection
 *  dont la méthode actuelle de Resend rend inutile.
 *
 *  ── CE QU'IL FAUT AVOIR FAIT POUR QUE ÇA MARCHE ────────────────────────────
 *
 *  1. `magicvince.com` est vérifié chez Resend, les trois enregistrements
 *     ci-dessus en place et en DNS only chez Cloudflare ;
 *  2. le secret `RESEND_API_KEY` est posé sur le Worker — par le tableau de
 *     bord (Settings → Variables and Secrets, type Secret) ou par
 *     `npx wrangler secret put RESEND_API_KEY`. Sans lui, la route répond 503
 *     et le journal le dit.
 */

/** La boîte de Vince, chez IONOS. C'est la seule adresse que cette route écrit,
 *  et elle est écrite EN DUR : rien dans la requête ne choisit le destinataire,
 *  sans quoi la route deviendrait un relais de courrier ouvert. */
const DESTINATAIRE = "contact@magicvince.com";

/** ⚠️ C'EST LA MÊME ADRESSE QUE LE DESTINATAIRE, ET C'EST VOULU. Le message
 *  part donc de la boîte de Vince vers la boîte de Vince ; seul le nom affiché
 *  dit d'où il vient vraiment.
 *
 *  Ce fichier a d'abord utilisé `no-reply@magicvince.com`, par prudence : une
 *  adresse d'expédition distincte évite les heuristiques anti-spam qui se
 *  méfient d'un message qu'une boîte s'enverrait à elle-même. Résultat, TOUS
 *  LES ENVOIS ONT REBONDI, avec ce motif d'IONOS :
 *
 *    550 Requested action not taken: mailbox unavailable
 *    550 invalid DNS MX or A/AAAA resource record
 *
 *  L'étiquette est trompeuse — les MX de `magicvince.com` pointent vers
 *  `mx00/mx01.ionos.fr`, qui ont tous deux un A, donc le critère annoncé par
 *  IONOS est satisfait. La vraie cause est la première ligne : IONOS héberge
 *  les boîtes de ce domaine, `no-reply@magicvince.com` n'en est pas une, et un
 *  message qui se réclame d'une adresse inconnue du domaine qu'il héberge est
 *  refusé. Le test qui l'a montré : un message de Resend lui-même, expédié
 *  depuis `onboarding@resend.dev`, est arrivé sans encombre dans la même boîte
 *  à la même période.
 *
 *  ⚠️ NE PAS REVENIR À UNE ADRESSE INVENTÉE — `no-reply@`, `site@`, `formulaire@`
 *  — sans créer d'abord la boîte ou l'alias correspondant chez IONOS. C'est
 *  l'erreur qui a coûté une soirée. Resend le déconseille d'ailleurs pour une
 *  autre raison, visible dans ses « Insights » : une adresse qui annonce qu'on
 *  ne peut pas répondre dégrade la confiance des boîtes de réception.
 *
 *  Le visiteur ne voit jamais cette adresse : seul Vince la lit, et c'est
 *  `reply_to` qui porte celle à laquelle répondre. */
const EXPEDITEUR = `Formulaire du site <${DESTINATAIRE}>`;

const RESEND_URL = "https://api.resend.com/emails";

/** ⚠️ TOUT MESSAGE D'ÉCHEC DOIT DONNER L'ADRESSE EN CLAIR. Un formulaire en
 *  panne ne doit pas faire perdre un client : il doit dire où écrire autrement.
 *  Les trois chemins d'erreur ci-dessous la portent donc tous. */
const REPLI = `Écrivez-moi directement à ${DESTINATAIRE}.`;

type Demande = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  date?: string;
  format?: string;
  message: string;
  /** Champ piège — voir `estUnRobot`. */
  website?: string;
};

/** Validation volontairement minimale : le navigateur a déjà exigé les champs
 *  requis. Ce contrôle-ci n'est pas là pour l'ergonomie mais parce que rien
 *  n'oblige un appel à passer par le formulaire. */
function estUneDemande(valeur: unknown): valeur is Demande {
  if (!valeur || typeof valeur !== "object") return false;
  const v = valeur as Record<string, unknown>;
  return (
    typeof v.firstName === "string" &&
    v.firstName.trim() !== "" &&
    typeof v.email === "string" &&
    // Un @ entouré de quelque chose. On ne cherche pas à valider une adresse
    // par expression régulière, c'est un problème sans solution propre : la
    // seule vraie validation est qu'un message y arrive.
    /.+@.+\..+/.test(v.email) &&
    typeof v.message === "string" &&
    v.message.trim() !== ""
  );
}

/** CHAMP PIÈGE. Le formulaire porte un champ `website` caché aux humains par le
 *  CSS et retiré du parcours clavier. Un visiteur ne peut pas le remplir ; un
 *  robot qui remplit tout ce qu'il trouve, si.
 *
 *  On répond alors 200 et on jette le message. Répondre en erreur apprendrait
 *  au robot qu'il a été repéré, et il reviendrait en contournant le piège. */
function estUnRobot(d: Demande): boolean {
  return typeof d.website === "string" && d.website.trim() !== "";
}

/** Récupère le secret.
 *
 *  `cloudflare:workers` n'existe QUE dans le moteur Workers : en développement,
 *  le serveur tourne sous Node et l'import échoue. D'où l'import dynamique dans
 *  un try/catch, et un message explicite plutôt qu'une pile d'appels. Le
 *  formulaire est donc inerte en local — c'est attendu, il ne peut pas en être
 *  autrement sans déployer. */
async function obtenirCle(): Promise<string | null> {
  try {
    const module = await import("cloudflare:workers");
    const cle = (module.env as Record<string, unknown> | undefined)?.RESEND_API_KEY;
    return typeof cle === "string" && cle !== "" ? cle : null;
  } catch {
    return null;
  }
}

/** Met la demande en forme. Texte brut et non HTML : le message est lu dans une
 *  boîte de réception, pas dans un navigateur, et un courrier en texte simple
 *  passe mieux les filtres anti-spam qu'un HTML envoyé par un robot. */
function composer(d: Demande): string {
  return [
    `Prénom : ${d.firstName}`,
    d.lastName ? `Nom : ${d.lastName}` : null,
    `Email : ${d.email}`,
    d.phone ? `Téléphone : ${d.phone}` : null,
    d.date ? `Date de l'événement : ${d.date}` : null,
    // `||` et non `??` : le menu déroulant commence par un marqueur vide, donc
    // un visiteur qui n'y touche pas envoie une CHAÎNE VIDE, que `??` laisse
    // passer — la ligne s'afficherait alors sans rien après les deux-points.
    `Format souhaité : ${d.format || "Non précisé"}`,
    "",
    "Message :",
    d.message,
  ]
    .filter((ligne) => ligne !== null)
    .join("\n");
}

/** L'envoi lui-même. C'est la SEULE fonction à réécrire pour changer de
 *  transporteur. */
async function envoyer(cle: string, d: Demande): Promise<void> {
  const reponse = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cle}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EXPEDITEUR,
      to: [DESTINATAIRE],
      subject: `Demande de devis — ${d.firstName} ${d.lastName ?? ""}`.trim(),
      text: composer(d),
      // Le champ qui rend le dispositif utilisable : Vince appuie sur
      // « Répondre » dans sa boîte et sa réponse part chez le visiteur, sans
      // copier-coller ni risque d'erreur de saisie.
      reply_to: d.email,
    }),
  });

  if (!reponse.ok) {
    // Le corps de la réponse porte le motif exact du refus — domaine non
    // vérifié, clé révoquée, quota. Sans lui, un échec est indéchiffrable.
    const detail = await reponse.text().catch(() => "");
    throw new Error(`Resend ${reponse.status} ${detail}`.trim());
  }
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let corps: unknown;
        try {
          corps = await request.json();
        } catch {
          return Response.json({ ok: false, erreur: "Requête illisible." }, { status: 400 });
        }

        if (!estUneDemande(corps)) {
          return Response.json(
            { ok: false, erreur: "Prénom, email et message sont requis." },
            { status: 400 },
          );
        }

        if (estUnRobot(corps)) {
          return Response.json({ ok: true });
        }

        const cle = await obtenirCle();
        if (!cle) {
          console.error("RESEND_API_KEY absente : envoi impossible.");
          return Response.json(
            { ok: false, erreur: `L'envoi est momentanément indisponible. ${REPLI}` },
            { status: 503 },
          );
        }

        try {
          await envoyer(cle, corps);
          return Response.json({ ok: true });
        } catch (erreur) {
          // Journalisé tel quel : c'est la seule trace disponible quand un
          // visiteur signale que son message n'est jamais arrivé.
          console.error("Échec de l'envoi du formulaire de contact :", erreur);
          return Response.json(
            { ok: false, erreur: `Le message n'a pas pu être envoyé. ${REPLI}` },
            { status: 502 },
          );
        }
      },
    },
  },
});
