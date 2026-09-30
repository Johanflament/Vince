import { createFileRoute } from "@tanstack/react-router";

import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactSection } from "@/components/ContactSection";
import { HomeEditorialSections } from "@/components/HomeEditorialSections";
import { Hero } from "@/components/Hero";
import { Prestations } from "@/components/Prestations";
// Importés depuis la route d'accueil, où ils vivent avec leurs données. Les
// recopier ici ferait exactement ce que ces variantes cherchent à éviter :
// plusieurs versions d'un même bloc, qui finissent par diverger.
import { Marquee } from "./index";

/**
 * VARIANTE DE TRAVAIL — la vidéo en PLEIN CADRE, bord à bord.
 *
 * Différence avec `/home-v2` : là-bas la vidéo reprenait le cadrage de la
 * photo, calée sur la hauteur et alignée à droite, donc bornée. Ici elle
 * couvre toute la section et on la voit jouer sous la barre de navigation,
 * qui reste transparente tant qu'on n'a pas défilé.
 *
 * Cette transparence n'est pas propre à cette variante : c'est le comportement
 * normal d'une page d'accueil, que `/home-v2` n'avait pas parce que la barre la
 * prenait pour une page intérieure. Corrigé dans `src/lib/accueil.ts` — toute
 * nouvelle variante doit y être déclarée, sinon elle hérite du même défaut.
 */
export const Route = createFileRoute("/home-v3")({
  head: () => ({
    meta: [
      { title: "Magic Vince — variante vidéo plein cadre (travail)" },
      // Une variante de travail n'a rien à faire dans les résultats de
      // recherche : indexée, elle ferait doublon avec l'accueil et les deux se
      // concurrenceraient sur les mêmes mots-clés.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HomeV3,
});

function HomeV3() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />
      <Hero fond="video-plein" />
      <Marquee />
      <Prestations />
      <HomeEditorialSections />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
