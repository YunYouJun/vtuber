import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  minify: true,
  dts: true,
  entryPoints: ['./src/index.ts'],
  format: [
    'esm',
    'cjs',
  ],
  external: [
    '@mediapipe/holistic',
    '@mediapipe/camera_utils',
    '@mediapipe/drawing_utils',
    '@pixiv/three-vrm',
    'three',
    'vue',
    'consola',
  ],
})
