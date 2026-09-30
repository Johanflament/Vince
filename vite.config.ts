// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      // Port FIXE. Par défaut la config Lovable prend 8080, ou le premier port
      // libre au-dessus si 8080 est occupé — et plusieurs sites de magiciens
      // tournent en parallèle sur cette machine. Le port glissait donc d'un
      // démarrage à l'autre : impossible de garder un signet, et l'adresse
      // donnée au téléphone tombait sur le site d'un autre artiste.
      //
      // `strictPort` fait ÉCHOUER le démarrage si 8083 est pris, au lieu de
      // glisser silencieusement sur 8084. Un refus franc vaut mieux qu'un site
      // servi à une adresse qu'on ne sait plus laquelle.
      port: 8083,
      strictPort: true,
      // Écoute sur toutes les interfaces, pour tester depuis le téléphone sur
      // le même réseau Wi-Fi.
      host: true,
    },
  },
});
