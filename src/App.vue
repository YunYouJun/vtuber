<template>
  <BaseHeader />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseHeader from "~/components/base/BaseHeader.vue";

export default defineComponent({
  name: "App",
  components: {
    BaseHeader,
  },
});
</script>
