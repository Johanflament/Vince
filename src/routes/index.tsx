import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactSection } from "@/components/ContactSection";
import { HomeEditorialSections } from "@/components/HomeEditorialSections";
import { Hero } from "@/components/Hero";
import { Prestations } from "@/components/Prestations";

// Pas de `head` ici : cette route redéclarait titre, description et Open Graph
// avec ses propres valeurs, qui l'emportaient sur celles de __root.tsx — une
// route étant plus spécifique que la racine. On a donc corrigé le <head> de la
// racine sans rien changer à ce que voyaient les visiteurs, l'accueil étant
// justement la page où ces balises comptent le plus.
//
// L'accueil se contente désormais des balises de la racine, qui décrivent le
// site entier. Ne rajouter ici que ce qui serait PROPRE à cette page — et alors
// vérifier ce qui est réellement servi, pas ce que dit le fichier.
export const Route = createFileRoute("/")({
  component: Home,
});

// Chaque carte renvoie à la section qui développe son format, plus bas dans la
// page. Trois formules seulement, celles de la maquette : le carrousel n'a plus
// lieu d'être et les cartes s'étalent sur toute la largeur du contenu.
//

function Home() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />
      <Hero />
      <Marquee />
      <Prestations />
      <HomeEditorialSections />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}

// Drapeaux dessinés en SVG plutôt qu'en emoji : Windows n'affiche pas les emoji
// drapeaux et les remplace par les deux lettres du pays — « FR » et « GB »
// apparaîtraient en plein milieu de la ligne.
//
// Deux bulles de 18px, découpées au cercle. Le rond règle ce que le rectangle ne
// pouvait pas à cette échelle : plus de coins à arrondir donc plus de bords
// sales, et les deux pastilles ont enfin le même gabarit — en rectangle, les
// proportions officielles (3:2 contre 2:1) rendaient l'anglais plus large que le
// français.
const bubbleClass = "h-[18px] w-[18px] shrink-0";

function FlagFR() {
  return (
    <svg viewBox="0 0 20 20" className={bubbleClass} aria-hidden="true">
      <clipPath id="fr-bubble">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
      <g clipPath="url(#fr-bubble)">
        <rect width="20" height="20" fill="#fff" />
        <rect width="6.667" height="20" fill="#002654" />
        <rect x="13.333" width="6.667" height="20" fill="#ce1126" />
      </g>
    </svg>
  );
}

function FlagUK() {
  return (
    <svg viewBox="0 0 20 20" className={bubbleClass} aria-hidden="true">
      <clipPath id="uk-bubble">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
      {/* Union Jack redessiné au carré plutôt que rogné depuis son format 2:1 :
          rogner aurait mangé les diagonales sur les côtés.
          Les diagonales rouges sont centrées sur les blanches, sans le décalage
          en hélice du vrai drapeau : à 18px il ne se verrait pas, et c'est lui
          qui rendait le dessin confus. */}
      <g clipPath="url(#uk-bubble)">
        <rect width="20" height="20" fill="#012169" />
        <path d="M0,0 L20,20 M20,0 L0,20" stroke="#fff" strokeWidth="4" />
        <path d="M0,0 L20,20 M20,0 L0,20" stroke="#c8102e" strokeWidth="2" />
        <path d="M10,0 V20 M0,10 H20" stroke="#fff" strokeWidth="6.5" />
        <path d="M10,0 V20 M0,10 H20" stroke="#c8102e" strokeWidth="3.5" />
      </g>
    </svg>
  );
}

// Les formules d'abord, puis les occasions, puis les publics : le bandeau se lit
// comme une phrase même en entrant au milieu.
//
// « Mentalisme » en est sorti — il ne correspond plus à ce que Vince met en
// avant, et « Ateliers » le remplace pour aligner le bandeau sur les trois
// formules de la section suivante.
// ── LE BANDEAU DE RÉFÉRENCES ────────────────────────────────────────────────
//
// Il annonçait des PRESTATIONS (« Close-up », « Mariages », « Séminaires »…),
// c'est-à-dire exactement ce que la section « Mes prestations » énumère trente
// centimètres plus bas, en mieux. Il liste maintenant des CLIENTS, ce que rien
// d'autre sur la page ne dit.
//
// ⚠️ CE SONT DE VRAIS NOMS D'ENTREPRISES, fournis par Vince. Deux orthographes
// de marque ont été corrigées au passage : « Préstige » → « Prestige » (c'est
// ainsi que Kyriad l'écrit, l'URL de l'hôtel le confirme) et « Sanofi Adventis »
// → « Sanofi-Aventis ». Ne rien ajouter ici sans que Vince l'ait confirmé : une
// référence client inventée est une allégation commerciale trompeuse, et celles
// -ci sont vérifiables.
const marqueeItems = [
  "Kyriad Prestige Bordeaux Mérignac",
  "Mercure Hôtel",
  "EDF",
  "IBM",
  "Crédit Agricole Touraine",
  "Laboratoire Sanofi-Aventis",
  "Lion’s Club",
  "Rotary Club",
  "Aquarium de Touraine",
  "Maison de la Magie de Blois",
  "Indiana Animation",
  "Société BEJO",
  "Pétrolier AVIA",
  "Noces & Réceptions",
  "Le Miroir aux Alouettes",
  "Newdream",
  "SOGAREP",
];

