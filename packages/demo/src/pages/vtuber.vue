<template>
  <el-button @click="showVideo = !showVideo">
    {{ showVideo ? "隐藏" : "显示" }}
  </el-button>
  <!-- vtuber 容器 -->
  <div id="vtuber-container"></div>
  <div v-show="showVideo" id="detect-container">
    <face-detection />
    <!-- <vtuber-config /> -->
  </div>
</template>

<script setup lang="ts">
import { Vtuber } from 'vtuber/index'

const showVideo = ref(false)

onMounted(() => {
  const vtuber = new Vtuber()
  vtuber.init()
})
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
