<template>
  <IconButton @click="openGithub">
    <i-ri-github-line />
  </IconButton>
  <router-link
    to="/about"
  >
    <IconButton :title="t('button.about')">
      <i-ri-file-info-line />
    </IconButton>
  </router-link>
  <IconButton title="开发笔记" @click="openDocs">
    <i-ri-book-line />
  </IconButton>
</template>

<script lang="ts" setup>
import * as pkg from '~/../package.json'

const { t } = useI18n()

const openGithub = () => {
  window.open(pkg.repository.url)
}

const openDocs = () => {
  window.open('https://docs.vtuber.yunyoujun.cn')
}
</script>
