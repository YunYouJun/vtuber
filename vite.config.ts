import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "vite-plugin-components";
import Icons, { ViteIconsResolver } from "vite-plugin-icons";
import Pages from "vite-plugin-pages";

export default defineConfig({
  plugins: [
    Vue(),
    Components({
      customComponentResolvers: ViteIconsResolver(),
    }),
    Icons(),
    Pages(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["three/examples/js/libs/ammo.wasm"],
  },
});
