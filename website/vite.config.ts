import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

/**
 * Capacitor-compatible path fixer:
 * Replaces hardcoded absolute paths ("/images/...", "/downloads.html", etc.)
 * with relative paths ("./images/...", "./downloads.html") in build output.
 * Vite's `base: "./"` only affects import-based asset URLs, not hardcoded strings.
 */
function capacitorPathFixer(): Plugin {
  return {
    name: "capacitor-path-fixer",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html) {
      // Remove crossorigin attributes that can cause issues in Capacitor WebView
      return html.replace(/\s+crossorigin(="[^"]*")?/g, "");
    },
    generateBundle(_options, bundle) {
      // Fix ALL hardcoded absolute paths in ALL output files
      function fixPaths(str: string): string {
        return str
          .replace(/"\/images\//g, '"./images/')
          .replace(/"\/admin"/g, '"./admin"')
          .replace(/"\/admin\//g, '"./admin/')
          .replace(/"\/downloads\.html"/g, '"./downloads.html"')
          .replace(/"\/sw\.js"/g, '"./sw.js"')
          .replace(/"\/manifest\.json"/g, '"./manifest.json"')
          .replace(/"\/api\//g, '"./api/')
          .replace(/"\/"/g, '"./"')
          .replace(/'\/images\//g, "'./images/")
          .replace(/'\/admin'/g, "'./admin'")
          .replace(/'\/admin\//g, "'./admin/")
          .replace(/'\/downloads\.html'/g, "'./downloads.html'")
          .replace(/'\/sw\.js'/g, "'./sw.js'")
          .replace(/'\/manifest\.json'/g, "'./manifest.json'")
          .replace(/'\/api\//g, "'./api/")
          .replace(/'\/'/g, "'./'");
      }
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName];
        if (chunk.type === "asset" && typeof chunk.source === "string") {
          chunk.source = fixPaths(chunk.source);
        }
        if (chunk.type === "chunk" && typeof chunk.code === "string") {
          chunk.code = fixPaths(chunk.code);
        }
      }
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), jsxLocPlugin(), capacitorPathFixer()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
