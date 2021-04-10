# Guide

[![GitHub Repo stars](https://img.shields.io/github/stars/YunYouJun/vtuber?style=social)](https://github.com/YunYouJun/vtuber)

## 前言

因为经济拮据，家道中落，我打算出道成为 Vtuber。（~~好，很有精神！~~）

那么当 Vtuber 直播些什么好呢？一不会唱歌跳舞，二不会引导气氛。嗯，那就干脆写代码吧。（~~等等，真的会有人想看这种东西吗？~~）

### 设备

不少虚拟主播使用的是 FaceRig + Live2D 的解决方案。而我的直播内容暂定是写代码（~~所以真会有人想看这个吗？别骂了，别骂了。~~），且我的开发环境大部分位于我的小 Macbook 上，但是 FaceRig 是不支持 Mac 平台的。

所以需要另寻他路。前前后后找了几个软件，也大部分不支持 Mac 端。

倒是有个 [Live2DViewerEX](https://store.steampowered.com/app/616720/Live2DViewerEX/) 看起来不错，想着等打折再买（~~因为我是因为拮据所以准备出道的嘛~~）。

此后发现了一个 Vtuber 教程：[RimoChan/Vtuber_Tutorial](https://github.com/RimoChan/Vtuber_Tutorial)（~~可惜作者是个变态~~），使用 Python 构建，我也就理所当然地当作跨平台了。并打算照猫画虎。学习（~~抄袭~~）中途发现需要使用 OpenGL，但是目中无人的苹果早在 2018 WWDC 便宣布弃用 OpenGL 了（~~又不是不能用~~），而 OpenGL 自身也的确停止更新了。

所以为了面向未来，同时节约资金，加之自身对此类工具精度与效率并没有过高追求，本着学习（~~造轮子与白嫖自己~~）的态度，决定自给自足。

首先造轮子，得确认它当前尽可能是是独一无二的，才是有意义的，我打算将其定位至浏览器端，以实现真正意义上的跨平台。
理想情况为部署后，任意机器打开浏览器页面即可尝试粗略的效果，而无须配置安装各类环境。

即通过 WebRTC 读取视频、Tensorflow.js 捕捉特征点、映射到 Live2D Web，最后通过 OBS 加载浏览器资源实现直播。（~~总感觉有很多坑要踩~~）

> 因为技术力有限，本仓库主要用于记录学习尝试中的过程，但不保证一定能实现预想中的目标。（~~勿谓言之不预也~~）

## 起步

使用已有的 [face-api.js](https://github.com/justadudewhohacks/face-api.js/) 配合浏览器的 WebCam 可以很方便地搭建出一个人近乎实时的人脸检测效果 Demo。

> [68 Point Face Landmark Detection Models](https://github.com/justadudewhohacks/face-api.js#68-point-face-landmark-detection-models)

face_landmark_68_mode 仅 350KB。

而我们将这些点坐标与其代表含义建立对应关系即可。

![dlib 68 point](/images/face-68-landmarks.jpg)

我们可以看到 dlib 给出的 68 个点对应的位置。

为了更方便的使用，我们可以将其各点用对象进行命名并一一对应。

见 `packages/vtuber/face.ts`。

<<< @/../packages/vtuber/face.ts

### 三二一，茄子

总之，咱们得先有一个 Vtuber 形象用于映射。

[使用 canvas 来绘制图形 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes) 中的笑脸是个不错的例子。

本质便是由弧线、圆圈组成，我们就绘制它来作为我们的初始形象吧。

Python 里有 [NumPy](https://numpy.org/)，JavaScript 里就用 [mathjs](https://github.com/josdejong/mathjs) 凑合一下吧。

#### 统计特征点

已知 30 是鼻子的中心点，而我们需要使用眉毛的中心与下巴的中心构成三角形，以计算头部的左右旋转角度。

#### 头的左右旋转

那么首先我们需要获取标准的正面，我们假设人的正脸是对称的，也就是说眉毛的中心，鼻子的中心，下巴的中心应当是可以连成直线的。

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
const midline = browCenter.sub(jawCenter);
// 上斜边
const topline = browCenter.sub(noseCenter);

// 转化为 Three.js 里的向量以使用叉乘
const midlineVector = new THREE.Vector2(midline.x, midline.y);
const toplineVector = new THREE.Vector2(topline.x, topline.y);
```

中线与上斜线进行 [叉乘(向量积)](https://baike.baidu.com/item/%E5%90%91%E9%87%8F%E7%A7%AF)，则可以得到三角形的面积。

`鼻子转过的高度 = 三角形面积 / 中线长度`

而所谓 `鼻子转过的高度` 即与脸水平旋转的角度正相关。

```ts
// 旋转头部模型的 Y 轴
const rotationY =
    midlineVector.cross(toplineVector) / (midlineLength * midlineLength);
...
const ratio = 5
head.rotation.y = rotationY * ratio
```

> 也许应当有一个正确的换算方式，但是我测试放大倍率为 `5` 的时候效果还不错，总之先将就用下吧！

![又不是不能用](https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/meme/not-unusable.jpg)

---

- [webgl_loader_mmd | three.js](https://threejs.org/examples/?q=mmd#webgl_loader_mmd)
