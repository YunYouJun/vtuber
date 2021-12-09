<template>
  <IconButton title="上传 VRM 模型（或拖拽）" @click="triggerUpload">
    <i-ri-upload-line />
    <input ref="uploadRef" class="hidden" type="file" @change="onFileChange">
  </IconButton>
</template>

<script lang="ts" setup>
import { useVtuberStore } from '~/stores/vtuber'
import { checkModelFormat } from '~/utils/vrm'

const vtbStore = useVtuberStore()

const uploadRef = ref()
const triggerUpload = () => {
  uploadRef.value.click()
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
