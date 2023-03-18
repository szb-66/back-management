<template>
    <div>
        这里是首页
        <button @click="go()" style="background-color: green;">dianwo </button>
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
button {
  background-color: blue; /* Blue */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
button:hover {
  background-color: green;
}
</style>