// Nombre de copies du bandeau. La translation ne fait qu'une copie : il faut donc
// que les copies restantes suffisent à couvrir l'écran, sinon un vide apparaît au
// bout de la course.
//
// SIX COPIES AVANT, TROIS MAINTENANT. Les entrées sont des raisons sociales et
// non plus des mots isolés : mesurée sur les chasses réelles de Playfair, une
// copie est passée de 2681px à 4527px. Après translation d'une copie, il en
// reste 9053 — de quoi couvrir un écran de 2560 quatre fois. Six copies, c'était
// 27 000px de DOM pour rien.
const marqueeGroups = 3;

// Durée d'un cycle, calculée pour conserver la VITESSE DE LECTURE et non le
// nombre d'entrées. L'ancien bandeau parcourait 2681px en 112s, soit 23,9 px/s.
// Les noms ayant été réduits de 24 à 18px et l'écartement de 80 à 64, une copie
// mesure 3463px — mesuré sur les chasses réelles de Playfair. 3463 / 23,9 ≈ 145.
// ⚠️ À recalculer si la liste, le corps ou l'écartement changent :
// `durée = largeur d'une copie / 23,9`. Garder la durée en changeant le corps
// ferait varier la vitesse de défilement sans qu'on comprenne pourquoi.
const MARQUEE_DUREE = 145;

// Exporté du temps où trois pages d'accueil concurrentes devaient afficher
// exactement les mêmes sections. Il n'en reste qu'une ; l'export ne coûte rien
// et évite de déplacer le composant et ses données.
export function Marquee() {
  const reduceMotion = useReducedMotion();
  return (
    // Masqué sur mobile : le bandeau empiétait sur l'écran d'accueil, et une
    // raison sociale de trente signes n'a pas la place d'y défiler lisiblement.
    <div className="hidden border-y border-border bg-background/60 py-6 md:block">
      {/* L'INTITULÉ EST FIXE, il ne défile pas avec les noms.
          Placé dans la boucle, il serait repassé entre deux entreprises à
          chaque cycle, comme si c'en était une. Hors de la boucle, il fait ce
          qu'un intitulé doit faire : il annonce ce qui suit. C'est déjà le
          parti retenu pour les chiffres du hero, et pour la même raison — une
          suite qui défile toute seule, sans rien pour la présenter, se lit
          comme un bandeau publicitaire.

          AU-DESSUS ET CENTRÉ plutôt qu'à gauche sur la même ligne : à côté des
          noms, il fallait lui réserver sa largeur, ce qui rognait d'autant la
          zone défilante et obligeait à un fondu pour éviter que le premier nom
          ne vienne le toucher. Au-dessus, la bande reprend toute la largeur. */}
      <p className="type-eyebrow font-title text-center text-[var(--gold)]">
        Ils m’ont fait confiance
      </p>

      <div className="relative mt-4 overflow-hidden">
        <motion.div
          /* 18px et non 24 : ce sont des noms de clients, pas des titres. À
             l'ancien corps ils pesaient autant que les intitulés de section
             qu'ils séparent. L'écartement suit — `mx-8` au lieu de `mx-10` —
             sinon les puces prennent plus de place que les noms. */
          className="flex w-max font-display text-lg"
          // On translate exactement d'une copie (100 % / nombre de copies), et les
          // copies sont strictement identiques : au moment où la boucle repart, le
          // rendu est au pixel près le même. Aucun saut possible.
          animate={reduceMotion ? undefined : { x: ["0%", `-${100 / marqueeGroups}%`] }}
          transition={{ duration: MARQUEE_DUREE, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: marqueeGroups }).map((_, g) => (
            <div key={g} className="flex shrink-0" aria-hidden={g > 0 ? "true" : undefined}>
              {marqueeItems.map((it) => (
                <span key={it} className="flex shrink-0 items-center">
                  <span className="whitespace-nowrap text-muted-foreground/60">{it}</span>
                  {/* Chaque item porte SA puce de séparation : les copies sont donc
                      interchangeables et se raccordent sans écart particulier. */}
                  <span className="mx-8 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]/60" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Fondus aux DEUX bords, maintenant que la bande touche les côtés de
            la fenêtre : sans eux, les noms apparaissent et disparaissent d'un
            coup sur une arête franche, ce qui fait voir le cadre au lieu du
            mouvement. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent"
        />
      </div>
    </div>
  );
}
