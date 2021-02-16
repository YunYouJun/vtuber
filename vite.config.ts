import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "vite-plugin-components";
import Icons, { ViteIconsResolver } from "vite-plugin-icons";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      customComponentResolvers: ViteIconsResolver(),
    }),
    Icons(),
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
