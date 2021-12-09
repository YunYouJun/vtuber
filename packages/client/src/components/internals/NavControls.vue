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
    :class="persist ? 'opacity-100' : 'opacity-0'"
  >
    <nav ref="root" class="flex flex-col shadow-xl">
      <div class="flex flex-wrap-reverse justify-center text-xl p-2 gap-1">
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

        <IconButton :title="t('button.toggle_langs')" @click="toggleLocales">
          <i-ri-translate class="transform" :class="locale === 'en' ? 'rotate-y-180' : ''" />
        </IconButton>

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
          title="!webcamStore.fitHeight ? '放大' : '缩小'"
          @click="() => {webcamStore.toggleFitHeight()}"
        >
          <i-ri-zoom-in-line v-if="!webcamStore.fitHeight" />
          <i-ri-zoom-out-line v-else />
        </IconButton>

        <VerticalDivider />

        <DetectionControls />

        <VerticalDivider />

        <IconButton title="上传 VRM 模型（或拖拽）" @click="">
          <i-ri-upload-line />
          <input type="file" @change="onFileChange">
        </IconButton>

        <!-- <VerticalDivider />
        <IconButton :active="webcamStore.fitHeight" @click="webcamStore.toggleFitHeight">
          <i-ri-pause-line v-if="isActionPlaying" />
          <i-ri-play-line v-else />
        </IconButton> -->

        <VerticalDivider />

        <AboutInfo />
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useVtuberStore } from '~/stores/vtuber'
import { useWebcamStore } from '~/stores/webcam'
import { isDark, toggleDark } from '~/composables'
import { useAppStore } from '~/stores/app'
import { checkModelFormat } from '~/utils/vrm'

const app = useAppStore()

const vtbStore = useVtuberStore()
const webcamStore = useWebcamStore()

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 根据已记录的数据，播放动作
// const isActionPlaying = ref(false)

const root = ref<HTMLDivElement>()

const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

/**
 * 显示圆形窗口时，则默认打开摄像头
 */
const toggleWebcam = () => {
  if (!vtbStore.showWebcam) webcamStore.enabled = true

  vtbStore.toggleShowWebcam()
}

// 上传文件
const onFileChange = (e: Event) => {
  const fileList = (e.target as any).files
  if (!fileList[0]) return
  if (checkModelFormat(fileList[0])) {
    const url = URL.createObjectURL(fileList[0])
    vtbStore.instance?.vrm.load(url)
  }
}
</script>
