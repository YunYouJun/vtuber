<script setup lang="ts">
import { useVtuberStore } from '~/stores/vtuber'
import { useWebcamStore } from '~/stores/webcam'
import { isDark, toggleDark } from '~/composables'
import { useAppStore } from '~/stores/app'

withDefaults(defineProps<{
  persist: boolean
}>(), {
  persist: true,
})

const { t } = useI18n()

const app = useAppStore()

const vtbStore = useVtuberStore()
const webcamStore = useWebcamStore()

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 根据已记录的数据，播放动作
// const isActionPlaying = ref(false)

const root = ref<HTMLDivElement>()

/**
 * 显示圆形窗口时，则默认打开摄像头
 */
function toggleWebcam() {
  if (!vtbStore.showWebcam)
    webcamStore.enabled = true
  vtbStore.toggleShowWebcam()
}

const pipVideoRef = ref<HTMLVideoElement>()

function togglePictureInPicture() {
  if (app.isPicInPic) {
    document.exitPictureInPicture()
    app.isPicInPic = false
    if (pipVideoRef.value)
      pipVideoRef.value.srcObject = null
  }
  else {
    const vrmCanvas = document.getElementsByClassName('vrm-canvas')[0]
    if (!pipVideoRef.value)
      return
    const stream = (vrmCanvas as HTMLCanvasElement).captureStream()
    pipVideoRef.value.srcObject = stream

    setTimeout(() => {
      if (!pipVideoRef.value)
        return
      pipVideoRef.value.requestPictureInPicture()

      app.isPicInPic = true
    }, 400)
  }
}
</script>

<template>
  <div
    class="absolute bottom-0 w-full shadow-dark-900 transition duration-300 hover:(bg-gray-200 bg-opacity-50 opacity-100)"
    :class="persist ? 'opacity-100' : 'opacity-0'"
  >
    <nav ref="root" class="flex flex-col shadow-xl">
      <div class="flex flex-wrap-reverse justify-center gap-1 p-2 text-xl">
        <IconButton
          :active="persist"
          :title="persist ? '隐藏' : '显示'"
          @click="app.toggleShowNavControls()"
        >
          <i-ri-eye-line v-if="persist" title="显示" />
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

        <ToggleLocale />

        <VerticalDivider />

        <IconButton
          :active="vtbStore.showWebcam"
          title="切换摄像显示"
          @click="toggleWebcam"
        >
          <i-ri-account-circle-line title="显示" />
        </IconButton>

        <IconButton
          :active="webcamStore.enabled"
          title="切换摄像状态"
          @click="() => { webcamStore.toggleEnabled() }"
        >
          <i-mdi:video v-if="webcamStore.enabled" />
          <i-mdi:video-off v-else />
        </IconButton>

        <IconButton
          :active="webcamStore.show"
          :title="webcamStore.show ? '隐藏' : '显示'"
          @click="webcamStore.toggleShow()"
        >
          <i-ri-eye-line v-if="persist" title="显示" />
          <i-ri-eye-close-line v-else title="隐藏" />
        </IconButton>

        <IconButton
          :active="webcamStore.isFlipped"
          title="水平翻转"
          @click="() => { webcamStore.toggleIsFlipped() }"
        >
          <i-mdi:flip-horizontal />
        </IconButton>

        <IconButton
          :active="webcamStore.fitHeight"
          :title="!webcamStore.fitHeight ? '放大' : '缩小'"
          @click="() => { webcamStore.toggleFitHeight() }"
        >
          <i-ri-zoom-in-line v-if="!webcamStore.fitHeight" />
          <i-ri-zoom-out-line v-else />
        </IconButton>

        <VerticalDivider />

        <DetectionControls />

        <IconButton :active="vtbStore.instance && vtbStore.instance?.drawMpResults" title="绘制标记" @click="vtbStore.instance!.drawMpResults = !vtbStore.instance?.drawMpResults">
          <i-ri-mark-pen-line />
        </IconButton>

        <IconButton title="画中画" @click="togglePictureInPicture">
          <i-ri-picture-in-picture-line v-if="app.isPicInPic" />
          <i-ri-picture-in-picture-exit-line v-else />
        </IconButton>

        <VerticalDivider />

        <UploadButton />

        <VerticalDivider />

        <AboutInfo />
      </div>
    </nav>

    <video ref="pipVideoRef" class="pointer-events-none invisible absolute bottom-0 right-0" autoplay muted playsinline />
  </div>
</template>
