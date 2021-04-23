<template>
  <div class="home text-center">
    <a href="https://docs.vtuber.yunyoujun.cn" target="_blank">
      <el-button>从一开始的 Vtuber</el-button>
    </a>
    <hr style="margin: 2rem" />
    <el-tooltip
      class="item"
      effect="dark"
      :content="pkg.repository.url"
      placement="top"
    >
      <a
        style="display: inline-block"
        :href="pkg.repository.url"
        target="_blank"
      >
        <i-carbon-logo-github class="github" style="margin: auto" />
      </a>
    </el-tooltip>
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

.github {
  font-size: 2rem;
}
</style>
