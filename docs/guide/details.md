# 细节优化

## 画中画 Picture in Picture

譬如我们可以为其添加画中画功能来更方便使用。

但是画中画 API 只可通过 video 元素使用，因此我们可以使用 canvas 的 `captureStream` 来捕获 canvas 的 stream，并将其赋值给 video 的源。

```ts
video.srcObject = canvas.captureStream()
```

:::tip
这里有个坑，video 元素需要添加 `muted` 属性，方可正常显示。（原因未知）

如：

```html
<video autoplay playsinline muted />
```

:::

这时再使用 `video.requestPictureInPicture()` 获取画中画模式。

- [Picture in Picture API | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API)
- [canvas-video/js/main.js | GitHub](https://github.com/webrtc/samples/blob/gh-pages/src/content/capture/canvas-video/js/main.js)
