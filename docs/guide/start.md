# 起步

使用已有的 [face-api.js](https://github.com/justadudewhohacks/face-api.js/) 配合浏览器的 WebCam 可以很方便地搭建出一个人近乎实时的人脸检测效果 Demo。

> [68 Point Face Landmark Detection Models](https://github.com/justadudewhohacks/face-api.js#68-point-face-landmark-detection-models)

face_landmark_68_mode 仅 350KB。

而我们将这些点坐标与其代表含义建立对应关系即可。

![dlib 68 point](/images/face-68-landmarks.jpg)

我们可以看到 dlib 给出的 68 个点对应的位置。

为了更方便的使用，我们可以将其各点用对象进行命名并一一对应。

见 `packages/vtuber/face.ts`。

<<< @/../packages/vtuber/src/face.ts

> 没错，是我自己一个个分的。

## 三二一，茄子

总之，咱们得先有一个 Vtuber 形象用于映射。

[使用 canvas 来绘制图形 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes) 中的笑脸是个不错的例子。

本质便是由弧线、圆圈组成，我们就绘制它来作为我们的初始形象吧。

Python 里有 [NumPy](https://numpy.org/)，JavaScript 里就用 [mathjs](https://github.com/josdejong/mathjs) 凑合一下吧。

说了这么多，发现还是先用现有的模型更方便，[Kizuna AI 绊爱 官网](https://kizunaai.com/download/) 可以下载到爱酱的模型（非商业使用）。

参照 Three.js 的 mmd 载入方式加载爱酱的模型。

> [webgl_loader_mmd | three.js](https://threejs.org/examples/?q=mmd#webgl_loader_mmd)

### 统计特征点

已知 30 是鼻子的中心点，而我们需要使用眉毛的中心与下巴的中心构成三角形，以计算头部的左右旋转角度。

### 头的左右旋转

那么首先我们需要获取标准的正面，我们假设人的正脸是对称的，也就是说 `眉毛的中心`，`鼻子的中心`，`下巴的中心` 应当是可以连成直线的。

眉毛的中心，我们可以通过取左眉毛中点与右眉毛中点连线的中点。

```ts
const browCenter = points[FaceMap.brow.left[2]]
  .add(points[FaceMap.brow.right[2]])
  .div({ x: 2, y: 2 });
```

鼻子中心

```ts
const noseCenter = points[FaceMap.nose.nostrils[2]];
```

下巴中心

```ts
const jawCenter = points[FaceMap.jaw[2]];
```

当转头时，三个点相连，应当是一个三角形。

我们暂且将眉毛中心到下巴中心这条最长的线称之为 `中线`，眉毛中心到鼻子中心的这条线称之为 `上斜线`。

```ts
const midLine = browCenter.sub(jawCenter);
// 上斜边
const topLine = browCenter.sub(noseCenter);

// 转化为 Three.js 里的向量以使用叉乘
const midLineVector = new THREE.Vector2(midLine.x, midLine.y);
const topLineVector = new THREE.Vector2(topLine.x, topLine.y);
```

中线与上斜线进行 [叉乘(向量积)](https://baike.baidu.com/item/%E5%90%91%E9%87%8F%E7%A7%AF)，则可以得到以这两个向量为边的平行四边形面积。

`鼻子转过的高度 = 平行四边形面积 / 中线长度`

而所谓 `鼻子转过的高度` 即与「脸水平旋转的角度」正相关。

```ts
// 旋转头部模型的 Y 轴
const rotationY =
    midlineVector.cross(topLineVector) / (midLineLength * midLineLength);
...
const ratio = 5
head.rotation.y = rotationY * ratio
```

> 也许应当有一个正确的换算方式，但是我测试放大倍率为 `5` 的时候效果还不错，总之先将就用下吧！

![又不是不能用](https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/meme/not-unusable.jpg)

看看效果吧。（有点卡！真的只是有点吗？）

![预览-1](/gif/preview-1.gif)

### 上下旋转

我们默认人是正对镜头的，且人脸是左右对称的，所以左右旋转很好实现。

但是上下旋转却不一样，我们并不知道用户什么情况下是正对镜头的。
也就是说我们应该有一张标准脸（即用户正对镜头时），并将此时 `眉毛的中心`，`鼻子的中心`，`下巴的中心` 三个点构成的直线长度比例作为用户正对镜头时的比例。

并由比值的增减来判断用户在抬头还是低头。

因此「脸垂直旋转的角度」应当与「 `上斜线` 在 `中线` 上的投影长度」与 「中线」的比值有关。
也就是说，用户抬头时，比值会减小，用户低头时，比值则会增大。

还记得点乘公式吗？[点积（数量积）](https://zh.wikipedia.org/wiki/%E7%82%B9%E7%A7%AF)

$$
\vec{a} \cdot \vec{b} = |\vec{a}| \, |\vec{b}| \cos \theta
$$

上斜线与中线的向量积，即为 `上斜线在中线上的投影长度（上斜线向量 * ）`  * `中线长度`

> 上斜线向量 * $\cos \theta$ = 上斜线在中线上的投影长度

因此我们想要得到比值，拿其除以两次中线长度即可。

```ts
// 垂直旋转量
const rotation
    = midLineVector.dot(topLineVector) / (midLineLength * midLineLength) - 0.5
```

对了，正常的上斜线比上中线是有一个比值的。
每个人可能有所区别，但为了方便起见，我们假设普通人的眉毛中心到鼻子的长度约等于眉毛到下巴的一半，所以我们还要在比例值上减去原有的 0.5，得到头真正应该旋转的角度。

可以看到在此过程中，我们可能需要重复计算 `midLineVector` 与 `topLineVector` 以及 `midLineLength * midLineLength`。

因此我们可以将水平与垂直旋转量公共部分合并到一起计算，进行些许优化。
