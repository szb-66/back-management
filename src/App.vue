<template>
  <Login v-if="showLogin" @login-success="handleLoginSuccess" />
  <el-container class="main" v-else>
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
import Login from './view/Login.vue';
import { ref, onMounted } from 'vue';

const showLogin = ref(true); //登录状态，true进入登录页面，false进入主页面

// 在组件挂载时检查登录状态
onMounted(() => {
  const loginStatus = localStorage.getItem('loginStatus');  //登录状态
  const loginTimestamp = localStorage.getItem('loginTimestamp');  //登录时间
  
  if (loginStatus && loginTimestamp) {
    const currentTime = new Date().getTime()//当前时间
    const timeDiff = currentTime - loginTimestamp;

    // 检查是否在两小时内
    if (timeDiff < 2 * 60 * 60 * 1000) {
      showLogin.value = false;
    } else {
      localStorage.removeItem('loginStatus');
      localStorage.removeItem('loginTimestamp');
    }
  } else {
    showLogin.value = true;
  }
});

// 登陆成功执行函数
const handleLoginSuccess = () => {
  showLogin.value = false;
  localStorage.setItem('loginStatus', 'loggedIn'); //登录状态
  localStorage.setItem('loginTimestamp', new Date().getTime()); //登录时间
};

</script>

<style lang="less" scoped>
.main {
  height: 100vh;
}
</style>