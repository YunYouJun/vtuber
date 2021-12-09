# use-vtuber

Realize Vtuber by Vue3 Composition API.

```bash
pnpm add use-vtuber
```

You need them to use Vue and VRM render.

```bash
pnpm add vue three @pixiv/three-vrm
pnpm add -D @types/three
```

If you need motion capture, You also should install them.

```bash
pnpm add @mediapipe/holistic @mediapipe/camera_utils @mediapipe/drawing_utils
```

## Usage

```ts
const vtuber = useVtuber({
  vrmUrl: 'https://v.yyj.moe/models/vrm/alicia-solid.vrm',
  // mediapipe canvas
  mpCanvasRef,
  // vrm canvas
  vrmCanvasRef,
  // web camera video
  videoRef,
})
```
