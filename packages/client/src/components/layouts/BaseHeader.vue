<script setup lang="ts">
import * as pkg from '~/../package.json'
import { isDark, toggleDark } from '~/composables'

const { t, availableLocales, locale } = useI18n()

function toggleLocales() {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <nav class="my-5 text-xl">
    <router-link
      active-class="text-blue-500"
      class="mx-1 icon-btn"
      to="/"
      :title="t('button.home')"
    >
      <i-ri-body-scan-line />
    </router-link>

    <router-link class="mx-2 icon-btn" to="/2d">
      <i-ri-camera-line />
    </router-link>

    <router-link
      class="mx-1 icon-btn"
      active-class="text-blue-500"
      to="/about"
      :title="t('button.about')"
    >
      <i-ri-file-info-line />
    </router-link>

    <a
      class="mx-1 icon-btn"
      rel="noreferrer"
      :href="pkg.repository.url"
      target="_blank"
      title="GitHub"
    >
      <i-ri-github-line />
    </a>

    <button
      class="mx-1 icon-btn !outline-none"
      :title="t('button.toggle_dark')"
      @click="toggleDark()"
    >
      <i-ri-moon-line v-if="isDark" />
      <i-ri-sun-line v-else />
    </button>

    <a class="mx-1 icon-btn" :title="t('button.toggle_langs')" @click="toggleLocales">
      <i-ri-translate />
    </a>
  </nav>
</template>
