<template>
  <button class="agm-button" @click="showVideo = !showVideo">
    {{ showVideo ? "隐藏" : "显示" }}
  </button>
  <!-- vtuber 容器 -->
  <div id="vtuber-container"></div>
  <div id="detect-container" v-show="showVideo">
    <face-detection />
    <!-- <vtuber-config /> -->
  </div>
</template>

<script lang="ts">
import { Vtuber } from "vtuber/index";
import { defineComponent } from "vue";
import FaceDetection from "../components/FaceDetection.vue";
import VtuberConfig from "../components/vtuber/VtuberConfig.vue";

export default defineComponent({
  components: { FaceDetection, VtuberConfig },
  data() {
    return {
      showVideo: false,
    };
  },
  async mounted() {
    const vtuber = new Vtuber();
    vtuber.init();
  },
});
</script>

<style lang="scss">
#vtuber-container {
  position: absolute;
  inset: 0;
  z-index: -1;
}

#detect-container {
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scale(0.6);
}
</style>
