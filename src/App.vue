<template>
  <el-container class="main">
    <el-header>
      <NavTop />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <NavLeft />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import NavLeft from './components/navLeft.vue';
import NavTop from './components/navTop.vue';
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
}
</style>