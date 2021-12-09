<template>
  <hr class="m-2">
  <vue-about-me :copyright="copyright" :is-dark="isDark" />
</template>

<script setup lang="ts">
import VueAboutMe from 'vue-about-me'
import 'vue-about-me/style.css'

import { isDark } from '~/composables'
import pkg from '~/../../../package.json'

const copyright = {
  name: 'Vtuber',
  repo: 'vtuber',
  author: pkg.author.name,
  link: 'https://sponsors.yunyoujun.cn',
}
</script>
