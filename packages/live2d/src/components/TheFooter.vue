<script setup lang="ts">
const { t, availableLocales, locale } = useI18n()

function toggleLocales() {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <nav mt-6 text-xl>
    <RouterLink class="mx-2 icon-btn" to="/" :title="t('button.home')">
      <div i-carbon-campsite />
    </RouterLink>

    <button class="mx-2 icon-btn !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>

    <a class="mx-2 icon-btn" :title="t('button.toggle_langs')" @click="toggleLocales()">
      <div i-carbon-language />
    </a>

    <RouterLink class="mx-2 icon-btn" to="/about" :title="t('button.about')">
      <div i-carbon-dicom-overlay />
    </RouterLink>

    <a class="mx-2 icon-btn" rel="noreferrer" href="https://github.com/YunYouJun/vtuber/blob/main/packages/live2d" target="_blank" title="GitHub">
      <div i-carbon-logo-github />
    </a>
  </nav>
</template>
