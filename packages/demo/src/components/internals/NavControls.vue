<template>
  <nav ref="root" class="flex flex-col shadow-xl">
    <div class="flex flex-wrap-reverse text-xl p-2 gap-1" :class="barStyle">
      <IconButton
        :active="vtuberStore.showWebcam"
        title="切换 Webcam"
        @click="vtuberStore.toggleShowWebcam"
      >
        <i-ri-eye-line v-if="vtuberStore.showWebcam" title="显示" />
        <i-ri-eye-close-line v-else title="隐藏" />
      </IconButton>

      <IconButton @click="toggleFullscreen">
        <i-carbon:minimize v-if="isFullscreen" />
        <i-carbon:maximize v-else />
      </IconButton>

      <VerticalDivider />

      <IconButton
        :active="webcamStore.enabled"
        @click="webcamStore.toggleEnabled"
      >
        <i-mdi:video v-if="webcamStore.enabled" />
        <i-mdi:video-off v-else />
      </IconButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import VerticalDivider from './VerticalDivider.vue'
import { fullscreen } from '~/stores'
import { useVtuberStore } from '~/stores/vtuber'
import { useWebcamStore } from '~/stores/webcam'
const vtuberStore = useVtuberStore()
const webcamStore = useWebcamStore()

const { isFullscreen, toggle: toggleFullscreen } = fullscreen

const props = withDefaults(
  defineProps<{
    persist: boolean
  }>(),
  {
    persist: false,
  },
)

const root = ref<HTMLDivElement>()

const barStyle = computed(() =>
  props.persist
    ? 'bg-transparent'
    : 'rounded-md shadow dark:(border border-gray-400 border-opacity-10)',
)

function toggleWebcam() {
  vtuberStore.toggleShowWebcam()
  webcamStore.enabled = !webcamStore.enabled
}
</script>
