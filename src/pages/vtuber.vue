<template>
  <button class="agm-button" @click="showVideo = !showVideo">
    {{ showVideo ? "隐藏" : "显示" }}
  </button>
  <div id="vtuber-container"></div>
  <div v-show="showVideo">
    <face-detection />
  </div>

  <!-- todo select mouth -->
  <!-- <div class="face-control">
    <select />
  </div> -->
</template>

<script lang="ts">
import { Vtuber } from "vtuber/index";
import { defineComponent } from "vue";
import FaceDetection from "../components/FaceDetection.vue";

export default defineComponent({
  components: { FaceDetection },
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
</style>
