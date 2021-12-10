# 解决方案

> 说一说，我目前直播的解决方案。

我日常写代码的工作平台是 macOS，所以我的解决方案都基于 mac 平台。

（为什么不说 Windows？因为大部分的直播解决方案其实都是基于 Windows，很多捕捉软件也是只有 Windows 可以用。）

首先我使用 [kalidokit](https://github.com/yeemachine/kalidokit/) + [@mediapipe/holistic](https://github.com/google/mediapipe) 搭建了一个基于 Web 端的 Vtuber 应用。
具体开发笔记可见本文档其他部分。

实际上 kalidokit 对应也提供了 [kalidoface](https://3d.kalidoface.com/) 网站，用户可以自由上传 VRM 模型，来使用其进行捕捉直播。
可惜其网站的代码尚未开源，因此无法基于此进行更多的自定义，但我们可以使用其开源的 kalidokit 来实现捕捉后的数据与模型骨骼的映射，来任意自定义自己想要的功能。

> [v.yyj.moe](https://v.yyj.moe)

## 直播平台

作为死宅，优先的平台自然只能是 B 站了。

因为直播间房间号很长，所以给域名加了个重定向。[yyj.moe/live](https://yyj.moe/live)

## 关于模型

模型使用的是 VRM 格式，这是日本许多家厂商目前一起制定的专门用于 VR 人物形象模型的格式。

使用 [Three.js](https://threejs.org/) + [@pixiv/three-vrm](https://github.com/pixiv/three-vrm/) 在 Web 端渲染模型。

同时 Pixiv 也提供了一个工具 [VRoid Studio](https://vroid.com/en/studio) 来使用，用户可以自由自定义人物的细节，且最后的版权是归属于自己的，所以没有版权纠纷。

> 比如现在的模型就是使用其自己捏的。

除此之外，许多 VRM 模型都可以在 [VRoid Hub](https://hub.vroid.com/) 上下载到。

## 关于音频

安装 Soundflower for Mac 后，打开音频 MIDI 来设置多输出设备，如勾选两个输出，一个输出到自己的耳机，一个输出到 Soundflower(2ch)，这样一个就可以自己听，一个交给 OBS 的音频流输出。

此外，多输出设备中为耳机勾选 「漂移矫正」可以去除可能存在的电流声。

## 关于直播

直播使用的是 OBS 软件，大部分教程可以直接上网搜到。

由于特殊性，我的捕捉程序其实运行在 Web 端，所以很卡。
我将其跑在了我的 iPad 上，然后 Type-C 数据线连接电脑，这时候就可以在 OBS 设备中添加视频采集设备为 iPad，来将 iPad 的画面投屏到直播里。
这样就不影响电脑本身的运行效率了。

好，大概就是这样，希望也能对你有所帮助。
