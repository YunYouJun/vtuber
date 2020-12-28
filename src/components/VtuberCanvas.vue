<template>
  <div class="vtuber-container">
    <canvas
      class="vtuber-canvas"
      ref="vtuberCanvas"
      width="640"
      height="360"
    ></canvas>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      ctx: null,

      center: [75, 75],
      radius: 50,

      ratio: 2,
    };
  },
  mounted() {
    this.initVtuber();
  },
  computed: {
    ...mapState({
      facePoints: (state) => state.face.points,
    }),
  },
  methods: {
    initVtuber() {
      const canvas = this.$refs.vtuberCanvas;
      const ctx = canvas.getContext("2d");
      this.ctx = ctx;

      // setInterval
      setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.facePoints[30]) {
          this.center = [
            this.facePoints[30].x / this.ratio,
            this.facePoints[30].y / this.ratio,
          ];
        }

        this.drawVtuber();
      }, 20);
    },

    drawVtuber() {
      const ctx = this.ctx;

      const center = this.center;
      const radius = this.radius;

      const eyeHeight = 12;
      const eyeGap = 15;
      const eyeRadius = 5;

      const mouthHeight = 2;
      const mouthRadius = 30;

      // arc 默认顺时针

      ctx.beginPath();
      ctx.arc(...center, radius, 0, Math.PI * 2, true);

      // draw mouth
      ctx.moveTo(center[0] + mouthRadius, center[1] + mouthHeight);
      ctx.arc(
        center[0],
        center[1] + mouthHeight,
        mouthRadius,
        0,
        Math.PI,
        false
      );

      // left eye
      ctx.moveTo(center[0] - eyeGap + eyeRadius, center[1] - eyeHeight);
      ctx.arc(
        center[0] - eyeGap,
        center[1] - eyeHeight,
        eyeRadius,
        0,
        Math.PI * 2,
        true
      );

      // right eye
      ctx.moveTo(center[0] + eyeGap + eyeRadius, center[1] - eyeHeight);
      ctx.arc(
        center[0] + eyeGap,
        center[1] - eyeHeight,
        eyeRadius,
        0,
        Math.PI * 2,
        true
      ); // 右眼
      ctx.stroke();
    },
  },
};
</script>

<style lang="scss">
.vtuber-container {
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 640px;
  height: 360px;
}

.vtuber-canvas {
  width: 640px;
  height: 360px;
}
</style>
