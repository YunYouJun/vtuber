<template>
  <div :class="['video-container', flip ? 'flip' : '']">
    <video
      id="webcam"
      class="video-card"
      ref="webcamVideo"
      autoplay
      controls
      width="640"
      height="480"
    ></video>
    <canvas id="overlay" class="webcam-overlay" ref="overlay"></canvas>
  </div>
  <div class="video-control">
    <el-button size="mini" @click="toggleDetect">
      {{ detecting ? "STOP" : "START" }}
    </el-button>
    <el-button size="mini" @click="debug = !debug">DEBUG</el-button>
    <el-button size="mini" @click="flip = !flip">翻转</el-button>
    <el-button size="mini" @click="withFaceLandmarks = !withFaceLandmarks">
      标记
    </el-button>
    <el-button size="mini" @click="withLandmarkIndex = !withLandmarkIndex">
      索引
    </el-button>
  </div>
</template>

<script lang="ts">
import * as faceapi from "face-api.js";
import { defineComponent, ref } from "vue";
import { Webcam } from "vtuber/utils/webcam";
import { loadModel } from "vtuber/detect";

import { PositionPoint } from "vtuber/types/index";

export default defineComponent({
  setup() {
    const debug = ref(false);
    const webcam = ref<Webcam | null>(null);
    return {
      debug,
      webcam,
    };
  },
  data() {
    return {
      videoEl: <HTMLVideoElement | null>null,
      overlay: <HTMLCanvasElement | null>null,
      ctx: <null | CanvasRenderingContext2D>null,

      minConfidence: 0.5,
      withBoxes: false,
      withFaceLandmarks: true,
      withLandmarkIndex: true,

      // 正在监听
      detecting: false,
    };
  },

  computed: {
    flip: {
      get() {
        return this.$store.state.webcam.flip;
      },
      set(val) {
        return this.$store.commit("webcam/setFlip", val);
      },
    },
  },

  async mounted() {
    this.videoEl = this.$refs.webcamVideo as HTMLVideoElement;
    this.overlay = this.$refs.overlay as HTMLCanvasElement;

    await loadModel();
    if (this.$refs.overlay) {
      this.ctx = (this.$refs.overlay as HTMLCanvasElement).getContext("2d");
      (this.ctx as CanvasRenderingContext2D).font = "100px serif";
    }
    this.initWebcam();
  },

  methods: {
    /**
     * 初始化 Webcam
     */
    async initWebcam() {
      const videoEl = this.videoEl;
      if (!videoEl) return;

      this.webcam = new Webcam(videoEl);
      await this.webcam.init();

      // videoEl.onloadedmetadata = () => {
      //   this.onPlay();
      // };
    },

    /**
     * 切换监听状态
     */
    toggleDetect() {
      if (this.detecting) {
        this.detecting = false;
      } else {
        this.detecting = true;
        this.onPlay();
      }
    },

    async onPlay() {
      if (!this.detecting) {
        return;
      }

      const videoEl = this.videoEl;
      if (!videoEl) return;

      if (videoEl.paused || videoEl.ended) {
        setTimeout(() => this.onPlay(), 100);
      }

      const options = new faceapi.SsdMobilenetv1Options({
        minConfidence: this.minConfidence,
      });

      // we only need single face
      // .detectAllFaces(videoEl, options)
      const results = await faceapi
        .detectSingleFace(videoEl, options)
        .withFaceLandmarks();

      const canvas = this.overlay;
      if (results && canvas) {
        this.drawFaceRecognitionResults(results);
      }

      setTimeout(() => this.onPlay());
    },

    /**
     * 绘制脸部识别结果
     */
    drawFaceRecognitionResults(
      results: faceapi.WithFaceLandmarks<
        {
          detection: faceapi.FaceDetection;
        },
        faceapi.FaceLandmarks68
      >
    ) {
      const videoEl = this.videoEl;
      const canvas = this.overlay;

      if (!canvas || !videoEl) return;

      const dims = faceapi.matchDimensions(canvas, videoEl, true);
      const resizedResults = faceapi.resizeResults(results, dims);

      if (this.debug) {
        console.log(resizedResults);
      }

      // draw detections
      if (this.withBoxes) {
        faceapi.draw.drawDetections(canvas, resizedResults);
      }

      if (this.withFaceLandmarks) {
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
        // draw text number
        const points = resizedResults.landmarks.positions;
        // this.$store.commit("face/setPoints", points);
        // 挂载到全局
        window.face = {
          enable: true,
          points,
        };

        // 绘制索引点序号
        if (this.withLandmarkIndex) {
          points.forEach((point: PositionPoint, i: number) => {
            if (this.ctx) {
              this.ctx.fillText(i.toString(), point.x, point.y);
            }
          });
        }
      }
    },
  },
});
</script>

<style lang="scss">
video {
  outline: none;
}

.video-container {
  position: relative;
  width: 640px;
  height: 360px;
  margin: 0 auto;
}

.video-control {
  margin: 1rem;
}

.video-card {
  border-radius: 5px;
}

#webcam {
  position: absolute;
  inset: 0;
  width: 640px;
  height: 360px;
}

.webcam-overlay {
  position: absolute;
  inset: 0;
  width: 640px;
  height: 360px;
  pointer-events: none;
}
</style>
