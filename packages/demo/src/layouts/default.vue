<template>
  <el-container>
    <el-header style="--el-header-padding: 0">
      <BaseHeader />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <BaseFooter />
  </el-container>
</template>
