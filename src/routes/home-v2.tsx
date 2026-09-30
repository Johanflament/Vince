import { createFileRoute } from "@tanstack/react-router";

import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactSection } from "@/components/ContactSection";
import { HomeEditorialSections } from "@/components/HomeEditorialSections";
import { Hero } from "@/components/Hero";
import { Prestations } from "@/components/Prestations";
// Importés depuis la route d'accueil, où ils vivent avec leurs données. Les
// recopier ici ferait exactement ce que cette variante cherche à éviter : deux
// versions d'un même bloc, qui finissent par diverger.
import { Marquee } from "./index";

/**
 * VARIANTE DE TRAVAIL — la vidéo SOUS une barre pleine.
 *
 * La barre de navigation garde son fond sombre dès le haut de page, et la
 * vidéo commence exactement en dessous : elle occupe toute la largeur et toute
 * la hauteur restante. C'est la différence avec `/home-v3`, où la vidéo part du
 * haut de la fenêtre et passe sous une barre transparente.
 *
 * `barreOpaque` est une prop du menu et non une déduction depuis l'URL : cette
 * page reste une page d'ACCUEIL — ses ancres sont locales — mais veut
 * l'habillage d'une page intérieure. Les deux notions étaient confondues dans
 * `SiteNav`, elles ne le sont plus.
 *
 * C'est la SEULE différence avec `/` : la prop `fond` du hero. Tout le reste
 * vient des mêmes composants, si bien qu'une correction faite sur l'accueil
 * apparaît ici sans rien recopier. Si cette variante est retenue, il suffira de
 * passer `fond="video"` sur `/` et de supprimer ce fichier — surtout ne pas
 * dupliquer le hero pour faire diverger les deux.
 */
export const Route = createFileRoute("/home-v2")({
  head: () => ({
    meta: [
      { title: "Magic Vince — variante vidéo (travail)" },
      // Une variante de travail n'a rien à faire dans les résultats de
      // recherche : indexée, elle ferait doublon avec l'accueil et les deux se
      // concurrenceraient sur les mêmes mots-clés.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HomeV2,
});

function HomeV2() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteNav barreOpaque />
      <Hero fond="video" />
      <Marquee />
      <Prestations />
      <HomeEditorialSections />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
