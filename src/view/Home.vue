<template>
    <div>
        这里是首页
        <button @click="go()">dianwo </button>
    </div>
</template>

<script setup>
function go (){
    ElMessage({
      message: '提交成功',
      type: 'success',
    })
}
</script>

<style lang="less" scoped>

</style>