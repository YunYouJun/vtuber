<template>
  <agm-select :options="options" />
  <!-- todo select mouth -->
  <!-- <div class="face-control">
    <select />
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {
      options: [{ label: "a", value: "a" }],
    };
  },
});
</script>
