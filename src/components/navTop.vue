<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <el-menu-item index="0">LOGO</el-menu-item>
    <div class="flex-grow" />
    <el-sub-menu index="1">
      <template #title>Workspace</template>
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-menu-item index="1-2">item two</el-menu-item>
      <el-menu-item index="1-3">item three</el-menu-item>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
        <el-menu-item index="1-4-2">item two</el-menu-item>
        <el-menu-item index="1-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>


<script setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = () => {
  console.log(key, keyPath)
}


</script>



<style lang="less" scoped>
.flex-grow {
  flex-grow: 1;
}
</style>