<template>
  <div
    class="
      absolute
      bottom-0
      transition
      duration-300
      hover:(opacity-100 bg-gray-200 bg-opacity-50)
      shadow-dark-900
      w-full
    "
    :class="persistBar ? 'opacity-100' : 'opacity-0'"
  >
    <nav ref="root" class="flex flex-col shadow-xl">
      <div class="flex flex-wrap-reverse justify-center text-xl p-2 gap-1">
        <IconButton
          :active="persistBar"
          :title="persistBar ? '隐藏' : '显示'"
          @click="persistBar = !persistBar"
        >
          <i-ri-eye-line v-if="persistBar" title="显示" />
          <i-ri-eye-close-line v-else title="隐藏" />
        </IconButton>

        <IconButton title="切换全屏" @click="toggleFullscreen">
          <i-carbon:minimize v-if="isFullscreen" />
          <i-carbon:maximize v-else />
        </IconButton>

        <IconButton
          :title="t('button.toggle_dark')"
          @click="toggleDark()"
        >
          <i-ri-moon-line v-if="isDark" />
          <i-ri-sun-line v-else />
        </IconButton>

        <VerticalDivider />

        <IconButton
          :active="vtuberStore.showWebcam"
          title="切换摄像显示"
          @click="toggleWebcam"
        >
          <i-ri-account-circle-line title="显示" />
        </IconButton>

        <IconButton
          :active="webcamStore.enabled"
          title="切换摄像状态"
          @click="() => {webcamStore.toggleEnabled()}"
        >
          <i-mdi:video v-if="webcamStore.enabled" />
          <i-mdi:video-off v-else />
        </IconButton>

        <IconButton
          :active="webcamStore.isFlipped"
          title="水平翻转"
          @click="() => {webcamStore.toggleIsFlipped()}"
        >
          <i-mdi:flip-horizontal />
        </IconButton>

        <IconButton
          :active="webcamStore.fitHeight"
          title="水平翻转"
          @click="() => {webcamStore.toggleFitHeight()}"
        >
          <i-ri-zoom-in-line v-if="!webcamStore.fitHeight" />
          <i-ri-zoom-out-line v-else />
        </IconButton>

        <VerticalDivider />

        <DetectionControls />

        <!-- <VerticalDivider />
        <IconButton :active="webcamStore.fitHeight" @click="webcamStore.toggleFitHeight">
          <i-ri-pause-line v-if="isActionPlaying" />
          <i-ri-play-line v-else />
        </IconButton> -->
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useVtuberStore } from '~/stores/vtuber'
import { useWebcamStore } from '~/stores/webcam'
import { isDark, toggleDark } from '~/logic'
const { t } = useI18n()

const vtuberStore = useVtuberStore()
const webcamStore = useWebcamStore()

const props = withDefaults(
  defineProps<{
    persist?: boolean
  }>(),
  {
    persist: false,
  },
)

const persistBar = ref(props.persist)

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 根据已记录的数据，播放动作
const isActionPlaying = ref(false)

const root = ref<HTMLDivElement>()

/**
 * 显示圆形窗口时，则默认打开摄像头
 */
const toggleWebcam = () => {
  if (!vtuberStore.showWebcam) webcamStore.enabled = true

  vtuberStore.toggleShowWebcam()
}
</script>
