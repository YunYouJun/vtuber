# Guide

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
