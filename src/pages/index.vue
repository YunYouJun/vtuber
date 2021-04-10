<template>
  <div class="home text-center">
    <a href="https://docs.vtuber.yunyoujun.cn" target="_blank">
      <h1>从零开始的 Vtuber</h1>
    </a>
    <hr style="margin: 2rem" />
    <a :href="pkg.repository" target="_blank">
      <i-carbon-logo-github class="github" style="margin: auto" />
    </a>
  </div>
</template>

<script lang="ts">
import { isDev } from "vtuber/utils";
import { defineComponent } from "vue";
import pkg from "../../package.json";
export default defineComponent({
  data() {
    return {
      pkg,
    };
  },
  mounted() {
    if (isDev()) {
      console.info("当前处于开发模式下...");
    }
  },
});
</script>

<style lang="scss">
.home {
  margin-top: 5rem;
}

.text-center {
  text-align: center;
}

.github {
  font-size: 2rem;
}
</style>
