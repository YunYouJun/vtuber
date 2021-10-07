<template>
  <el-container>
    <el-header>
      <BaseHeader />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseHeader from './layouts/BaseHeader.vue'

export default defineComponent({
  name: 'App',
  components: {
    BaseHeader,
  },
})
</script>
