# 扩展

## 录制数据

事实上，在开发调试时，想要实时在浏览器里跑人脸识别再根据点映射 Vtuber 实在是太太卡了！

所以为了临时解决这一问题，我觉得可以为其添加录制数据的功能。

即录制人脸的点数据，然后将其记录到本地，调试时只根据之前记录的数据进行映射开发，暂时省掉实时人脸识别的部分。

数据量其实会很大，所以我们应当尽可能地简化数据结构。
我们只用到每次检测时 68 个点的位置。即只记录 `results.landmarks.positions` 作为 points。

将 points 与流逝的时间建立对应关系，推入数组，这个数组存储为 JSON 就是我们想要的记录的数据啦。
这里只是粗糙地存储，之后我们直接存储运算解析后的人物身体动作，可以进一步提高效率。

## 播放数据

记录好数据，我们需要把记录的数据拿来播放。

3D 模型本身每一帧都要去渲染，每次渲染时我们让它去读取全局 windows 下 face.points 是否有数据，若有数据，则进行解析，根据解析后的结果跳转旋转并渲染。

> 同时到这里我们也可以发现此前看起来卡顿的原因了，人脸识别记录下来的数据远远不足 30fps，所以动画的状态看起来其实几乎是瞬移的。
> 我们应当根据此对动画进行插值，来使动画变得更加平缓。

动画这部分，THREE.JS 有自己的动画序列关键帧规范。我们尽量把格式往上靠近。

- [AnimationClip | three.js](https://threejs.org/docs/index.html?q=animati#api/en/animation/AnimationClip)
- [examples/misc_animation_keys | three.js | GitHub](https://github.com/mrdoob/three.js/blob/master/examples/misc_animation_keys.html)

[KeyframeTrack](https://threejs.org/docs/index.html?q=keyfr#api/en/animation/KeyframeTrack) 规则为 times 与 values 均为数组。
