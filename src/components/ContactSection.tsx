import { motion } from "motion/react";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";

// Les formules du site, dans le même ordre que « Mes prestations », plus une
// sortie pour qui ne sait pas encore : c'est le cas le plus fréquent d'une
// première prise de contact, et l'absence de cette option pousse à en cocher
// une au hasard.
//
// « Ateliers & initiation » n'y figure plus : la section a été retirée de la
// page, une formule proposée ici sans rien pour la décrire ailleurs.
const formats = ["Close-up", "Spectacle de scène", "Je ne sais pas encore"];

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  /** ⚠️ CE FORMULAIRE A LONGTEMPS MENTI. Son `onSubmit` se contentait de
   *  `setSent(true)` : le visiteur lisait « Message envoyé ! Je vous réponds
   *  sous 24 heures ouvrées » alors qu'aucun appel réseau n'était jamais parti.
   *  Les demandes se perdaient en silence, et les gens attendaient une réponse
   *  qui ne pouvait pas venir. Ne jamais remettre l'écran de confirmation sans
   *  une réponse du serveur derrière.
   *
   *  La route est `src/routes/api.contact.ts` ; elle envoie par Resend et
   *  explique pourquoi pas par Cloudflare. */
  async function soumettre(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (envoi) return;
    setEnvoi(true);
    setErreur(null);

    // Les champs sont lus par leur attribut `name` plutôt que par un état React
    // par champ : le formulaire n'a aucune logique de saisie, en tenir sept en
    // mémoire ne servirait qu'à les recopier.
    const donnees = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      });
      const resultat = (await reponse.json().catch(() => null)) as { erreur?: string } | null;
      if (!reponse.ok) throw new Error(resultat?.erreur ?? "Envoi impossible.");
      setSent(true);
    } catch (e) {
      // Le repli donne l'adresse en clair : un formulaire en panne ne doit pas
      // faire perdre un client, il doit dire où écrire autrement.
      setErreur(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : "L'envoi a échoué. Écrivez-moi directement à contact@magicvince.com.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <section
      id="contact"
      /* Marge d'ancrage négative : même raison qu'à la galerie. Le `padding-top`
         de la section (85px, 136px en md) puis le sur-titre et sa marge (~36px)
         séparent le point d'ancrage du titre, qui atterrissait donc à 257px du
         haut pour une barre de 86px. La valeur ramène le TITRE sous la barre.
         Elle remplace un `scrollMarginTop` en style inline, qui aurait gagné
         sur la classe et rendu la variante `md:` sans effet. */
      className="contact-shift relative -scroll-mt-2 md:-scroll-mt-14 py-20 md:py-32"
    >
      <style>{`
        .contact-shift input,
        .contact-shift select,
        .contact-shift textarea {
          background: color-mix(in oklab, var(--card) 70%, transparent);
          color: var(--foreground);
        }
        /* L'icône de calendrier du champ date est dessinée par le navigateur,
           pas par nous : c'est un pseudo-élément natif, en noir plein, prévu
           pour un formulaire sur fond clair. Sur le bleu nuit, elle faisait une
           tache sombre au bout du champ.

           On ne peut ni lui donner une couleur ni la remplacer proprement —
           mais on peut la retourner. Le noir devient blanc, et comme le dessin
           est monochrome sur fond transparent, l'inversion ne touche que lui. */
        .contact-shift input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.85;
          cursor: pointer;
        }
        .contact-shift input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <div className="type-eyebrow text-[var(--gold)]">— Rencontrons-nous</div>
          <h2 className="font-display text-5xl md:text-7xl mt-5 leading-[1.02]">
            Votre événement <span className="text-gradient-gold">commence ici.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
            Racontez-moi vos envies. Je vous réponds sous 24 heures pour imaginer la formule qui
            vous correspond.
          </p>
        </motion.div>

        <div className="mt-14 space-y-10">
          <motion.div
            /* Entrée par le BAS, comme le formulaire en dessous, et surtout PAS
               par le côté.
               Le `x: -30` d'origine datait du temps où ces cartes étaient une
               colonne étroite à gauche : arrivée latérale, cela se tenait. En
               rangée pleine largeur, il décalait le bloc de 30px vers la gauche
               par rapport au formulaire, avec lequel il partage pourtant le
               même conteneur et donc exactement la même largeur. Tant que
               l'animation n'était pas terminée — ou si elle ne se déclenchait
               pas, le bloc étant déjà à l'écran au chargement — les deux bords
               gauches ne tombaient pas l'un sur l'autre.
               Même axe et même durée pour les deux : ils ne peuvent plus se
               désaligner latéralement, quel que soit le moment du rendu. */
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            /* Trois cartes en rangée au-dessus du formulaire, qui récupère la
               largeur entière. Une seule colonne sous 768px, où trois cartes
               côte à côte réduiraient chaque libellé à deux mots par ligne. */
            className="grid gap-4 md:grid-cols-3"
          >
            <a
              href="mailto:contact@magicvince.com"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-[var(--gold)]/40 transition-colors"
            >
              <span
                className="grid place-items-center w-12 h-12 rounded-xl shrink-0"
                style={{
                  background: "color-mix(in oklab, var(--gold) 22%, transparent)",
                  color: "var(--gold)",
                }}
              >
                <Mail size={22} />
              </span>
              <div>
                <div className="type-eyebrow text-muted-foreground">Email</div>
                <div className="font-display text-lg mt-1 group-hover:text-[var(--gold)] transition-colors">
                  contact@magicvince.com
                </div>
                <div className="text-sm text-muted-foreground mt-1">Réponse sous 24h ouvrées</div>
              </div>
            </a>

            <a
              href="tel:+33670018241"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-[var(--gold)]/40 transition-colors"
            >
              <span
                className="grid place-items-center w-12 h-12 rounded-xl shrink-0"
                style={{
                  background: "color-mix(in oklab, var(--gold) 22%, transparent)",
                  color: "var(--gold)",
                }}
              >
                <Phone size={22} />
              </span>
              <div>
                <div className="type-eyebrow text-muted-foreground">Téléphone</div>
                <div className="font-display text-lg mt-1 group-hover:text-[var(--gold)] transition-colors">
                  06 70 01 82 41
                </div>
                <div className="text-sm text-muted-foreground mt-1">Lun-Ven, 10h-19h</div>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6">
              <span
                className="grid place-items-center w-12 h-12 rounded-xl shrink-0"
                style={{
                  background: "color-mix(in oklab, var(--gold) 22%, transparent)",
                  color: "var(--gold)",
                }}
              >
                <MapPin size={22} />
              </span>
              <div>
                <div className="type-eyebrow text-muted-foreground">Zone</div>
                <div className="font-display text-lg mt-1">Picardie · Hauts-de-France</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Déplacements France & Europe
                </div>
              </div>
            </div>

            {/* La carte « Agenda » (« Dates 2026 ouvertes », « Réservez tôt pour
                les samedis ») a été retirée : c'était la seule des quatre à
                porter une information datée, donc à devoir être tenue à jour
                chaque année sous peine de vieillir le site toute seule. */}
          </motion.div>

          <motion.form
            /* Entrée par le bas et non plus par la droite : le formulaire
               n'arrive plus de côté, il arrive dessous. */
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={soumettre}
            className="rounded-3xl border border-border bg-card/40 backdrop-blur p-8 md:p-10"
          >
            {sent ? (
              <div className="text-center py-12">
                <span className="inline-grid place-items-center w-16 h-16 rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                  <Sparkles size={28} />
                </span>
                <h3 className="font-display text-4xl mt-6">Message envoyé !</h3>
                <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                  Merci. Je vous réponds personnellement sous 24 heures ouvrées avec une première
                  proposition.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-4xl leading-tight">Échangeons ensemble</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Tous les champs marqués * sont requis.
                </p>

                {/* Quatre colonnes à partir de 1024px. En deux colonnes, le
                    formulaire ayant doublé de largeur, un champ « Prénom »
                    s'étalait sur 560px : la ligne de saisie était huit fois
                    plus longue que ce qu'on y écrit, et l'œil perdait le lien
                    entre l'étiquette et le champ suivant. Quatre champs courts
                    sur une rangée rendent la largeur utile au lieu de la subir. */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Prénom *" name="firstName" placeholder="Jeanne" required />
                  <Field label="Nom *" name="lastName" placeholder="Dupont" required />
                  <Field
                    label="Email *"
                    type="email"
                    name="email"
                    placeholder="jeanne@exemple.fr"
                    required
                  />
                  <Field label="Téléphone" type="tel" name="phone" placeholder="06 00 00 00 00" />
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <Field label="Date de l'événement" type="date" name="date" />
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Format souhaité
                    </label>
                    {/* `defaultValue=""` sur le SELECT, et non `selected` sur
                        l'option : React refuse `selected` et s'en plaint en
                        console — c'est le select qui porte la valeur initiale.

                        L'invite est `disabled` pour qu'on ne puisse pas la
                        choisir, et `hidden` pour qu'elle disparaisse de la
                        liste une fois celle-ci ouverte : elle n'est pas un
                        choix, seulement l'état de départ. Sans `disabled`,
                        elle partirait dans le message comme une réponse. */}
                    <select
                      name="format"
                      defaultValue=""
                      className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
                    >
                      <option value="" disabled hidden>
                        Veuillez choisir un format
                      </option>
                      {formats.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Votre message *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Lieu, nombre d'invités, ambiance recherchée, contraintes…"
                    className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                  />
                </div>

                {/* CHAMP PIÈGE. Invisible à l'œil, retiré du parcours clavier
                    et ignoré des lecteurs d'écran : un visiteur ne peut pas le
                    remplir. Un robot qui remplit tout ce qu'il trouve, si — et
                    la route jette alors le message en répondant 200, pour ne
                    pas lui apprendre qu'il a été repéré.

                    ⚠️ `hidden` du HTML, et non `type="hidden"` : un champ de
                    type caché est le premier que remplit un robot, et le
                    `sr-only` le laisserait atteignable à la tabulation. */}
                <div hidden aria-hidden="true">
                  <label htmlFor="website">Ne remplissez pas ce champ</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {/* L'erreur se place AVANT le bouton : après, elle serait sous
                    la ligne de flottaison sur un téléphone, et le visiteur
                    cliquerait une deuxième fois sans jamais la lire. */}
                {erreur && (
                  <p
                    role="alert"
                    className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    {erreur}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={envoi}
                  className="mt-8 group inline-flex items-center gap-2 rounded-full bg-[var(--gold)] text-primary-foreground px-7 py-3.5 font-medium hover:shadow-glow transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {envoi ? "Envoi en cours…" : "Envoyer la demande"}
                  <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
      />
    </div>
  );
}
