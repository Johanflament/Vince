import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Magic Vince" },
      {
        name: "description",
        content:
          "Mentions légales, hébergement et traitement des données personnelles du site de Vince, magicien en Picardie.",
      },
      // Une page légale n'a rien à faire dans les résultats de recherche.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: MentionsLegales,
});

function MentionsLegales() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />

      {/* pt-40 : la barre de menu est fixe, et sur cette page elle porte son fond
          sombre dès le chargement. Le titre doit commencer franchement dessous. */}
      <main className="max-w-3xl mx-auto px-6 md:px-10 pt-40 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]"
        >
          — Informations légales
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl mt-4 leading-[1.02]"
        >
          Mentions <span className="text-gradient-gold">légales</span>
        </motion.h1>

        <div className="mt-14 space-y-12">
          <Section title="Éditeur du site">
            <p>
              <strong className="text-foreground font-medium">Vince</strong> — magicien,
              entrepreneur individuel.
            </p>
            {/* L'adresse a traversé deux copies de site sans jamais appartenir à
                l'artiste affiché : c'était encore celle d'un précédent magicien,
                à Nozay en Loire-Atlantique. La publier sous un autre nom revenait
                à publier le domicile de quelqu'un d'autre — elle reste donc
                retirée tant que Vince n'a pas communiqué la sienne. Mention
                obligatoire pour une activité professionnelle, donc à compléter
                avant la mise en ligne, au même titre que le SIRET ci-dessous. */}
            <p className="text-muted-foreground/70">Adresse : à compléter.</p>
            <p>
              Téléphone :{" "}
              <a href="tel:+33670018241" className="text-[var(--gold)] hover:underline">
                06 70 01 82 41
              </a>
              <br />
              Email :{" "}
              <a
                href="mailto:contact@magicvince.com"
                className="text-[var(--gold)] hover:underline"
              >
                contact@magicvince.com
              </a>
            </p>
            <p>Directeur de la publication : Vince.</p>
            {/* Le SIRET est obligatoire pour une activité professionnelle : à
                remplacer dès que Vince l'aura communiqué. */}
            <p className="text-muted-foreground/70">Numéro SIRET : à compléter.</p>
          </Section>

          <Section title="Hébergement">
            <p>
              Le site est hébergé par{" "}
              <strong className="text-foreground font-medium">Cloudflare, Inc.</strong>
              <br />
              101 Townsend Street, San Francisco, CA 94107, États-Unis
              <br />
              <a
                href="https://www.cloudflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--gold)] hover:underline"
              >
                www.cloudflare.com
              </a>
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L'ensemble de ce site — textes, photographies, vidéos, logo et éléments graphiques —
              est protégé par le droit d'auteur. Toute reproduction, représentation ou diffusion,
              totale ou partielle, sans autorisation écrite préalable est interdite.
            </p>
            <p>
              Les photographies et vidéos présentées sont la propriété de Vince ou de leurs auteurs
              respectifs.
            </p>
          </Section>

          <Section title="Données personnelles" id="donnees-personnelles">
            <p>
              <strong className="text-foreground font-medium">Responsable du traitement :</strong>{" "}
              Johan FLAMENT.
            </p>
            <p>
              Le formulaire de contact recueille les informations que vous y saisissez — prénom,
              nom, adresse email, numéro de téléphone, date et format de l'événement, ainsi que le
              contenu de votre message. Ces données servent uniquement à répondre à votre demande et
              à établir une proposition. Elles ne sont ni cédées, ni vendues, ni utilisées à des
              fins publicitaires.
            </p>
            <p>
              Elles sont conservées le temps nécessaire au traitement de votre demande et à la
              relation commerciale qui peut en découler, puis trois ans après le dernier contact.
            </p>
            <p>
              Conformément au Règlement général sur la protection des données (RGPD) et à la loi
              Informatique et Libertés, vous disposez d'un droit d'accès, de rectification,
              d'effacement, de limitation et d'opposition sur les données qui vous concernent, ainsi
              que d'un droit à la portabilité. Pour les exercer, écrivez à{" "}
              <a
                href="mailto:contact@magicvince.com"
                className="text-[var(--gold)] hover:underline"
              >
                contact@magicvince.com
              </a>
              .
            </p>
            <p>
              Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés,
              vous pouvez adresser une réclamation à la{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--gold)] hover:underline"
              >
                CNIL
              </a>
              .
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Ce site ne dépose aucun cookie de mesure d'audience, de publicité ou de suivi. Aucune
              donnée de navigation n'est collectée à votre insu.
            </p>
          </Section>

          <Section title="Responsabilité">
            <p>
              Les informations publiées sur ce site sont fournies à titre indicatif et peuvent
              évoluer. Vince s'efforce de les tenir à jour mais ne peut garantir leur exactitude à
              tout instant. Les liens vers des sites tiers n'engagent pas sa responsabilité quant à
              leur contenu.
            </p>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      style={id ? { scrollMarginTop: "7rem" } : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </motion.section>
  );
}
